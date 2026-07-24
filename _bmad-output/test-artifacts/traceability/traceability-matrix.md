---
stepsCompleted: ['step-01-load-context', 'step-02-discover-tests', 'step-03-map-criteria', 'step-04-analyze-gaps', 'step-05-gate-decision']
lastStep: 'step-05-gate-decision'
lastSaved: '2026-07-23T17:54:00Z'
tempCoverageMatrixPath: '/tmp/tea-trace-coverage-matrix-2026-07-23T17-51-00.json'
coverageBasis: 'acceptance_criteria'
oracleConfidence: 'high'
oracleResolutionMode: 'formal_requirements'
oracleSources:
  - '_bmad-output/planning-artifacts/epics.md'
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
externalPointerStatus: 'not_used'
test_framework: 'vitest+playwright+rust-integration'
---

# Traceability Matrix — Epic 1: Configurer le cockpit de surveillance

## Step 1: Resolve Coverage Oracle & Load Knowledge Base

### Oracle Resolution

**Resolved Oracle:** Formal requirements — acceptance criteria from Epic 1 stories (epics.md)

**Resolution Mode:** `formal_requirements` — detailed acceptance criteria found in project planning artifacts.

**Confidence:** `high` — all 3 stories complete with Given/When/Then acceptance criteria, mapped to FR-01 and FR-02 from PRD.

### Source Artifacts

| Artifact | Purpose | Status |
|----------|---------|--------|
| `_bmad-output/planning-artifacts/epics.md` | Epic breakdown with full ACs for stories 1.1, 1.2, 1.3 | ✅ Loaded |
| `_bmad-output/planning-artifacts/prd.md` | Product requirements (FR-01, FR-02) | ✅ Available |
| `_bmad-output/planning-artifacts/architecture.md` | Architecture decisions (AD-5 SQLite, AD-13 unit tests) | ✅ Available |
| `_bmad-output/implementation-artifacts/sprint-status.yaml` | Sprint status (all Epic 1 stories completed) | ✅ Available |
| `_bmad-output/implementation-artifacts/epic-1-retro-2026-07-23.md` | Epic 1 retrospective | ✅ Available |

### Acceptance Criteria Inventory

| AC ID | Criteria | Priority | Risk Score |
|-------|----------|----------|-------------|
| 1.2-AC1 | Créer/modifier un profil de surveillance → paramètres persistés localement | P0 🔴 | 6 HIGH |
| 1.2-AC2 | Paramètres réutilisés automatiquement au prochain cycle de monitoring | P0 🔴 | 6 HIGH |
| 1.1-AC1 | Backend Rust + UI React opérationnel au premier lancement | P1 🟡 | 3 LOW |
| 1.1-AC2 | SQLite initialisée avec migrations versionnées sans erreur | P1 🟡 | 4 MEDIUM |
| 1.2-AC3 | Écran utilisable de 320px à desktop, pas de scroll horizontal, cibles tactiles ≥44px | P1 🟡 | 4 MEDIUM |
| 1.3-AC1 | Sélectionner des sets/éditions depuis un référentiel avec métadonnées | P1 🟡 | 4 MEDIUM |
| 1.3-AC2 | Saisie libre possible mais signalée comme non normalisée | P2 🟢 | 2 LOW |

---

## Step 2: Discover & Catalog Tests

### 2.1 Tests Discovered — 8 files, 35 tests

#### Integration Tests (Rust — `src-tauri/tests/`)

| ID | Test | File | Level | Covers |
|----|------|------|-------|--------|
| INT-001 | `first_launch_creates_db_and_applies_migration` | `src-tauri/tests/first_launch.rs:7` | Integration | 1.1-AC2 ✅ |
| INT-002 | `profile_roundtrip_survives_restart_simulation` | `src-tauri/tests/profile_persistence.rs:12` | Integration | 1.2-AC1 ✅ |

#### Component Tests (Vitest + Testing Library — `ui/src/__tests__/`)

