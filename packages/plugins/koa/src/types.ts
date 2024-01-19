import type { Context as ArtusContext, Middleware as ArtusMiddleware } from '@artus/pipeline';
import type { Context as KoaContext, Next as KoaNext, Middleware as KoaMiddleware } from 'koa';

import KoaRouter from './koa/router';
import KoaApplication from './koa/application';

export enum HTTPMethod {
  PUT = 'PUT',
  GET = 'GET',
  POST = 'POST',
  HEAD = 'HEAD',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS'
}

export interface ControllerMetadata {
  prefix?: string;
}

export interface MiddlewareMetadata {
  middlewares: string[];
}

export interface RouteMetadata {
  path: string;
  method: HTTPMethod;
}

interface ArtusxContext extends KoaContext {
  context: ArtusContext;
}

interface ArtusxNext extends KoaNext {}

type ArtusxHandler = (ctx: ArtusxContext, next: ArtusxNext) => Promise<void>;

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
  ArtusxHandler
};

export interface ArtusxConfig {
  koa: {
    port?: number;
    middlewares?: KoaMiddleware[];
  };

  artusx: {
    middlewares?: ArtusMiddleware[];
  };
}
