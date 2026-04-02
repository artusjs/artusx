# Plugin Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade 7 ArtusX plugin dependencies to latest versions and verify functionality through application testing

**Architecture:** Parallel multi-agent execution with risk-based grouping (Low Risk → Medium Risk → High Risk). Each agent handles plugin upgrade, code adaptation, and verification independently.

**Tech Stack:** Rush.js monorepo, pnpm workspace, TypeScript, Jest, Artus.js framework plugins

---

## File Structure

**Plugin packages to upgrade:**
- `packages/plugins/ejs/` - EJS template engine (low risk)
- `packages/plugins/grpc/` - gRPC service (low risk)
- `packages/plugins/log4js/` - Logging (low risk, no version change)
- `packages/plugins/nunjucks/` - Nunjucks template engine (low risk, no version change)
- `packages/plugins/schedule/` - Cron scheduling (medium risk, major version)
- `packages/plugins/proxy/` - SOCKS proxy (medium risk, major version)
- `packages/plugins/koa/` - Koa web framework (high risk, major version)

**Verification applications:**
- `packages/apps/artusx-koa/` - Primary test application (ejs, log4js, koa, schedule)
- `packages/apps/artusx-grpc/` - gRPC test application

**Key files per plugin:**
- `package.json` - Dependency version definitions
- `src/client.ts` - Main client implementation (may need API adaptation)
- `src/lifecycle.ts` - Lifecycle hooks (minimal changes expected)

---

## Phase 1: Low Risk Group (Parallel Execution)

### Task 1: Upgrade EJS Plugin (3.1.9 → 3.2.0)

**Files:**
- Modify: `packages/plugins/ejs/package.json:49`
- Verify: `packages/apps/artusx-koa/` (uses EJS for template rendering)

- [ ] **Step 1: Update package.json dependency version**

```json
// packages/plugins/ejs/package.json
// Change line 49 from:
"ejs": "~3.1.9"
// To:
"ejs": "~3.2.0"
```

- [ ] **Step 2: Run rush update to fetch new dependency**

Run: `rush update`
Expected: No dependency conflicts, ejs@3.2.0 installed

- [ ] **Step 3: Build ejs plugin**

Run: `rush rebuild -t @artusx/plugin-ejs`
Expected: Build succeeds, TypeScript compiles without errors

- [ ] **Step 4: Verify artusx-koa application**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Expected: Application starts successfully, visit http://localhost:3000 to verify template rendering

- [ ] **Step 5: Commit ejs upgrade**

```bash
git add packages/plugins/ejs/package.json
git commit -m "upgrade(plugin-ejs): update ejs from 3.1.9 to 3.2.0"
```

---

### Task 2: Upgrade gRPC Plugin (1.10.3 → 1.14.3)

**Files:**
- Modify: `packages/plugins/grpc/package.json:53,54` (grpc-js and proto-loader)
- Verify: `packages/apps/artusx-grpc/`

- [ ] **Step 1: Update package.json dependency versions**

```json
// packages/plugins/grpc/package.json
// Change lines 53-54 from:
"@grpc/grpc-js": "~1.10.3",
"@grpc/proto-loader": "~0.7.10",
// To:
"@grpc/grpc-js": "~1.14.3",
"@grpc/proto-loader": "~0.7.13",
```

- [ ] **Step 2: Run rush update to fetch new dependencies**

Run: `rush update`
Expected: No dependency conflicts, grpc-js@1.14.3 installed

- [ ] **Step 3: Build grpc plugin**

Run: `rush rebuild -t @artusx/plugin-grpc`
Expected: Build succeeds, TypeScript compiles without errors

- [ ] **Step 4: Verify artusx-grpc application**

Run:
```bash
cd packages/apps/artusx-grpc
rushx dev
```
Expected: Application starts successfully, gRPC server runs without errors

- [ ] **Step 5: Commit grpc upgrade**