| ID | Test | File | Level | Covers |
|----|------|------|-------|--------|
| COMP-001 | affiche un état prêt après le boot nominal | `boot-page.test.tsx:15` | Component | 1.1-AC1 ✅ |
| COMP-002 | bloque l'application quand le backend échoue | `boot-page.test.tsx:27` | Component | 1.1-AC1 ✅ |
| COMP-003 | bloque l'application quand Tauri est absent | `boot-page.test.tsx:38` | Component | 1.1-AC1 ✅ |
| COMP-004 | affiche le formulaire stratégie en mode navigateur | `strategy-page.test.tsx:29` | Component | 1.1-AC1 ✅ |
| COMP-005 | expose une structure responsive sans tableau ni largeur fixe | `strategy-page.test.tsx:37` | Component | 1.2-AC3 ✅ |
| COMP-006 | conserve produits et profils quand référentiel indisponible | `strategy-page.test.tsx:45` | Component | 1.2-AC1 ✅ |
| COMP-007 | crée via Tauri puis relit le même identifiant de référence | `strategy-page.test.tsx:62` | Component | 1.3-AC1 ✅ |
| COMP-008 | annonce création acquise si rafraîchissement échoue | `strategy-page.test.tsx:85` | Component | 1.2-AC1 ✅ |
| COMP-009 | conserve instantané cohérent si lecture essentielle échoue | `strategy-page.test.tsx:97` | Component | 1.2-AC1 ✅ |
| COMP-010 | conserve l'indication de référentiel vide/indisponible après création libre | `strategy-page.test.tsx:125` | Component | 1.3-AC2 ✅ |
| COMP-011 | ignore réponse de rafraîchissement plus ancienne arrivée en dernier | `strategy-page.test.tsx:148` | Component | 1.2-AC1 ✅ |
| COMP-012 | propage échec rafraîchissement gagnant à une création supplantée | `strategy-page.test.tsx:177` | Component | 1.2-AC1 ✅ |
| COMP-013 | ignore échec app_ready d'une requête supplantée après refresh gagnant | `strategy-page.test.tsx:207` | Component | 1.2-AC1 ✅ |
| COMP-014 | refuse en mode navigateur un SKU libre déjà présent | `strategy-page.test.tsx:241` | Component | 1.3-AC2 ✅ |
| COMP-015 | préserve contrôles clavier et classes cibles tactiles | `strategy-page.test.tsx:254` | Component | 1.2-AC3 ✅ |
| COMP-016 | affiche les produits libres des profils avec libellé et état | `strategy-page.test.tsx:273` | Component | 1.3-AC2 ✅ |
| COMP-017 | signale explicitement les produits historiques non normalisés | `strategy-form.test.tsx:13` | Component | 1.3-AC2 ✅ |
| COMP-018 | rend validation nom+produit accessible avant soumission | `strategy-form.test.tsx:18` | Component | 1.2-AC1 ✅ |
| COMP-019 | garde le produit obligatoire même quand le nom est renseigné | `strategy-form.test.tsx:27` | Component | 1.2-AC1 ✅ |
| COMP-020 | affiche message actionnable renvoyé par le backend | `strategy-form.test.tsx:36` | Component | 1.2-AC1 ✅ |
| COMP-021 | affiche succès et empêche double soumission concurrente | `strategy-form.test.tsx:48` | Component | 1.2-AC1 ✅ |
| COMP-022 | conserve saisies modifiées sans leur attribuer le succès de l'ancienne sauvegarde | `strategy-form.test.tsx:73` | Component | 1.2-AC1 ✅ |
| COMP-023 | n'affiche pas l'erreur d'une ancienne sauvegarde après modification du brouillon | `strategy-form.test.tsx:97` | Component | 1.2-AC1 ✅ |
| COMP-024 | écarte une sélection qui disparaît lors du rafraîchissement | `strategy-form.test.tsx:118` | Component | 1.2-AC1 ✅ |
| COMP-025 | traite l'élagage d'une sélection comme modification du brouillon | `strategy-form.test.tsx:126` | Component | 1.2-AC1 ✅ |
| COMP-026 | affiche métadonnées et soumet une référence | `product-configurator.test.tsx:21` | Component | 1.3-AC1 ✅ |
| COMP-027 | permet saisie libre avec avertissement accessible | `product-configurator.test.tsx:34` | Component | 1.3-AC2 ✅ |
| COMP-028 | affiche erreur backend actionnable | `product-configurator.test.tsx:46` | Component | 1.3-AC1 ✅ |
| COMP-029 | annonce succès sans les présenter comme alertes | `product-configurator.test.tsx:52` | Component | 1.3-AC1 ✅ |
| COMP-030 | ne réinitialise pas brouillon modifié pendant la création | `product-configurator.test.tsx:60` | Component | 1.3-AC2 ✅ |
| COMP-031 | sélectionne première référence arrivée après rendu initial | `product-configurator.test.tsx:78` | Component | 1.3-AC1 ✅ |
| COMP-032 | écarte les références dont le SKU existe déjà | `product-configurator.test.tsx:86` | Component | 1.3-AC1 ✅ |

