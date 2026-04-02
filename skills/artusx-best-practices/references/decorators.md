# Decorators Reference

## Overview

ArtusX provides decorators for defining controllers, routes, middleware, validators, and scheduled jobs. All decorators are imported from `@artusx/core` or specific plugins.

---

## Controller Decorator

### Syntax

```typescript
@Controller(prefix?: string)
```

### Purpose

Marks a class as a controller and optionally defines a route prefix.

### Usage

```typescript
import { Controller, GET } from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';

@Controller('/api')
export default class APIController {
  @GET('/')
  async home(ctx: ArtusXContext) {
    ctx.body = 'Hello API';
  }
}
```

### Without Prefix

```typescript
@Controller()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusXContext) {
    ctx.body = 'Hello World';
  }
}
```

### From Boilerplate

```typescript
// packages/plugins/koa/test/fixtures/app/src/controller/home.ts
import { GET, Controller } from '../types';
import type { ArtusXContext } from '../types';

@Controller()
export default class HomeController {
  @GET('/')
  async home(ctx: ArtusXContext) {
    ctx.body = 'Hello World';
  }
}
```

---

## HTTP Route Decorators

### GET

```typescript
@GET(path: string)
```

### POST

```typescript
@POST(path: string)
```

### PUT

```typescript
@PUT(path: string)
```

### DELETE

```typescript
@DELETE(path: string)
```

### PATCH

```typescript
@PATCH(path: string)
```

### HEAD

```typescript
@HEAD(path: string)
```

### OPTIONS

```typescript
@OPTIONS(path: string)
```

### Combined Routes

Multiple methods can share the same handler:

```typescript
@Controller('/validator')
export default class ValidatorController {
  @GET('/:uuid')
  @POST('/:uuid')
  async handler(ctx: ArtusXContext) {
    // Handles both GET and POST
  }
}
```

### Example: API Controller

From `/packages/apps/artusx-koa/src/module-api/api.controller.ts`:

```typescript
@Controller('/api')
export default class APIController {
  @Inject(ArtusXInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusXInjectEnum.Config)
  config: Record<string, string | number>;

  @GET('/')
  async home(ctx: ArtusXContext) {
    ctx.body = 'api';
  }

  @GET('/mock')
  async mock(ctx: ArtusXContext) {
    ctx.body = 'mock';
  }

  @GET('/mockApi')
  @ContentType('application/json; charset=utf-8')
  async getInfo(ctx: ArtusXContext) {
    ctx.body = await this.apiService.mockApi();
  }
}
```

---

## Response Decorators

### ContentType

```typescript
@ContentType(contentType: string)
```

Sets the response Content-Type header.

```typescript
@GET('/json')
@ContentType('application/json; charset=utf-8')
async getJson(ctx: ArtusXContext) {
  ctx.body = { data: 'value' };
}
```

### StatusCode

```typescript
@StatusCode(code: number)
```

Sets the response status code and automatically handles errors.

```typescript
@POST('/')
@StatusCode(201)
async create(ctx: ArtusXContext) {
  return { created: true };
}
```

From `/packages/apps/artusx-koa/src/module-validator/validator.controller.ts`:

```typescript
@Controller('/validator')
export default class ValidatorController {
  @GET('/:uuid')
  @POST('/:uuid')
  @Query<QueryTypes>(QueryScheme)
  @Body<BodyTypes>(BodyScheme)
  @Params<ParamsTypes>(ParamsScheme)
  @StatusCode(200)
  async index(ctx: ArtusXContext): Promise<Object> {
    const query = ctx.context.output.data.query;
    const params = ctx.context.output.data.params;
    const body = ctx.context.output.data.body;

    return { query, body, params };
  }
}
```

### Headers

```typescript
@Headers(headers: Record<string, string | string[]>)
```

Sets response headers.

---

## Validator Decorators

### Query

```typescript
@Query<T>(schema: JSONSchemaType<T>)
```

Validates query string parameters.

### Params

```typescript
@Params<T>(schema: JSONSchemaType<T>)
```

Validates route parameters.

### Body

```typescript
@Body<T>(schema: JSONSchemaType<T>)
```

Validates request body.

### Implementation

From `/packages/libs/core/src/decorator.ts`:

```typescript
function buildValidatorFactory<T>(key: 'query' | 'params' | 'body', schema: JSONSchemaType<T>) {
  const validate = ajv.compile(schema);

  return (_target: object, _key: string, descriptor: TypedPropertyDescriptor<any>) => {
    const originalDef = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const [ctx, _next] = args as [ArtusXContext, ArtusXNext];

      let data = ctx.query;
      if (key === 'params') data = ctx.params;
      if (key === 'body') data = ctx.request.body;

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
```

### Usage Example

