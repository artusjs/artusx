import { GET, Controller } from '../types';
import type { ArtusxContext } from '../types';

@Controller()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusxContext) {
    ctx.body = 'Hello World';
  }
}
