import {
  ArtusXErrorEnum,
  ArtusXInjectEnum,
  ArtusApplication,
  Inject,
  Controller,
  GET,
  POST,
  MW,
  Headers,
  StatusCode,
} from '@artusx/core';

import { getMeter, getTracer, Span } from '@artusx/otl';

import type { ArtusXContext, Log4jsClient, NunjucksClient } from '@artusx/core';
import tracing from '../middleware/tracing';

const meter = getMeter('artusx-koa', '1.0.0');
const tracer = getTracer('artusx-koa', '1.0.0');
const homeCounter = meter.createCounter('home.counter');

@Controller()
export default class HomeController {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.Log4js)
  log4js: Log4jsClient;

  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;

  @MW([tracing])
  @GET('/')
  async home(ctx: ArtusXContext) {
    const infoLogger = this.log4js.getLogger('default');
    infoLogger.info(`path: /, method: GET`);

    // meter
    console.log(homeCounter);
    homeCounter.add(1);

    // tracer
    tracer.startActiveSpan('home', (span: Span) => {
      span.addEvent('home', { key: 'home', value: Math.random() });

      const spanId = span?.spanContext().spanId;
      const traceId = span?.spanContext().traceId;

      ctx.body = this.nunjucks.render('index.html', {
        title: 'ArtusX',
        message: 'Hello ArtusX!',
        data: {
          spanId,
          traceId,
          count: homeCounter,
        },
      });
      span.end();
    });
  }

  @POST('/post')
  @StatusCode(200)
  async post(_ctx: ArtusXContext) {
    return this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Post method' });
  }

  @MW([tracing])
  @GET('/html')
  @Headers({
    'x-handler': 'Home-controller-html: html',
  })
  @StatusCode(200)
  async html(_ctx: ArtusXContext) {
    return this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Render with nunjucks' });
  }

  @GET('/error')
  @StatusCode(403)
  async error(ctx: ArtusXContext) {
    const errorLogger = this.log4js.getLogger('error');
    const mockError = ctx.query.error;
    errorLogger.error('mockError', mockError);

    if (mockError) {
      this.app.throwException(ArtusXErrorEnum.ARTUSX_UNKNOWN_ERROR);
    }

    return 'mockError: error.';
  }
}
