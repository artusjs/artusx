// https://json-schema.org/specification

import { JSONSchemaType } from '@artusx/core';

export interface QueryTypes {
  foo: string;
  bar?: string;
}

export const QueryScheme: JSONSchemaType<QueryTypes> = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
    bar: { type: 'string', nullable: true },
  },
  required: ['foo'],
  additionalProperties: false,
};

export interface ParamsTypes {
  uuid: string;
}

export const ParamsScheme: JSONSchemaType<ParamsTypes> = {
  type: 'object',
  properties: {
    uuid: { type: 'string', nullable: false },
  },
  required: ['uuid'],
  additionalProperties: false,
};

export interface BodyTypes {
  key: number;
}

export const BodyScheme: JSONSchemaType<BodyTypes> = {
  type: 'object',
  properties: {
    key: { type: 'integer', nullable: false },
  },
  required: ['key'],
  additionalProperties: false,
};