```bash
git add packages/plugins/grpc/package.json
git commit -m "upgrade(plugin-grpc): update grpc-js to 1.14.3 and proto-loader to 0.7.13"
```

---

### Task 3: Verify log4js Plugin (No Version Change)

**Files:**
- Verify: `packages/plugins/log4js/package.json:49` (version 6.9.1 already latest)
- Verify: `packages/apps/artusx-koa/` (uses log4js for logging)

- [ ] **Step 1: Confirm log4js is already at latest version**

Run: `npm view log4js version`
Expected: Output shows 6.9.1, matching current package.json

- [ ] **Step 2: Build log4js plugin**

Run: `rush rebuild -t @artusx/plugin-log4js`
Expected: Build succeeds (no changes needed)

- [ ] **Step 3: Verify log4js functionality in artusx-koa**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Expected: Application logs appear correctly, log4js integration works

- [ ] **Step 4: No commit needed**

Note: log4js already at latest version, no changes required

---

### Task 4: Verify nunjucks Plugin (No Version Change)

**Files:**
- Verify: `packages/plugins/nunjucks/package.json:49` (version 3.2.4 already latest)

- [ ] **Step 1: Confirm nunjucks is already at latest version**

Run: `npm view nunjucks version`
Expected: Output shows 3.2.4, matching current package.json

- [ ] **Step 2: Build nunjucks plugin**

Run: `rush rebuild -t @artusx/plugin-nunjucks`
Expected: Build succeeds (no changes needed)

- [ ] **Step 3: No commit needed**

Note: nunjucks already at latest version, no changes required

---

### Task 5: Phase 1 Integration Check

**Files:**
- All Phase 1 plugins

- [ ] **Step 1: Run full rebuild for low-risk group**

Run: `rush rebuild -t @artusx/plugin-ejs -t @artusx/plugin-grpc -t @artusx/plugin-log4js -t @artusx/plugin-nunjucks`
Expected: All plugins build successfully

- [ ] **Step 2: Verify no dependency conflicts**

Run: `rush update`
Expected: No warnings or errors, pnpm-lock.yaml stable

- [ ] **Step 3: Test artusx-koa application integration**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Expected: Application starts successfully with all low-risk plugins integrated

- [ ] **Step 4: Create Phase 1 summary commit**

```bash
git add -A
git commit -m "feat(phase-1): complete low-risk plugin upgrades

- ejs: 3.1.9 → 3.2.0
- grpc: grpc-js 1.10.3 → 1.14.3
- log4js: already latest (6.9.1)
- nunjucks: already latest (3.2.4)

All plugins verified with artusx-koa and artusx-grpc applications"
```

---

## Phase 2: Medium Risk Group (Parallel Execution)

### Task 6: Research cron 4.x Breaking Changes

**Files:**
- Research: cron package changelog and migration guide
- Modify: `packages/plugins/schedule/src/client.ts` (potential API adaptation)

- [ ] **Step 1: Check cron 4.x release notes**

Run:
```bash
npm view cron versions --json | tail -20
npm view cron@4.4.0 --json | grep -A 10 "readme"
```
Expected: Identify breaking changes between 3.x and 4.x

- [ ] **Step 2: Review cron 4.x migration guide**

Web search or documentation check for:
- API signature changes
- Constructor changes
- Deprecated methods
- New required parameters

- [ ] **Step 3: Check current schedule plugin implementation**

Read: `packages/plugins/schedule/src/client.ts`
Expected: Identify code that may need adaptation for cron 4.x

---

### Task 7: Upgrade Schedule Plugin (3.1.6 → 4.4.0)

**Files:**
- Modify: `packages/plugins/schedule/package.json:49` (cron version)
- Modify: `packages/plugins/schedule/src/client.ts` (API adaptation if needed)
- Modify: `packages/plugins/schedule/src/types.ts` (type updates if needed)
- Verify: `packages/apps/artusx-koa/`

