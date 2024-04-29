import {
  ArtusApplication,
  ArtusInjectEnum,
  ApplicationLifecycle,
  Inject,
  LifecycleHook,
  LifecycleHookUnit,
} from '@artus/core';
import { InjectEnum } from './constants';
import Nest, { NestConfig } from './client';

@LifecycleHookUnit()
export default class NestLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const nest = this.app.container.get(InjectEnum.Nest) as Nest;
    const { port = 7001, rootModule } = this.app.config.nest as NestConfig;
    await nest.init(
      rootModule.registerAsync({
        container: this.app.container,
      })
    );
    const app = nest.app;
    await app.listen(port);
    console.log(`Server listening on: http://localhost:${port}`);
  }
}
