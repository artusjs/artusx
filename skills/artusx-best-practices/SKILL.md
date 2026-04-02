---
name: artusx-best-practices
description: Build ArtusX applications with best practices. TRIGGER when working with Artus.js framework, ArtusX plugins, or any task involving @artusx packages, decorators, lifecycle hooks, or plugin development. Use for creating new plugins, testing ArtusX apps, debugging lifecycle issues, configuring middleware, or understanding ArtusX architecture.
---

# ArtusX Best Practices

## Quick Start

### Install ArtusX CLI

```bash
npm install -g @artusx/init
```

### Create New Application

```bash
# Create a web application
artusx-init --name web --type apps

# Create a plugin
artusx-init --name postgres --type plugins

# Create a library
artusx-init --name common --type libs
```

### Run Your Application

```bash
cd web
npm install
npm run dev
```

### Package Types

| Type | Description | Example |
|------|-------------|---------|
| apps | Web applications | artusx-koa, artusx-nest |
| plugins | ArtusX plugins | plugin-redis, plugin-sequelize |
| libs | Shared libraries | @artusx/core, @artusx/utils |

> **Note**: If you're developing ArtusX itself (contributing to the monorepo), see `references/rush-workflow.md` for Rush.js commands.

---

## Common Tasks

### Create a New Plugin

Standard plugin structure:

```
packages/plugins/mongodb/src/
├── client.ts       # Client with @Injectable
├── constants.ts    # InjectEnum definitions
├── lifecycle.ts    # @LifecycleHookUnit with hooks
├── index.ts        # Export entry point
└── config/config.default.ts  # Default configuration
```

**client.ts**:

```typescript
import { Injectable, ScopeEnum } from '@artus/core';
import { InjectEnum } from './constants';

@Injectable({ id: InjectEnum.MongoDB, scope: ScopeEnum.SINGLETON })
export default class MongoDBClient {
  async init(config: MongoDBConfig) {
    if (!config) return;
    // Initialize client
  }
  getClient() { return this.client; }
}
```

**constants.ts**:

```typescript
export enum InjectEnum {
  MongoDB = 'ARTUSX_MONGODB',
}
```

**lifecycle.ts**:

```typescript
import { LifecycleHookUnit, LifecycleHook, Inject, ArtusInjectEnum, Logger } from '@artus/core';

@LifecycleHookUnit()
export default class MongoDBLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application) app: ArtusApplication;
  @Inject(ArtusInjectEnum.Logger) logger: Logger;

  @LifecycleHook()
  async willReady() {
    const config = this.app.config.mongodb;
    if (!config || !config.uri) return;
    this.logger.info('MongoDB plugin initializing...');
    const client = this.app.container.get(InjectEnum.MongoDB);
    await client.init(config);
    this.logger.info('MongoDB plugin initialized successfully');
  }
}

// Verify lifecycle.ts is exported in index.ts:
// export { default as MongoDBLifecycle } from './lifecycle';
```

**config/config.default.ts**:

```typescript
export default {
  mongodb: {
    uri: 'mongodb://localhost:27017',
    dbName: 'test',
    options: { useNewUrlParser: true, useUnifiedTopology: true },
  },
};
```

**types.ts** (optional):

```typescript
export interface MongoDBConfig {
  uri: string;
  dbName: string;
  options?: Record<string, any>;
}
```


### Add a Controller

```typescript
import { Controller, GET, POST, PUT, DELETE, ContentType, StatusCode } from '@artusx/core';

@Controller('/api/users')
export default class UserController {
  @GET('/') @ContentType('application/json')
  async list(ctx: ArtusXContext) { ctx.body = { users: [] }; }

  @GET('/:id') @StatusCode(200)
  async getOne(ctx: ArtusXContext) { return { id: ctx.params.id }; }

  @POST('/') @StatusCode(201)
  async create(ctx: ArtusXContext) { return { created: true }; }

  @PUT('/:id')
  async update(ctx: ArtusXContext) { ctx.body = { updated: true }; }

  @DELETE('/:id') @StatusCode(204)
  async delete(ctx: ArtusXContext) { ctx.status = 204; }
}
```

### Add Validation

```typescript
import { Controller, GET, Query, StatusCode } from '@artusx/core';
import { JSONSchemaType } from 'ajv';

const QuerySchema: JSONSchemaType<UserQuery> = {
  type: 'object',
  properties: { name: { type: 'string' }, page: { type: 'number' } },
  required: ['name'],
};

@Controller('/api/users')
export default class UserController {
  @GET('/') @Query<UserQuery>(QuerySchema) @StatusCode(200)
  async list(ctx: ArtusXContext) {
    return { query: ctx.context.output.data.query };
  }
}
```

### Implement Middleware

```typescript
import { Middleware, Inject, ArtusInjectEnum, Logger } from '@artusx/core';

@Middleware({ enable: true })
export default class TimingMiddleware {
  @Inject(ArtusInjectEnum.Config) config: Record<string, any>;
  @Inject(ArtusInjectEnum.Logger) logger: Logger;

  async use(ctx: ArtusXContext, next: ArtusXNext): Promise<void> {
    const start = Date.now();
    const { method, path } = ctx;
    this.logger.info(`[Request] ${method} ${path} - starting`);

    await next();

    const duration = Date.now() - start;
    // Store timing data in context for downstream use
    ctx.context.output.data.timing = { start, duration, method, path };
    this.logger.info(`[Response] ${method} ${path} - ${ctx.status} (${duration}ms)`);
  }
}
```

