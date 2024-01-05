import { ArtusxContext, ArtusxNext } from '../types';

export default async function checkAuth(ctx: ArtusxContext, next: ArtusxNext): Promise<void> {
  const { data } = ctx.output;
  data.authed = false;
  console.log('middleware - checkAuth', data);
  await next();
}
