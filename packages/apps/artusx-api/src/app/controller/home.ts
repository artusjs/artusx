import { ArtusInjectEnum, Inject } from '@artus/core';
import { GET, POST, HTTPController, Middleware } from '../types';
import type { HTTPContext } from '../types';

@HTTPController()
export default class HomeController {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @GET('/')
  async home(ctx: HTTPContext) {
    ctx.body = 'home';
  }

  @GET('/get')
  async getInfo(ctx: HTTPContext) {
    ctx.body = {
      msg: 'get.'
    };
  }

  @Middleware([])
  @GET('/can-be-get')
  @POST('/post')
  async postInfo(ctx: HTTPContext) {
    ctx.body = {
      msg: 'post.'
    };
  }
}
