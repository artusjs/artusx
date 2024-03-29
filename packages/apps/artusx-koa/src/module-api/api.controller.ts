import { ArtusInjectEnum, Inject, GET, Controller, ContentType, ArtusApplication } from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';
import APIService from './api.service';

@Controller('/api')
export default class APIController {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  @Inject(APIService)
  apiService: APIService;

  @GET('/')
  async home(ctx: ArtusXContext) {
    const err = this.app.createException('ARTUSX:UNKNOWN_ERROR');
    if (err) {
      throw err;
    }
    ctx.body = 'api';
  }

  @GET('/mock')
  async mock(ctx: ArtusXContext) {
    ctx.body = 'mock';
  }

  @GET('/MOCK')
  async mockWithUpperCase(ctx: ArtusXContext) {
    ctx.body = 'MOCK';
  }

  @GET('/mockApi')
  @ContentType('application/json; charset=utf-8')
  async getInfo(ctx: ArtusXContext) {
    ctx.body = await this.apiService.mockApi();
  }
}
