import { ArtusXInjectEnum, ArtusXErrorEnum } from '@artusx/utils';
import {
  ArtusInjectEnum,
  ArtusApplication,
  Inject,
  Controller,
  GET,
  POST,
  Headers,
  StatusCode,
} from '@artusx/core';
import type { ArtusxContext, Log4jsClient, NunjucksClient } from '@artusx/core';

@Controller()
export default class HomeController {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.Log4js)
  log4js: Log4jsClient;

  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;

  @GET('/')
  @POST('/')
  @Headers({
    'x-method': 'home-controller',
  })
  @StatusCode(209)
  async home(ctx: ArtusxContext) {
    const infoLogger = this.log4js.getLogger('default');
    const errorLogger = this.log4js.getLogger('error');

    const mockError = ctx.query.error;

    infoLogger.info(`path: /, method: GET`);
    errorLogger.error('mockError', mockError);

    if (mockError) {
      this.app.throwException(ArtusXErrorEnum.UNKNOWN_ERROR);
    }

    return this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Hello ArtusX!' });
  }
}
