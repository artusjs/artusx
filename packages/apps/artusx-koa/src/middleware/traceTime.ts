import { ArtusxContext, ArtusxNext } from '@artusx/core';

export default async function traceTime(_ctx: ArtusxContext, next: ArtusxNext): Promise<void> {
  console.time('TraceTime');
  await next();
  console.timeEnd('TraceTime');
}
