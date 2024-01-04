import { Pipeline, Context, Next } from '@artus/pipeline';
import { Injectable, ScopeEnum } from '@artus/core';

@Injectable({ scope: ScopeEnum.SINGLETON })
export default class HttpPipeline extends Pipeline {
  constructor() {
    super();

    this.use(async (_ctx: Context, next: Next) => {
      await next();
    });
  }
}
