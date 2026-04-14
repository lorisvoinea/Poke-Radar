# BMAD Code Review — 2026-04-13

## Skill note
`bmad-code-review` was requested, but that skill is not listed in the active session skill list. I ran a manual adversarial review using the same intent (bug hunting + edge cases + acceptance checks).

## Scope reviewed
- `ui/src/pages/BootPage.tsx`
- `src-tauri/src/app/commands.rs`
- `src-tauri/src/infrastructure/db/mod.rs`
- `ui/src/__tests__/boot-page.test.tsx`

## Findings

### 1) High — Frontend depends on private Tauri runtime internals
**Where**: `ui/src/pages/BootPage.tsx` lines 21-23 and 31.

The boot flow uses `window.__TAURI_INTERNALS__` directly. This is not a stable, documented public API surface and can change across Tauri runtime updates. A runtime update can therefore break app bootstrap silently before business logic runs.

**Impact**
- Startup can fail after Tauri upgrades even if app code is unchanged.
- Harder to type and mock consistently compared to importing `invoke` from official Tauri API package.

**Recommendation**
- Use `@tauri-apps/api/core` (`invoke`) for production code.
- Keep a tiny adapter wrapper around invoke so tests can mock that adapter, not global window internals.

---

### 2) Medium — No cancellation guard in async boot effect
**Where**: `ui/src/pages/BootPage.tsx` lines 43-59.

`useEffect` launches an async sequence and sets state in `then`/`catch` unconditionally. If the component unmounts quickly (window close, route changes, hot reload), React may attempt state updates on an unmounted component.

**Impact**
- Potential React warnings and nondeterministic UI behavior during teardown.
- Risk increases once boot flow does more network/IO work.

**Recommendation**
- Add `let cancelled = false` and cleanup `return () => { cancelled = true; }`.
- Gate `setStatus`/`setMessage` behind `if (!cancelled)`.

---

### 3) Medium — Missing busy timeout/retry strategy for SQLite lock contention
**Where**: `src-tauri/src/infrastructure/db/mod.rs` lines 48-49 and 72-77 (plus lock failure test at lines 175-197).

Connections are opened and transactions started with default SQLite busy handling. Under realistic desktop conditions (multiple app instances, backup software, antivirus scans), transient DB locks can occur. Current behavior fails fast and blocks app startup.

**Impact**
- Users can see hard startup failures from temporary locks.
- “Retry app” user guidance may become frequent and noisy.

**Recommendation**
- Configure `busy_timeout` on connection initialization.
- Optionally add a bounded retry around migration start with jittered backoff.
- Log lock-specific diagnostics to distinguish permanent vs transient failures.

## Test/verification notes
- UI unit tests pass.
- Rust test suite could not run in this environment because cargo could not download crates via proxy (HTTP 403 from crates index).