#### E2E / User-Flow Tests

| ID | Test | File | Level | Covers |
|----|------|------|-------|--------|
| E2E-001 | crée produit libre puis l'utilise immédiatement dans un profil | `strategy-user-flow.e2e.test.tsx:14` | E2E (vitest) | 1.2-AC1 ✅ |
| E2E-002 | bloque le profil tant qu'aucun produit n'est sélectionné | `strategy-user-flow.e2e.test.tsx:46` | E2E (vitest) | 1.2-AC1 ✅ |
| E2E-003 | keeps strategy flow usable without horizontal overflow at 320 px | `e2e/strategy-responsive.spec.ts:3` | E2E (Playwright) | 1.2-AC3 ✅ |

### 2.2 Coverage Heuristics

#### ✅ Covered (6/7 ACs)

| AC ID | Coverage | Depth |
|-------|----------|-------|
| 1.1-AC1 | BootPage ×3 + StrategyPage render ×1 | ⭐⭐⭐ Happy + error paths |
| 1.1-AC2 | INT-001 direct DB init + table check | ⭐⭐ Happy path only |
| 1.2-AC1 | INT-002 + 14 component + 2 E2E = 17 tests | ⭐⭐⭐⭐ Deep: happy, validation, error, race conditions, draft states |
| 1.2-AC3 | COMP-005 + COMP-015 + E2E-003 | ⭐⭐⭐ Responsive + keyboard + touch targets + 320px |
| 1.3-AC1 | COMP-007 + COMP-026 + COMP-028 + COMP-029 + COMP-031 + COMP-032 | ⭐⭐⭐ Reference metadata + error + dedup + late-load |
| 1.3-AC2 | COMP-010 + COMP-014 + COMP-016 + COMP-017 + COMP-027 + COMP-030 | ⭐⭐⭐⭐ Free text + normalization label + dedup + draft preservation |

#### 🔴 GAP: 1.2-AC2 (Paramètres réutilisés au prochain cycle de monitoring)

| Aspect | Status |
|--------|--------|
| Test found | ❌ **NONE** |
| Risk score | 6 (HIGH — MITIGATE) |
| Gap severity | **CRITICAL** — P0 AC with zero coverage |

**What should exist:**
- An integration test that: creates a profile with specific economic parameters → simulates a monitoring cycle → verifies params were reused
- A component/E2E test that: creates a profile → triggers a cycle → confirms the profile's parameters appear in the cycle output

**What exists nearby (partial):**
- INT-002 validates DB roundtrip but doesn't exercise the monitoring cycle
- COMP-010 verifies reference catalog state is preserved but not parameter reuse
- `run_monitoring_cycle_stub_command` is referenced in tests (COMP-011, COMP-012, COMP-013) but only as mock infrastructure — never asserting parameter reuse

#### Coverage by Level

