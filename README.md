# ArtusX

[![Continuous Integration](https://github.com/artusjs/artusx/actions/workflows/ci.yml/badge.svg)](https://github.com/artusjs/artusx/actions/workflows/ci.yml)

> toolchain powered by artus.js .

| packages                 |  Version                                                                                                                                           |
|:-------------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------|
| @artusx/core             | [![NPM version](https://img.shields.io/npm/v/@artusx/core.svg?style=flat-square)](https://npmjs.org/package/@artusx/core)                          |
| @artusx/utils            | [![NPM version](https://img.shields.io/npm/v/@artusx/utils.svg?style=flat-square)](https://npmjs.org/package/@artusx/utils)                        |
| @artusx/plugin-koa       | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-koa.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-koa)              |
| @artusx/plugin-nest      | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-nest.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-nest)            |
| @artusx/plugin-express   | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-express.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-express)      |
| @artusx/plugin-redis     | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-redis.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-redis)          |
| @artusx/plugin-sequelize | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-sequelize.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-sequelize)  |

## Packages

The monorepo is managed by rush.js

```bash
packages
├── apps
│   ├── artusx-api
│   ├── artusx-express
│   ├── artusx-koa
│   └── artusx-nest
├── libs
│   ├── core
│   └── utils
└── plugins
    ├── express
    ├── koa
    ├── nest
    ├── redis
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

`controller/home.ts`

```typescript
import { GET, POST, HTTPController } from '../types';
import type { HTTPContext } from '../types';

@HTTPController()
export default class HomeController {

  @GET('/can-be-get')
  @POST('/post')
  async home(ctx: HTTPContext) {
    ctx.body = 'Hello World';
  }
}
```

`types.ts`

```typescript
export * from '@artusx/core/lib/types';
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

publish to npm.js

```bash
# export npm auth token
export NPM_AUTH_TOKEN={NPM_AUTH_TOKEN}

# update version
rush version --bump

# publish with actions
git release {version}

# publish with rush.js
rush publish --include-all --publish
```
