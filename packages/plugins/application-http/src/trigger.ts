import { Context, Next } from '@artus/pipeline';
import { Injectable, ScopeEnum, Trigger } from '@artus/core';

@Injectable({ scope: ScopeEnum.SINGLETON })
export default class HttpTrigger extends Trigger {
  constructor() {
    super();

    this.use(async (_ctx: Context, next: Next) => {
      await next();
    });
  }
}
