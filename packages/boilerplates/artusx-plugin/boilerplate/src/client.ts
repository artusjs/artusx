import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';

@Injectable({
  id: InjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export default class Client {
  async init(config) {
    if (!config) {
      return;
    }
  }

  getClient() {    
  }
}
