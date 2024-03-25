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
import GRPCClient, { GRPCConfig } from './client';
import { GRPC_SERVICE_METADATA, GRPC_SERVICE_TAG, GRPC_HANDLER_METADATA } from './decorator';
import {
  ArtusxGrpcHandlerMetadata,
  ArtusxGrpcServiceMetadata,
  ArtusXGrpcHandleMap,
  ArtusXGrpcServiceMap,
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

    let serviceMap: ArtusXGrpcServiceMap = {};

    for (const serviceClazz of serviceClazzList) {
      const serviceMetadata: ArtusxGrpcServiceMetadata = Reflect.getMetadata(
        GRPC_SERVICE_METADATA,
        serviceClazz
      );
      const service = this.container.get(serviceClazz) as any;
      const serviceDescriptorList = Object.getOwnPropertyDescriptors(serviceClazz.prototype);

      const { packageName, serviceName } = serviceMetadata;
      const serviceIndex = `${packageName}:${serviceName}`;

      let handlerMap: ArtusXGrpcHandleMap = {};
      for (const key of Object.keys(serviceDescriptorList)) {
        const serviceDescriptor = serviceDescriptorList[key];
        if (!serviceDescriptor.value) {
          continue;
        }

        const handlerMetadata: ArtusxGrpcHandlerMetadata =
          Reflect.getMetadata(GRPC_HANDLER_METADATA, serviceDescriptor.value) ?? undefined;

        if (!handlerMetadata || !handlerMetadata?.enable) {
          continue;
        }

        handlerMap[key] = service[key].bind(service);
      }

      serviceMap[serviceIndex] = {
        ...serviceMap[serviceIndex],
        ...handlerMap,
      };
    }

    return serviceMap;
  }

  @LifecycleHook()
  async willReady() {
    const config: GRPCConfig = this.app.config.grpc;

    assert(config, 'grpc config is required');
    assert(config.protoList, 'grpc config.protoList is required');

    const client = this.app.container.get(ArtusXInjectEnum.GRPC) as GRPCClient;
    await client.init(config);

    if (config.server) {
      const serviceMap = await this.loadService();
      await client.initServer(serviceMap, (err, port) => {
        if (err != null) {
          return console.error(err);
        }
        this.logger.info(`[gRPC] listening on ${port}`);
      });
    }
  }
}
