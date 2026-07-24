---
stepsCompleted:
  - step-02-discover-tests
  - step-03f-aggregate-scores
  - step-04-generate-report
lastStep: step-04-generate-report
lastSaved: '2026-07-23T17:35:00Z'
reviewScope: suite
stack: fullstack
epic: 1
---

# 🔍 Test Review — Epic 1 : Fondation & Persistance

**Date** : 23 juillet 2026  
**Scope** : Suite (8 fichiers — Rust backend + React/Vitest + Playwright)  
**Stack** : fullstack (Tauri/Rust + React/Vitest + Playwright)  
**Analyste** : Murat, TEA (Master Test Architect)

---

## 📊 Score Global

| Métrique | Valeur |
|----------|--------|
| **Score Global** | **75 / 100** |
| **Grade** | **C** |
| **Évaluation** | Acceptable — des corrections ciblées sont nécessaires avant le gate |

### Scores par Dimension

| Dimension | Score | Grade | Poids |
|-----------|-------|-------|-------|
| 🔄 Déterminisme | 56 / 100 | **F** | 30% |
| 🔒 Isolation | 93 / 100 | **A** | 30% |
| 🧹 Maintenabilité | 63 / 100 | **D** | 25% |
| ⚡ Performance | 96 / 100 | **A** | 15% |

---

## 🚨 Violations Critiques (6 HIGH)

### Déterminisme — 3 violations HIGH

Toutes concentrées dans `ui/src/__tests__/strategy-page.test.tsx` :

1. **L86** — Compteur `productReads` muté dans `mock invoke`. React Strict Mode double-invoque les effets, ce qui peut incrémenter le compteur de façon imprévisible entre deux exécutions du même test.

2. **L110** — Compteur `refreshCount` muté dans `mock invoke`. Même problème : la mutation de l'état partagé du mock pendant l'exécution produit des résultats non-déterministes.

3. **L260** — Compteurs `appReadyCalls` et `productReads` mutés simultanément. Cumul des deux problèmes précédents dans un mock encore plus complexe.

**Impact** : Les tests peuvent passer en local et échouer en CI, ou inversement. Le taux de flakiness est élevé sous React Strict Mode.

**Correctif recommandé** : Remplacer tous les compteurs mutables par `vi.fn().mockReturnValueOnce()` séquencé, ou utiliser un tableau de retours consommé par `shift()`.

### Maintenabilité — 3 violations HIGH

1. **`strategy-form.test.tsx`** (151 lignes) — Dépasse le seuil de 100 lignes. Les tests 5 à 8 dupliquent un pattern de promesse différée (`let resolveSubmission`).

2. **`strategy-page.test.tsx`** (345 lignes) — Fichier 3.5× trop long. Impossible à maintenir sans sous-structure : 14 tests + `it.each` sans un seul sous-`describe`.

3. **`strategy-page.test.tsx` L64** — Duplication massive des mocks `invoke` (10-30 lignes par test). Chaque test réimplémente sa propre version avec des variantes subtiles. Un changement d'API Tauri nécessitera de modifier 10+ endroits.

**Correctif recommandé** : Créer un helper `createMockInvoke(config)` centralisé. Diviser le fichier en 3-4 fichiers thématiques (rafraîchissement, création, accessibilité).

---

## ⚠️ Avertissements (9 MEDIUM)

### Déterminisme — 5 MEDIUM
- **`strategy-page.test.tsx`** L34, L53, L80, L320 : Sélecteurs CSS fragiles (`.app-shell`, `.status-pill`, `.product-option`, `.touch-target`) → utiliser `data-testid` ou rôles ARIA
- **`strategy-user-flow.e2e.test.tsx`** L55 : Sélecteur `.profile-card strong` fragile → idem

### Isolation — 1 MEDIUM
- **`strategy-page.test.tsx`** L12 : Injection globale de `<style>` dans `document.head` via `beforeAll`. Tous les tests du worker partagent cette feuille de style → remplacer par mock CSS Vitest ou import module

### Maintenabilité — 3 MEDIUM
- **`strategy-page.test.tsx`** : Zéro commentaire malgré 345 lignes de mocks complexes
- **`strategy-page.test.tsx`** L231 : `readFileSync` dans `beforeAll` crée une dépendance inutile au filesystem
- **`strategy-form.test.tsx`** L120 : Pattern `let resolveSubmission` dupliqué 4 fois → extraire en helper

---

## 💡 Suggestions (8 LOW)

