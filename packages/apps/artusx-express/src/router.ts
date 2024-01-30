import {
  ArtusApplication,
  ArtusInjectEnum,
  ApplicationLifecycle,
  Inject,
  LifecycleHook,
  LifecycleHookUnit,
} from '@artus/core';

import IExpressClient from '@artusx/plugin-express/client';
import { ArtusXInjectEnum } from '@artusx/plugin-express';

@LifecycleHookUnit()
export default class ExpressLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.Express)
  express: IExpressClient;

  @LifecycleHook()
  async willReady() {
    const router = this.express.router;
    router.use((req, res, next) => {
      console.log('%s %s %s', req.method, req.url, req.path);
      res.locals.method = req.method;
      next();
    });

    router.get('/', (_req, res) => {
      console.log(res.locals);
      res.send('router - /, powered by express.js');
    });

    router.get('/get', (_req, res) => {
      console.log(res.locals);
      res.send('router - /get , powered by express.js');
    });
  }
}
