import { Context, Next } from '@artus/pipeline';
import {
  // Inject,
  Injectable,
  // Logger,
  ScopeEnum,
  Trigger
} from '@artus/core';

@Injectable({ scope: ScopeEnum.SINGLETON })
export default class HttpTrigger extends Trigger {
  // @Inject(Logger)
  // logger: Logger;

  constructor() {
    super();

    this.use(async (_ctx: Context, next: Next) => {
      // this.logger.debug('ArtusX - HTTP Trigger', 'run pipeline');
      await next();
    });
  }
}
