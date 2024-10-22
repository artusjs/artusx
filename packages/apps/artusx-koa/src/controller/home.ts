import { PassThrough } from 'stream';

import {
  ArtusXErrorEnum,
  ArtusXInjectEnum,
  ArtusApplication,
  Inject,
  Controller,
  GET,
  POST,
  Headers,
  StatusCode,
} from '@artusx/core';

import EventEmitterService, { EventMessage } from '../module-events/eventEmitter.service';
import type { ArtusXContext, Log4jsClient, NunjucksClient } from '@artusx/core';

@Controller()
export default class HomeController {
  @Inject(EventEmitterService)
  eventEmitterService: EventEmitterService;

  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.Log4js)
  log4js: Log4jsClient;

  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;

  @GET('/')
  async home(ctx: ArtusXContext) {
    const infoLogger = this.log4js.getLogger('default');
    infoLogger.info(`path: /, method: GET`);

    ctx.body = this.nunjucks.render('index.html', {
      title: 'ArtusX',
      message: 'Hello ArtusX!',
      data: {},
    });
  }

  @GET('/html')
  @Headers({
    'x-handler': 'Home-controller-html: html',
  })
  @StatusCode(200)
  async html(_ctx: ArtusXContext) {
    return this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Render with nunjucks' });
  }

  @POST('/post')
  @StatusCode(200)
  async post(_ctx: ArtusXContext) {
    return this.nunjucks.render('index.html', { title: 'ArtusX', message: 'Post method' });
  }

  @GET('/stream')
  async stream(ctx: ArtusXContext) {
    ctx.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });

    const stream = new PassThrough();

    ctx.respond = false;
    ctx.res.statusCode = 200;
    stream.pipe(ctx.res);

    const listener = (msg: EventMessage) => {
      console.log('listener', msg);
      stream.write(`data: ${msg.data}\n\n`);
    };

    // handle message
    this.eventEmitterService.on('stream', listener);

    // init message
    this.eventEmitterService.emit('stream', {
      data: '/stream: init',
    });
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
