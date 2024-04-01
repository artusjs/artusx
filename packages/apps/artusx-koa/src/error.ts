import { ArtusStdError } from '@artusx/core';

export class ArtusXWrappedError extends ArtusStdError {
  static code = 'ARTUSX:WRAPPED_ERROR';
  name = 'ArtusXWrappedError';

  constructor() {
    super(ArtusXWrappedError.code);
  }
}

export class BizCustomError extends Error {
  name = 'BizCustomError';
}
