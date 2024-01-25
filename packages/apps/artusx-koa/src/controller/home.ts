import { HTTPController, GET, POST } from '../types';
import type { ArtusxContext } from '../types';

@HTTPController()
export default class HomeController {
  @GET('/')
  @POST('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'Hello World';
  }
}
