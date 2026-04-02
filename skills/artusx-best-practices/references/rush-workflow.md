# Rush.js Workflow Reference

> **Important**: This reference is for **contributing to ArtusX itself**. If you're using ArtusX to build applications, use `@artusx/init` instead:
>
> ```bash
> npm install -g @artusx/init
> artusx-init --name web --type apps
> ```

## Overview

ArtusX uses Rush.js for monorepo management. Rush provides unified dependency management, build orchestration, and publishing workflow across all packages.

---

## Installation

### Install Rush.js

```bash
npm install -g @microsoft/rush
```

### Verify Installation

```bash
rush --version
```

---

## Common Commands

### Dependency Management

| Command | Description |
|---------|-------------|
| `rush update` | Install all dependencies |
| `rush update --full` | Clean install |
| `rush check` | Verify package versions |

### Building

| Command | Description |
|---------|-------------|
| `rush build` | Build all packages |
| `rush rebuild` | Clean and rebuild all |
| `rush build -t {package}` | Build specific package |
| `rush build -T {tag}` | Build packages by tag |

### Testing

| Command | Description |
|---------|-------------|
| `rush test` | Run tests for all packages |
| `rush test -t {package}` | Test specific package |

### Creating Packages

| Command | Description |
|---------|-------------|
| `rush create --name {name} --type {type}` | Create new package |
| `rush create --name {name} --type {type} --rush` | Create and update rush.json |

---

## Package Creation Workflow

### Step 1: Build Generator Tools

```bash
rush rebuild -t @artusx/init
```

### Step 2: Create Package

```bash
# Create app
rush create --name web --type apps --rush

# Create library
rush create --name common --type libs --rush

# Create plugin
rush create --name postgres --type plugins --rush
```

### Step 3: Update Dependencies

```bash
rush update
```

### Step 4: Build New Package

```bash
rush build -t @artusx/plugin-postgres
```

### Package Types

| Type | Directory | Description |
|------|-----------|-------------|
| apps | packages/apps | Application packages |
| plugins | packages/plugins | Plugin packages |
| libs | packages/libs | Library packages |
| boilerplates | packages/boilerplates | Template packages |

---

## rush.json Configuration

From `/rush.json`:

```json
{
  "$schema": "https://developer.microsoft.com/json-schemas/rush/v5/rush.schema.json",
  "rushVersion": "5.172.1",
  "pnpmVersion": "10.33.0",
  "nodeSupportedVersionRange": ">=20.x",
  "projectFolderMinDepth": 2,
  "projectFolderMaxDepth": 3,
  "repository": {
    "url": "https://github.com/artusjs/artusx",
    "defaultRemote": "origin",
    "defaultBranch": "main"
  },
  "allowedProjectTags": [
    "artusx-apps",
    "artusx-plugins",
    "artusx-libs",
    "artusx-tools",
    "artusx-boilerplates"
  ],
  "projects": [
    {
      "packageName": "@artusx/plugin-redis",
      "projectFolder": "packages/plugins/redis",
      "tags": ["artusx-plugins"],
      "versionPolicyName": "public"
    }
  ]
}
```

---

## Version Management

### Version Policies

Defined in `common/config/rush/version-policies.json`:

| Policy | Description |
|--------|-------------|
| public | Lockstep versioning for public packages |
| individual-utils | Independent versioning |

### Bump Version

```bash
# Bump all lockstep packages
rush version --bump
```

### Update Changelog

```bash
rush changelog
```

---

## Release Workflow

### Option 1: Release with GitHub Actions

```bash
# Set npm token
export NPM_AUTH_TOKEN={your_token}

# Update changelog
rush changelog

# Bump version
rush version --bump

# Create git release tag
git release v1.0.12 -m "chore: release 1.0.12"

# Release packages
rush release-package
```

### Option 2: Release Pre-release Version

```bash
# Create pre-release tag
git release v1.1.5-rc.12 -m "chore: release 1.1.5-rc.12"

# Release as pre-release
rush release-package -r  # --prerelease flag
```