- **Rust** `first_launch.rs` / `profile_persistence.rs` : `tempfile::tempdir()` génère des chemins aléatoires (inoffensif mais non pur)
- **`boot-page.test.tsx`** L9 : Cast `Window & { __TAURI_INTERNALS__? }` verbeux et dupliqué → définir un type global
- **`strategy-page.test.tsx`** : Noms de test >80 caractères → raccourcir
- **Performance** : `readFileSync` synchrone bloque jsdom → `fs.promises.readFile` ; initialisation DB SQLite à factoriser en fixtures Rust

---

## 📋 Inventaire des Tests

| # | Fichier | Lignes | Tests | Framework |
|---|---------|--------|-------|-----------|
| 1 | `src-tauri/tests/first_launch.rs` | 32 | 1 | Rust |
| 2 | `src-tauri/tests/profile_persistence.rs` | 50 | 1 | Rust |
| 3 | `ui/src/__tests__/boot-page.test.tsx` | 54 | 3 | Vitest + RTL |
| 4 | `ui/src/__tests__/product-configurator.test.tsx` | 91 | 7 | Vitest + RTL |
| 5 | `ui/src/__tests__/strategy-form.test.tsx` | 151 | 9 | Vitest + RTL |
| 6 | `ui/src/__tests__/strategy-page.test.tsx` | 345 | 14 | Vitest + RTL |
| 7 | `ui/src/__tests__/strategy-user-flow.e2e.test.tsx` | 57 | 2 | Vitest + RTL |
| 8 | `ui/e2e/strategy-responsive.spec.ts` | 49 | 1 | Playwright |
| **Total** | | **829** | **38** | |

---

## ✅ Points Forts

- **Performance exemplaire** (96/100) : zéro `waitForTimeout`, zéro `describe.serial` inutile, parallélisme par défaut, promesses contrôlées
- **Isolation quasi-parfaite** (93/100) : `tempdir()` en Rust, `afterEach(cleanup)` en Vitest, contexte frais Playwright
- **Absence de flaky patterns classiques** : aucun `Math.random()`, `Date.now()`, `setTimeout` non mocké
- **Couverture fonctionnelle d'Epic 1 complète** : boot, persistance, configuration produit, formulaire stratégie, responsive
- **Backend Rust impeccable** : 2 tests bien isolés, assertions claires, pas de duplication

---

## 🔧 Plan d'Action Prioritaire

| Priorité | Action | Impact | Effort |
|----------|--------|--------|--------|
| 🔴 P0 | Remplacer les compteurs mutés dans `strategy-page.test.tsx` par `mockReturnValueOnce()` | Élimine 3 HIGH determinism | ~2h |
| 🔴 P0 | Diviser `strategy-page.test.tsx` (345l) en 3-4 fichiers thématiques | Élimine 2 HIGH maintainability | ~3h |
| 🟡 P1 | Créer un helper centralisé `createMockInvoke(config)` | Élimine duplication massive | ~2h |
| 🟡 P1 | Remplacer les sélecteurs CSS fragiles par `data-testid` | Élimine 5 MEDIUM determinism | ~1.5h |
| 🟡 P1 | Remplacer l'injection globale de stylesheet par mock CSS Vitest | Élimine 1 MEDIUM isolation | ~30min |
| 🟢 P2 | Extraire le pattern `deferred promise` en helper | Réduit duplication | ~30min |
| 🟢 P2 | Définir un type `WindowWithTauri` global | Améliore maintenabilité | ~15min |
| 🟢 P2 | Factoriser l'initialisation DB Rust en fixtures | Prépare l'avenir | ~30min |

**Effort total estimé** : ~10h pour atteindre le grade A.

---

## 🎯 Décision de Gate

| Critère | Statut |
|---------|--------|
| Score global ≥ 70 | ✅ 75/100 |
| Aucun HIGH en isolation | ✅ 0 HIGH |
| Aucun HIGH en performance | ✅ 0 HIGH |
| Déterminisme ≥ 70 | ❌ 56/100 (F) |
| Maintenabilité ≥ 70 | ❌ 63/100 (D) |

**Verdict** : ⚠️ **GATE CONDITIONNEL** — Le score global atteint le seuil minimum (75 ≥ 70), mais deux dimensions sont en échec. La correction des 3 violations HIGH de déterminisme (compteurs mutés) est **bloquante** avant le passage en production. Les problèmes de maintenabilité peuvent être traités en parallèle du développement d'Epic 2.

---

## 📎 Prochain Workflow Recommandé

Après correction des violations P0 :
- **`automate`** — pour ajouter ces tests à la CI et suivre leur stabilité dans le temps
- **`trace`** — pour l'analyse de couverture (exclue du périmètre `test-review`)

---

*Rapport généré par Murat (TEA BMAD) le 23 juillet 2026 — Mode parallèle (4 sous-agents, ~60% plus rapide que séquentiel)*
