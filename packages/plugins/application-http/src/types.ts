import type {
  Context as ArtusContext
  // Next as ArtusNext,
} from '@artus/pipeline';

import type { Context as KoaContext, Next as KoaNext, Middleware as KoaMiddleware } from 'koa';

import KoaRouter from './koa/router';
import KoaApplication from './koa/application';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST'
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
  KoaMiddleware,
  KoaNext,
  KoaApplication,
  KoaRouter,

  // artusx
  ArtusxContext,
  ArtusxNext,
  ArtusxHandler
};
