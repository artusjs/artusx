import { ArtusInjectEnum, Inject } from '@artus/core';
import { GET, HTTPController } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';
import APIService from './api.service';

@HTTPController('/api')
export default class APIController {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  @Inject(APIService)
  apiService: APIService;

  @GET('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'home';
  }

  @GET('/info')
  async getInfo(ctx: ArtusxContext) {
    ctx.body = await this.apiService.mockApi();
  }
}
