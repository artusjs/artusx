# Plugin Structure Reference

## Overview

ArtusX plugins follow a consistent structure that enables easy integration with the framework. Each plugin provides a specific functionality (e.g., database connection, logging, scheduling) and can be configured through the application's config files.

---

## Standard Plugin Directory Structure

```
packages/plugins/{plugin-name}/
├── src/
│   ├── client.ts          # Main client implementation
│   ├── constants.ts       # Injection tokens and constants
│   ├── lifecycle.ts       # Lifecycle hooks
│   ├── index.ts           # Export entry point
│   ├── types.ts           # Type definitions
│   └── config/
│       └── config.default.ts  # Default configuration
├── lib/                   # Compiled output
├── test/                  # Test files
│   ├── {plugin}.test.ts
│   └── fixtures/
│       └── app/
├── package.json
└── tsconfig.json
```

---

## File-by-File Explanation

### client.ts - Injectable Client

The client file defines the main service class with `@Injectable` decorator. This is the core functionality provider.

From `/packages/plugins/redis/src/client.ts`:

```typescript
import { Injectable, ScopeEnum } from '@artus/core';
import { Redis, RedisOptions } from 'ioredis';
import { InjectEnum } from './constants';

export interface RedisConfig extends RedisOptions {
  host: string;
  port: number;
  username?: string;
  password?: string;
  db: number;
}

@Injectable({
  id: InjectEnum.Redis,
  scope: ScopeEnum.SINGLETON,
})
export default class RedisClient {
  private redis: Redis;

  async init(config: RedisConfig) {
    if (!config) {
      return;
    }

    this.redis = new Redis(config);
  }

  getClient(): Redis {
    return this.redis;
  }
}
```

**Key Points**:
- `@Injectable` marks class for DI container
- `id` specifies injection token
- `scope: SINGLETON` ensures single instance
- `init` method for initialization
- `getClient` exposes underlying library

### constants.ts - Injection Tokens

Defines enum for container injection tokens.

From `/packages/plugins/redis/src/constants.ts`:

```typescript
export enum InjectEnum {
  Redis = 'ARTUSX_REDIS',
}
```

From `/packages/libs/core/src/constants.ts`:

```typescript
import { ArtusInjectEnum } from '@artus/core';

export enum InjectEnum {
  Pipeline = 'ARTUSX_PIPELINE',
  Nunjucks = 'ARTUSX_NUNJUCKS',
  Koa = 'ARTUSX_KOA',
  KoaRouter = 'ARTUSX_KOA_ROUTER',
  Log4js = 'ARTUSX_LOG4JS',
  Schedule = 'ARTUSX_SCHEDULE',
}

export const ArtusXInjectEnum = {
  ...ArtusInjectEnum,
  ...InjectEnum,
};

export type ArtusXInjectEnum = ArtusInjectEnum | InjectEnum;
```

**Naming Convention**: Use `ARTUSX_{PLUGIN_NAME}` format.

### lifecycle.ts - Lifecycle Hooks

Implements application lifecycle to initialize the plugin.

From `/packages/plugins/redis/src/lifecycle.ts`:

```typescript
import { LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { ApplicationLifecycle } from '@artus/core';
import { ArtusApplication, Inject, ArtusInjectEnum } from '@artus/core';
import { InjectEnum } from './constants';
import Redis, { RedisConfig } from './client';

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

**Pattern**:
1. Get config from `this.app.config`
2. Check if config exists
3. Get client from container
4. Initialize client with config

### index.ts - Export Entry

Exports all public components.

From `/packages/plugins/redis/src/index.ts`:

```typescript
export * from './client';
export * from './lifecycle';
```

### types.ts - Type Definitions

Defines interfaces and types.

```typescript
export interface PluginConfig {
  host: string;
  port: number;
  // ... other options
}
```

### config/config.default.ts - Default Configuration

Provides default config values.

From `/packages/plugins/redis/src/config/config.default.ts`:

```typescript
import { RedisConfig } from '../client';

export default {
  redis: {
    host: 'localhost',
    port: 6379,
    username: '',
    password: '',
    db: 0
  } as RedisConfig
};
```

---

## Plugin Boilerplate Template

From `/packages/boilerplates/artusx-plugin/boilerplate/src/`:

### client.ts

```typescript
import { Injectable, Inject, ScopeEnum, ArtusInjectEnum } from '@artus/core';
import { InjectEnum } from './constants';

@Injectable({
  id: InjectEnum.Client,
  scope: ScopeEnum.SINGLETON,
})
export default class Client {
  _config: any;

  constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
    this._config = config || {};
  }

  async init(config) {
    if (!config) {
      return;
    }
  }

  getClient() {
    // Return underlying client
  }
}
```

### constants.ts

```typescript
export enum InjectEnum {
  Client = '{{injectName}}'  // Template placeholder
}
```

### lifecycle.ts

```typescript
import { ApplicationLifecycle, ArtusApplication, Inject, ArtusInjectEnum, LifecycleHookUnit, LifecycleHook } from '@artus/core';
import { InjectEnum } from './constants';
import Client from './client';

