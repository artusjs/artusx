import { Context, Next } from '@artus/pipeline';

export default async function checkAuth(ctx: Context, next: Next): Promise<void> {
  const { data } = ctx.output;
  console.log('middleware - checkAuth', data);
  await next();
}
