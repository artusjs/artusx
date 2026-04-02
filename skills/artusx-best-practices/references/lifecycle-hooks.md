# Lifecycle Hooks Reference

## Overview

Lifecycle hooks in ArtusX allow you to execute code at specific points during the application's lifecycle. They are defined using the `@LifecycleHookUnit` decorator on classes and `@LifecycleHook` decorator on methods.

## Hook Execution Order

The hooks execute in this order during application startup:

```
1. didLoad     - Load modules and register middleware
2. willReady   - Initialize services and connections
3. didReady    - Application ready, start background tasks
4. beforeClose - Cleanup before shutdown
```

---

## didLoad Hook

### Purpose

The `didLoad` hook runs after modules are loaded but before the application is ready. Use it for:

- Registering middleware
- Setting up parsers (body parser, compression)
- Configuring static file serving
- Initializing CORS settings

### Implementation

```typescript
@LifecycleHookUnit()
export default class CoreLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  private readonly app: ArtusApplication;

  @LifecycleHook()
  async didLoad() {
    // Register body parser
    this.koa.use(bodyParser({
      encoding: 'utf-8',
      onError(_err, ctx) {
        ctx.throw(422, 'body parse error');
      },
    }));

    // Register compression
    this.koa.use(compression());

    // Configure CORS
    this.registerCors();

    // Setup static file serving
    this.registerStatic();
  }
}
```

### Example from artusx-koa

From `/packages/libs/core/src/lifecycle.ts`:

```typescript
@LifecycleHook()
async didLoad() {
  this.koa.use(compression());

  this.koa.use(
    bodyParser({
      encoding: 'utf-8',
      onError(_err, ctx) {
        ctx.throw(422, 'body parse error');
      },
    })
  );

  this.registerCors();
  this.registerStatic();
}
```

### When to Use

| Scenario | Recommendation |
|----------|---------------|
| Body parsing | Always in didLoad |
| Static files | Register in didLoad |
| CORS | Configure in didLoad |
| Compression | Add in didLoad |

---

## willReady Hook

### Purpose

The `willReady` hook runs after didLoad, when the application is preparing to be ready. Use it for:

- Connecting to databases
- Initializing external clients (Redis, MongoDB)
- Setting up connections
- Loading initial data

### Implementation Pattern

```typescript
@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    const config = this.app.config.pluginName;

    // Check if config exists
    if (!config || !config.host) {
      return;
    }

    this.logger.info('[plugin] starting with host: %s', config.host);

    // Get client from container and initialize
    const client = this.app.container.get(InjectEnum.Client) as Client;
    await client.init(config);
  }
}
```

### Example: Redis Plugin

From `/packages/plugins/redis/src/lifecycle.ts`:

```typescript
@LifecycleHookUnit()
export default class RedisLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  @LifecycleHook()
  async willReady() {
    const config: RedisConfig = this.app.config.redis;

    if (!config || !config.host) {
      return;
    }

    this.logger.info('[redis] staring redis with host: %s', config.host);
    const redis = this.app.container.get(InjectEnum.Redis) as Redis;
    await redis.init(config);
  }
}
```

### Example: Sequelize Plugin

From `/packages/plugins/sequelize/src/lifecycle.ts`:

```typescript
@LifecycleHook()
async willReady() {
  const config: SequelizeConfig = this.app.config.sequelize;

  if (!config || !config.host) {
    return;
  }

  this.logger.info('[sequelize] staring sequelize with host: %s', config.host);
  const sequelize = this.app.container.get(InjectEnum.Sequelize) as Sequelize;
  await sequelize.init(config);
}
```

### Example: Schedule Plugin

From `/packages/plugins/schedule/src/lifecycle.ts`:

```typescript
@LifecycleHook()
async willReady() {
  this.loadSchedule();
}

private loadSchedule() {
  const scheduleClazzList = this.container.getInjectableByTag(CLASS_SCHEDULE_TAG);

  for (const scheduleClazz of scheduleClazzList) {
    const schedule: ArtusXSchedule = this.container.get(scheduleClazz) as any;
    const scheduleMetadata = Reflect.getMetadata(CLASS_SCHEDULE_METADATA, scheduleClazz);
    this.registerSchedule(scheduleClazz.name, scheduleMetadata, schedule.run.bind(schedule));
  }
}
```

---

## didReady Hook

### Purpose

The `didReady` hook runs when the application is fully ready. Use it for:

- Starting scheduled jobs
- Logging startup completion
- Running background processes
- Starting cron jobs

### Implementation

