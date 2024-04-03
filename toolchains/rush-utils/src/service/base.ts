import { Inject, Injectable } from '@artus-cli/artus-cli';
import { Log4jsClient } from '@artusx/plugin-log4js';

@Injectable()
export default class BaseService {
  @Inject(Log4jsClient)
  log4jsClient: Log4jsClient;

  get logger() {
    return this.log4jsClient.getLogger();
  }
}
