# @artusx/rush-utils

## Usages

### install

```bash
npm i -g @artusx/rush-utils
```

### release / publish

```bash
cd ~/rush-project

# release
artusx-rush-utils release

# publish
artusx-rush-utils publish
```

### use with rush project

create rush autoinstaller

```bash
cd ~/rush-project

# install utils
rush init-autoinstaller --name rush-utils
cd common/autoinstallers/rush-utils
pnpm i @artusx/rush-utils

# update deps
rush update-autoinstaller --name rush-utils
```

add custom commmands

```json
// common/config/rush/command-line.json

{
  "commands": [
    {
      "name": "release-package",
      "commandKind": "global",
      "summary": "custom release for artusx, This command invokes @artusx/rush-utils to releas tag.",
      "safeForSimultaneousRushProcesses": true,
      "autoinstallerName": "rush-utils",
      "shellCommand": "artusx-rush-utils release -n ${name}"
    },
    {
      "name": "publish-package",
      "commandKind": "global",
      "summary": "custom publish for artusx, This command invokes @artusx/rush-utils to publish npm package.",
      "safeForSimultaneousRushProcesses": true,
      "autoinstallerName": "rush-utils",
      "shellCommand": "artusx-rush-utils publish -r ${registry}"
    },
  ]
}
```

update version and publish

```bash
# bump version 
rush version --bump

# release tag (publish with CI runner)
rush release-package

# publish npm (publish with npm token, $NPM_AUTH_TOKEN is required.)
rush publish-package
```

add to github / gitlab pipeline.

> Rush prepare is used to copy .npmrc-publish to .npmrc

```yml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags:
      - v1.*

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - name: Git config user
        run: |
          git config --local user.name "artusxbot"
          git config --local user.email "artusxbot@users.noreply.github.com"
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Verify Change Logs
        run: node common/scripts/install-run-rush.js change --verify
      - name: Rush Install
        run: node common/scripts/install-run-rush.js install
      - name: Rush rebuild
        run: node common/scripts/install-run-rush.js rebuild
      - name: Rush prepare
        run: node common/scripts/install-run-rush.js publish        
      - name: Rush publish
        env:
          NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}
        run: node common/scripts/install-run-rush.js publish-package
```

```yml
## .gitlab-ci.yml
release:
  stage: deploy
  needs: ['ci']
  tags:    
    - nodejs
  rules:
    - if: '$CI_COMMIT_TAG =~ /^(latest\/|beta\/|next\/|alpha\/|test\/|dev\/|rc\/|v)?(.+@)?\d+\.\d+\.\d+(.+)?$/'
  variables:
    NODE_VERSION: 18
  script:
    - node common/scripts/install-run-rush.js change --verify
    - node common/scripts/install-run-rush.js install
    - node common/scripts/install-run-rush.js rebuild
    - node common/scripts/install-run-rush.js publish    
    - node common/scripts/install-run-rush.js publish-package
    - node common/scripts/install-run-rush.js sync
```
