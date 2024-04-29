import fs from 'fs-extra';
import path from 'path';
import get from 'lodash.get';
import assert from 'assert';
import runScript from 'runscript';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';

import type { Server, GrpcObject } from '@grpc/grpc-js';
import type { PackageDefinition } from '@grpc/proto-loader';
import type { ArtusXGrpcServiceList, ArtusXGrpcServiceMap } from './types';

export interface ArtusXGrpcConfig {
  client?: {
    addr: string;
  };
  server?: {
    addr: string;
  };

  // static
  static: {
    proto: string;
    codegen:
      | string
      | {
          js: string;
          ts?: string;
          grpc?: string;
        };
  };

  // dynamic
  dynamic: {
    proto: string[];
  };
}

type InitServerCallback = (err: Error, port: number) => void;

const NPM_BIN_DIR = path.resolve(__dirname, '../node_modules/.bin');

const getBinPath = (name: string) => {
  return path.join(NPM_BIN_DIR, name);
};

@Injectable({
  id: InjectEnum.GRPC,
  scope: ScopeEnum.SINGLETON,
})
export default class ArtusXGrpcClient {
  private _server: Server;
  private _config: ArtusXGrpcConfig;

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

  async init(config: ArtusXGrpcConfig) {
    if (!config) {
      return;
    }

    this._config = config;
  }

  async genDynamicCode(options: ArtusXGrpcConfig['dynamic']) {
    const { proto: protoPath } = options;

    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const packageObject = grpc.loadPackageDefinition(packageDefinition);

    this._packageObject = packageObject;
    this._packageDefinition = packageDefinition;
  }

  async genStaticCode(options: ArtusXGrpcConfig['static']) {
    const { proto: protoPath, codegen } = options;

    const protoc = getBinPath('grpc_tools_node_protoc');
    const protocGenTS = getBinPath('protoc-gen-ts');
    const protocGenRPC = getBinPath('grpc_tools_node_protoc_plugin');

    assert(protoc, 'grpc_tools_node_protoc is required.');
    assert(protocGenTS, 'protoc-gen-ts is required.');
    assert(protocGenRPC, 'grpc_tools_node_protoc_plugin is required.');

    let jsPath = '';
    let tsPath = '';
    let grpcPath = '';

    let targetPath: string[] = [];

    if (typeof codegen === 'string') {
      jsPath = tsPath = grpcPath = codegen;
      targetPath = [jsPath];
    } else {
      jsPath = codegen.js;
      tsPath = codegen.ts || codegen.js;
      grpcPath = codegen.grpc || codegen.js;
      targetPath = [jsPath, tsPath, grpcPath];
    }

    for (const target of targetPath) {
      if (!target) {
        continue;
      }

      fs.ensureDirSync(target);
      fs.emptyDirSync(target);
    }

    const cmd = [
      `${protoc}`,
      `--proto_path=${protoPath}`,
      `--js_out=import_style=commonjs,binary:${jsPath}`,
      `--grpc_out=grpc_js:${grpcPath}`,
      `--plugin=protoc-gen-grpc=${protocGenRPC}`,
      `--ts_out=:${tsPath}`,
      `--ts_opt=no_namespace,unary_rpc_promise=true,target=node`,
      `--plugin=protoc-gen-ts=${protocGenTS}`,
      path.join(protoPath, '*.proto'),
    ].join(' ');

    try {
      await runScript(cmd, {
        stdio: 'pipe',
        shell: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async initServer(
    services: {
      dynamicService: ArtusXGrpcServiceMap;
      staticService: ArtusXGrpcServiceList;
    },
    callback: InitServerCallback = (_err, _port) => {}
  ) {
    assert(this._config?.server, 'server config is required');

    const { addr } = this._config?.server;

    const server = new grpc.Server();

    const { dynamicService, staticService } = services;

    // register dynamic service
    for (const serviceIndex of Object.keys(dynamicService)) {
      const [packageName, serviceName] = serviceIndex.split(':');
      if (!packageName || !serviceName) {
        continue;
      }

      const service = this.getService(packageName, serviceName);

      if (!service) {
        continue;
      }

      const handler = dynamicService[serviceIndex];

      server.addService(service.service, handler);
    }

    // register static service
    for (const serviceItem of staticService) {
      const { definition, instance } = serviceItem;
      server.addService(definition, instance);
    }

    server.bindAsync(addr, grpc.ServerCredentials.createInsecure(), callback);

    this._server = server;
  }
}

export { ArtusXGrpcClient };