| Level | Tests | % |
|-------|-------|---|
| Integration (Rust) | 2 | 6% |
| Component (Vitest) | 32 | 91% |
| E2E (Vitest + Playwright) | 3 | 9% |
| **Total** | **35** | — |

#### Coverage by Priority

| Priority | ACs | Covered | % |
|----------|-----|---------|---|
| P0 | 2 | 1 | **50%** 🚨 |
| P1 | 4 | 4 | 100% ✅ |
| P2 | 1 | 1 | 100% ✅ |
| **Total** | **7** | **6** | **86%** |

### 2.3 Blind Spot Signals

| Signal | Detail | Severity |
|--------|--------|----------|
| 🔴 Monitoring cycle reuse | 1.2-AC2 has zero tests — the cycle path is only exercised as a mock in race-condition tests, never validated for correctness | CRITICAL |
| 🟡 E2E browser coverage | 1 Playwright test only covers responsive layout, not full Tauri-backed E2E flows | LOW (Tauri E2E not feasible in current CI) |
| 🟢 Unit-level Rust | No `#[cfg(test)]` unit tests in `src/`. Only integration tests exist. | LOW — mitigated by strong component test suite |
| 🟡 DB migration error paths | INT-001 only tests happy path. No test for malformed migration or concurrent init | MEDIUM |
| 🟡 Negative monitoring cycle | `run_monitoring_cycle_stub_command` is never tested for failure modes | MEDIUM |

---

---

## Step 3: Map Coverage Oracle to Tests

### 3.1 Traceability Matrix

#### 1.1-AC1 — Backend Rust + UI React opérationnel au premier lancement

| Field | Value |
|-------|-------|
| **Coverage** | `FULL` ✅ |
| **Priority** | P1 |
| **Risk score** | 3 LOW |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| COMP-001 | Component | `ui/src/__tests__/boot-page.test.tsx:15` | Happy: boot nominal → "Application prête" |
| COMP-002 | Component | `ui/src/__tests__/boot-page.test.tsx:27` | Error: backend failure → message d'erreur |
| COMP-003 | Component | `ui/src/__tests__/boot-page.test.tsx:38` | Error: Tauri absent → message explicatif |
| COMP-004 | Component | `ui/src/__tests__/strategy-page.test.tsx:29` | Happy: render complet en mode navigateur |

**Heuristics:**
- ✅ Happy path: boot nominal (COMP-001, COMP-004)
- ✅ Error path: backend failure (COMP-002), runtime absent (COMP-003)
- ✅ UI state: loading state via async `findByText` (all 3 tests)
- ✅ Error state: message d'erreur visible (COMP-002, COMP-003)

---

#### 1.1-AC2 — SQLite initialisée avec migrations versionnées sans erreur

| Field | Value |
|-------|-------|
| **Coverage** | `INTEGRATION-ONLY` 🟡 |
| **Priority** | P1 |
| **Risk score** | 4 MEDIUM |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| INT-001 | Integration | `src-tauri/tests/first_launch.rs:7` | Happy: DB file created + `products` table exists |

**Heuristics:**
- ✅ Happy path: init + migration OK (INT-001)
- ❌ Error path: no test for malformed migration, concurrent init, or disk-full
- ❌ UI state: no component test validates what the UI shows during DB init failure

---

#### 1.2-AC1 — Créer/modifier un profil de surveillance → paramètres persistés localement