@LifecycleHookUnit()
export default class PluginLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  @LifecycleHook()
  async willReady() {
    const client = this.app.container.get(InjectEnum.Client) as Client;
    await client.init(this.app.config.{{name}});
  }
}
```

---

## Plugin Registration

### In Application config/plugin.ts

```typescript
export default {
  redis: {
    enable: true,
    path: '@artusx/plugin-redis',
  },
  sequelize: {
    enable: true,
    path: '@artusx/plugin-sequelize',
  },
  log4js: {
    enable: true,
    path: '@artusx/plugin-log4js',
  },
};
```

### In Application config/config.default.ts

```typescript
export default {
  redis: {
    host: 'localhost',
    port: 6379,
    db: 0,
  },
  sequelize: {
    host: 'localhost',
    port: 3306,
    database: 'myapp',
    username: 'root',
    password: '',
  },
};
```

---

## Complete Plugin Example: Schedule

From `/packages/plugins/schedule/src/`:

### Structure

```
packages/plugins/schedule/src/
├── client.ts (implicit in lifecycle)
├── constants.ts
├── decorator.ts
├── index.ts
├── lifecycle.ts
└── types.ts
```

### decorator.ts

```typescript
import { addTag, Injectable, ScopeEnum } from '@artus/core';

export const CLASS_SCHEDULE_TAG = 'CLASS_SCHEDULE_TAG';
export const CLASS_SCHEDULE_METADATA = Symbol.for('CLASS_SCHEDULE_METADATA');

export function Schedule(options: ArtusXScheduleOptions) {
  return (target: any) => {
    const scheduleMetadata = options;
    Reflect.defineMetadata(CLASS_SCHEDULE_METADATA, scheduleMetadata, target);
    addTag(CLASS_SCHEDULE_TAG, target);
    Injectable({ scope: ScopeEnum.EXECUTION })(target);
  };
}
```

### lifecycle.ts

```typescript
import {
  ApplicationLifecycle,
  ArtusApplication,
  Inject,
  ArtusInjectEnum,
  LifecycleHookUnit,
  LifecycleHook,
} from '@artus/core';
import { CronJob } from 'cron';
import { CLASS_SCHEDULE_TAG, CLASS_SCHEDULE_METADATA } from './decorator';

@LifecycleHookUnit()
export default class ScheduleLifecycle implements ApplicationLifecycle {
  @Inject(ArtusInjectEnum.Application)
  app: ArtusApplication;

  jobs: Map<string, any>;
  schedules: Map<string, { metadata: any; handler: any }>;

  get container() {
    return this.app.container;
  }

  constructor() {
    this.jobs = new Map();
    this.schedules = new Map();
  }

  @LifecycleHook()
  async willReady() {
    this.loadSchedule();
  }

  @LifecycleHook()
  async didReady() {
    this.startSchedules();
  }

  private loadSchedule() {
    const scheduleClazzList = this.container.getInjectableByTag(CLASS_SCHEDULE_TAG);

    for (const scheduleClazz of scheduleClazzList) {
      const schedule = this.container.get(scheduleClazz) as any;
      const scheduleMetadata = Reflect.getMetadata(CLASS_SCHEDULE_METADATA, scheduleClazz);
      this.registerSchedule(scheduleClazz.name, scheduleMetadata, schedule.run.bind(schedule));
    }
  }

  private startSchedules() {
    // Start all registered schedules
  }
}
```

---

## Creating a New Plugin

### Step 1: Create Package

```bash
rush create --name mongodb --type plugins --rush
```

### Step 2: Implement Files

Create the standard files in `src/`:

1. `constants.ts` - Define InjectEnum
2. `types.ts` - Define interfaces
3. `client.ts` - Implement @Injectable client
4. `lifecycle.ts` - Implement lifecycle hooks
5. `index.ts` - Export components
6. `config/config.default.ts` - Default config

### Step 3: Update rush.json

The `rush create --rush` command updates rush.json automatically:

```json
{
  "packageName": "@artusx/plugin-mongodb",
  "projectFolder": "packages/plugins/mongodb",
  "tags": ["artusx-plugins"],
  "versionPolicyName": "public"
}
```

### Step 4: Build and Test

```bash
rush build -t @artusx/plugin-mongodb
rush test -t @artusx/plugin-mongodb
```

---

## Best Practices

### Singleton vs Execution Scope

| Use Case | Scope |
|----------|-------|
| Database clients | SINGLETON |
| External service clients | SINGLETON |
| Controllers | EXECUTION |
| Middleware | EXECUTION |
| Schedules | EXECUTION |

### Configuration Validation

Always check config before initializing:

```typescript
const config = this.app.config.myPlugin;
if (!config || !config.requiredField) {
  return;  // Skip initialization
}
```

### Error Handling in Lifecycle

Use try-catch for external connections:

```typescript
@LifecycleHook()
async willReady() {
  try {
    await this.client.init(config);
    this.logger.info('[plugin] initialized');
  } catch (error) {
    this.logger.error('[plugin] init failed: %s', error.message);
    throw error;
  }
}
```

### Dependency Injection Pattern

```typescript
// Get from container
const client = this.app.container.get(InjectEnum.MyPlugin) as MyClient;

// Or inject in class property
@Inject(InjectEnum.MyPlugin)
client: MyClient;
```

---

## Plugin Dependencies

If your plugin depends on another plugin:

1. Ensure dependent plugin loads first (order in plugin.ts)
2. Get dependent client from container in willReady
3. Handle case when dependent plugin not enabled

```typescript
@LifecycleHook()
async willReady() {
  // Check if Redis is enabled
  try {
    const redis = this.app.container.get(InjectEnum.Redis);
    // Use Redis
  } catch {
    // Redis not available, handle gracefully
  }
}
```