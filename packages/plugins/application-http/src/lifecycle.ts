import path from 'path';
import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';

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

import HttpPipeline from './pipeline';

import type {
  ControllerMetadata,
  HTTPContext,
  HttpHandler,
  MiddlewareMetadata,
  RouteMetadata
} from './types';

@LifecycleHookUnit()
export default class ApplicationHttpLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  @Inject()
  pipeline: HttpPipeline;

  private router = new Router();

  get container() {
    return this.app.container;
  }

  get logger() {
    return this.app.logger;
  }

  private registerRoute(
    controllerMetadata: ControllerMetadata,
    routeMetadataList: RouteMetadata[],
    _middlewareMetadataList: MiddlewareMetadata[],
    handler: HttpHandler
  ) {
    for (const routeMetadata of routeMetadataList) {
      const routePath = path.normalize(controllerMetadata.prefix ?? '/' + routeMetadata.path);

      this.router.register(routePath, [routeMetadata.method], async (ctx, next) => {
        // run pipeline
        const input = new Input();
        input.params.ctx = ctx;
        input.params.req = ctx.req;
        input.params.res = ctx.res;

        // const context = await this.pipeline.initContext(input);
        const context = new Context(input);
        await this.pipeline.run(context);
        ctx.context = context;

        // handle request
        handler(ctx as unknown as HTTPContext, next);
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

  @LifecycleHook()
  async didLoad() {
    const middlewares = this.app.config.middlewares || [];
    this.pipeline.use(middlewares);
  }

  @LifecycleHook()
  public async willReady() {
    this.loadController();

    const app = new Koa();
    const port = this.app.config.port || 7001;

    app.use(
      cors({
        credentials: true,
        origin(ctx) {
          return ctx.get('Origin') || 'localhost';
        }
      })
    );

    app.use(this.router.routes());
    app.listen(port, () => {
      this.logger.info(`Server listening on: http://localhost:${port}`);
    });
  }
}
