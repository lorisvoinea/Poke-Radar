---
stepsCompleted: ['step-01-load-context', 'step-02-discover-tests', 'step-03f-aggregate-scores', 'step-04-generate-report']
lastStep: 'step-04-generate-report'
lastSaved: '2026-07-24'
workflowType: 'testarch-test-review'
inputDocuments:
  - _bmad/tea/config.yaml
  - ui/package.json
  - ui/vitest.config.ts
  - ui/playwright.config.ts
  - src-tauri/Cargo.toml
---
# Test Quality Review: Poke-Radar Test Suite

**Quality Score**: 51/100 (F - Needs Improvement)  
**Review Date**: 2026-07-24  
**Review Scope**: suite  
**Reviewer**: Murat / BMad TEA Agent

> This review audits existing tests; it does not generate tests. Coverage mapping and coverage gates are out of scope here. Use `trace` for coverage decisions.

## Executive Summary

**Overall Assessment**: Needs Improvement  
**Recommendation**: Request Changes

### Key Strengths

✅ No hard waits were found in reviewed Playwright/Vitest tests.  
✅ Isolation is strong overall: component tests generally clean Tauri bridge state, Playwright uses per-test `page`, and Rust tests use temp directories.  
✅ Performance risk is low: no serial-only tests, no `page.$$` selectors, and no measured slow tests because execution was not requested.

### Key Weaknesses

❌ Maintainability is the dominant risk: large, broad files and duplicated Tauri mock setup make tests expensive to change.  
❌ Several assertions rely on styling classes or DOM traversal (`locator('..')`, `.status-pill`, `.active-badge`, `.product-option strong`) that can flake after harmless markup changes.  
❌ The suite has uneven priority/test metadata: Playwright ATDD and one reload test carry P-markers, but most Vitest/Rust tests do not.

### Summary

The suite gives useful regression signal, but I would not treat it as a clean merge gate without targeted remediation. The high-value path is not more coverage first; it is stabilizing selectors and extracting reusable test fixtures/builders so the existing coverage remains trustworthy.

## Quality Criteria Assessment

| Criterion | Status | Violations | Notes |
|---|---:|---:|---|
| Hard Waits | ✅ PASS | 0 | No `waitForTimeout` / sleep anti-pattern found. |
| Determinism / selector stability | ❌ FAIL | 21 MEDIUM | CSS-class and parent-traversal selectors create flake risk. |
| Isolation | ✅ PASS | 3 LOW | No high/medium isolation issues. |
| Fixture Patterns | ⚠️ WARN | Multiple | Tauri mocks are duplicated instead of fixture/helper based. |
| Data Factories | ❌ FAIL | Multiple | Repeated product/profile/reference literals should move to builders. |
| Explicit Assertions | ✅ PASS | 0 | Assertions are visible in test bodies. |
| Test Length (≤300 lines) | ❌ FAIL | 1 file >300 | `strategy-page.test.tsx` has 345+ lines. |
| Test Duration (≤1.5 min) | ⚠️ WARN | Not measured | Static scan found no hard waits. |

**Total Violations**: 0 Critical, 7 High, 21 Medium, 8 Low

## Quality Score Breakdown

| Dimension | Weight | Score | Grade |
|---|---:|---:|---|
| Determinism | 30% | 10/100 | F |
| Isolation | 30% | 94/100 | A |
| Maintainability | 25% | 21/100 | F |
| Performance | 15% | 94/100 | A |

Weighted final score: **51/100 (F)**.

## Critical Issues / Must Fix

### 1. Extract duplicated Tauri bridge mocks and data builders

**Severity**: P1 (High)  
**Locations**: `ui/e2e/strategy-persistence.spec.ts:17`, `ui/src/__tests__/strategy-page.test.tsx:40`, `ui/src/__tests__/strategy-page.test.tsx:56`  
**Criterion**: Maintainability / fixture patterns  
**Knowledge Base**: `data-factories.md`, `test-quality.md`, `fixtures-composition.md`

E2E and component tests repeatedly inline Tauri `invoke` dispatch branches and large product/reference/profile object literals. Every behavior change now requires editing many mock blocks, increasing false positives and stale fixture risk.

For Vitest component tests, centralize the bridge mock with `vi.fn` so assertions can inspect calls:

```ts
const installTauriMock = (handlers: Record<string, unknown>) => {
  const invoke = vi.fn(async (command: string, args?: Record<string, unknown>) => {
    const handler = handlers[command];
    if (typeof handler === "function") return handler(args);
    if (handler !== undefined) return handler;
    throw new Error(`Unexpected Tauri command: ${command}`);
  });
  window.__TAURI_INTERNALS__ = { invoke };
  return invoke;
};
```

For Playwright E2E tests that install the mock through `page.addInitScript`, do not reference Vitest globals. Use a plain async function inside the browser context instead:

```ts
await page.addInitScript((handlers) => {
  window.__TAURI_INTERNALS__ = {
    invoke: async (command, args) => {
      const handler = handlers[command];
      if (typeof handler === "function") return handler(args);
      if (handler !== undefined) return handler;
      throw new Error(`Unexpected Tauri command: ${command}`);
    },
  };
}, handlers);
```

### 2. Replace brittle selectors with semantic locators or stable test ids

