import { ArtusXInjectEnum } from '@artusx/utils';
import { Controller, GET, POST, Inject } from '@artusx/core';
import type { ArtusXContext, NunjucksClient } from '@artusx/core';

@Controller()
export default class HomeController {
  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;
  
  @GET('/')
  @POST('/')
  async home(ctx: ArtusXContext) {
    ctx.body = this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Hello ArtusX!' });
  }
}
