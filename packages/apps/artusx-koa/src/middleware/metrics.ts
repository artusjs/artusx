import { ArtusXInjectEnum, Inject, ArtusXContext, ArtusXNext, Middleware } from '@artusx/core';
import { register, Counter, Histogram } from '@artusx/plugin-prometheus';

const counter = new Counter({
  name: 'artusx_metrics_request_counter',
  help: 'artusx metrics request counter',
  labelNames: ['path', 'methods'],
  registers: [register],
});

const histogram = new Histogram({
  name: 'artusx_metrics_request_histogram',
  help: 'artusx metrics request histogram',
  labelNames: ['path', 'methods'],
  registers: [register],
});

register.registerMetric(counter);
register.registerMetric(histogram);

@Middleware({
  enable: true,
})
export default class MetricsMiddleware {
  @Inject(ArtusXInjectEnum.Config)
  config: Record<string, string | number>;

  async use(ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
    if (ctx.path === '/metrics') {
      return await next();
    }

    counter.inc({
      path: ctx.path,
      methods: ctx.method,
    });

    histogram.observe(
      {
        path: ctx.path,
        methods: ctx.method,
      },
      1
    );

    await next();
  }
}
