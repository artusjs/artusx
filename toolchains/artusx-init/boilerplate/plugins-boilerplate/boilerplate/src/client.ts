import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

@Injectable({
  id: ArtusXInjectEnum.Client,
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
