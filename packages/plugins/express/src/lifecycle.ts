import {
  ArtusApplication,
  ArtusInjectEnum,
  ApplicationLifecycle,
  Inject,
  LifecycleHook,
  LifecycleHookUnit,
} from '@artus/core';
import { ArtusXInjectEnum } from './constants';
import Express, { ExpressConfig } from './client';

@LifecycleHookUnit()
export default class ExpressLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const express = this.app.container.get(ArtusXInjectEnum.Express) as Express;
    const { port = 7001 } = this.app.config.express as ExpressConfig;
    const app = express.app;

    app.listen(port, () => {
      console.log(`Server listening on: http://localhost:${port}`);
    });
  }
}
