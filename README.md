# ArtusX

> Monorepo for ArtusX.

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
