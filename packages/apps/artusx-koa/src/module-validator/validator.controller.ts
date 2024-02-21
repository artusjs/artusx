import { Controller, StatusCode, GET, Query, Params, Body, POST } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';

import {
  QueryTypes,
  QueryScheme,
  BodyTypes,
  BodyScheme,
  ParamsTypes,
  ParamsScheme,
} from './validator.validator';

@Controller('/validator')
export default class ValidatorController {
  @GET('/:uuid')
  @POST('/:uuid')

  /**
   * validator.index.handler
   * @description validate query / params / body
   * @example:
   *   - url: /validator/e8b847b9-cb23-4fbf-8e7c-0c4ba72b9629?foo=foo&bar=bar
   *   - body: { "key": 123456 }
   */
  @Query<QueryTypes>(QueryScheme)
  @Body<BodyTypes>(BodyScheme)
  @Params<ParamsTypes>(ParamsScheme)
  @StatusCode(200)
  async index(ctx: ArtusxContext): Promise<Object> {
    const query = ctx.context.output.data.query;
    const params = ctx.context.output.data.params;
    const body = ctx.context.output.data.body;

    return {
      query,
      body,
      params,
    };
  }
}
