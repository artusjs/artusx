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

import KoaRouter from './koa/router';
import KoaApplication from './koa/application';

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

  get router(): KoaRouter {
    return this.app.container.get(KoaRouter);
  }

  get koa(): KoaApplication {
    return this.app.container.get(KoaApplication);
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
      this.router.register(
        routePath,
        [routeMetadata.method],
        [
          ...middlewares,

          async (ctx, next) => {
            // run pipeline
            const input = new Input();
            const context = new Context(input);
            ctx.context = context;

            await this.pipeline.run(ctx as any);

            // handle request
            await handler(ctx as unknown as ArtusxContext, next);
          },
        ]
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

  private registerMiddleware(middlewareMetadata: MiddlewareMetadata, handler: ArtusxHandler) {
    if (middlewareMetadata.enable === false) {
      return;
    }

    this.pipeline.use(handler);
  }

  private loadMiddleware() {
    const middlewareClazzList = this.container.getInjectableByTag(CLASS_MIDDLEWARE_TAG);
    for (const middlewareClazz of middlewareClazzList) {
      const middlewareMetadata = Reflect.getMetadata(CLASS_MIDDLEWARE_METADATA, middlewareClazz);
      const middleware: ArtusxMiddleware = this.container.get(middlewareClazz) as any;

      this.registerMiddleware(middlewareMetadata, middleware.use.bind(middleware));
    }
  }

  private startHttpServer() {
    const { port = 7001 } = this.app.config.koa;

    const koa = this.koa;
    const router = this.router;

    koa.use(router.routes());
    server = koa.listen(port, () => {
      this.logger.info(`Server listening on: http://localhost:${port}`);
    });
  }

  @LifecycleHook()
  async didLoad() {}

  @LifecycleHook()
  public async willReady() {
    this.loadController();
    this.loadMiddleware();
    this.startHttpServer();
  }

  @LifecycleHook()
  beforeClose() {
    this.logger.info('Server closing...');
    server?.close();
  }
}
