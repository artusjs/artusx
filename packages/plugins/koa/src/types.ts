import type { ArtusStdError } from '@artus/core';
import type { Context as ArtusContext } from '@artus/pipeline';
import type { Context as KoaContext, Next as KoaNext, Middleware as KoaMiddleware } from 'koa';

import Router from 'find-my-way';
import type KoaApplication from 'koa';

type KoaRouter<V extends Router.HTTPVersion = Router.HTTPVersion.V1> = Router.Instance<V> & {
  new (config?: Router.Config<V>): Router.Instance<V>;
};

export enum HTTPMethod {
  PUT = 'PUT',
  GET = 'GET',
  POST = 'POST',
  HEAD = 'HEAD',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

export interface ControllerMetadata {
  prefix?: string;
}

export interface MiddlewareMetadata {
  enable?: boolean;
}

export interface HTTPRouteMetadata {
  path: string;
  method: HTTPMethod;
}

export interface HTTPMiddlewareMetadata {
  middlewares: KoaMiddleware[];
}

type ArtusXContext = KoaContext & {
  context: ArtusContext;
};

type ArtusXNext = KoaNext & {};

type ArtusXHandler = (ctx: ArtusXContext, next: ArtusXNext) => Promise<void>;

export interface ArtusXMiddleware {
  use: ArtusXHandler;
}

export interface ArtusXConfig {
  keys?: string;
  port?: number;
  middlewares?: any[];
  router?: {
    caseSensitive?: boolean;
    ignoreTrailingSlash?: boolean;
    ignoreDuplicateSlashes?: boolean;
  };
  onError?: (ctx: ArtusXContext, err: Error) => void;
}

export {
  // koa
  KoaContext,
  KoaNext,
  KoaMiddleware,
  KoaApplication,
  KoaRouter,

  // artusx
  ArtusXContext,
  ArtusXNext,
  ArtusXHandler,
};

export interface ArtusXExceptionFilterType {
  catch(err: Error | ArtusStdError, ctx?: ArtusXContext): void | Promise<void>;
}
