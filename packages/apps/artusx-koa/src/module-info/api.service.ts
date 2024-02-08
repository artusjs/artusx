import { Inject, Injectable, ArtusInjectEnum, ArtusApplication } from '@artusx/core';

@Injectable()
export default class APIService {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  async mockApi() {
    return {
      data: {
        name: 'artusx',
      },
    };
  }
}
