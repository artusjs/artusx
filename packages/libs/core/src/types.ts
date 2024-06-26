import type { ArtusXConfig as _ArtusXConfig } from '@artusx/plugin-koa';
import type { Options as KoaCorsOptions } from '@koa/cors';

export * from '@artus/core';
export * from '@artusx/plugin-koa';
export * from '@artusx/plugin-xtransit';
export * from '@artusx/plugin-log4js';
export * from '@artusx/plugin-nunjucks';
export * from '@artusx/plugin-schedule';

export type StaticDirObj = {
  prefix?: string;
  dir?: string;
};

export type ArtusXConfig = _ArtusXConfig & {
  cors?: KoaCorsOptions;
  static?: {
    prefix?: string;
    dir?: string;

    dirs?: Array<string | StaticDirObj>;

    dynamic?: boolean;
    preload?: boolean;
    buffer?: boolean;

    maxFiles?: number;
    maxAge?: number;
  };
};
