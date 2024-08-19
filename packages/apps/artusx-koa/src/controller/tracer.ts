import { ArtusXInjectEnum, Inject, Controller, GET, MW } from '@artusx/core';

import { getMeter, getTracer, Span } from '@artusx/otl';
import type { ArtusXContext, NunjucksClient } from '@artusx/core';
import tracing from '../middleware/tracing';

const meter = getMeter('artusx-koa', '1.0.0');
const tracer = getTracer('artusx-koa', '1.0.0');
const indexCounter = meter.createCounter('index.counter');

@Controller('/tracer')
export default class TracerController {
  @Inject(ArtusXInjectEnum.Nunjucks)
  nunjucks: NunjucksClient;

  @MW([tracing])
  @GET('/')
  async index(ctx: ArtusXContext) {
    // meter
    console.log(indexCounter);
    indexCounter.add(1);

    // tracer
    tracer.startActiveSpan('index', (span: Span) => {
      span.addEvent('index', { key: 'index', value: Math.random() });

      const spanId = span?.spanContext().spanId;
      const traceId = span?.spanContext().traceId;

      ctx.body = this.nunjucks.render('tracer.html', {
        title: 'Tracer',
        message: 'OTL - OpenTelemetry',
        data: {
          spanId,
          traceId,
          count: indexCounter,
        },
      });
      span.end();
    });
  }
}