- [ ] **Step 1: Update package.json dependency version**

```json
// packages/plugins/schedule/package.json
// Change line 49 from:
"cron": "~3.1.6"
// To:
"cron": "~4.4.0"

// Change line 54 from:
"@types/cron": "~2.4.0"
// To:
"@types/cron": "~4.4.0"
```

- [ ] **Step 2: Run rush update to fetch new dependency**

Run: `rush update`
Expected: cron@4.4.0 installed, check for peer dependency warnings

- [ ] **Step 3: Read current client implementation**

Read: `packages/plugins/schedule/src/client.ts`
Expected: Understand current cron API usage patterns

- [ ] **Step 4: Adapt code for cron 4.x API changes**

```typescript
// packages/plugins/schedule/src/client.ts
// Adjust cron constructor and method calls based on 4.x API
// Example potential changes (actual changes depend on research):

// If constructor signature changed:
import { CronJob } from 'cron';

// Update job creation to match new API:
const job = new CronJob(
  cronExpression,
  onTick,
  onComplete,
  start,
  timezone,
  // Add any new required parameters for 4.x
);
```

- [ ] **Step 5: Build schedule plugin**

Run: `rush rebuild -t @artusx/plugin-schedule`
Expected: TypeScript compiles successfully, no type errors

- [ ] **Step 6: Verify schedule functionality in artusx-koa**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Expected: Application starts, scheduled tasks execute correctly

- [ ] **Step 7: Commit schedule upgrade**

```bash
git add packages/plugins/schedule/package.json packages/plugins/schedule/src/
git commit -m "upgrade(plugin-schedule): update cron from 3.1.6 to 4.4.0

Adapted client implementation for cron 4.x API changes"
```

---

### Task 8: Research socks-proxy-agent 10.x Breaking Changes

**Files:**
- Research: socks-proxy-agent package changelog
- Modify: `packages/plugins/proxy/src/client.ts` (potential API adaptation)

- [ ] **Step 1: Check socks-proxy-agent 10.x release notes**

Run:
```bash
npm view socks-proxy-agent versions --json | tail -20
npm view socks-proxy-agent@10.0.0 --json | grep -A 10 "readme"
```
Expected: Identify breaking changes between 8.x and 10.x

- [ ] **Step 2: Review socks-proxy-agent migration guide**

Web search or documentation check for:
- Constructor changes
- API signature changes
- Configuration option changes

- [ ] **Step 3: Check current proxy plugin implementation**

Read: `packages/plugins/proxy/src/client.ts`
Expected: Identify code that may need adaptation

---

### Task 9: Upgrade Proxy Plugin (8.0.2 → 10.0.0)

**Files:**
- Modify: `packages/plugins/proxy/package.json:49` (socks-proxy-agent version)
- Modify: `packages/plugins/proxy/src/client.ts` (API adaptation if needed)
- Verify: Standalone proxy functionality test

- [ ] **Step 1: Update package.json dependency version**

```json
// packages/plugins/proxy/package.json
// Change line 49 from:
"socks-proxy-agent": "~8.0.2"
// To:
"socks-proxy-agent": "~10.0.0"
```

- [ ] **Step 2: Run rush update to fetch new dependency**

Run: `rush update`
Expected: socks-proxy-agent@10.0.0 installed

- [ ] **Step 3: Read current client implementation**

Read: `packages/plugins/proxy/src/client.ts`
Expected: Understand current proxy agent usage

- [ ] **Step 4: Adapt code for socks-proxy-agent 10.x API**

```typescript
// packages/plugins/proxy/src/client.ts
// Update imports and constructor usage for 10.x API
// Example potential changes:

import { SocksProxyAgent } from 'socks-proxy-agent';

// Update agent creation to match new API:
const agent = new SocksProxyAgent(proxyUrl, {
  // Add any new configuration options for 10.x
});
```

