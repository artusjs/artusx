# ArtusX

[![Continuous Integration](https://github.com/thonatos/artusx/actions/workflows/ci.yml/badge.svg)](https://github.com/thonatos/artusx/actions/workflows/ci.yml)

> toolchain powered by artus.js .

## Packages

### ArtusX Framework

[![NPM version](https://img.shields.io/npm/v/@artusx/core.svg?style=flat-square)](https://npmjs.org/package/@artusx/core)

```bash
pnpm i @artusx/core
```

**plugins**

- @artusx/plugin-application-http

### ArtusX Utils

[![NPM version](https://img.shields.io/npm/v/@artusx/utils.svg?style=flat-square)](https://npmjs.org/package/@artusx/utils)

```bash
pnpm i @artusx/utils
```

### ArtusX Plugins

[![NPM version](https://img.shields.io/npm/v/@artusx/plugin-redis.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-redis)

```bash
pnpm i @artusx/plugin-redis
```

---

[![NPM version](https://img.shields.io/npm/v/@artusx/plugin-sequelize.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-sequelize)

```bash
pnpm i @artusx/plugin-sequelize
```

---

[![NPM version](https://img.shields.io/npm/v/@artusx/plugin-application-http.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-application-http)

```bash
pnpm i @artusx/plugin-application-http
```

## Example

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

# publish to npm.js
rush publish --include-all --publish
```