### Set Up Testing

**test/utils/index.ts**:

```typescript
import 'reflect-metadata';  // Must be first
import { ArtusScanner, ArtusApplication } from '@artus/core';

export async function createApp(baseDir: string) {
  const scanner = new ArtusScanner({
    needWriteFile: false, configDir: 'config', extensions: ['.ts'],
  });
  const manifest = await scanner.scan(baseDir);
  const app = new ArtusApplication();
  await app.load(manifest, baseDir);
  await app.run();
  return app;
}
```

**Test fixture structure**:

```
test/fixtures/app/src/
├── controller/home.ts    # Basic controller for testing
├── config/
│   ├── config.default.ts  # Test configuration
│   └── plugin.ts          # Plugin registration
```

**test/fixtures/app/src/config/plugin.ts**:

```typescript
export default {
  redis: { enable: true, path: '@artusx/plugin-redis' },
};
```

**test/redis.test.ts**:

```typescript
import 'reflect-metadata';
import path from 'path';
import assert from 'assert';
import { createApp } from './utils';
import RedisClient from '@artusx/plugin-redis';

describe('Redis Plugin', () => {
  let app;
  beforeAll(async () => {
    app = await createApp(path.resolve(__dirname, './fixtures/app'));
  });

  it('container should have Redis client', async () => {
    const client = app.container.get(RedisClient);
    assert(client);
  });

  it('client should have getClient method', async () => {
    const client = app.container.get(RedisClient);
    assert(typeof client.getClient === 'function');
  });

  it('config should be loaded correctly', async () => {
    assert(app.config.redis);
    assert(app.config.redis.uri);
  });
});
```

### Add Scheduled Jobs

```typescript
import { Schedule } from '@artusx/plugin-schedule';

@Schedule({ enable: true, cron: '0 0 * * *', start: true })
export default class DailyCleanupSchedule {
  async run() { console.log('Running daily cleanup...'); }
}
```

### Handle Errors

```typescript
throw new ArtusXStdError(400, 'Invalid request', { data: {} });
throw new ArtusXBizError('Business error', 400);
this.app.throwException('ARTUSX:UNKNOWN_ERROR');
```

---

## Best Practices

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Packages | lowercase-hyphen | `@artusx/plugin-redis` |
| Classes | PascalCase | `RedisClient` |
| Methods | camelCase | `getUser` |
| Constants | UPPER_SNAKE_CASE | `InjectEnum.Redis` |

### Dependency Injection

```typescript
@Inject(ArtusInjectEnum.Application) app: ArtusApplication;
@Inject(ArtusInjectEnum.Config) config: Record<string, any>;
@Inject(InjectEnum.Redis) redis: RedisClient;
```

### Configuration

```
config/
├── config.default.ts      # Default config
├── config.production.ts   # Production overrides
└── plugin.ts              # Plugin registration
```

### Lifecycle Hook Order

| Hook | Purpose | When to Use |
|------|---------|-------------|
| didLoad | Load modules | Middleware, parsers |
| willReady | Initialize | Database connections |
| didReady | Ready | Start jobs |
| beforeClose | Cleanup | Close connections |

---

## Troubleshooting Quick Reference

### Lifecycle Hook Not Executing

**Cause**: Missing decorators or exports. **Solution**:

1. Add required decorators:
```typescript
@LifecycleHookUnit()  // Required on class
export default class MyLifecycle implements ApplicationLifecycle {
  @LifecycleHook()   // Required on method
  async willReady() { }
}
```

2. Verify lifecycle.ts is exported in index.ts:
```typescript
// packages/plugins/my-plugin/src/index.ts
export { default as MyLifecycle } from './lifecycle';
```

3. Check plugin is registered in config/plugin.ts:
```typescript
export default {
  myPlugin: { enable: true, path: '@artusx/plugin-my-plugin' },
};
```

### Dependency Injection Failures

**Cause**: Missing @Injectable or wrong token. **Solution**:

```typescript
@Injectable({ id: InjectEnum.MyClient, scope: ScopeEnum.SINGLETON })
export default class MyClient { }

@Inject(InjectEnum.MyClient) client: MyClient;
```

### Configuration Errors

**Cause**: Wrong file naming or missing plugin.ts. **Solution**:

```typescript
// config/plugin.ts
export default {
  redis: { enable: true, path: '@artusx/plugin-redis' },
};
```

### Testing Failures

**Cause**: Missing reflect-metadata import. **Solution**:

```typescript
import 'reflect-metadata';  // Must be first
import { ArtusScanner } from '@artus/core';
```

---

## Reference Pointers

| Topic | Reference File | When to Use |
|-------|---------------|-------------|
| Lifecycle hooks | `references/lifecycle-hooks.md` | Implementing lifecycle |
| Decorators | `references/decorators.md` | Controllers, routes |
| Plugin structure | `references/plugin-structure.md` | Building plugins |
| Testing | `references/testing-patterns.md` | Writing tests |
| Rush workflow | `references/rush-workflow.md` | Contributing to ArtusX monorepo |
| Troubleshooting | `references/troubleshooting.md` | Debugging issues |

For detailed examples, read the corresponding reference files.