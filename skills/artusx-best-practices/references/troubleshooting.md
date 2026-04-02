# Troubleshooting Reference

## Overview

This guide covers common ArtusX issues with root cause analysis and solutions. Each problem includes symptoms, causes, and step-by-step fixes.

---

## Lifecycle Issues

### Issue: Lifecycle Hook Not Executing

**Symptoms**:
- Hook method never runs during startup
- Plugin initialization code not executed
- Logger shows no hook output

**Root Causes**:

1. Missing `@LifecycleHookUnit` decorator on class
2. Missing `@LifecycleHook` decorator on method
3. Class not exported from index.ts
4. Plugin not registered in config/plugin.ts

**Diagnosis Steps**:

```bash
# Check decorator presence
grep -r "@LifecycleHookUnit" packages/plugins/my-plugin/src/
grep -r "@LifecycleHook" packages/plugins/my-plugin/src/

# Check exports
grep -r "lifecycle" packages/plugins/my-plugin/src/index.ts

# Check plugin registration
grep -r "my-plugin" packages/apps/artusx-koa/src/config/plugin.ts
```

**Solution**:

```typescript
// WRONG: Missing decorators
export default class MyLifecycle implements ApplicationLifecycle {
  async willReady() {
    // Never executes
  }
}

// CORRECT: With decorators
@LifecycleHookUnit()
export default class MyLifecycle implements ApplicationLifecycle {
  @LifecycleHook()
  async willReady() {
    // Executes properly
  }
}
```

**Ensure Export**:

```typescript
// src/index.ts
export * from './lifecycle';  // Must export
```

---

### Issue: Hook Executing in Wrong Order

**Symptoms**:
- Database operations fail before connection
- Config not available in didLoad
- Services not initialized when needed

**Root Causes**:
1. Using database in didLoad instead of willReady
2. Starting cron jobs before connections established
3. Wrong hook for operation type

**Hook Order Reference**:

```
didLoad     -> Middleware setup, parsers
willReady   -> Database connections, client init
didReady    -> Start jobs, ready logging
beforeClose -> Cleanup, close connections
```

**Solution**:

```typescript
// WRONG: Database in didLoad
@LifecycleHook()
async didLoad() {
  const db = this.app.container.get(InjectEnum.Sequelize);
  await db.query('SELECT 1');  // Fails - not connected yet
}

// CORRECT: Database in willReady
@LifecycleHook()
async willReady() {
  const db = this.app.container.get(InjectEnum.Sequelize);
  await db.init(config);  // Connect first
}

@LifecycleHook()
async didReady() {
  const db = this.app.container.get(InjectEnum.Sequelize);
  await db.query('SELECT 1');  // Works now
}
```

---

### Issue: Config Undefined in Hook

**Symptoms**:
- `TypeError: Cannot read property 'host' of undefined`
- Plugin crashes on startup
- Config values return undefined

**Root Causes**:
1. Config file missing or wrong name
2. Plugin name mismatch in config
3. Missing config check before use

**Solution**:

```typescript
// WRONG: No config check
@LifecycleHook()
async willReady() {
  const config = this.app.config.redis;
  this.logger.info(config.host);  // Crashes if undefined
}

// CORRECT: With config check
@LifecycleHook()
async willReady() {
  const config = this.app.config.redis;

  if (!config || !config.host) {
    return;  // Skip if config missing
  }

  this.logger.info('[redis] host: %s', config.host);
}
```

**Check Config File**:

```typescript
// config/config.default.ts - Must match plugin name
export default {
  redis: {           // Must match: this.app.config.redis
    host: 'localhost',
    port: 6379,
  },
};
```

---

## Dependency Injection Issues

### Issue: Cannot Find Injectable

**Symptoms**:
- `Error: Cannot find injectable with id 'ARTUSX_REDIS'`
- Container.get returns undefined
- Injected property is undefined

**Root Causes**:
1. Missing `@Injectable` decorator on client class
2. Wrong injection token/id
3. Class not registered in container
4. Circular dependency

**Diagnosis**:

```typescript
// Check if client has @Injectable
@Injectable({ id: InjectEnum.Redis, scope: ScopeEnum.SINGLETON })
export default class RedisClient { }

// Check token matches
export enum InjectEnum {
  Redis = 'ARTUSX_REDIS',  // Must match
}

// Debug container
console.log('Container contents:', [...this.app.container.values()]);
```

**Solution**:

