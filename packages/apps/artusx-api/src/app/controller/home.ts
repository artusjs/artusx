import { ArtusInjectEnum, Inject } from '@artus/core';
import { GET, POST, HTTPController, Middleware } from '../types';
import type { ArtusxContext } from '../types';

@HTTPController()
export default class HomeController {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @GET('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'home';
  }

  @GET('/get')
  async getInfo(ctx: ArtusxContext) {
    ctx.body = {
      msg: 'get.'
    };
  }

  @Middleware([])
  @GET('/can-be-get')
  @POST('/post')
  async postInfo(ctx: ArtusxContext) {
    ctx.body = {
      msg: 'post.'
    };
  }
}
