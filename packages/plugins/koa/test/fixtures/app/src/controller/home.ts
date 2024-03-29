import { GET, Controller } from '../types';
import type { ArtusXContext } from '../types';

@Controller()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusXContext) {
    ctx.body = 'Hello World';
  }
}
