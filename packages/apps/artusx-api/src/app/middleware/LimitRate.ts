import { ArtusInjectEnum, Inject, ArtusxContext, ArtusxNext, Middleware } from '@artusx/core';

import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiterOptions = {
  points: 6,
  duration: 1,
};

@Middleware({
  enable: true,
})
export default class LimitRateMiddleware {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  private rateLimiter: RateLimiterMemory;

  constructor() {
    this.rateLimiter = new RateLimiterMemory(rateLimiterOptions);
  }

  async use(ctx: ArtusxContext, next: ArtusxNext): Promise<void> {
    try {
      const rateLimiterRes = await this.rateLimiter.consume(ctx.ip);
      ctx.set('Retry-After', `${rateLimiterRes.msBeforeNext / 1000}`);
      ctx.set('X-RateLimit-Limit', `${rateLimiterOptions.points}`);
      ctx.set('X-RateLimit-Remaining', `${rateLimiterRes.remainingPoints}`);
      ctx.set('X-RateLimit-Reset', `${new Date(Date.now() + rateLimiterRes.msBeforeNext)}`);
    } catch (rejRes) {
      ctx.status = 429;
      ctx.body = 'Too Many Requests';
      return;
    }
    await next();
  }
}
