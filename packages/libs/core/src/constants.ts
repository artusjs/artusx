import { ArtusInjectEnum } from '@artus/core';

enum InjectEnum {
  // cotainers
  Pipeline = 'ARTUSX_PIPELINE',

  // nunjucks
  Nunjucks = 'ARTUSX_NUNJUCKS',

  // koa
  Koa = 'ARTUSX_KOA',
  KoaRouter = 'ARTUSX_KOA_ROUTER',

  // log4js
  Log4js = 'ARTUSX_LOG4JS',

  // shedule
  Schedule = 'ARTUSX_SCHEDULE',

  // xtransit
  XTransit = 'ARTUSX_XTRANSIT',
}

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
export enum HTTPErrorEnum {
  // Status_Code = 400
  HTTP_BAD_REQUEST = 'HTTP:BAD_REQUEST',
  // Status_Code = 401
  HTTP_UNAUTHORIZED = 'HTTP:UNAUTHORIZED',
  // Status_Code = 403
  HTTP_FORBIDDEN = 'HTTP:FORBIDDEN',
  // Status_Code = 404
  HTTP_NOT_FODUND = 'HTTP:NOT_FODUND',
  // Status_Code = 405
  HTTP_METHOD_NOT_ALLOWED = 'HTTP:METHOD_NOT_ALLOWED',
  // Status_Code = 500
  HTTP_INTERNAL_SERVER_ERROR = 'HTTP:INTERNAL_SERVER_ERROR',
  // Status_Code = 501
  HTTP_NOT_IMPLEMENTED = 'HTTP:NOT_IMPLEMENTED',
  // Status_Code = 502
  HTTP_BAD_GATEWAY = 'HTTP:BAD_GATEWAY',
  // Status_Code = 503
  HTTP_SERVICE_UNAVAILABLE = 'HTTP:SERVICE_UNAVAILABLE',
  // Status_Code = 504
  HTTP_GATEWAY_TIMEOUT = 'HTTP:GATEWAY_TIMEOUT',
}

export enum ArtusXErrorEnum {
  // Status_Code = 500
  ARTUSX_UNKNOWN_ERROR = 'ARTUSX:UNKNOWN_ERROR',
}

export const ArtusXInjectEnum = {
  ...ArtusInjectEnum,
  ...InjectEnum,
};

export type ArtusXInjectEnum = ArtusInjectEnum | InjectEnum;
