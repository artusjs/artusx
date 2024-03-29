import { Controller, GET } from '@artusx/core';

import type { ArtusXContext } from '@artusx/core';

@Controller()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusXContext) {
    ctx.body = {
      data: {
        msg: 'artusx',
      },
    };
  }
}
