---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
  - step-04c-aggregate
  - step-05-validate-and-complete
lastStep: step-05-validate-and-complete
lastSaved: '2026-07-24T07:30:00Z'
storyId: '1.2'
storyKey: 1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques
storyFile: _bmad-output/implementation-artifacts/1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques.md
atddChecklistPath: _bmad-output/test-artifacts/atdd-checklist-1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques.md
generatedTestFiles:
  - ui/e2e/strategy-persistence.spec.ts
  - src-tauri/tests/profile_persistence.rs
  - ui/src/__tests__/strategy-reload-ui.test.tsx
---

# ATDD — Story 1.2 AC2 ✅ Terminé

## Résumé

| Niveau | Fichier | Tests | Statut |
|--------|---------|-------|--------|
| E2E Playwright | `ui/e2e/strategy-persistence.spec.ts` | 3 | 🔴 skipped |
| Component Vitest | `ui/src/__tests__/strategy-reload-ui.test.tsx` | 2 | 🔴 skipped |
| Integration Rust | `src-tauri/tests/profile_persistence.rs` | 2 (+1 existant) | 🟢 passing |

**Validation : Rust `cargo test` 3/3 ✅ | UI `vitest` 35 pass + 2 skipped ✅**

## Scénarios AC2

| # | Scénario | P | Niveau | Statut |
|---|----------|---|--------|--------|
| S1 | Profil chargé automatiquement après restart | P0 | E2E | 🔴 skipped |
| S2 | Profil actif réutilisé dans le cycle monitoring | P0 | E2E | 🔴 skipped |
| S3 | Seul le profil actif utilisé par défaut (profils multiples) | P1 | E2E | 🔴 skipped |
| S4 | Profil modifié survit au restart | P1 | Rust | 🟢 passing |
| S5 | DB absente → démarrage propre sans crash | P2 | Rust | 🟢 passing |
| S6 | UI post-reload sans erreur résiduelle | P2 | Component | 🔴 skipped |

## Activation des tests skipped

```bash
# 1. Retirer test.skip() dans les fichiers concernés
# 2. Lancer les tests
cd ui && npm run test:e2e  # Playwright
cd ui && npm test           # Vitest
```

## Risques

- Tests E2E mockent `__TAURI_INTERNALS__` — pas de vrai IPC Tauri
- AC2 déjà implémentée → ces tests sont un filet de régression
