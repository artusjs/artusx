import { ArtusInjectEnum, Inject } from '@artus/core';
import { ArtusXContext, ArtusXNext, Middleware } from '../types';

@Middleware({
  enable: true,
})
export default class CheckAuthMiddleware {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  async use(ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
    const { data } = ctx.context.output;
    data.authed = false;
    await next();
  }
}
