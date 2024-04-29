import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';
import { NestFactory } from '@nestjs/core';
import type { NestApplicationOptions, INestApplication } from '@nestjs/common';

export interface NestConfig extends NestApplicationOptions {
  port: number;
  rootModule: any;
}

@Injectable({
  id: InjectEnum.Nest,
  scope: ScopeEnum.SINGLETON,
})
export default class NestClient {
  private _app: INestApplication;

  async init(module: any, options?: NestApplicationOptions) {
    const app = await NestFactory.create(module, options);
    this._app = app;
  }

  get app() {
    return this._app;
  }
}
