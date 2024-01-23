import { addTag, Injectable, ScopeEnum } from '@artus/core';

import { ControllerMetadata, MiddlewareMetadata, RouteMetadata, HTTPMethod, KoaMiddleware } from './types';

export const ROUTER_METADATA = Symbol.for('ROUTE_METADATA');
export const MIDDLEWARE_METADATA = Symbol.for('MIDDLEWARE_METADATA');

export const WEB_CONTROLLER_TAG = 'WEB_CONTROLLER_TAG';
export const CONTROLLER_METADATA = Symbol.for('CONTROLLER_METADATA');

export function HTTPController(prefix?: string) {
  return (target: any) => {
    const controllerMetadata: ControllerMetadata = {
      prefix
    };

    Reflect.defineMetadata(CONTROLLER_METADATA, controllerMetadata, target);
    addTag(WEB_CONTROLLER_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export const Middleware = (middlewares: KoaMiddleware[]) => {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const middlewareMetadata: MiddlewareMetadata = {
      middlewares
    };

    Reflect.defineMetadata(MIDDLEWARE_METADATA, middlewareMetadata, descriptor.value);

    return descriptor;
  };
};

function buildMethodFactory(method: HTTPMethod, path: string) {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMetadataList: RouteMetadata[] = Reflect.getMetadata(ROUTER_METADATA, descriptor.value) ?? [];

    routeMetadataList.push({
      path,
      method: method
    });

    Reflect.defineMetadata(ROUTER_METADATA, routeMetadataList, descriptor.value);

    return descriptor;
  };
}

export const GET = (path: string) => {
  return buildMethodFactory(HTTPMethod.GET, path);
};

export const PUT = (path: string) => {
  return buildMethodFactory(HTTPMethod.PUT, path);
};

export const POST = (path: string) => {
  return buildMethodFactory(HTTPMethod.POST, path);
};

export const HEAD = (path: string) => {
  return buildMethodFactory(HTTPMethod.HEAD, path);
};

export const PATCH = (path: string) => {
  return buildMethodFactory(HTTPMethod.PATCH, path);
};

export const DELETE = (path: string) => {
  return buildMethodFactory(HTTPMethod.DELETE, path);
};

export const OPTIONS = (path: string) => {
  return buildMethodFactory(HTTPMethod.OPTIONS, path);
};
