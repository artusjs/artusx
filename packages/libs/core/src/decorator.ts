import { ArtusStdError, ArtusxContext, ArtusxNext } from './types';

export function Headers(params: Record<string, string | string[]>) {
  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [ctx, _next] = args as [ArtusxContext, ArtusxNext];

      Object.keys(params).forEach((header) => {
        ctx.set(header, params[header]);
      });

      return originalDef.apply(this, args);
    };
    return descriptor;
  };
}

export function StatusCode(statusCode: number) {
  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const [ctx, _next] = args as [ArtusxContext, ArtusxNext];

      try {
        const response = await originalDef.apply(this, args);
        if (response) {
          ctx.status = statusCode || 200;
          ctx.body = response;
        }
      } catch (error) {
        let _statusCode = 500;

        if (error.name === 'ArtusStdError') {
          const err = error as ArtusStdError;
          const desc = err.desc;
          _statusCode = parseInt(desc) || 500;
        }

        ctx.status = _statusCode;
        ctx.body = error;
      }
    };
    return descriptor;
  };
}
