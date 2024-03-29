import { Catch } from '@artusx/core';
import { ExceptionFilterType } from '@artusx/core';

@Catch()
export class DefaultExceptionHandler implements ExceptionFilterType {
  async catch(_err: Error) {
    console.log('DefaultExceptionHandler');
  }
}
