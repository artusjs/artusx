import { ArtusXContext, ArtusXNext } from '@artusx/core';
import { getTraceId } from '@artusx/otl';

export default async function tracing(_ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
  const traceId = getTraceId();
  console.log('tracing', {
    traceId,
    path: _ctx.path,
  });

  console.time('tracing');
  await next();
  console.timeEnd('tracing');
}
