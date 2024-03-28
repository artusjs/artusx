import { UntypedServiceImplementation } from '@grpc/grpc-js';

export * from '@grpc/grpc-js';

export interface ArtusxGrpcServiceMetadata {
  packageName: string;
  serviceName: string;

  // UnimplementedService.definition
  definition?: any;
}

export interface ArtusxGrpcMethodMetadata {
  enable: boolean;
}

export type ArtusXGrpcMethodMap = UntypedServiceImplementation;
export type ArtusXGrpcServiceMap = Record<string, ArtusXGrpcMethodMap>;
export type ArtusXGrpcServiceList = Array<{
  definition: any;
  instance: ArtusXGrpcMethodMap;
}>;