### Option 3: Manual Publishing

```bash
# Publish all packages
rush publish-package
```

---

## Release Commands

| Command | Description |
|---------|-------------|
| `rush changelog` | Update CHANGELOG.md |
| `rush version --bump` | Increment version |
| `rush release-package` | Publish to npm |
| `rush release-package -r` | Publish as pre-release |
| `rush publish-package` | Alternative publish command |

---

## Building Specific Packages

### By Package Name

```bash
rush build -t @artusx/plugin-redis
rush build -t @artusx/core
```

### By Tag

```bash
# Build all plugins
rush build -T artusx-plugins

# Build all libs
rush build -T artusx-libs
```

### Dependencies

Rush automatically builds dependencies:

```bash
# This builds core and all its dependents
rush build -t @artusx/core
```

---

## Development Workflow

### Typical Day Workflow

```bash
# Morning: Update dependencies
rush update

# Work on feature
rush build -t my-package

# Run tests
rush test -t my-package

# Commit changes
git add .
git commit -m "feat: new feature"
```

### Adding New Dependency

1. Add to package.json of specific package
2. Run `rush update`

```bash
cd packages/plugins/my-plugin
# Edit package.json to add dependency
rush update
```

---

## CI/CD Integration

### GitHub Actions Workflow

From `/.github/workflows/ci.yml` pattern:

```yaml
name: Continuous Integration

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Rush
        run: npm install -g @microsoft/rush

      - name: Update dependencies
        run: rush update

      - name: Build
        run: rush build

      - name: Test
        run: rush test
```

---

## Debugging Build Issues

### Clean Build

```bash
# Remove all build artifacts
rush rebuild
```

### Check Dependencies

```bash
# Verify shrinkwrap
rush check
```

### View Package Dependencies

```bash
# List dependencies for package
rush list -p @artusx/plugin-redis
```

---

## Monorepo Structure

```
artusx/
├── rush.json              # Rush configuration
├── common/
│   ├── config/
│   │   └── rush/
│   │       ├── version-policies.json
│   │       └── pnpm-lock.yaml
│   └── temp/              # Temporary build files
├── packages/
│   ├── apps/              # Application packages
│   ├── plugins/           # Plugin packages
│   ├── libs/              # Library packages
│   └── boilerplates/      # Boilerplate packages
└── toolchains/            # Tool packages
```

---

## Best Practices

### 1. Always Use Rush Commands

Don't use npm or pnpm directly:

```bash
# WRONG
npm install
pnpm install

# CORRECT
rush update
```

### 2. Build Before Test

```bash
# Build first
rush build -t my-package

# Then test
rush test -t my-package
```

### 3. Use Tags for Bulk Operations

```bash
# Build all plugins at once
rush build -T artusx-plugins
```

### 4. Keep rush.json Updated

When creating packages with `--rush` flag, rush.json is auto-updated. For manual updates, edit rush.json.

### 5. Check Node Version

Rush enforces Node.js version range:

```json
"nodeSupportedVersionRange": ">=20.x"
```

---

## Quick Reference Card

| Task | Command |
|------|---------|
| Install dependencies | `rush update` |
| Build all | `rush build` |
| Build specific | `rush build -t @artusx/plugin-name` |
| Test all | `rush test` |
| Test specific | `rush test -t @artusx/plugin-name` |
| Create package | `rush create --name foo --type plugins --rush` |
| Bump version | `rush version --bump` |
| Update changelog | `rush changelog` |
| Publish | `rush release-package` |
| Clean rebuild | `rush rebuild` |

---

## Troubleshooting

### Lock File Conflicts

```bash
# Regenerate lock file
rush update --full
```

### Build Cache Issues

```bash
# Clear build cache
rush rebuild
```

### Missing Dependencies

```bash
# Reinstall
rush update
```

### Version Policy Errors

Check `common/config/rush/version-policies.json` for policy definitions.