```typescript
@LifecycleHook()
async didReady() {
  this.startSchedules();
}

private startSchedules() {
  const ids = Array.from(this.schedules.keys()) || [];

  ids.map((id) => {
    const schedule = this.schedules.get(id);
    if (!schedule) return;

    const { metadata, handler } = schedule;
    const { enable, cron, start = false, timeZone = 'Asia/Shanghai', runOnInit = false } = metadata;

    if (!enable) return;

    const job = CronJob.from({
      cronTime: cron,
      start,
      runOnInit,
      timeZone,
      onTick: async () => {
        await handler();
      },
    });

    this.jobs.set(id, job);
    job.start();
  });
}
```

### When to Use

| Scenario | Recommendation |
|----------|---------------|
| Start cron jobs | Always in didReady |
| Background tasks | Run in didReady |
| Logging ready | Use didReady |
| Initial processing | After connections (didReady) |

---

## beforeClose Hook

### Purpose

The `beforeClose` hook runs before the application shuts down. Use it for:

- Closing database connections
- Stopping scheduled jobs
- Cleanup resources
- Saving pending data

### Implementation Pattern

```typescript
@LifecycleHook()
async beforeClose() {
  // Stop all scheduled jobs
  for (const [id, job] of this.jobs) {
    job.stop();
    this.logger.info(`[schedule] stopped job: ${id}`);
  }

  // Close database connection
  const client = this.app.container.get(InjectEnum.Client) as Client;
  await client.close();

  this.logger.info('[app] cleanup complete');
}
```

### When to Use

| Scenario | Recommendation |
|----------|---------------|
| Close connections | Always in beforeClose |
| Stop cron jobs | Must stop in beforeClose |
| Cleanup resources | Use beforeClose |
| Save pending data | Before shutdown |

---

## Complete Lifecycle Class Structure

```typescript
import {
  LifecycleHookUnit,
  LifecycleHook,
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
} from '@artus/core';

@LifecycleHookUnit()
export default class MyPluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  get logger() {
    return this.app.logger;
  }

  get container() {
    return this.app.container;
  }

  @LifecycleHook()
  async didLoad() {
    // Register middleware
  }

  @LifecycleHook()
  async willReady() {
    // Initialize connections
  }

  @LifecycleHook()
  async didReady() {
    // Start background tasks
  }

  @LifecycleHook()
  async beforeClose() {
    // Cleanup
  }
}
```

---

## Common Pitfalls

### Missing Decorators

**Problem**: Hook not executing.

**Cause**: Missing `@LifecycleHookUnit` or `@LifecycleHook` decorator.

**Solution**:

```typescript
// WRONG: Missing decorators
export default class MyLifecycle implements ApplicationLifecycle {
  async willReady() {
    // This will never execute
  }
}

// CORRECT: With decorators
@LifecycleHookUnit()
export default class MyLifecycle implements ApplicationLifecycle {
  @LifecycleHook()
  async willReady() {
    // This will execute
  }
}
```

### Wrong Hook Order

**Problem**: Connection fails because client not initialized.

**Cause**: Using database in `didLoad` before `willReady` connects.

**Solution**: Move database operations to `didReady` or later.

### Missing Config Check

**Problem**: App crashes when plugin config missing.

**Cause**: Not checking if config exists.

**Solution**:

```typescript
@LifecycleHook()
async willReady() {
  const config = this.app.config.myPlugin;

  // Always check config exists
  if (!config || !config.host) {
    return;
  }

  // Proceed with initialization
}
```

### Not Exporting from index.ts

**Problem**: Lifecycle class not loaded.

**Cause**: Class not exported from package entry point.

**Solution**:

```typescript
// src/index.ts
export * from './client';
export * from './lifecycle';  // Must export lifecycle
```

---

## Hook Dependencies Between Plugins

When plugins depend on each other, hooks execute in order of plugin registration:

```typescript
// config/plugin.ts
export default {
  redis: { enable: true, path: '@artusx/plugin-redis' },
  sequelize: { enable: true, path: '@artusx/plugin-sequelize' },
};
```

Execution order:

1. Redis plugin didLoad
2. Sequelize plugin didLoad
3. Redis plugin willReady
4. Sequelize plugin willReady
5. ...

---

## Testing Lifecycle Hooks

```typescript
describe('lifecycle', () => {
  let app;

  beforeAll(async () => {
    app = await createApp(path.resolve(__dirname, './fixtures/app'));
  });

  it('should run willReady hook', async () => {
    const client = app.container.get(InjectEnum.Redis);
    assert(client.getClient());  // Client should be initialized
  });
});
```