import { Controller, StatusCode, GET, Query, Params, JSONSchemaType } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';

interface QueryTypes {
  foo: number;
  bar?: string;
}

// https://json-schema.org/specification
const queryScheme: JSONSchemaType<QueryTypes> = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string', nullable: true },
  },
  required: ['foo'],
  additionalProperties: false,
};

interface ParamsTypes {
  id: string;
}

// https://json-schema.org/specification
const paramsScheme: JSONSchemaType<ParamsTypes> = {
  type: 'object',
  properties: {
    id: { type: 'string', nullable: false },
  },
  required: ['id'],
  additionalProperties: false,
};

@Controller('/validator')
export default class ValidatorController {
  @GET('/:id')

  /*
   * validator
   * test path: /validator/111?foo=1&bar=bar
   */
  @Query<QueryTypes>(queryScheme)
  @Params<ParamsTypes>(paramsScheme)
  @StatusCode(200)
  async query(ctx: ArtusxContext): Promise<Object> {
    const query = ctx.context.output.data.query;
    const params = ctx.context.output.data.params;

    return {
      query,
      params,
    };
  }
}
