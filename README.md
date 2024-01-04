# ArtusX

[![NPM version](https://img.shields.io/npm/v/@artusx/core.svg?style=flat-square)](https://npmjs.org/package/@artusx/core)
[![Continuous Integration](https://github.com/thonatos/artusx/actions/workflows/ci.yml/badge.svg)](https://github.com/thonatos/artusx/actions/workflows/ci.yml)

> a undefined project.

## Packages

**ArtusX Framework**

- @artusx/core

**ArtusX Application**

- @artusx/run

**ArtusX ArtusX Plugins**

- @artusx/plugin-redis
- @artusx/plugin-sequelize
- @artusx/plugin-application-http

## Usage

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
