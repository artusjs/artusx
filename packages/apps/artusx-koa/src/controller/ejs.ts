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
  async home(ctx: ArtusXContext) {
    const locals = {
      title: 'Ejs - Home',
      message: 'This is a message',
    };
    ctx.body = await this.ejs.render('home.ejs', {
      locals,
    });
  }

  @GET('/user-list')
  async userList(ctx: ArtusXContext) {
    const people = ['geddy', 'neil', 'alex'];
    ctx.body = await this.ejs.render('users.ejs', {
      title: 'Ejs - user list',
      people,
      name: 'user list',
      layout: false,
    });
  }

  @GET('/user-detail')
  async userDetail(ctx: ArtusXContext) {
    ctx.body = await this.ejs.render('user/detail.ejs', {
      title: 'Ejs - user detail',
      name: 'user detail',
      layout: false,
    });
  }
}
