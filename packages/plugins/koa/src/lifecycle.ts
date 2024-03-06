import path from 'path';
import { Server } from 'http';

import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit,
} from '@artus/core';

import { Input, Context } from '@artus/pipeline';

import {
  CLASS_CONTROLLER_TAG,
  CLASS_CONTROLLER_METADATA,
  CLASS_MIDDLEWARE_TAG,
  CLASS_MIDDLEWARE_METADATA,
  HTTP_MIDDLEWARE_METADATA,
  HTTP_ROUTER_METADATA,
} from './decorator';

import Pipeline from './pipeline';

import type {
  ControllerMetadata,
  MiddlewareMetadata,
  ArtusxHandler,
  ArtusxContext,
  ArtusxMiddleware,
  HTTPRouteMetadata,
  HTTPMiddlewareMetadata,
} from './types';

import { KoaRouterClient } from './koa/router';
import { KoaApplicationClient } from './koa/application';

export let server: Server;

@LifecycleHookUnit()
export default class ApplicationHttpLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  @Inject()
  pipeline: Pipeline;

  get container() {
    return this.app.container;
  }

  get logger() {
    return this.app.logger;
  }

  get router(): KoaRouterClient {
    return this.app.container.get(KoaRouterClient);
  }

  get koa(): KoaApplicationClient {
    return this.app.container.get(KoaApplicationClient);
  }

  private registerRoute(
    controllerMetadata: ControllerMetadata,
    routeMetadataList: HTTPRouteMetadata[],
    middlewareMetadata: HTTPMiddlewareMetadata,
    handler: ArtusxHandler
  ) {
    for (const routeMetadata of routeMetadataList) {
      const routePath = path.normalize((controllerMetadata.prefix ?? '/') + routeMetadata.path);
      const middlewares = middlewareMetadata.middlewares || [];
      const singlePipeline = this.pipeline;

      this.router.on(
        routeMetadata.method,
        routePath,
        async function routerHandler(this, _req, _res, params, _store, _query) {
          const executionHandler = async (ctx, next) => {
            // run pipeline
            const input = new Input();
            const context = new Context(input);
            ctx.context = context;
            await singlePipeline.run(ctx as any);

            // handle request
            await handler(ctx as unknown as ArtusxContext, next);
          };

          const { ctx, next } = this;
          ctx.params = params;
          try {
            const executionPipeline = new Pipeline();
            executionPipeline.use([...middlewares, executionHandler]);
            await executionPipeline.run(ctx as any);
            next();
          } catch (error) {
            ctx.throw(error);
          }
        }
      );
    }
  }

  private loadController() {
    const controllerClazzList = this.container.getInjectableByTag(CLASS_CONTROLLER_TAG);

    for (const controllerClazz of controllerClazzList) {
      const controllerMetadata = Reflect.getMetadata(CLASS_CONTROLLER_METADATA, controllerClazz);
      const controller = this.container.get(controllerClazz) as any;

      const handlerDescriptorList = Object.getOwnPropertyDescriptors(controllerClazz.prototype);

      for (const key of Object.keys(handlerDescriptorList)) {
        const handlerDescriptor = handlerDescriptorList[key];

        const routeMetadataList: HTTPRouteMetadata[] =
          Reflect.getMetadata(HTTP_ROUTER_METADATA, handlerDescriptor.value) ?? [];

        const middlewareMetadata: HTTPMiddlewareMetadata =
          Reflect.getMetadata(HTTP_MIDDLEWARE_METADATA, handlerDescriptor.value) ?? [];

        if (routeMetadataList.length === 0) continue;

        this.registerRoute(
          controllerMetadata,
          routeMetadataList,
          middlewareMetadata,
          controller[key].bind(controller)
        );
      }
    }
  }

  private registerMiddleware({ metadata, handler }: IMiddleware) {
    if (metadata.enable === false) {
      return;
    }

    this.pipeline.use(handler);
  }

  private loadMiddleware() {
    const middlewareClazzList = this.container.getInjectableByTag(CLASS_MIDDLEWARE_TAG);
    const { middlewares = [] } = this.app.config.artusx as {
      middlewares: any[];
    };

    const unorderedMiddlewares: IMiddleware[] = [];
    const orderedMiddlewares: IMiddlewareWithIndex[] = [];

    for (const middlewareClazz of middlewareClazzList) {
      const middleware: ArtusxMiddleware = this.container.get(middlewareClazz) as any;
      const middlewareIndex = middlewares.findIndex((item) => item === middleware.constructor);
      const middlewareMetadata = Reflect.getMetadata(CLASS_MIDDLEWARE_METADATA, middlewareClazz);

      if (middlewareIndex === -1) {
        unorderedMiddlewares.push({
          middleware,
          metadata: middlewareMetadata,
          handler: middleware.use.bind(middleware),
        });
        continue;
      }

      orderedMiddlewares.push({
        middleware,
        index: middlewareIndex,
        metadata: middlewareMetadata,
        handler: middleware.use.bind(middleware),
      });
    }

    // sort middleware
    const sortedMiddlewares = orderedMiddlewares.sort(
      (middlewareA, middlewareB) => middlewareA?.index - middlewareB?.index
    );

    // register middleware
    [...sortedMiddlewares, ...unorderedMiddlewares].forEach((item) => {
      this.registerMiddleware(item);
    });
  }

  private startHttpServer() {
    const { port = 7001 } = this.app.config.artusx;

    const koa = this.koa;
    const router = this.router;

    koa.use((ctx, next) => {
      return router.lookup(ctx.req, ctx.res, { ctx, next });
    });
    server = koa.listen(port, () => {
      this.logger.info(`[koa] listening on: http://localhost:${port}`);
    });
  }

  @LifecycleHook()
  async didLoad() {}

  @LifecycleHook()
  public async willReady() {
    this.loadController();
    this.loadMiddleware();
  }

  @LifecycleHook()
  public async didReady() {
    this.startHttpServer();
  }

  @LifecycleHook()
  beforeClose() {
    this.logger.info('[server] closing...');
    server?.close();
  }
}

interface IMiddleware {
  middleware: ArtusxMiddleware;
  metadata: MiddlewareMetadata;
  handler: ArtusxHandler;
}

interface IMiddlewareWithIndex extends IMiddleware {
  index: number;
}
