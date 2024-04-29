import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';
import OpenAI, { ClientOptions } from 'openai';

export type OpenAIConfig = ClientOptions & {
  apiKey: string;
};

@Injectable({
  id: InjectEnum.OpenAI,
  scope: ScopeEnum.SINGLETON,
})
export default class OpenAIClient {
  private openai: OpenAI;

  async init(config: OpenAIConfig) {
    this.openai = new OpenAI(config);
  }

  getClient(): OpenAI {
    return this.openai;
  }
}
