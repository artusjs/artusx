import { Inject, Injectable, ArtusInjectEnum, ArtusApplication } from '@artus/core';

@Injectable()
export default class APIService {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  async mockApi() {
    return {
      data: {
        name: 'artusx'
      }
    };
  }
}
