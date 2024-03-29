import { UntypedServiceImplementation } from '@grpc/grpc-js';

export * from '@grpc/grpc-js';

export interface ArtusXGrpcServiceMetadata {
  packageName: string;
  serviceName: string;

  // UnimplementedService.definition
  definition?: any;
}

export interface ArtusXGrpcMethodMetadata {
  enable: boolean;
}

export type ArtusXGrpcMethodMap = UntypedServiceImplementation;
export type ArtusXGrpcServiceMap = Record<string, ArtusXGrpcMethodMap>;
export type ArtusXGrpcServiceList = Array<{
  definition: any;
  instance: ArtusXGrpcMethodMap;
}>;
