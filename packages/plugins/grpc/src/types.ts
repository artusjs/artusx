import { UntypedServiceImplementation } from '@grpc/grpc-js';

export * from '@grpc/grpc-js';

export interface ArtusxGrpcServiceMetadata {
  packageName: string;
  serviceName: string;

  // UnimplementedService.definition
  definition?: any;
}

export interface ArtusxGrpcHandlerMetadata {
  enable: boolean;
}

export type ArtusXGrpcHandleMap = UntypedServiceImplementation;
export type ArtusXGrpcServiceMap = Record<string, ArtusXGrpcHandleMap>;
export type ArtusXGrpcServiceList = Array<{
  definition: any;
  instance: ArtusXGrpcHandleMap;
}>;
