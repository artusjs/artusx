import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { InjectEnum } from './constants';
import OpenAIClient, { OpenAIConfig } from './client';

@LifecycleHookUnit()
export default class OpenAILifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const config: OpenAIConfig = this.app.config.openai;

    if (!config || !config.apiKey) {
      return;
    }

    const client = this.app.container.get(InjectEnum.OpenAI) as OpenAIClient;
    await client.init(config);
  }
}
