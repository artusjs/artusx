import path from 'path';
import { Server } from 'http';

import {
  Inject,
  ArtusInjectEnum,
  ArtusApplication,
  ApplicationLifecycle,
  LifecycleHook,
  LifecycleHookUnit
} from '@artus/core';

import { Input, Context } from '@artus/pipeline';

import { CONTROLLER_METADATA, MIDDLEWARE_METADATA, ROUTER_METADATA, WEB_CONTROLLER_TAG } from './decorator';

import Pipeline from './pipeline';

import type {
  ControllerMetadata,
  ArtusxContext,
  ArtusxHandler,
  MiddlewareMetadata,
  RouteMetadata
} from './types';

import KoaRouter from './koa/router';
import KoaApplication from './koa/application';

import type { Middleware as KoaMiddleware } from 'koa';

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
    routeMetadataList: RouteMetadata[],
    _middlewareMetadataList: MiddlewareMetadata[],
    handler: ArtusxHandler
  ) {
    for (const routeMetadata of routeMetadataList) {
      const routePath = path.normalize((controllerMetadata.prefix ?? '/') + routeMetadata.path);

      this.router.register(routePath, [routeMetadata.method], async (ctx, next) => {
        // run pipeline
        const input = new Input();
        input.params.ctx = ctx;
        input.params.req = ctx.req;
        input.params.res = ctx.res;

        const context = new Context(input);
        await this.pipeline.run(context);
        ctx.context = context;

        // handle request
        await handler(ctx as unknown as ArtusxContext, next);
      });
    }
  }

  private loadController() {
    const controllerClazzList = this.container.getInjectableByTag(WEB_CONTROLLER_TAG);

    for (const controllerClazz of controllerClazzList) {
      const controllerMetadata = Reflect.getMetadata(CONTROLLER_METADATA, controllerClazz);

      const controller = this.container.get(controllerClazz) as any;

      const handlerDescriptorList = Object.getOwnPropertyDescriptors(controllerClazz.prototype);

      for (const key of Object.keys(handlerDescriptorList)) {
        const handlerDescriptor = handlerDescriptorList[key];

        const routeMetadataList: RouteMetadata[] =
          Reflect.getMetadata(ROUTER_METADATA, handlerDescriptor.value) ?? [];

        const middlewareMetadataList: MiddlewareMetadata[] =
          Reflect.getMetadata(MIDDLEWARE_METADATA, handlerDescriptor.value) ?? [];

        if (routeMetadataList.length === 0) continue;

        this.registerRoute(
          controllerMetadata,
          routeMetadataList,
          middlewareMetadataList,
          controller[key].bind(controller)
        );
      }
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
  async didLoad() {
    const artusXMiddlewares = this.app.config.artusx.middlewares || [];
    this.pipeline.use(artusXMiddlewares);

    const koaMiddlewares: KoaMiddleware[] = this.app.config.koa.middlewares || [];
    koaMiddlewares.map((middleware) => {
      this.koa.use(middleware);
    });
  }

  @LifecycleHook()
  public async willReady() {
    this.loadController();
    this.startHttpServer();
  }

  @LifecycleHook()
  beforeClose() {
    this.logger.info('Server closing...');
    server?.close();
  }
}
