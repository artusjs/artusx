import { addTag, Injectable, ScopeEnum } from '@artus/core';

import {
  ControllerMetadata,
  MiddlewareMetadata,
  HTTPMethod,
  HTTPRouteMetadata,
  HTTPMiddlewareMetadata,
  KoaMiddleware,
} from './types';

export const CLASS_CONTROLLER_TAG = 'CLASS_CONTROLLER_TAG';
export const CLASS_CONTROLLER_METADATA = Symbol.for('CLASS_CONTROLLER_METADATA');

export const CLASS_MIDDLEWARE_TAG = 'CLASS_MIDDLEWARE_TAG';
export const CLASS_MIDDLEWARE_METADATA = 'CLASS_MIDDLEWARE_METADATA';

export const HTTP_ROUTER_METADATA = Symbol.for('HTTP_ROUTER_METADATA');
export const HTTP_MIDDLEWARE_METADATA = Symbol.for('HTTP_MIDDLEWARE_METADATA');

// class decorator
export function Controller(prefix?: string) {
  return (target: any) => {
    const controllerMetadata: ControllerMetadata = {
      prefix,
    };

    Reflect.defineMetadata(CLASS_CONTROLLER_METADATA, controllerMetadata, target);
    addTag(CLASS_CONTROLLER_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

export function Middleware(params: { enable: boolean }) {
  return (target: any) => {
    const middlewareMetadata: MiddlewareMetadata = {
      enable: params.enable,
    };

    Reflect.defineMetadata(CLASS_MIDDLEWARE_METADATA, middlewareMetadata, target);
    addTag(CLASS_MIDDLEWARE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}

function buildMethodFactory(method: HTTPMethod, path: string) {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const routeMetadataList: HTTPRouteMetadata[] =
      Reflect.getMetadata(HTTP_ROUTER_METADATA, descriptor.value) ?? [];

    routeMetadataList.push({
      path,
      method,
    });

    Reflect.defineMetadata(HTTP_ROUTER_METADATA, routeMetadataList, descriptor.value);

    return descriptor;
  };
}

// function decorator
export const MW = (middlewares: KoaMiddleware[]) => {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const httpMiddlewareMetadata: HTTPMiddlewareMetadata = {
      middlewares,
    };

    Reflect.defineMetadata(HTTP_MIDDLEWARE_METADATA, httpMiddlewareMetadata, descriptor.value);
    return descriptor;
  };
};

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
