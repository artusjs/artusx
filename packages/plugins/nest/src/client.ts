import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import { NestFactory } from '@nestjs/core';
import type { NestApplicationOptions, INestApplication } from '@nestjs/common';

export interface NestConfig extends NestApplicationOptions {
  port: number;
  rootModule: any;
}

@Injectable({
  id: ArtusXInjectEnum.Nest,
  scope: ScopeEnum.SINGLETON
})
export default class Client {
  private _app: INestApplication;

  async init(module: any, options?: NestApplicationOptions) {
    const app = await NestFactory.create(module, options);
    this._app = app;
  }

  get app() {
    return this._app;
  }
}