```typescript
import { Controller, GET, Query, Body, Params } from '@artusx/core';
import { JSONSchemaType } from 'ajv';

interface QueryTypes {
  foo: string;
  bar: string;
}

const QueryScheme: JSONSchemaType<QueryTypes> = {
  type: 'object',
  properties: {
    foo: { type: 'string' },
    bar: { type: 'string' },
  },
  required: ['foo', 'bar'],
};

@Controller('/validator')
export default class ValidatorController {
  @GET('/:uuid')
  @Query<QueryTypes>(QueryScheme)
  @Params<ParamsTypes>(ParamsScheme)
  async index(ctx: ArtusXContext) {
    const query = ctx.context.output.data.query;
    const params = ctx.context.output.data.params;
    return { query, params };
  }
}
```

---

## Middleware Decorator

### Class Middleware

```typescript
@Middleware(params: { enable: boolean })
```

Marks a class as a middleware component.

From `/packages/plugins/koa/test/fixtures/app/src/middleware/checkAuth.ts`:

```typescript
import { ArtusInjectEnum, Inject } from '@artus/core';
import { ArtusXContext, ArtusXNext, Middleware } from '../types';

@Middleware({
  enable: true,
})
export default class CheckAuthMiddleware {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  async use(ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
    const { data } = ctx.context.output;
    data.authed = false;
    await next();
  }
}
```

### Function Middleware (MW)

```typescript
@MW(middlewares: ArtusXHandler[])
```

Adds function middleware to a route handler.

---

## Inject Decorator

### Syntax

```typescript
@Inject(token: string | symbol | class)
```

Injects dependencies into class properties.

### Available Tokens

| Token | Provides |
|-------|----------|
| `ArtusInjectEnum.Application` | ArtusApplication instance |
| `ArtusInjectEnum.Config` | Configuration object |
| `ArtusInjectEnum.Logger` | Logger instance |
| Custom `InjectEnum.*` | Plugin-specific clients |

### Usage

```typescript
import { Inject, ArtusInjectEnum, ArtusApplication } from '@artusx/core';
import { InjectEnum } from './constants';

@Controller('/api')
export default class APIController {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @Inject(ArtusInjectEnum.Config)
  config: Record<string, any>;

  @Inject(InjectEnum.Redis)
  redis: RedisClient;

  @Inject(MyService)
  myService: MyService;
}
```

---

## Schedule Decorator

### Syntax

```typescript
@Schedule(options: ArtusXScheduleOptions)
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| enable | boolean | Whether schedule is enabled |
| cron | string | Cron expression |
| start | boolean | Auto-start on init |
| timeZone | string | Time zone (default: Asia/Shanghai) |
| runOnInit | boolean | Run immediately on init |

### Implementation

From `/packages/plugins/schedule/src/decorator.ts`:

```typescript
export function Schedule(options: ArtusXScheduleOptions) {
  return (target: any) => {
    const scheduleMetadata = options;
    Reflect.defineMetadata(CLASS_SCHEDULE_METADATA, scheduleMetadata, target);
    addTag(CLASS_SCHEDULE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}
```

### Usage

```typescript
import { Schedule } from '@artusx/plugin-schedule';

@Schedule({
  enable: true,
  cron: '0 */5 * * *',  // Every 5 minutes
  start: true,
  timeZone: 'Asia/Shanghai',
})
export default class CleanupSchedule {
  async run() {
    // Cleanup logic
  }
}
```

---

## Injectable Decorator

### Syntax

```typescript
@Injectable(options?: { id?: string | symbol, scope?: ScopeEnum })
```

### Scope Options

| Scope | Description |
|-------|-------------|
| SINGLETON | Single instance for entire app |
| EXECUTION | New instance per request |

### Usage

```typescript
import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';

@Injectable({
  id: InjectEnum.Redis,
  scope: ScopeEnum.SINGLETON,
})
export default class RedisClient {
  private redis: Redis;

  async init(config: RedisConfig) {
    this.redis = new Redis(config);
  }

  getClient(): Redis {
    return this.redis;
  }
}
```

---

## Decorator Combinations

### Full Controller Example

```typescript
import {
  Controller,
  GET,
  POST,
  PUT,
  DELETE,
  ContentType,
  StatusCode,
  Query,
  Body,
  Params,
  Inject,
  ArtusInjectEnum,
} from '@artusx/core';
import type { ArtusXContext } from '@artusx/core';

@Controller('/api/users')
export default class UserController {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @GET('/')
  @ContentType('application/json')
  async list(ctx: ArtusXContext) {
    ctx.body = { users: [] };
  }

  @GET('/:id')
  @StatusCode(200)
  async getOne(ctx: ArtusXContext) {
    return { id: ctx.params.id };
  }

  @POST('/')
  @Body<CreateUserDTO>(CreateUserSchema)
  @StatusCode(201)
  async create(ctx: ArtusXContext) {
    const body = ctx.context.output.data.body;
    return { created: body };
  }
}
```

---

## Best Practices

1. **Controller Naming**: Use descriptive names ending with `Controller`
2. **Route Prefix**: Use plural nouns for resources (e.g., `/users`, `/products`)
3. **Validation**: Always validate input with Query/Body/Params
4. **Status Codes**: Use appropriate HTTP status codes
5. **Injection**: Prefer injecting services over direct instantiation