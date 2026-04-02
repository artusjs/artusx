# Testing Patterns Reference

## Overview

ArtusX uses Jest for testing with the ArtusScanner to create test applications. Tests typically verify container injection, lifecycle hooks, and HTTP endpoints.

---

## Test Structure

```
packages/plugins/{plugin}/test/
├── {plugin}.test.ts       # Main test file
├── utils/
│   └── index.ts           # Test helpers
└── fixtures/
    └── app/
        └── src/
            ├── controller/
            ├── middleware/
            └── config/
                ├── config.default.ts
                └── plugin.ts
```

---

## Creating Test Application

### Helper Function

From `/packages/plugins/koa/test/utils/index.ts`:

```typescript
import 'reflect-metadata';
import { ArtusScanner, ArtusApplication } from '@artus/core';

export async function createApp(baseDir: string) {
  const scanner = new ArtusScanner({
    needWriteFile: false,
    configDir: 'config',
    extensions: ['.ts'],
  });
  const manifest = await scanner.scan(baseDir);

  const app = new ArtusApplication();
  await app.load(manifest, baseDir);
  await app.run();

  return app;
}
```

**Key Points**:
- 'reflect-metadata' must be imported first
- ArtusScanner scans the test fixture directory
- Manifest is loaded into ArtusApplication
- app.run() triggers lifecycle hooks

---

## Basic Test Pattern

From `/packages/plugins/koa/test/app.test.ts`:

```typescript
import path from 'path';
import assert from 'assert';
import { createApp } from './utils';
import HomeController from './fixtures/app/src/controller/home';

describe('test/app.test.ts', () => {
  let app;

  beforeAll(async () => {
    app = await createApp(path.resolve(__dirname, './fixtures/app'));
  });

  it('container should have koa', async () => {
    assert(app.container.get('ARTUSX_KOA'));
  });

  it('container should have home controller with home method', async () => {
    const homeController = app.container.get(HomeController);
    assert(homeController.home);
  });
});
```

---

## Test Fixture Structure

### Controller Example

From `/packages/plugins/koa/test/fixtures/app/src/controller/home.ts`:

```typescript
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

### Middleware Example

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

### Config Example

```typescript
// config/config.default.ts
export default {
  port: 3000,
  keys: ['test-secret'],
};

