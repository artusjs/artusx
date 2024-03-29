import Ajv, { JSONSchemaType } from 'ajv';
import { ArtusXContext, ArtusXNext } from './types';
export type { JSONSchemaType, JSONType } from 'ajv';

const ajv = new Ajv();

function buildValidatorFactory<T>(key: 'query' | 'params' | 'body', schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema);

  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [ctx, _next] = args as [ArtusXContext, ArtusXNext];

      let data = ctx.query;

      if (key === 'params') {
        data = ctx.params;
      }

      if (key === 'body') {
        data = ctx.request.body;
      }

      const validated = validate(data);

      ctx.context.output.data[key] = {
        data,
        validated,
        errors: validate.errors,
      };

      return originalDef.apply(this, args);
    };
    return descriptor;
  };
}

export function Query<T>(params: JSONSchemaType<T>) {
  return buildValidatorFactory('query', params);
}

export function Params<T>(params: JSONSchemaType<T>) {
  return buildValidatorFactory('params', params);
}

export function Body<T>(params: JSONSchemaType<T>) {
  return buildValidatorFactory('body', params);
}