| Field | Value |
|-------|-------|
| **Coverage** | `FULL` ✅ |
| **Priority** | P0 🔴 |
| **Risk score** | 6 HIGH |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| INT-002 | Integration | `src-tauri/tests/profile_persistence.rs:12` | Happy: profile survives connection close/reopen |
| COMP-006 | Component | `ui/src/__tests__/strategy-page.test.tsx:45` | Error: référentiel indisponible, produits/profils conservés |
| COMP-008 | Component | `ui/src/__tests__/strategy-page.test.tsx:85` | Error: création acquise malgré échec refresh |
| COMP-009 | Component | `ui/src/__tests__/strategy-page.test.tsx:97` | Error: instantané cohérent si lecture essentielle échoue |
| COMP-011 | Component | `ui/src/__tests__/strategy-page.test.tsx:148` | Race: réponse ancienne ignorée |
| COMP-012 | Component | `ui/src/__tests__/strategy-page.test.tsx:177` | Race: échec gagnant propagé |
| COMP-013 | Component | `ui/src/__tests__/strategy-page.test.tsx:207` | Race: échec app_ready supplanté ignoré |
| COMP-018 | Component | `ui/src/__tests__/strategy-form.test.tsx:18` | Validation: formulaire invalide → bouton désactivé |
| COMP-019 | Component | `ui/src/__tests__/strategy-form.test.tsx:27` | Validation: produit obligatoire |
| COMP-020 | Component | `ui/src/__tests__/strategy-form.test.tsx:36` | Error: message backend actionnable |
| COMP-021 | Component | `ui/src/__tests__/strategy-form.test.tsx:48` | Concurrency: double soumission empêchée |
| COMP-022 | Component | `ui/src/__tests__/strategy-form.test.tsx:73` | State: saisies modifiées ≠ succès ancien |
| COMP-023 | Component | `ui/src/__tests__/strategy-form.test.tsx:97` | State: erreur ancien brouillon ignorée |
| COMP-024 | Component | `ui/src/__tests__/strategy-form.test.tsx:118` | State: sélection disparue = formulaire invalide |
| COMP-025 | Component | `ui/src/__tests__/strategy-form.test.tsx:126` | State: élagage = brouillon modifié |
| E2E-001 | E2E (vitest) | `ui/src/__tests__/strategy-user-flow.e2e.test.tsx:14` | Flow: produit libre → profil → succès |
| E2E-002 | E2E (vitest) | `ui/src/__tests__/strategy-user-flow.e2e.test.tsx:46` | Flow: blocage sans produit |

**Heuristics:**
- ✅ Happy path: persistence roundtrip (INT-002), full creation flow (E2E-001)
- ✅ Validation: required fields (COMP-018, COMP-019)
- ✅ Error path: backend rejection (COMP-020), refresh failure (COMP-008, COMP-009), catalog unavailable (COMP-006)
- ✅ Concurrency: double submission (COMP-021), stale responses (COMP-011, COMP-012, COMP-013)
- ✅ State: draft preservation across save cycles (COMP-022, COMP-023, COMP-024, COMP-025)
- ✅ UI state: loading/disabled button (COMP-021), success message (E2E-001)

---

#### 1.2-AC2 — Paramètres réutilisés automatiquement au prochain cycle de monitoring

| Field | Value |
|-------|-------|
| **Coverage** | `NONE` 🔴 |
| **Priority** | P0 🔴 |
| **Risk score** | 6 HIGH |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| — | — | — | **NO TESTS FOUND** |

**Heuristics:**
- ❌ Happy path: no test asserts that monitoring parameters are reused across cycles
- ❌ Error path: no test for parameter corruption across cycles
- ⚠️ `run_monitoring_cycle_stub_command` exists as mock infrastructure but is only used for race-condition testing, never correctness

**🔴 GATE BLOCKER:** This P0 AC with risk score 6 has zero coverage. Per risk-governance.md, RISK_HIGH items must have at minimum integration-level coverage before gate approval.

---

#### 1.2-AC3 — Écran utilisable de 320px à desktop, pas de scroll horizontal, cibles tactiles ≥44px

| Field | Value |
|-------|-------|
| **Coverage** | `FULL` ✅ |
| **Priority** | P1 |
| **Risk score** | 4 MEDIUM |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| COMP-005 | Component | `ui/src/__tests__/strategy-page.test.tsx:37` | Structure: no table, CSS Grid, `.app-shell` class |
| COMP-015 | Component | `ui/src/__tests__/strategy-page.test.tsx:254` | A11y: keyboard nav + `.touch-target` class |
| E2E-003 | E2E (Playwright) | `ui/e2e/strategy-responsive.spec.ts:3` | Layout: 320px viewport, no horizontal overflow, target ≥44px |

