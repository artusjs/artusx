import { Controller, GET } from '@artusx/core';

import type { ArtusxContext } from '@artusx/core';

@Controller()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusxContext) {
    ctx.body = {};
  }
}
