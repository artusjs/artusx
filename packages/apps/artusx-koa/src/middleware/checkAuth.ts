import { ArtusXInjectEnum, Inject, ArtusXContext, ArtusXNext, Middleware } from '@artusx/core';

@Middleware({
  enable: true,
})
export default class CheckAuthMiddleware {
  @Inject(ArtusXInjectEnum.Config)
  config: Record<string, string | number>;

  async use(ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
    const { data } = ctx.context.output;
    data.authed = false;
    console.log('[middleware] - checkAuth', ctx.context);
    await next();
  }
}