- [ ] **Step 5: Build proxy plugin**

Run: `rush rebuild -t @artusx/plugin-proxy`
Expected: TypeScript compiles successfully

- [ ] **Step 6: Test proxy functionality**

Note: Since proxy is utility plugin, create simple test script or use in application that requires proxy

- [ ] **Step 7: Commit proxy upgrade**

```bash
git add packages/plugins/proxy/package.json packages/plugins/proxy/src/
git commit -m "upgrade(plugin-proxy): update socks-proxy-agent from 8.0.2 to 10.0.0

Adapted client implementation for socks-proxy-agent 10.x API changes"
```

---

### Task 10: Phase 2 Integration Check

**Files:**
- All Phase 2 plugins

- [ ] **Step 1: Run full rebuild for medium-risk group**

Run: `rush rebuild -t @artusx/plugin-schedule -t @artusx/plugin-proxy`
Expected: Both plugins build successfully

- [ ] **Step 2: Verify no dependency conflicts**

Run: `rush update`
Expected: No warnings or errors

- [ ] **Step 3: Test artusx-koa with schedule plugin**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Expected: Application starts successfully with schedule functionality working

- [ ] **Step 4: Create Phase 2 summary commit**

```bash
git add -A
git commit -m "feat(phase-2): complete medium-risk plugin upgrades

- schedule: cron 3.1.6 → 4.4.0 (API adapted)
- proxy: socks-proxy-agent 8.0.2 → 10.0.0 (API adapted)

All plugins verified successfully"
```

---

## Phase 3: High Risk Group (Single Execution)

### Task 11: Research Koa 3.x Breaking Changes

**Files:**
- Research: Koa 3.x migration guide and changelog
- Modify: `packages/plugins/koa/src/koa/application.ts` (potential API adaptation)
- Modify: `packages/plugins/koa/src/pipeline.ts` (potential middleware changes)

- [ ] **Step 1: Check Koa 3.x release notes**

Run:
```bash
npm view koa versions --json | tail -20
npm view koa@3.2.0 --json | grep -A 20 "readme"
```
Expected: Identify major breaking changes

- [ ] **Step 2: Search for Koa 2.x to 3.x migration guide**

Web search: "Koa 3.x migration guide breaking changes"
Expected: Find official documentation on API changes

- [ ] **Step 3: Read key Koa 3.x changes**

Focus areas:
- Constructor signature changes
- Middleware API changes
- Context object changes
- Request/response API changes
- New async patterns

- [ ] **Step 4: Check current koa plugin implementation**

Read: `packages/plugins/koa/src/koa/application.ts`
Read: `packages/plugins/koa/src/pipeline.ts`
Expected: Identify code requiring adaptation

---

### Task 12: Evaluate Koa 3.x Upgrade Impact

**Files:**
- Analyze: `packages/plugins/koa/` entire plugin
- Analyze: `packages/apps/artusx-koa/` application usage

- [ ] **Step 1: Compare koa 2.x vs 3.x API**

Document all breaking changes found:
1. Constructor signature
2. Middleware signature
3. Context/request/response methods
4. Deprecations and removals

- [ ] **Step 2: Assess impact on plugin code**

List files requiring changes:
- `src/koa/application.ts` - Koa constructor usage
- `src/pipeline.ts` - Middleware handling
- `src/decorator.ts` - Route decorators (minimal impact expected)

- [ ] **Step 3: Assess impact on application code**

Check: `packages/apps/artusx-koa/src/`
Expected: Identify application-level changes needed

- [ ] **Step 4: Make upgrade decision**

Based on impact assessment:
- Option A: Proceed with koa 3.x upgrade (if changes are manageable)
- Option B: Upgrade to koa 2.x latest (2.15.3) instead (if 3.x too disruptive)

Note: This is critical decision point requiring user input if impact is severe

---

### Task 13: Upgrade Koa Plugin (2.15.0 → 3.2.0)

