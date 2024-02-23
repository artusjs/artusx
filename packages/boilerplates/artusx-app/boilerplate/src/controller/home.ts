import { Controller, GET, POST } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';

@Controller()
export default class HomeController {
  @GET('/')
  @POST('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'Hello World';
  }
}
