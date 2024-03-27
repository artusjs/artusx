import { UntypedServiceImplementation } from '@grpc/grpc-js';

export * from '@grpc/grpc-js';

export interface ArtusxGrpcServiceMetadata {
  packageName: string;
  serviceName: string;

  // UnimplementedService.definition
  definition?: any;
}

export interface ArtusxGrpcClientMetadata {
  load: boolean;
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

export class ArtusXGrpcClientClass<T> {
  private _client: T;

  setClient(instance: T) {
    this._client = instance;
  }

  getClient() {
    return this._client;
  }
}
