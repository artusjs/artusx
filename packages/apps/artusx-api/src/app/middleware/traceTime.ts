import { ArtusxContext, ArtusxNext } from '@artusx/core';

export default async function traceTime(_ctx: ArtusxContext, next: ArtusxNext): Promise<void> {
  console.time('trace');
  await next();
  console.timeEnd('trace');
}
