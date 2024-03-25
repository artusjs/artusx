import { addTag, Injectable, ScopeEnum } from '@artus/core';

export const GRPC_SERVICE_TAG = 'GRPC_SERVICE_TAG';
export const GRPC_SERVICE_METADATA = Symbol.for('GRPC_SERVICE_METADATA');
export const GRPC_HANDLER_METADATA = Symbol.for('GRPC_METHOD_METADATA');

import { ArtusxGrpcServiceMetadata, ArtusxGrpcHandlerMetadata } from './types';

/**
 * GRPC service decorator
 * @param options GRPCServiceOptions
 * @example @GRPC()
 * @returns void
 */
export function GRPC(options: ArtusxGrpcServiceMetadata) {
  return (target: any) => {
    const grpcServiceMetadata = options;

    Reflect.defineMetadata(GRPC_SERVICE_METADATA, grpcServiceMetadata, target);
    addTag(GRPC_SERVICE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function GRPCHandler(options?: ArtusxGrpcHandlerMetadata) {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const grpcHandlerMetadata = options || {};

    Reflect.defineMetadata(GRPC_HANDLER_METADATA, grpcHandlerMetadata, descriptor.value);
    return descriptor;
  };
}
