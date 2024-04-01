import { Catch, ArtusStdError } from '@artusx/core';
import { ExceptionFilterType } from '@artusx/core';
import { ArtusXWrappedError, BizCustomError } from './error';

@Catch()
export class DefaultExceptionHandler implements ExceptionFilterType {
  async catch(_err: Error) {
    console.log('error:name', _err.name);
  }
}

@Catch('BIZ:COMMON_ERROR')
export class AppCodeExceptionHandler implements ExceptionFilterType {
  async catch(_err: ArtusStdError) {
    console.log('error:code', _err.code);
  }
}

@Catch(ArtusXWrappedError)
export class ArtusXWrapperExceptionHandler implements ExceptionFilterType {
  async catch(_err: ArtusXWrappedError) {
    console.log('error:code', _err.code);
  }
}

@Catch(BizCustomError)
export class BizCustomExceptionHandler implements ExceptionFilterType {
  async catch(_err: BizCustomError) {
    console.log('error:name', _err.name);
  }
}
