import { Inject, Injectable, ArtusInjectEnum, ArtusApplication } from '@artus/core';

@Injectable()
export default class InfoService {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  async getName(): Promise<string> {
    console.log('app.config', this.app.config);
    return 'InfoService';
  }
}