```typescript
// Ensure client is decorated
import { Injectable, ScopeEnum } from '@artus/core';

@Injectable({
  id: InjectEnum.Redis,      // Must define id
  scope: ScopeEnum.SINGLETON,
})
export default class RedisClient {
  async init(config: RedisConfig) {
    // Implementation
  }
}
```

---

### Issue: Injected Property Undefined

**Symptoms**:
- `TypeError: this.client is undefined`
- Injected service has no value

**Root Causes**:
1. Wrong injection token
2. Injectable not in scope
3. Property inject syntax wrong

**Solution**:

```typescript
// WRONG: Wrong token
@Inject('WRONG_TOKEN')
client: RedisClient;

// CORRECT: Correct token
@Inject(InjectEnum.Redis)
client: RedisClient;

// Or use class directly (if registered)
@Inject(RedisClient)
client: RedisClient;
```

---

### Issue: Singleton vs Request Scope

**Symptoms**:
- Multiple instances created when expecting single
- State lost between requests
- Connection pool exhausted

**Root Causes**:
1. Wrong scope on Injectable
2. Execution scope for client class

**Solution**:

```typescript
// WRONG: Request scope for database
@Injectable({ scope: ScopeEnum.EXECUTION })
export default class DatabaseClient { }

// CORRECT: Singleton for shared resources
@Injectable({ scope: ScopeEnum.SINGLETON })
export default class DatabaseClient { }

// Use Execution for request-specific
@Injectable({ scope: ScopeEnum.EXECUTION })
export default class UserController { }
```

---

## Configuration Issues

### Issue: Plugin Config Not Loading

**Symptoms**:
- Config values undefined
- Default config not applied

**Root Causes**:
1. Wrong config file name
2. Missing plugin.ts registration
3. Config path mismatch

**Config File Names**:

```
config/config.default.ts      # Default config
config/config.development.ts  # Dev overrides
config/config.production.ts   # Prod overrides
config/plugin.ts              # Plugin registration
```

**Solution**:

```typescript
// Check plugin.ts
export default {
  redis: {
    enable: true,
    path: '@artusx/plugin-redis',
  },
};

// Check config.default.ts
export default {
  redis: {  // Key must match plugin name
    host: 'localhost',
  },
};
```

---

### Issue: Environment Config Not Applied

**Symptoms**:
- Production values not used in prod
- Development config persists in production

**Root Causes**:
1. Wrong NODE_ENV value
2. Missing environment config file
3. Config merge order wrong

**Solution**:

```bash
# Set NODE_ENV correctly
NODE_ENV=production pnpm run dev
```

```typescript
// config/config.production.ts
export default {
  redis: {
    host: 'prod.redis.example.com',
  },
};
```

---

## Testing Issues

### Issue: Scanner Cannot Find Modules

**Symptoms**:
- `Error: Cannot find module`
- Tests fail with file not found
- ArtusScanner returns empty manifest

**Root Causes**:
1. Wrong fixture path
2. Extensions mismatch
3. Missing reflect-metadata

**Solution**:

```typescript
// WRONG: Missing reflect-metadata
import { ArtusScanner } from '@artus/core';  // Fails

// CORRECT: Import reflect-metadata first
import 'reflect-metadata';
import { ArtusScanner } from '@artus/core';

export async function createApp(baseDir: string) {
  const scanner = new ArtusScanner({
    needWriteFile: false,
    configDir: 'config',
    extensions: ['.ts'],  // Match your files
  });

  const manifest = await scanner.scan(baseDir);
  // ...
}
```

---

### Issue: Container Empty in Tests

**Symptoms**:
- container.get returns undefined
- Injectable classes not found

**Root Causes**:
1. Scanner didn't load modules
2. Wrong baseDir path
3. Missing index.ts exports

**Solution**:

```typescript
// Check fixture path
const baseDir = path.resolve(__dirname, './fixtures/app');
console.log('Scanning:', baseDir);  // Verify path

// Check scanner result
const manifest = await scanner.scan(baseDir);
console.log('Manifest:', manifest);  // Check items
```

---

### Issue: Jest Timeout

**Symptoms**:
- Tests fail with timeout error
- Async operations don't complete

**Root Causes**:
1. Missing await in beforeAll
2. Hook initialization slow
3. Default timeout too short

**Solution**:

```typescript
// Increase timeout
describe('MyPlugin', () => {
  let app;

  beforeAll(async () => {
    app = await createApp(fixturePath);  // Must be async
  }, 30000);  // 30 second timeout

  // Tests
});
```

---

## Build Issues

### Issue: TypeScript Compilation Errors

