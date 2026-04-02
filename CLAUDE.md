# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Available Skills

### artusx-best-practices

A Claude Code skill is available at `skills/artusx-best-practices/` to assist with ArtusX application development. This skill provides:

- **Plugin Development**: Complete patterns for creating ArtusX plugins with lifecycle hooks
- **Decorators**: Usage examples for @Controller, @Middleware, @Inject, HTTP route decorators
- **Testing**: Setup patterns with ArtusScanner, ArtusApplication, and Jest
- **Common Tasks**: Step-by-step guides for controllers, middleware, database integration
- **Troubleshooting**: Solutions for lifecycle issues, DI failures, configuration errors

The skill automatically activates when working with:
- Creating or modifying ArtusX plugins
- Implementing controllers and middleware
- Setting up tests for ArtusX packages
- Debugging lifecycle hook issues
- Configuring decorators and dependency injection

For detailed reference, see the skill's reference files in `skills/artusx-best-practices/references/`.

## Project Overview

ArtusX is an ecosystem based on Artus.js framework (https://www.artusjs.org), managed as a Rush.js monorepo. It provides a plugin-based architecture for building web applications with support for multiple frameworks (Koa, Express, Nest).

## Development Commands

### Environment Setup
```bash
# Install Rush.js globally (required)
npm install -g @microsoft/rush

# Install all dependencies
rush update

# Rebuild all packages
rush rebuild
```

### Building and Testing
```bash
# Build specific package
rush build -t <package-name>

# Rebuild specific package (clean build)
rush rebuild -t <package-name>

# Run tests for a specific package (from package directory)
cd packages/plugins/koa
rushx test

# Run tests with coverage
rushx cov

# Run linting
rushx lint
rushx lint:fix
```

### Running Applications
```bash
# Development mode (from app directory)
cd packages/apps/artusx-koa
rushx dev

# Production mode
rushx start
```

### Creating New Packages
```bash
# Build the init tool first
rush rebuild -t @artusx/init

# Create new package (automatically updates rush.json)
rush create --name <name> --type <type> --rush
# Types: apps, libs, plugins, boilerplates
```

### Release Process
```bash
# Update changelog
rush changelog

# Bump version
rush version --bump

# Release packages
rush release-package              # For lockStepVersion (stable)
rush release-package -r           # For prerelease versions

# Alternative: publish directly
rush publish-package
```

## Architecture

### Monorepo Structure
- **packages/libs**: Core libraries (@artusx/core, @artusx/utils, @artusx/otl)
- **packages/plugins**: Framework plugins (koa, express, nest, redis, sequelize, etc.)
- **packages/apps**: Example applications (artusx-koa, artusx-express, etc.)
- **toolchains**: Development tools (init, tsconfig, eslint-config, rush-utils)
- **packages/boilerplates**: Project templates for scaffolding

### Version Policies
- **lockStepVersion** (policy: "public"): libs and plugins share unified version (1.1.5-20)
- **individualVersion** (policy: "individual-utils"): tools have independent versions

### Core Framework Concepts

**Artus.js Lifecycle Hooks:**
- `didLoad`: Load configurations and plugins
- `willReady`: Initialize controllers and middleware
- `didReady`: Start HTTP server
- `beforeClose`: Cleanup resources

**Dependency Injection:**
- Uses `@Inject` decorator for dependency injection
- Container access via `app.container`
- Injectable classes tagged with metadata

**Decorator Pattern:**
- `@Controller(prefix)`: Define route controller
- `@Middleware({ enable })`: Define middleware class
- `@GET/POST/PUT/DELETE(path)`: Define HTTP routes
- `@Headers/ContentType/StatusCode`: Response modifiers

### Plugin Architecture
Each plugin implements:
- Lifecycle hook unit with `@LifecycleHookUnit()` decorator
- Lifecycle methods: `didLoad`, `willReady`, `didReady`, `beforeClose`
- Configuration in `src/config/config.default.ts`
- Plugin registration in `src/config/plugin.ts`

Example plugin structure:
```
packages/plugins/<name>/
├── src/
│   ├── index.ts          # Plugin exports
│   ├── lifecycle.ts      # Lifecycle hooks
│   ├── decorator.ts      # Plugin-specific decorators
│   ├── config/
│   │   ├── config.default.ts
│   │   └plugin.ts
├── test/
│   ├── app.test.ts
│   └── utils/index.ts    # Test helpers
├── package.json
└── jest.config.js
```

### Testing
- Jest with ts-jest preset
- Test environment: node
- Create test app using `ArtusScanner` and `ArtusApplication`
- Test fixtures in `test/fixtures/app/`

Example test setup:
```typescript
import { ArtusScanner, ArtusApplication } from '@artus/core';

export async function createApp(baseDir: string) {
  const scanner = new ArtusScanner({ needWriteFile: false, configDir: 'config', extensions: ['.ts'] });
  const manifest = await scanner.scan(baseDir);
  const app = new ArtusApplication();
  await app.load(manifest, baseDir);
  await app.run();
  return app;
}
```

## Code Standards

### TypeScript Configuration
- Target: ES2017, Module: NodeNext
- Experimental decorators enabled
- Strict type checking enabled
- Common config: `@artusx/tsconfig` workspace package

### ESLint Rules
- Extends `@artus/eslint-config-artus/typescript`
- Unused variables with `_` prefix ignored
- Import resolver for `.ts` extensions

### Commit Standards
- Conventional commits enforced via commitlint
- Configuration: `common/autoinstallers/rush-commitlint/`

### Code Formatting
- Prettier config: 2-space tabs, single quotes, trailing commas (ES5)
- Print width: 110 characters
- LF line endings

## Important Notes

### Web Framework Support
- Primary: Koa (via @artusx/plugin-koa)
- Also supported: Express, Nest
- HTTP routing with `find-my-way` router
- Middleware pipeline using `@artus/pipeline`

### Environment Variables
- `ARTUS_SERVER_ENV`: Set environment (development/production)
- Node version requirement: >=18.x
- Uses dotenv for configuration

### Plugin Development
When creating new plugins:
1. Use `rush create --name <name> --type plugins --rush`
2. Implement lifecycle hooks (didLoad, willReady, didReady)
3. Add configuration in `src/config/`
4. Export from `src/index.ts`
5. Add tests with Jest
6. Update version policies if needed in `common/config/rush/version-policies.json`

### Application Bootstrap
Applications use `@artusx/utils` bootstrap:
```typescript
import { bootstrap } from '@artusx/utils';

const app = await bootstrap({
  root: __dirname,
  configDir: 'config',
});
```