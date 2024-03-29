import { ArtusXContext, ArtusXNext } from '@artusx/core';

export default async function traceTime(_ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
  console.time('TraceTime');
  await next();
  console.timeEnd('TraceTime');
}