// config/plugin.ts
export default {
  koa: {
    enable: true,
    path: '@artusx/plugin-koa',
  },
};
```

---

## Common Test Scenarios

### Testing Container Injection

```typescript
it('should inject client into container', async () => {
  const client = app.container.get(InjectEnum.Redis);
  assert(client);
  assert(client.getClient());
});
```

### Testing Controller Methods

```typescript
it('should have controller methods', async () => {
  const controller = app.container.get(UserController);
  assert(controller.list);
  assert(controller.create);
  assert(controller.update);
});
```

### Testing Lifecycle Hooks

```typescript
it('should initialize client in willReady', async () => {
  // Client should be initialized after app.run()
  const client = app.container.get(InjectEnum.Redis) as RedisClient;
  const redis = client.getClient();

  // Test connection
  const result = await redis.ping();
  assert(result === 'PONG');
});
```

### Testing Configuration

```typescript
it('should load configuration', async () => {
  const config = app.config;
  assert(config.redis);
  assert(config.redis.host === 'localhost');
});
```

---

## Jest Configuration

### Basic jest.config.js

```javascript
module.exports = {
  testEnvironment: 'node',
  rootDir: 'test',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
};
```

### With Coverage Thresholds

```javascript
module.exports = {
  testEnvironment: 'node',
  rootDir: 'test',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
```

---

## HTTP Endpoint Testing

### Using supertest

```typescript
import request from 'supertest';

describe('HTTP endpoints', () => {
  let app;
  let server;

  beforeAll(async () => {
    app = await createApp(path.resolve(__dirname, './fixtures/app'));
    server = app.server;
  });

  it('GET / should return Hello World', async () => {
    const response = await request(server)
      .get('/')
      .expect(200);

    assert(response.text === 'Hello World');
  });

  it('POST /api/users should create user', async () => {
    const response = await request(server)
      .post('/api/users')
      .send({ name: 'Test User' })
      .expect(201);

    assert(response.body.created === true);
  });

  it('GET /api/users/:id should return user', async () => {
    const response = await request(server)
      .get('/api/users/123')
      .expect(200);

    assert(response.body.id === '123');
  });
});
```

---

## Mocking External Services

### Mock Redis for Tests

```typescript
// test/fixtures/app/src/config/config.default.ts
export default {
  redis: {
    host: 'localhost',
    port: 6379,
    mock: true,  // Use mock client
  },
};

// In client.ts
async init(config: RedisConfig) {
  if (config.mock) {
    this.redis = createMockRedis();
    return;
  }
  this.redis = new Redis(config);
}
```

### Mock Database

```typescript
// Use test database
export default {
  sequelize: {
    host: 'localhost',
    database: 'test_db',
    username: 'test',
    password: '',
  },
};
```

---

## Testing Middleware

```typescript
describe('CheckAuthMiddleware', () => {
  let app;
  let middleware;

  beforeAll(async () => {
    app = await createApp(path.resolve(__dirname, './fixtures/app'));
    middleware = app.container.get(CheckAuthMiddleware);
  });

  it('should have use method', async () => {
    assert(middleware.use);
  });

  it('should set authed to false', async () => {
    const ctx = createMockContext();
    const next = async () => {};

    await middleware.use(ctx, next);

    assert(ctx.context.output.data.authed === false);
  });
});
```

---

## Testing Validators

```typescript
describe('Validator decorators', () => {
  it('should validate query params', async () => {
    const response = await request(server)
      .get('/validator/test?foo=bar&baz=qux')
      .expect(200);

    assert(response.body.query.validated === true);
  });

  it('should reject invalid params', async () => {
    const response = await request(server)
      .get('/validator/test')  // Missing required 'foo'
      .expect(400);

    assert(response.body.errors);
  });
});
```

---

## Testing Error Handling

```typescript
describe('Error handling', () => {
  it('should handle ArtusXStdError', async () => {
    const response = await request(server)
      .get('/exception/std_error')
      .expect(400);

    assert(response.body.message);
  });

  it('should handle ArtusXBizError', async () => {
    const response = await request(server)
      .get('/exception/biz_error')
      .expect(400);
  });
});
```

---

## Best Practices

### 1. Separate Test Fixtures

Keep test fixtures isolated from production code:

```
packages/plugins/my-plugin/
├── src/          # Production code
└── test/
    └── fixtures/ # Test code
```

### 2. Use beforeAll for Setup

```typescript
describe('MyPlugin', () => {
  let app;

  beforeAll(async () => {
    app = await createApp(fixturePath);
  });

  // Tests run with app already initialized
});
```

### 3. Clean Up Resources

```typescript
afterAll(async () => {
  // Close connections
  const client = app.container.get(InjectEnum.Redis);
  await client.close();

  // Stop server
  if (app.server) {
    app.server.close();
  }
});
```

### 4. Test Both Success and Failure

```typescript
it('should succeed with valid input', async () => {
  const response = await request(server)
    .post('/api/users')
    .send({ name: 'Valid Name' })
    .expect(201);
});

it('should fail with invalid input', async () => {
  const response = await request(server)
    .post('/api/users')
    .send({})  // Missing required fields
    .expect(400);
});
```

### 5. Test Container Behavior

```typescript
it('should return singleton instance', async () => {
  const instance1 = app.container.get(InjectEnum.Redis);
  const instance2 = app.container.get(InjectEnum.Redis);

  assert(instance1 === instance2);
});
```

---

## Running Tests

### Single Package

```bash
rush test -t @artusx/plugin-redis
```

### All Packages

```bash
rush test
```

### With Coverage

```bash
rush test -t @artusx/plugin-redis --coverage
```

---

## Debugging Tests

### Verbose Output

```bash
jest --verbose
```

### Specific Test

```bash
jest app.test.ts -t "container should have koa"
```

### Debug Mode

```typescript
// Add logging in test
it('debug test', async () => {
  console.log('Container contents:', app.container.values());
  // Test code
});
```