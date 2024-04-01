import path from 'path';
import { Server } from 'http';

import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit,
  matchExceptionFilter,
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
  ArtusXHandler,
  ArtusXContext,
  ArtusXMiddleware,
  HTTPRouteMetadata,
  HTTPMiddlewareMetadata,
  ArtusXExceptionFilterType,
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

  private async handleError(ctx: ArtusXContext, error: any) {
    const { onError } = this.app.config.artusx;
    const filter = matchExceptionFilter(error, this.container) as ArtusXExceptionFilterType;

    if (filter) {
      await filter?.catch(error, ctx);
    }

    if (!!ctx.body) {
      return;
    }

    if (onError) {
      await onError(ctx, error);
    } else {
      ctx.throw(error?.status || 500, error);
    }
  }

  private registerRoute(
    controllerMetadata: ControllerMetadata,
    routeMetadataList: HTTPRouteMetadata[],
    middlewareMetadata: HTTPMiddlewareMetadata,
    handler: ArtusXHandler
  ) {
    const that = this;
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
            await handler(ctx as unknown as ArtusXContext, next);
          };

          const { ctx, next } = this;
          ctx.params = params;
          try {
            const executionPipeline = new Pipeline();
            executionPipeline.use([...middlewares, executionHandler]);
            await executionPipeline.run(ctx as any);
            next();
          } catch (error) {
            await that.handleError(ctx as any, error);
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
      const controllerDescriptorList = Object.getOwnPropertyDescriptors(controllerClazz.prototype);

      for (const key of Object.keys(controllerDescriptorList)) {
        const controllerDescriptor = controllerDescriptorList[key];

        // skip getter/setter
        if (!controllerDescriptor.value) {
          continue;
        }

        const routeMetadataList: HTTPRouteMetadata[] =
          Reflect.getMetadata(HTTP_ROUTER_METADATA, controllerDescriptor.value) ?? [];

        const middlewareMetadata: HTTPMiddlewareMetadata =
          Reflect.getMetadata(HTTP_MIDDLEWARE_METADATA, controllerDescriptor.value) ?? [];

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
      const middleware: ArtusXMiddleware = this.container.get(middlewareClazz) as any;
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
  middleware: ArtusXMiddleware;
  metadata: MiddlewareMetadata;
  handler: ArtusXHandler;
}

interface IMiddlewareWithIndex extends IMiddleware {
  index: number;
}
