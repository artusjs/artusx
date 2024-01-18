import { Pipeline, Context, Next } from '@artus/pipeline';
import { Injectable, ScopeEnum } from '@artus/core';
import { ArtusXInjectEnum } from './constants';

@Injectable({
  id: ArtusXInjectEnum.Pipeline,
  scope: ScopeEnum.SINGLETON
})
export default class ArtusPipeline extends Pipeline {
  constructor() {
    super();

    this.use(async (_ctx: Context, next: Next) => {
      await next();
    });
  }
}
