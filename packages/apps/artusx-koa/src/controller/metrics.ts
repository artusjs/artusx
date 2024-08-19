import { ArtusXInjectEnum, ArtusApplication, Inject, Controller, GET } from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';
import { PluginInjectEnum } from '@artusx/utils';
import PrometheusClient from '@artusx/plugin-prometheus/client';

@Controller('/metrics')
export default class MetricsController {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @Inject(PluginInjectEnum.Prometheus)
  prometheus: PrometheusClient;

  @GET('/')
  async index(ctx: ArtusXContext) {
    const metrics = await this.prometheus.getMetrics();
    ctx.body = metrics;
  }
}
