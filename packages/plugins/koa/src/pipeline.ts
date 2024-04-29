import { Pipeline, Context, Next } from '@artus/pipeline';
import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';

@Injectable({
  id: InjectEnum.Pipeline,
  scope: ScopeEnum.SINGLETON,
})
export default class ArtusPipeline extends Pipeline {
  constructor() {
    super();
    // this.use(this.trace);
  }

  async trace(_ctx: Context, next: Next) {
    await next();
  }
}
