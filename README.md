# ArtusX

[![Continuous Integration](https://github.com/artusjs/artusx/actions/workflows/ci.yml/badge.svg)](https://github.com/artusjs/artusx/actions/workflows/ci.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fartusjs%2Fartusx.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fartusjs%2Fartusx?ref=badge_shield)

Ecosystem based on Artus.js - [https://www.artusjs.org](https://www.artusjs.org).

## Packages

| packages                            |  Version                                                                                                                                                          |
|:------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| libs                                |                                                                                                                                                                   |
| @artusx/core                        | [![NPM version](https://img.shields.io/npm/v/@artusx/core.svg?style=flat-square)](https://npmjs.org/package/@artusx/core)                                         |
| @artusx/utils                       | [![NPM version](https://img.shields.io/npm/v/@artusx/utils.svg?style=flat-square)](https://npmjs.org/package/@artusx/utils)                                       |
| tools                               |                                                                                                                                                                   |
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
| @artusx/plugin-nunjucks             | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-nunjucks.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-nunjucks)                   |
| @artusx/plugin-schedule             | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-schedule.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-schedule)                   |
| @artusx/plugin-sequelize            | [![NPM version](https://img.shields.io/npm/v/@artusx/plugin-sequelize.svg?style=flat-square)](https://npmjs.org/package/@artusx/plugin-sequelize)                 |
| boilerplates                        |                                                                                                                                                                   |
| @artusx/boilerplate-artusx-app      | [![NPM version](https://img.shields.io/npm/v/@artusx/boilerplate-artusx-app?style=flat-square)](https://npmjs.org/package/@artusx/boilerplate-artusx-app)         |
| @artusx/boilerplate-artusx-lib      | [![NPM version](https://img.shields.io/npm/v/@artusx/boilerplate-artusx-lib?style=flat-square)](https://npmjs.org/package/@artusx/boilerplate-artusx-lib)         |
| @artusx/boilerplate-artusx-plugin   | [![NPM version](https://img.shields.io/npm/v/@artusx/boilerplate-artusx-plugin?style=flat-square)](https://npmjs.org/package/@artusx/boilerplate-artusx-plugin)   |

## Quickstart

install `@artusx/init`

```bash
npm i -g @artusx/init
```

create web app with app boilerplate

```bash
artusx-init --name web --type apps
```

install deps and run the app

```bash
cd web
pnpm i
pnpm run dev
```

## Development

### prepare

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
rush create --name web --type apps --source local
rush create --name common --type libs --source local
rush create --name postgres --type plugins --source local
```

### release

publish to npm.js

```bash
# export npm auth token
export NPM_AUTH_TOKEN={NPM_AUTH_TOKEN}

# update version
rush version --bump

# update changelog
rush changelog

# publish with actions
# git release v1.0.12 -m "chore: release 1.0.12"
git release {version} -m "chore: release {version}"

# publish with rush.js
rush publish --include-all --publish
```

## License

[MIT](LICENSE)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fartusjs%2Fartusx.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fartusjs%2Fartusx?ref=badge_large)