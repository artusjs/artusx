import { PluginInjectEnum } from '@artusx/utils';
import { ArtusXInjectEnum, ArtusApplication, Inject, Controller, GET, ContentType } from '@artusx/core';

import type { ArtusXContext } from '@artusx/core';
import { EjsClient } from '@artusx/plugin-ejs';

@Controller('/ejs')
export default class EjsController {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @Inject(PluginInjectEnum.EJS)
  ejs: EjsClient;

  @GET('/')
  @ContentType('html')
  async view(ctx: ArtusXContext) {
    const locals = {
      title: 'Example',
      message: 'This is a message',
    };
    ctx.body = await this.ejs.render('view.ejs', {
      locals,
    });
  }

  @GET('/people')
  async people(ctx: ArtusXContext) {
    const people = ['geddy', 'neil', 'alex'];
    ctx.body = await this.ejs.render('people.ejs', {
      people,
      name: 'hello world',
      layout: false,
    });
  }

  @GET('/user-show')
  async userShow(ctx: ArtusXContext) {
    ctx.body = await this.ejs.render('user/show.ejs', {
      name: 'hello world',
      layout: false,
    });
  }
}