**Heuristics:**
- ✅ Happy path: responsive grid (COMP-005, E2E-003)
- ✅ UI state: 320px viewport rendering (E2E-003)
- ✅ Accessibility: keyboard focus order (COMP-015), touch targets (E2E-003)

---

#### 1.3-AC1 — Sélectionner des sets/éditions depuis un référentiel avec métadonnées

| Field | Value |
|-------|-------|
| **Coverage** | `FULL` ✅ |
| **Priority** | P1 |
| **Risk score** | 4 MEDIUM |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| COMP-007 | Component | `ui/src/__tests__/strategy-page.test.tsx:62` | Happy: Tauri create + re-read same reference ID |
| COMP-026 | Component | `ui/src/__tests__/product-configurator.test.tsx:21` | Happy: metadata display + submit |
| COMP-028 | Component | `ui/src/__tests__/product-configurator.test.tsx:46` | Error: backend error → alert message |
| COMP-029 | Component | `ui/src/__tests__/product-configurator.test.tsx:52` | UI state: success as status, not alert |
| COMP-031 | Component | `ui/src/__tests__/product-configurator.test.tsx:78` | Edge: first reference auto-selected on late arrival |
| COMP-032 | Component | `ui/src/__tests__/product-configurator.test.tsx:86` | Edge: SKU dedup — existing SKUs filtered out |

**Heuristics:**
- ✅ Happy path: reference selection + metadata + submit (COMP-026, COMP-007)
- ✅ Error path: backend rejection (COMP-028)
- ✅ UI state: success status (COMP-029), empty state (COMP-032 — "toutes déjà suivies")
- ✅ Edge: late-load (COMP-031), dedup (COMP-032)

---

#### 1.3-AC2 — Saisie libre possible mais signalée comme non normalisée

| Field | Value |
|-------|-------|
| **Coverage** | `FULL` ✅ |
| **Priority** | P2 🟢 |
| **Risk score** | 2 LOW |

| Test ID | Level | File:Line | Assertion |
|---------|-------|-----------|-----------|
| COMP-010 | Component | `ui/src/__tests__/strategy-page.test.tsx:125` | State: référentiel vide/indisponible → message conservé |
| COMP-014 | Component | `ui/src/__tests__/strategy-page.test.tsx:241` | Validation: SKU libre en doublon rejeté |
| COMP-016 | Component | `ui/src/__tests__/strategy-page.test.tsx:273` | Display: label "Non normalisé", pas d'ID brut |
| COMP-017 | Component | `ui/src/__tests__/strategy-form.test.tsx:13` | Display: "Non normalisé" explicite |
| COMP-027 | Component | `ui/src/__tests__/product-configurator.test.tsx:34` | Happy: free text mode + "Non normalisé" status |
| COMP-030 | Component | `ui/src/__tests__/product-configurator.test.tsx:60` | State: draft preserved during async creation |

**Heuristics:**
- ✅ Happy path: free text creation (COMP-027)
- ✅ Validation: SKU dedup (COMP-014)
- ✅ UI state: "Non normalisé" label (COMP-016, COMP-017, COMP-027)
- ✅ State: draft preservation (COMP-030), referential state maintained (COMP-010)

---

### 3.2 Coverage Summary

| AC ID | Story | Priority | Risk | Coverage | Tests | Depth |
|-------|-------|----------|------|----------|-------|-------|
| 1.1-AC1 | 1.1 | P1 | 3 LOW | FULL | 4 | ⭐⭐⭐ |
| 1.1-AC2 | 1.1 | P1 | 4 MED | INTEGRATION-ONLY | 1 | ⭐⭐ |
| 1.2-AC1 | 1.2 | P0 | 6 HIGH | FULL | 17 | ⭐⭐⭐⭐ |
| 1.2-AC2 | 1.2 | P0 | 6 HIGH | **NONE** 🔴 | **0** | — |
| 1.2-AC3 | 1.2 | P1 | 4 MED | FULL | 3 | ⭐⭐⭐ |
| 1.3-AC1 | 1.3 | P1 | 4 MED | FULL | 6 | ⭐⭐⭐ |
| 1.3-AC2 | 1.3 | P2 | 2 LOW | FULL | 6 | ⭐⭐⭐⭐ |