**Files:**
- Modify: `packages/plugins/koa/package.json:66` (koa version)
- Modify: `packages/plugins/koa/src/koa/application.ts:17-19` (constructor)
- Modify: `packages/plugins/koa/src/pipeline.ts` (middleware if needed)
- Verify: `packages/apps/artusx-koa/`

- [ ] **Step 1: Update package.json dependency version**

```json
// packages/plugins/koa/package.json
// Change line 66 from:
"koa": "^2.15.0"
// To:
"koa": "^3.2.0"

// Also update types:
// Change line 72 from:
"@types/koa": "^2.13.12"
// To appropriate version for koa 3.x
```

- [ ] **Step 2: Run rush update to fetch new dependency**

Run: `rush update`
Expected: koa@3.2.0 installed, check for type compatibility issues

- [ ] **Step 3: Adapt application.ts for koa 3.x constructor**

```typescript
// packages/plugins/koa/src/koa/application.ts
// Current constructor (lines 14-20):

constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
  const conf = config.artusx as ArtusXConfig;
  const keys = process.env.KOA_KEYS?.split(',') ?? conf.keys?.split(',') ?? ['artusx'];
  super({
    keys,
  });
}

// Update for koa 3.x if constructor signature changed:
// Example potential changes (actual depends on research):

constructor(@Inject(ArtusInjectEnum.Config) public config: any) {
  const conf = config.artusx as ArtusXConfig;
  const keys = process.env.KOA_KEYS?.split(',') ?? conf.keys?.split(',') ?? ['artusx'];
  // Update super() call for koa 3.x API
  super({
    keys,
    // Add new koa 3.x options if required
  });
}
```

- [ ] **Step 4: Adapt pipeline.ts middleware handling**

```typescript
// packages/plugins/koa/src/pipeline.ts
// Update middleware composition for koa 3.x if needed
// Check for middleware signature changes

// Example potential changes:
import compose from 'koa-compose';

// Update middleware composition to match koa 3.x API
const middlewareChain = compose(middlewares);
```

- [ ] **Step 5: Build koa plugin**

Run: `rush rebuild -t @artusx/plugin-koa`
Expected: TypeScript compiles, fix any type errors

- [ ] **Step 6: Test koa plugin basic functionality**

Run:
```bash
cd packages/plugins/koa
rushx test
```
Expected: Tests pass (or fix test failures for koa 3.x)

- [ ] **Step 7: Verify artusx-koa application**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Expected: Application starts successfully, HTTP routes work correctly

- [ ] **Step 8: Full functionality test**

Test checklist:
- Application starts without errors
- HTTP endpoints respond correctly
- Middleware executes in correct order
- Error handling works
- Static file serving works (if applicable)

- [ ] **Step 9: Commit koa upgrade**

```bash
git add packages/plugins/koa/package.json packages/plugins/koa/src/
git commit -m "upgrade(plugin-koa): update koa from 2.15.0 to 3.2.0

Major version upgrade with API adaptations:
- Updated constructor for koa 3.x
- Adapted middleware handling
- Updated type definitions

Verified with artusx-koa application"
```

---

### Task 14: Alternative - Upgrade Koa to 2.x Latest (If 3.x Too Disruptive)

**Files:**
- Modify: `packages/plugins/koa/package.json:66`

- [ ] **Step 1: Update to koa 2.x latest version**

```json
// packages/plugins/koa/package.json
// Change line 66 from:
"koa": "^2.15.0"
// To:
"koa": "^2.15.3"
```

- [ ] **Step 2: Run rush update**

Run: `rush update`
Expected: koa@2.15.3 installed (minimal risk)

- [ ] **Step 3: Build and verify**

Run:
```bash
rush rebuild -t @artusx/plugin-koa
cd packages/apps/artusx-koa
rushx dev
```
Expected: No issues, stable upgrade within 2.x series

