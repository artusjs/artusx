import { GET, HTTPController } from '../types';
import type { ArtusxContext } from '../types';

@HTTPController()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'Hello World';
  }
}
