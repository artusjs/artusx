import { addTag, Injectable, ScopeEnum } from '@artus/core';

export const GRPC_CLIENT_TAG = 'GRPC_CLIENT_TAG';
export const GRPC_CLIENT_METADATA = Symbol.for('GRPC_CLIENT_METADATA');

export const GRPC_SERVICE_TAG = 'GRPC_SERVICE_TAG';
export const GRPC_SERVICE_METADATA = Symbol.for('GRPC_SERVICE_METADATA');

export const GRPC_METHOD_METADATA = Symbol.for('GRPC_METHOD_METADATA');

import { ArtusxGrpcServiceMetadata, ArtusxGrpcClientMetadata, ArtusxGrpcMethodMetadata } from './types';

/**
 * Grpc service decorator
 * @param options GrpcServiceOptions
 * @example @GrpcService()
 * @returns void
 */
export function GrpcService(options: ArtusxGrpcServiceMetadata) {
  return (target: any) => {
    const serviceMetadata = options;

    Reflect.defineMetadata(GRPC_SERVICE_METADATA, serviceMetadata, target);
    addTag(GRPC_SERVICE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

/**
 * Grpc method decorator
 * @param options GrpcMethodOptions
 * @example @GrpcMethod()
 * @returns void
 */
export function GrpcMethod(options?: ArtusxGrpcMethodMetadata) {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const methodMetadata = options || {};

    Reflect.defineMetadata(GRPC_METHOD_METADATA, methodMetadata, descriptor.value);
    return descriptor;
  };
}

/**
 * GRPC client decorator
 * @param options GrpcClientOptions
 * @example @GrpcClient()
 * @returns void
 */
export function GrpcClient(options: ArtusxGrpcClientMetadata) {
  return (target: any) => {
    const clientMetadata = options;

    Reflect.defineMetadata(GRPC_CLIENT_METADATA, clientMetadata, target);
    addTag(GRPC_CLIENT_TAG, target);
    Injectable({ scope: ScopeEnum.SINGLETON })(target);
  };
}
