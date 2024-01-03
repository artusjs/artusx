import type { Context as KoaContext, Next as KoaNext } from 'koa';
import type {
  Context as ArtusContext
  // Next as ArtusNext,
} from '@artus/pipeline';

export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST'
}

export interface HTTPContext extends KoaContext {
  context: ArtusContext;
}

export interface HTTPNext extends KoaNext {}

export type HttpHandler = (ctx: HTTPContext, next: HTTPNext) => Promise<void>;

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
