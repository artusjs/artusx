import { ArtusXInjectEnum } from '@artusx/utils';
import { ArtusInjectEnum, ArtusApplication, Inject, Controller, GET, ContentType } from '@artusx/core';

import type { ArtusxContext } from '@artusx/core';
import { EjsClient } from '@artusx/plugin-ejs';

@Controller('/ejs')
export default class EjsController {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.EJS)
  ejs: EjsClient;

  @GET('/')
  @ContentType('html')
  async view(ctx: ArtusxContext) {
    const locals = {
      title: 'Example',
      message: 'This is a message',
    };
    ctx.body = await this.ejs.render('view.ejs', {
      locals,
    });
  }

  @GET('/people')
  async people(ctx: ArtusxContext) {
    const people = ['geddy', 'neil', 'alex'];
    ctx.body = await this.ejs.render('people.ejs', {
      people,
      layout: false,
    });
  }
}
