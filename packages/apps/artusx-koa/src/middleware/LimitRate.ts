import dayjs from 'dayjs';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { ArtusInjectEnum, Inject, ArtusXContext, ArtusXNext, Middleware } from '@artusx/core';

const rateLimiterOptions = {
  points: 6,
  duration: 2,
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

  async use(ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
    try {
      const rateLimiterRes = await this.rateLimiter.consume(ctx.ip);
      const reset = dayjs().add(rateLimiterRes.msBeforeNext, 'milliseconds');

      ctx.set('Retry-After', `${rateLimiterRes.msBeforeNext / 1000}`);
      ctx.set('X-RateLimit-Limit', `${rateLimiterOptions.points}`);
      ctx.set('X-RateLimit-Remaining', `${rateLimiterRes.remainingPoints}`);
      ctx.set('X-RateLimit-Reset', reset.toString());
    } catch (rejRes) {
      ctx.status = 429;
      ctx.body = 'Too Many Requests';
      return;
    }
    await next();
  }
}
