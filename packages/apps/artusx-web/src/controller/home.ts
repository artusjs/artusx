import { GET, HTTPController } from '../types';
import type { HTTPContext } from '../types';

@HTTPController()
export default class HomeController {
  @GET('/')
  async home(ctx: HTTPContext) {
    ctx.body = 'Hello World';
  }
}
