import { ArtusxContext, ArtusxNext } from '@artusx/core';

export default async function checkAuth(ctx: ArtusxContext, next: ArtusxNext): Promise<void> {
  const { data } = ctx.context.output;
  data.authed = false;
  console.log('middleware - checkAuth', ctx.context);
  await next();
}
