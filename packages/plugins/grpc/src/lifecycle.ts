import assert from 'assert';
import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import ArtusXGrpcClient, { ArtusxGrpcConfig } from './client';
import { GRPC_SERVICE_TAG, GRPC_SERVICE_METADATA, GRPC_METHOD_METADATA } from './decorator';
import {
  ArtusxGrpcServiceMetadata,
  ArtusxGrpcMethodMetadata,
  ArtusXGrpcMethodMap,
  ArtusXGrpcServiceMap,
  ArtusXGrpcServiceList,
} from './types';

@LifecycleHookUnit()
export default class GRPCLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  get container() {
    return this.app.container;
  }

  private async loadService() {
    const serviceClazzList = this.container.getInjectableByTag(GRPC_SERVICE_TAG);

    let dynamicService: ArtusXGrpcServiceMap = {};
    let staticService: ArtusXGrpcServiceList = [];

    for (const serviceClazz of serviceClazzList) {
      const serviceMetadata: ArtusxGrpcServiceMetadata = Reflect.getMetadata(
        GRPC_SERVICE_METADATA,
        serviceClazz
      );
      const service = this.container.get(serviceClazz) as any;
      const serviceDescriptorList = Object.getOwnPropertyDescriptors(serviceClazz.prototype);

      const { packageName, serviceName, definition } = serviceMetadata;
      const serviceIndex = `${packageName}:${serviceName}`;

      if (definition) {
        staticService.push({
          definition,
          instance: service,
        });
        continue;
      }

      let handlerMap: ArtusXGrpcMethodMap = {};
      for (const key of Object.keys(serviceDescriptorList)) {
        const serviceDescriptor = serviceDescriptorList[key];
        if (!serviceDescriptor.value) {
          continue;
        }

        const handlerMetadata: ArtusxGrpcMethodMetadata =
          Reflect.getMetadata(GRPC_METHOD_METADATA, serviceDescriptor.value) ?? undefined;

        if (!handlerMetadata || !handlerMetadata?.enable) {
          continue;
        }

        handlerMap[key] = service[key].bind(service);
      }

      dynamicService[serviceIndex] = {
        ...dynamicService[serviceIndex],
        ...handlerMap,
      };
    }

    return {
      staticService,
      dynamicService,
    };
  }

  @LifecycleHook()
  async willReady() {
    const config: ArtusxGrpcConfig = this.app.config.grpc;

    assert(config, 'grpc config is required');
    assert(config.dynamic || config.static, 'dynamic or static config is required');

    const client = this.app.container.get(ArtusXInjectEnum.GRPC) as ArtusXGrpcClient;
    await client.init(config);

    if (config.dynamic) {
      await client.genDynamicCode(config.dynamic);
    }

    if (config.static) {
      await client.genStaticCode(config.static);
    }

    if (config.server) {
      const services = await this.loadService();
      await client.initServer(services, (err, port) => {
        if (err != null) {
          return console.error(err);
        }
        this.logger.info(`[gRPC] listening on ${port}`);
      });
    }
  }
}
