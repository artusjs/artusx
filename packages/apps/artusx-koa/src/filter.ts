import { Catch, ArtusStdError, ArtusXExceptionFilterType, ArtusXContext } from '@artusx/core';
import { ArtusXWrappedError, BizCustomError } from './error';

@Catch()
export class DefaultExceptionHandler implements ArtusXExceptionFilterType {
  async catch(_err: Error, _ctx: ArtusXContext) {
    console.log('error:name', _err.name);
  }
}

@Catch('BIZ:COMMON_ERROR')
export class AppCodeExceptionHandler implements ArtusXExceptionFilterType {
  async catch(_err: ArtusStdError) {
    console.log('error:code', _err.code);
  }
}

@Catch(ArtusXWrappedError)
export class ArtusXWrapperExceptionHandler implements ArtusXExceptionFilterType {
  async catch(_err: ArtusXWrappedError) {
    console.log('error:code', _err.code);
  }
}

@Catch(BizCustomError)
export class BizCustomExceptionHandler implements ArtusXExceptionFilterType {
  async catch(_err: BizCustomError) {
    console.log('error:name', _err.name);
  }
}
