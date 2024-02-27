import type { Context as ArtusContext } from '@artus/pipeline';
import type { Context as KoaContext, Next as KoaNext, Middleware as KoaMiddleware } from 'koa';

import type KoaRouter from '@koa/router';
import type KoaApplication from 'koa';

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

type ArtusxContext = KoaContext & {
  context: ArtusContext;
};

type ArtusxNext = KoaNext & {};

type ArtusxHandler = (ctx: ArtusxContext, next: ArtusxNext) => Promise<void>;

export interface ArtusxMiddleware {
  use: ArtusxHandler;
}

export interface ArtusxConfig {
  port?: number;
  middlewares?: any[];
}

export {
  // koa
  KoaContext,
  KoaNext,
  KoaMiddleware,
  KoaApplication,
  KoaRouter,

  // artusx
  ArtusxContext,
  ArtusxNext,
  ArtusxHandler,
};
