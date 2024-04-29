import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';
import App, { Express, Router } from 'express';

export interface ExpressConfig {
  port: number;
}

@Injectable({
  id: InjectEnum.Express,
  scope: ScopeEnum.SINGLETON,
})
export default class Client {
  private _app: Express;
  private _router: Router;

  constructor() {
    const app = App();
    const router = App.Router();
    app.use('/', router);

    this._app = app;
    this._router = router;
  }

  get app() {
    return this._app;
  }

  get router() {
    return this._router;
  }
}
