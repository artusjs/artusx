import { ArtusXInjectEnum, Inject, GET, Controller, ContentType, ArtusApplication } from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';
import APIService from './api.service';

@Controller('/api')
export default class APIController {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.Config)
  config: Record<string, string | number>;

  @Inject(APIService)
  apiService: APIService;

  @GET('/')
  async home(ctx: ArtusXContext) {
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