- [ ] **Step 4: Commit conservative upgrade**

```bash
git add packages/plugins/koa/package.json
git commit -m "upgrade(plugin-koa): update koa to 2.15.3 (conservative)

Decided to stay on koa 2.x series due to 3.x breaking changes impact"
```

---

### Task 15: Phase 3 Integration Check

**Files:**
- All Phase 3 changes

- [ ] **Step 1: Run full rebuild for koa**

Run: `rush rebuild -t @artusx/plugin-koa`
Expected: Build succeeds

- [ ] **Step 2: Verify no dependency conflicts**

Run: `rush update`
Expected: No warnings or errors

- [ ] **Step 3: Full artusx-koa application test**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Test all functionality:
- HTTP server starts
- Routes respond correctly
- Templates render (ejs)
- Logs output (log4js)
- Scheduled tasks execute (schedule)

- [ ] **Step 4: Create Phase 3 summary commit**

```bash
git add -A
git commit -m "feat(phase-3): complete high-risk plugin upgrade

- koa: 2.15.0 → 3.2.0 (or 2.15.3 if conservative)

Verified with full artusx-koa application test suite"
```

---

## Phase 4: Final Integration and Verification

### Task 16: Full Project Rebuild

**Files:**
- All upgraded plugins

- [ ] **Step 1: Run complete rush rebuild**

Run: `rush rebuild`
Expected: All packages build successfully without errors

- [ ] **Step 2: Verify pnpm lock file stability**

Run: `rush update --purge && rush update`
Expected: pnpm-lock.yaml regenerates cleanly, no conflicts

- [ ] **Step 3: Check for peer dependency warnings**

Run: `rush update`
Expected: No peer dependency warnings or errors

---

### Task 17: Full Application Verification Suite

**Files:**
- All test applications

- [ ] **Step 1: Test artusx-koa application**

Run:
```bash
cd packages/apps/artusx-koa
rushx dev
```
Test checklist:
- Server starts on port 3000
- HTTP GET/POST routes work
- EJS templates render correctly
- Log4js outputs logs
- Schedule tasks execute
- No runtime errors

- [ ] **Step 2: Test artusx-grpc application**

Run:
```bash
cd packages/apps/artusx-grpc
rushx dev
```
Test checklist:
- gRPC server starts
- gRPC methods respond correctly
- No runtime errors

- [ ] **Step 3: Run any existing plugin tests**

Run:
```bash
cd packages/plugins/koa
rushx test
```
Expected: Tests pass (or documented failures)

- [ ] **Step 4: Document any remaining issues**

Create list of:
- Known issues or limitations
- Deprecations to address later
- Future upgrade considerations

---

### Task 18: Create Final Upgrade Report

**Files:**
- Create: `prd/report/2026-04-03-plugin-upgrade-report.md`

- [ ] **Step 1: Write upgrade report**

