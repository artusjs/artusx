import { GET, HTTPController } from '@artusx/plugin-application-http';

import { HTTPContext } from '@artusx/plugin-application-http';

@HTTPController()
export default class HomeController {
  @GET('/')
  async home(ctx: HTTPContext) {
    ctx.body = 'Hello World';
  }
}
