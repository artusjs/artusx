import assert from 'assert';
import get from 'lodash.get';

import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import type { Server, GrpcObject } from '@grpc/grpc-js';
import type { PackageDefinition } from '@grpc/proto-loader';
import type { ArtusXGrpcServiceMap } from './types';

export interface GRPCConfig {
  protoList: string[];
  server?: {
    host: string;
    port: number;
  };
}

type InitServerCallback = (err: Error, port: number) => void;

@Injectable({
  id: ArtusXInjectEnum.GRPC,
  scope: ScopeEnum.SINGLETON,
})
export default class GRPCClient {
  private _server: Server;
  private _config: GRPCConfig;

  private _packageObject: GrpcObject;
  private _packageDefinition: PackageDefinition;

  get packageObject() {
    return this._packageObject;
  }

  get packageDefinition() {
    return this._packageDefinition;
  }

  get server() {
    return this._server;
  }

  getService(packageName: string, serviceName: string) {
    const packageObject = this._packageObject;
    if (!packageObject) {
      return;
    }

    const grpcObject = get(packageObject, packageName);
    if (!grpcObject) {
      return;
    }

    return get(grpcObject, serviceName);
  }

  async init(config: GRPCConfig) {
    if (!config) {
      return;
    }

    const { protoList } = config;
    const packageDefinition = protoLoader.loadSync(protoList, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const packageObject = grpc.loadPackageDefinition(packageDefinition);

    this._config = config;
    this._packageObject = packageObject;
    this._packageDefinition = packageDefinition;
  }

  async initServer(serviceMap: ArtusXGrpcServiceMap, callback: InitServerCallback = (_err, _port) => {}) {
    assert(this._config?.server, 'server config is required');

    const { host = '0.0.0.0', port = '50051' } = this._config?.server;

    const server = new grpc.Server();
    const serverUrl = `${host}:${port}`;

    for (const serviceIndex of Object.keys(serviceMap)) {
      const [packageName, serviceName] = serviceIndex.split(':');
      if (!packageName || !serviceName) {
        continue;
      }

      const service = this.getService(packageName, serviceName);

      if (!service) {
        continue;
      }

      const handler = serviceMap[serviceIndex];

      server.addService(service.service, handler);
    }

    server.bindAsync(serverUrl, grpc.ServerCredentials.createInsecure(), callback);

    this._server = server;
  }
}

export { GRPCClient };
