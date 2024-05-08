import { Injectable, Inject, ScopeEnum, ArtusInjectEnum } from '@artus/core';
import { InjectEnum } from './constants';

@Injectable({
  id: InjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export default class Client {
  _config: any;
  
  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    this._config = config || {};
  }

  async init(config) {
    if (!config) {
      return;
    }
  }

  getClient() {    
  }
}
