import { ArtusXInjectEnum } from '@artusx/utils';
import { Controller, GET, POST } from '@artusx/core';
import type { ArtusxContext, NunjucksClient } from '@artusx/core';

@Controller()
export default class HomeController {
  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;
  
  @GET('/')
  @POST('/')
  async home(ctx: ArtusxContext) {
    ctx.body = this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Hello ArtusX!' });
  }
}