**Severity**: P1 (High)  
**Locations**: `ui/e2e/strategy-persistence.spec.ts:73`, `ui/e2e/strategy-persistence.spec.ts:122`, `ui/e2e/strategy-persistence.spec.ts:167`, `ui/src/__tests__/strategy-page.test.tsx:53`, `ui/src/__tests__/strategy-page.test.tsx:80`  
**Criterion**: Determinism / flakiness prevention  
**Knowledge Base**: `selector-resilience.md`, `test-quality.md`, `playwright-cli.md`

Several tests assert behavior through CSS classes and DOM ancestry. Styling hooks and nesting are implementation details; tests should normally assert user-visible semantics.

```ts
const profile = page.getByRole("listitem", { name: /Profil Actif Principal/ });
await expect(profile.getByText("Actif", { exact: true })).toBeVisible();
```

### 3. Split or reorganize oversized/broad suites

**Severity**: P1 (High)  
**Locations**: `ui/src/__tests__/strategy-page.test.tsx:17`, `src-tauri/tests/profile_persistence.rs:11`, `ui/e2e/strategy-persistence.spec.ts:14`  
**Criterion**: Test length / maintainability  
**Knowledge Base**: `test-quality.md`, `test-levels-framework.md`

`strategy-page.test.tsx` is the biggest risk because it mixes browser-mode rendering, Tauri product/reference behavior, refresh races, profile persistence, keyboard/touch checks, and free-text validation in one describe block. Split by behavior area.

## Recommendations / Should Fix

1. Wrap `strategy-responsive.spec.ts` in `test.describe(...)` and promote `320` / `44` to named constants.
2. Freeze or factory-create shared fixture objects such as `references` in `product-configurator.test.tsx`.
3. If Playwright `fullyParallel` is not globally enabled, opt independent E2E describe blocks into `test.describe.configure({ mode: 'parallel' })` after confirming isolation.
4. Normalize test metadata: either apply P0/P1/P2 markers consistently to story-level tests or document that only acceptance-test artifacts carry priority markers.
5. Keep full-page `StrategyPage` renders for integration behavior; prefer focused component tests for narrow component behavior.

## Best Practices Found

- No hard waits in browser tests.
- Rust persistence tests use `tempdir()` and isolated database paths.
- Most RTL suites call `cleanup()` and delete `window.__TAURI_INTERNALS__` in `afterEach`.

## Test File Analysis

| File | Framework | Tests | Lines | Risk |
|---|---|---:|---:|---|
| `ui/e2e/strategy-persistence.spec.ts` | Playwright | 3 | 181 | High maintainability + selector brittleness |
| `ui/e2e/strategy-responsive.spec.ts` | Playwright | 1 | 49 | Low isolation/maintainability polish |
| `ui/src/__tests__/boot-page.test.tsx` | Vitest/RTL | 3 | 55 | Low risk |
| `ui/src/__tests__/product-configurator.test.tsx` | Vitest/RTL | 7 | 92 | Low shared fixture risk |
| `ui/src/__tests__/strategy-form.test.tsx` | Vitest/RTL | 9 | 152 | Moderate size, acceptable |
| `ui/src/__tests__/strategy-page.test.tsx` | Vitest/RTL | 12 | 345 | Highest maintainability risk |
| `ui/src/__tests__/strategy-reload-ui.test.tsx` | Vitest/RTL | 2 | 59 | Low risk |
| `ui/src/__tests__/strategy-user-flow.e2e.test.tsx` | Vitest/RTL | 2 | 58 | Selector naming mismatch: `.e2e` but not browser E2E |
| `src-tauri/tests/first_launch.rs` | Rust cargo test | 1 | 33 | Low risk |
| `src-tauri/tests/profile_persistence.rs` | Rust cargo test | 3 | 157 | Moderate maintainability risk |

## Context and Integration

Related artifacts found: sprint status, test summary, automation summary, traceability matrix, and gate decision outputs. Coverage mapping and gate decision evidence were intentionally not scored in this review.

## Knowledge Base References

Consulted fragments included `test-quality.md`, `data-factories.md`, `test-levels-framework.md`, `selective-testing.md`, `test-healing-patterns.md`, `selector-resilience.md`, `timing-debugging.md`, Playwright Utils fragments, and `playwright-cli.md`.

## Validation Notes

- CLI sessions cleaned up: N/A — `playwright-cli` is not installed, so no browser session was opened.
- Temp worker artifacts were created under `/tmp` as required by the workflow worker contract. Aggregated output is saved here.
- JSON worker outputs validated with `python3 -m json.tool`.

## Decision

**Recommendation**: Request Changes

The tests are valuable and mostly isolated, but the current suite is too brittle and too hard to maintain for a high-confidence gate. Fixing fixture duplication and selector resilience should raise the signal substantially without needing a broad coverage expansion.

## Next Recommended Workflow

Run `TA` to generate/refactor prioritized automation helpers/tests, or run `TR` for coverage mapping and a gate decision.

## Review Metadata

**Generated By**: BMad TEA Agent (Murat)  
**Workflow**: testarch-test-review  
**Review ID**: test-review-suite-20260724  
**Timestamp**: 2026-07-24 00:00:00 UTC  
**Version**: 1.0
