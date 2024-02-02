import { Inject } from '@artus/core';
import { Controller, GET, POST } from '@artusx/core';
import { ArtusXInjectEnum } from '@artusx/utils';
import type { ArtusxContext, Log4jsClient } from '@artusx/core';

@Controller()
export default class HomeController {
  @Inject(ArtusXInjectEnum.Log4js)
  log4js: Log4jsClient;

  @GET('/')
  @POST('/')
  async home(ctx: ArtusxContext) {
    const logger = this.log4js.logger;
    logger.info(`path: /, method: GET`);

    ctx.body = 'Hello World';
  }
}
