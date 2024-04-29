import {
  ArtusApplication,
  ArtusXInjectEnum,
  Inject,
  GET,
  Controller,
  ArtusXStdError,
  ArtusXBizError,
} from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';
import { ArtusXWrappedError, BizCustomError } from '../error';

@Controller('/exception')
export default class APIController {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @GET('/system_error')
  async systemError(ctx: ArtusXContext) {
    const passed = ctx.request.query?.passed;
    if (!passed) {
      this.app.throwException('ARTUSX:UNKNOWN_ERROR');
    }
    ctx.body = 'system_error';
  }

  @GET('/default_error')
  async defaultError(ctx: ArtusXContext) {
    const err = new Error('default error message');
    err.name = 'default error';

    if (err) {
      throw err;
    }
    ctx.body = 'default_error';
  }

  @GET('/wrapper_error')
  async wrapperError(ctx: ArtusXContext) {
    const err = new ArtusXWrappedError();
    if (err) {
      throw err;
    }
    ctx.body = 'wrapper_error';
  }

  @GET('/std_error')
  async stdError(ctx: ArtusXContext) {
    const err = new ArtusXStdError(400, 'artusx std error', {
      data: {},
    });

    if (err) {
      throw err;
    }
    ctx.body = 'biz_custom_error';
  }

  @GET('/biz_error')
  async bizError(ctx: ArtusXContext) {
    const err = new ArtusXBizError('artusx biz error', 400);

    if (err) {
      throw err;
    }
    ctx.body = 'biz_custom_error';
  }

  @GET('/biz_common_error')
  async commonError(ctx: ArtusXContext) {
    const passed = ctx.request.query?.passed;
    if (!passed) {
      this.app.throwException('BIZ:COMMON_ERROR');
    }
    ctx.body = 'biz_common_error';
  }

  @GET('/biz_custom_error')
  async customError(ctx: ArtusXContext) {
    const err = new BizCustomError('biz custom error message');
    if (err) {
      throw err;
    }
    ctx.body = 'biz_custom_error';
  }
}