**Overall: 6/7 ACs covered (86%) — 1 CRITICAL gap | 35 tests across 8 files**

### 3.3 Heuristic Signal Summary

| Signal | 1.1-AC1 | 1.1-AC2 | 1.2-AC1 | 1.2-AC2 | 1.2-AC3 | 1.3-AC1 | 1.3-AC2 |
|--------|---------|---------|---------|---------|---------|---------|----------|
| Happy path | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Error path | ✅ | ❌ | ✅ | ❌ | — | ✅ | — |
| Validation | — | — | ✅ | ❌ | — | — | ✅ |
| Concurrency | — | — | ✅ | ❌ | — | — | — |
| UI state (loading) | ✅ | ❌ | ✅ | ❌ | — | — | — |
| UI state (empty) | — | — | — | — | — | ✅ | ✅ |
| UI state (error) | ✅ | ❌ | — | ❌ | — | — | — |
| A11y (keyboard) | — | — | — | — | ✅ | — | — |
| A11y (touch) | — | — | — | — | ✅ | — | — |
| Responsive (320px) | — | — | — | — | ✅ | — | — |

### 3.4 Validation Checklist

| Rule | Status | Detail |
|------|--------|--------|
| P0 items have coverage | 🔴 FAIL | 1.2-AC2 has zero tests |
| P1 items have coverage | ✅ PASS | All 4 P1 ACs covered |
| No duplicate coverage without justification | ✅ PASS | Tests map to distinct assertions |
| Happy-path-only items flagged | ✅ PASS | 1.1-AC2 flagged as INTEGRATION-ONLY (happy only) |
| Error paths covered where oracle implies | 🟡 PARTIAL | 1.1-AC2 missing error paths; 1.2-AC2 missing entirely |
| API items not marked FULL without endpoint tests | N/A | No API endpoints in Epic 1 scope |
| Auth/authz items include denied path | N/A | No auth in Epic 1 scope |
| Synthetic UI journeys have E2E/component coverage | N/A | Oracle is formal ACs, not synthetic |

---

---

## Step 4: Gap Analysis & Phase 1 Completion

### 4.1 Execution Mode

**Resolved:** `sequential` — `tea_execution_mode` not explicitly configured; capability probe not required; sequential analysis with full context.

### 4.2 Gap Analysis

#### Critical Gaps (P0)

| AC ID | Criteria | Priority | Risk Score | Risk Level |
|-------|----------|----------|------------|------------|
| 1.2-AC2 | Paramètres réutilisés automatiquement au prochain cycle de monitoring | P0 🔴 | 6 | HIGH |

**Impact:** This is the ONLY P0 AC with zero coverage. 50% of P0 requirements are untested. Profile parameter reuse is a foundational behavior — if parameters aren't correctly reloaded for the next monitoring cycle, all downstream monitoring is invalid.

#### High Gaps (P1)

None — all 4 P1 ACs have FULL coverage.

#### Medium Gaps — Happy-Path-Only

| AC ID | Issue |
|-------|-------|
| 1.1-AC2 | INT-001 only tests migration success. No tests for: malformed SQL, concurrent init, corrupted DB file, disk full, migration version mismatch |

#### Coverage Heuristics Summary

| Signal | Count | Status |
|--------|-------|--------|
| Endpoints without tests | 0 | N/A — no API in Epic 1 scope |
| Auth negative paths missing | 0 | N/A — no auth in Epic 1 scope |
| Happy-path-only criteria | 1 (1.1-AC2) | 🟡 Monitor |
| UI journeys without E2E | 0 | ✅ |
| UI states missing coverage | 1 (1.1-AC2 error state) | 🟢 Low |

### 4.3 Recommendations