```markdown
# Plugin Upgrade Completion Report

**Date:** 2026-04-03
**Status:** [Success/Partial/Failed]

## Upgrade Summary

| Plugin | From | To | Status | Issues |
|--------|------|-----|--------|---------|
| ejs | 3.1.9 | 3.2.0 | ✅ Success | None |
| grpc-js | 1.10.3 | 1.14.3 | ✅ Success | None |
| log4js | 6.9.1 | 6.9.1 | ✅ No change | None |
| nunjucks | 3.2.4 | 3.2.4 | ✅ No change | None |
| cron | 3.1.6 | 4.4.0 | ✅ Success | Document specific API changes and any runtime warnings observed |
| socks-proxy-agent | 8.0.2 | 10.0.0 | ✅ Success | Document any configuration changes required |
| koa | 2.15.0 | 3.2.0 | ✅ Success | Document all breaking changes and code adaptations made |

## Verification Results

- **artusx-koa:**
  - Status: ✅ Pass / ❌ Fail
  - HTTP Server: Document startup success/failure and port
  - Routes: Document which endpoints were tested (GET, POST, etc.)
  - Templates: Document EJS rendering success and specific pages tested
  - Logs: Document log4js output format and destinations
  - Schedule: Document which cron jobs were tested and execution results
  - Runtime Errors: Document any errors encountered during testing

- **artusx-grpc:**
  - Status: ✅ Pass / ❌ Fail
  - gRPC Server: Document startup success/failure
  - Methods: Document which gRPC methods were called and responses
  - Runtime Errors: Document any errors encountered during testing

## Breaking Changes Handled

List each breaking change identified and the specific code adaptations made:

1. **cron 4.x:** Document the API signature changes found and how client.ts was updated
2. **socks-proxy-agent 10.x:** Document constructor or configuration changes and adaptations
3. **koa 3.x:** Document all breaking changes (constructor, middleware, context) and code updates

Example format:
- Breaking Change: CronJob constructor signature changed
- Original Code: `new CronJob(expression, onTick, onComplete, start, timezone)`
- Adapted Code: `new CronJob(expression, onTick, { onComplete, start, timezone })`

## Known Issues

List any issues that remain after upgrade completion:

1. Deprecation warnings observed during build or runtime
2. Type definition mismatches requiring manual fixes
3. Test failures that need future attention
4. Features that work but may need refinement

## Recommendations

Document recommendations for future work:

1. Consider creating comprehensive test suite for plugins lacking tests
2. Monitor upstream releases for security patches
3. Plan next major version upgrades based on ecosystem stability
4. Document migration patterns for similar future upgrades
```

- [ ] **Step 2: Save report**

Write report to: `prd/report/2026-04-03-plugin-upgrade-report.md`

- [ ] **Step 3: Commit report**

```bash
git add prd/report/2026-04-03-plugin-upgrade-report.md
git commit -m "docs: add plugin upgrade completion report"
```

---

### Task 19: Final Git Status and Push

**Files:**
- All upgrade commits

- [ ] **Step 1: Review commit history**

Run: `git log --oneline --graph -20`
Expected: Clean commit history with all upgrade phases documented

- [ ] **Step 2: Check final git status**

Run: `git status`
Expected: No uncommitted changes, working tree clean

- [ ] **Step 3: Push to remote (if requested)**

Run: `git push origin main`
Expected: All commits pushed successfully

- [ ] **Step 4: Create final summary commit**

```bash
git add -A
git commit -m "feat: complete ArtusX plugin dependency upgrade project

Successfully upgraded 7 plugins to latest versions:
- Low Risk: ejs 3.2.0, grpc 1.14.3
- Medium Risk: cron 4.4.0, socks-proxy-agent 10.0.0  
- High Risk: koa 3.2.0

All plugins verified with artusx-koa and artusx-grpc applications
All tests passing, no dependency conflicts

Co-authored-by: Superpowers Multi-Agent Team"
```

---

## Success Criteria Checklist

Before marking project complete, verify:

- [ ] All 7 plugins upgraded to target versions (or documented alternatives)
- [ ] `rush rebuild` succeeds for all packages
- [ ] `rush update` shows no dependency conflicts
- [ ] artusx-koa application starts and runs correctly
- [ ] artusx-grpc application starts and runs correctly
- [ ] All API breaking changes adapted in plugin code
- [ ] Git commit history documents all upgrade phases
- [ ] Upgrade report written to `prd/report/`
- [ ] No regressions in existing functionality

---

## Notes

- **Breaking Changes:** Each major version upgrade (cron, socks-proxy-agent, koa) requires careful API review before implementation
- **Fallback Option:** If koa 3.x proves too disruptive, use Task 14 for conservative 2.x upgrade
- **User Decisions:** Critical decision points (especially koa upgrade) may require user input
- **Parallel Execution:** Phase 1 and Phase 2 tasks can run concurrently using subagent-driven-development