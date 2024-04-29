import { Inject, Injectable, ArtusXInjectEnum, ArtusApplication } from '@artusx/core';

@Injectable()
export default class APIService {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  async mockApi() {
    return {
      data: {
        name: 'artusx',
      },
    };
  }
}