| Priority | Action | Requirements |
|----------|--------|--------------|
| 🔴 URGENT | Run `/bmad:tea:atdd` for 1 P0 requirement: 1.2-AC2 | 1.2-AC2 |
| 🟡 MEDIUM | Add error-path tests for 1.1-AC2 (malformed migration, concurrent init, disk-full) | 1.1-AC2 |
| 🟢 LOW | Run `/bmad:tea:test-review` for quality audit of 35 existing tests | — |

### 4.4 Coverage Statistics

```
📊 Overall: 6/7 ACs fully covered (86%)

🔴 P0: 1/2 (50%)  ← GATE BLOCKER
🟡 P1: 4/4 (100%)
🟢 P2: 1/1 (100%)
🟢 P3: 0/0 (N/A)

📦 Test Inventory: 35 tests across 8 files
  - Integration (Rust):   2 tests (6%)
  - Component (Vitest):  30 tests (86%)
  - E2E (Playwright):     1 test (3%)
  - E2E (Vitest):         2 tests (6%)
  - Skipped/Fixme/Pending: 0
```

### 4.5 Phase 1 Output

✅ Phase 1 Complete — Coverage matrix saved to: `/tmp/tea-trace-coverage-matrix-2026-07-23T17-51-00.json`

---

---

## Step 5: Gate Decision (Phase 2)

### Gate Decision

```
╔══════════════════════════════════════════╗
║   🚫  GATE: FAIL                          ║
╚══════════════════════════════════════════╝
```

**Rationale:** P0 coverage is **50%** (required: 100%). 1 critical requirement uncovered: **1.2-AC2** (Paramètres réutilisés automatiquement au prochain cycle de monitoring).

### Gate Criteria Evaluation

| Criterion | Required | Actual | Status |
|-----------|----------|--------|--------|
| P0 Coverage | 100% | **50%** | ❌ NOT MET |
| P1 Coverage | ≥80% (target 90%) | 100% | ✅ MET |
| Overall Coverage | ≥80% | 86% | ✅ MET |

### Why P0 Failed

**1.2-AC2** — "Paramètres réutilisés automatiquement au prochain cycle de monitoring" — has **zero tests**. This is the second of only 2 P0 requirements for Epic 1. The `run_monitoring_cycle_stub_command` Tauri command exists in the codebase and is mocked in several race-condition tests (COMP-011, COMP-012, COMP-013), but no test ever asserts that the command *correctly reuses profile parameters*. The mock infrastructure is present; the correctness assertion is absent.

### Blockers

| # | Blocker | Impact |
|---|---------|--------|
| 1 | 1.2-AC2 uncovered | P0 requirement; risk score 6 (HIGH) |

### Recommendations

| Priority | Action | Requirements |
|----------|--------|--------------|
| 🔴 URGENT | Run `/bmad:tea:atdd` to generate acceptance tests for 1.2-AC2, then run `/bmad:tea:automate` to implement them | 1.2-AC2 |
| 🟡 MEDIUM | Add error-path tests for 1.1-AC2 (malformed migration, concurrent init, disk-full) | 1.1-AC2 |
| 🟢 LOW | Run `/bmad:tea:test-review` for quality audit of 35 existing tests | — |

### Machine-Readable Outputs

- `_bmad-output/test-artifacts/traceability/e2e-trace-summary.json` ✅
- `_bmad-output/test-artifacts/traceability/gate-decision.json` ✅

### What's Strong

- **1.2-AC1** (Profile persistence): 17 tests across 3 levels — integration, component, E2E. Deep coverage including race conditions, draft states, and concurrent submissions.
- **1.3-AC2** (Free text normalization): 6 tests covering free-text creation, dedup, labels, draft preservation.
- **1.2-AC3** (Responsive UX): Playwright E2E at 320px + keyboard a11y + touch targets.
- **No skipped/fixme/pending tests** — all 35 tests are active and passing.

### Workflow Complete ✅

Trace coverage workflow finished for Epic 1. Gate: **FAIL** — release blocked until 1.2-AC2 is covered.
