# ArtusX

[![Continuous Integration](https://github.com/artusjs/artusx/actions/workflows/ci.yml/badge.svg)](https://github.com/artusjs/artusx/actions/workflows/ci.yml)

> toolchain powered by artus.js .

| packages                            |  Version                                                                                                                                                          |
|:------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| @artusx/core                        | [![NPM version](https://img.shields.io/npm/v/@artusx/core.svg?style=flat-square)](https://npmjs.org/package/@artusx/core)                                         |
| @artusx/utils                       | [![NPM version](https://img.shields.io/npm/v/@artusx/utils.svg?style=flat-square)](https://npmjs.org/package/@artusx/utils)                                       |
| @artusx/init                        | [![NPM version](https://img.shields.io/npm/v/@artusx/init.svg?style=flat-square)](https://npmjs.org/package/@artusx/init)                                         |
| @artusx/init-config                 | [![NPM version](https://img.shields.io/npm/v/@artusx/init-config.svg?style=flat-square)](https://npmjs.org/package/@artusx/init-config)                           |
| @artusx/tsconfig                    | [![NPM version](https://img.shields.io/npm/v/@artusx/tsconfig.svg?style=flat-square)](https://npmjs.org/package/@artusx/tsconfig)                                 |
| @artusx/eslint-config               | [![NPM version](https://img.shields.io/npm/v/@artusx/eslint-config.svg?style=flat-square)](https://npmjs.org/package/@artusx/eslint-config)                       |
| plugins                             |                                                                                                                                                                   |
| @artusx/plugin-koa                  | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-koa.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-koa)                             |
| @artusx/plugin-nest                 | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-nest.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-nest)                           |
| @artusx/plugin-express              | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-express.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-express)                     |
| @artusx/plugin-redis                | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-redis.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-redis)                         |
| @artusx/plugin-log4js               | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-log4js.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-log4js)                       |
| @artusx/plugin-nunjucks             | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-nunjucks.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-nunjucks)                   |
| @artusx/plugin-xtransit             | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-xtransit.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-xtransit)                   |
| @artusx/plugin-sequelize            | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-sequelize.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-sequelize)                 |
| boilerplates                        |                                                                                                                                                                   |
| @artusx/boilerplate-artusx-app      | [![NPM version](https://img.shields.io/npm/v/@artusx/boilerplate-artusx-app?style=flat-square)](https://npmjs.org/package/@artusx/boilerplate-artusx-app)         |
| @artusx/boilerplate-artusx-lib      | [![NPM version](https://img.shields.io/npm/v/@artusx/boilerplate-artusx-lib?style=flat-square)](https://npmjs.org/package/@artusx/boilerplate-artusx-lib)         |
| @artusx/boilerplate-artusx-plugin   | [![NPM version](https://img.shields.io/npm/v/@artusx/boilerplate-artusx-plugin?style=flat-square)](https://npmjs.org/package/@artusx/boilerplate-artusx-plugin)   |

## Packages

The monorepo is managed by rush.js

```bash
packages
├── apps
│   ├── artusx-api
│   └── artusx-koa
├── libs
│   ├── core
│   └── utils
├── boilerplates
│   ├── artusx-app
│   ├── artusx-lib
│   └── artusx-plugin
└── plugins
    ├── express
    ├── koa
    ├── redis
    ├── log4js
    ├── nunjucks
    ├── xtransit
    └── sequelize
```

## Quickstart

The code show how to run a simple web server using `@artusx/core`.

`bootstrap.ts`

```typescript
import path from 'path';
import { Application } from '@artusx/utils';

(async () => {
  const app = await Application.start({
    root: path.resolve(__dirname),
    configDir: 'config'
  });

  console.log(app.config);
})();
```

`config/plugin.ts`

```typescript
export default {
  artusx: {
    enable: true,
    package: '@artusx/core'
  }
};
```

`middleware/traceTime.ts`

```ts
import { ArtusInjectEnum, Inject, ArtusxContext, ArtusxNext, Middleware } from '@artusx/core';

@Middleware({
  enable: true,
})
export default class TraceTimeMiddleware {
  @Inject(ArtusInjectEnum.Config)
  config: Record<string, string | number>;

  async use(ctx: ArtusxContext, next: ArtusxNext): Promise<void> {
    const { data } = ctx.context.output;
    data.traced = true;
    console.log('middleware - traceTime', ctx.context);

    console.time('trace');
    await next();    
    console.timeEnd('trace');
  }
}
```

`controller/home.ts`

```typescript
import { GET, POST, Controller } from '@artusx/core';
import type { ArtusxContext } from '@artusx/core';

@Controller()
export default class HomeController {

  @GET('/can-be-get')
  @POST('/post')
  async home(ctx: ArtusxContext) {
    ctx.body = 'Hello World';
  }
}
```

## Development

install rush.js

```bash
npm install -g @microsoft/rush
```

install deps

```bash
rush update
```

create new package

```bash
# build generator tools
rush rebuild -t @artusx/init

# create new package and update projects in rush.json
rush gen --name web --type apps
rush gen --name common --type libs
rush gen --name postgres --type plugins
```

publish to npm.js

```bash
# export npm auth token
export NPM_AUTH_TOKEN={NPM_AUTH_TOKEN}

# update version
rush version --bump

# update changelog
rush changelog

# publish with actions
# git release v1.0.1-dev.20 -m "chore: release 1.0.1-dev.20"
git release {version} -m "chore: release {version}"

# publish with rush.js
rush publish --include-all --publish
```
