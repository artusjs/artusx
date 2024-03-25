import { ArtusInjectEnum, Inject, GET, Controller, ContentType } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';
import APIService from './api.service';

@Controller('/api')
export default class APIController {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  @Inject(APIService)
  apiService: APIService;

  @GET('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'api';
  }

  @GET('/mock')
  async mock(ctx: ArtusxContext) {
    ctx.body = 'mock';
  }

  @GET('/MOCK')
  async mockWithUpperCase(ctx: ArtusxContext) {
    ctx.body = 'MOCK';
  }

  @GET('/mockApi')
  @ContentType('application/json; charset=utf-8')
  async getInfo(ctx: ArtusxContext) {
    ctx.body = await this.apiService.mockApi();
  }
}
