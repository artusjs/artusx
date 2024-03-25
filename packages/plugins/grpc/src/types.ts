import { UntypedServiceImplementation } from '@grpc/grpc-js';

export * from '@grpc/grpc-js';

export interface ArtusxGrpcServiceMetadata {
  packageName: string;
  serviceName: string;
}

export interface ArtusxGrpcHandlerMetadata {
  enable: boolean;
}

export type ArtusXGrpcHandleMap = UntypedServiceImplementation;
export type ArtusXGrpcServiceMap = Record<string, ArtusXGrpcHandleMap>;
