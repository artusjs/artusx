import { addTag, Injectable, ScopeEnum } from '@artus/core';
import type { ArtusStdError } from '@artus/core';

import {
  ControllerMetadata,
  MiddlewareMetadata,
  HTTPMethod,
  HTTPRouteMetadata,
  HTTPMiddlewareMetadata,
  ArtusxHandler,
  ArtusxContext,
  ArtusxNext,
} from './types';

export const CLASS_CONTROLLER_TAG = 'CLASS_CONTROLLER_TAG';
export const CLASS_CONTROLLER_METADATA = Symbol.for('CLASS_CONTROLLER_METADATA');

export const CLASS_MIDDLEWARE_TAG = 'CLASS_MIDDLEWARE_TAG';
export const CLASS_MIDDLEWARE_METADATA = 'CLASS_MIDDLEWARE_METADATA';

export const HTTP_ROUTER_METADATA = Symbol.for('HTTP_ROUTER_METADATA');
export const HTTP_MIDDLEWARE_METADATA = Symbol.for('HTTP_MIDDLEWARE_METADATA');

/**
 * Controler decorator
 * @param prefix string
 * @example @Controller('/api')
 * @returns void
 */
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

// class middleware decorator
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

export function Headers(params: Record<string, string | string[]>) {
  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [ctx, _next] = args as [ArtusxContext, ArtusxNext];

      Object.keys(params).forEach((header) => {
        ctx.set(header, params[header]);
      });

      return originalDef.apply(this, args);
    };
    return descriptor;
  };
}

/**
 * ContentType decorator
 * @description set content-type, https://www.npmjs.com/package/mime-types
 * @param contentType
 * @returns void
 */

export function ContentType(contentType: string) {
  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [ctx, _next] = args as [ArtusxContext, ArtusxNext];

      await originalDef.apply(this, args);

      ctx.type = contentType || 'text/plain; charset=utf-8';
    };
    return descriptor;
  };
}

export function StatusCode(statusCode: number) {
  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [ctx, _next] = args as [ArtusxContext, ArtusxNext];

      try {
        const response = await originalDef.apply(this, args);
        if (response) {
          ctx.status = statusCode || 200;
          ctx.body = response;
        }
      } catch (error) {
        let _statusCode = 500;

        if (error.name === 'ArtusStdError') {
          const err = error as ArtusStdError;
          const desc = err.desc;
          _statusCode = parseInt(desc) || 500;
        }

        ctx.status = _statusCode;
        ctx.body = error;
      }
    };
    return descriptor;
  };
}

// function middleware decorator
export const MW = (middlewares: ArtusxHandler[]) => {
  return (_target: object, _key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
    const httpMiddlewareMetadata: HTTPMiddlewareMetadata = {
      middlewares,
    };

    Reflect.defineMetadata(HTTP_MIDDLEWARE_METADATA, httpMiddlewareMetadata, descriptor.value);
    return descriptor;
  };
};

function buildHttpMethodFactory(method: HTTPMethod, path: string) {
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

export const GET = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.GET, path);
};

export const PUT = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.PUT, path);
};

export const POST = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.POST, path);
};

export const HEAD = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.HEAD, path);
};

export const PATCH = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.PATCH, path);
};

export const DELETE = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.DELETE, path);
};

export const OPTIONS = (path: string) => {
  return buildHttpMethodFactory(HTTPMethod.OPTIONS, path);
};
