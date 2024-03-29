import { addTag, Injectable, ScopeEnum } from '@artus/core';

export const GRPC_SERVICE_TAG = 'GRPC_SERVICE_TAG';
export const GRPC_SERVICE_METADATA = Symbol.for('GRPC_SERVICE_METADATA');
export const GRPC_METHOD_METADATA = Symbol.for('GRPC_METHOD_METADATA');

import { ArtusXGrpcServiceMetadata, ArtusXGrpcMethodMetadata } from './types';

/**
 * Grpc service decorator
 * @param options GrpcServiceOptions
 * @example @GrpcService()
 * @returns void
 */
export function GrpcService(options: ArtusXGrpcServiceMetadata) {
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
export function GrpcMethod(options?: ArtusXGrpcMethodMetadata) {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const methodMetadata = options || {};

    Reflect.defineMetadata(GRPC_METHOD_METADATA, methodMetadata, descriptor.value);
    return descriptor;
  };
}