**Symptoms**:
- `error TS2307: Cannot find module`
- Type errors in build output

**Root Causes**:
1. Missing dependencies
2. Wrong tsconfig references
3. Types not installed

**Solution**:

```bash
# Rebuild all packages
rush rebuild

# Build specific package
rush build -t @artusx/plugin-redis

# Check dependencies
cd packages/plugins/my-plugin
pnpm install
```

---

### Issue: Rush Build Fails

**Symptoms**:
- Build stops at specific package
- Dependency build errors

**Root Causes**:
1. Circular dependency
2. Missing peer dependencies
3. Build order wrong

**Solution**:

```bash
# Full clean rebuild
rush rebuild

# Build with verbose output
rush build --verbose

# Check dependency graph
rush list
```

---

## HTTP Route Issues

### Issue: Route Not Found (404)

**Symptoms**:
- All routes return 404
- Controller methods not accessible

**Root Causes**:
1. Missing @Controller decorator
2. Wrong route prefix
3. Controller not in scan path

**Solution**:

```typescript
// Check decorator
@Controller('/api')  // Must have decorator
export default class APIController {
  @GET('/users')  // Full path: /api/users
  async getUsers(ctx: ArtusXContext) {
    ctx.body = [];
  }
}
```

---

### Issue: Middleware Not Running

**Symptoms**:
- Middleware logic not executed
- Request processing missing

**Root Causes**:
1. enable: false in decorator
2. Missing plugin registration
3. Wrong middleware order

**Solution**:

```typescript
// Check enable flag
@Middleware({ enable: true })  // Must be true
export default class AuthMiddleware {
  async use(ctx: ArtusXContext, next: ArtusXNext) {
    // Middleware logic
    await next();
  }
}
```

---

## Error Handling Issues

### Issue: Error Not Caught Properly

**Symptoms**:
- Generic error messages
- Stack traces lost
- HTTP status incorrect

**Root Causes**:
1. Using plain Error instead of ArtusX errors
2. Missing exception filter
3. Wrong error type

**Solution**:

```typescript
// WRONG: Plain Error
throw new Error('Something failed');  // Generic 500

// CORRECT: ArtusX errors
throw new ArtusXStdError(400, 'Invalid request', { data: {} });
throw new ArtusXBizError('Business error', 400);

// Using exception codes
this.app.throwException('HTTP:BAD_REQUEST');
```

---

## Database Issues

### Issue: Connection Timeout

**Symptoms**:
- Database operations timeout
- Connection refused errors

**Root Causes**:
1. Database not running
2. Wrong connection config
3. Firewall blocking

**Solution**:

```typescript
// Check config
const config = this.app.config.sequelize;
console.log('Connecting to:', config.host, config.port);

// Add timeout handling
try {
  await client.init(config);
} catch (error) {
  this.logger.error('[db] connection failed: %s', error.message);
  throw error;
}
```

---

## Schedule Issues

### Issue: Cron Job Not Running

**Symptoms**:
- Schedule never executes
- Jobs not starting

**Root Causes**:
1. enable: false in options
2. Wrong cron expression
3. Plugin not loaded

**Solution**:

```typescript
// Check options
@Schedule({
  enable: true,      // Must be true
  cron: '0 0 * * *', // Valid cron expression
  start: true,       // Auto-start
  timeZone: 'Asia/Shanghai',
})
export default class DailyJob {
  async run() {
    // Job logic
  }
}
```

---

## Prevention Tips

### 1. Always Check Config

```typescript
if (!config || !config.requiredField) {
  return;  // Safe skip
}
```

### 2. Use Proper Decorators

Never skip decorators - they're required for framework integration.

### 3. Import reflect-metadata First

In tests and entry points, import reflect-metadata before any Artus imports.

### 4. Test Lifecycle Hooks

Write tests for each hook:

```typescript
it('should run willReady', async () => {
  const client = app.container.get(InjectEnum.Redis);
  assert(client.getClient());  // Initialized
});
```

### 5. Use Correct Scopes

| Type | Scope |
|------|-------|
| Database client | SINGLETON |
| External service | SINGLETON |
| Controller | EXECUTION |
| Middleware | EXECUTION |

### 6. Log Initialization

```typescript
this.logger.info('[plugin] initialized successfully');
```

### 7. Handle Errors in Lifecycle

```typescript
try {
  await client.init(config);
} catch (error) {
  this.logger.error('[plugin] init failed:', error);
  // Decide: throw or graceful fail
}
```