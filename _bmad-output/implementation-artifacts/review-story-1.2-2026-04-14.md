# Code Review — Story 1.2 (2026-04-14)

## Scope
- Story: `1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques`
- Baseline analyzed: `d31d5cc..HEAD`
- Files changed: 21

## Layer execution notes
- Blind Hunter: completed (diff-only pass)
- Edge Case Hunter: completed (repository-aware pass)
- Acceptance Auditor: completed (spec/story aligned pass)

## Findings (triaged)

### Patch
1. **Soumission autorisée sans produit**
   - **Type:** patch
   - **Location:** `ui/src/components/StrategyForm.tsx`
   - **Detail:** le formulaire autorise l'envoi quand `products.length === 0`, mais le backend Rust rejette un profil sans `product_ids` (validation `EmptyProducts`). Cela crée un échec évitable côté UX.

2. **Erreur de sauvegarde non gérée dans le formulaire**
   - **Type:** patch
   - **Location:** `ui/src/components/StrategyForm.tsx`
   - **Detail:** `handleSubmit` ne capture pas les erreurs de `onSubmit`; l’utilisateur ne reçoit pas de message d’erreur dédié au formulaire en cas d’échec de persistance.

## Dismissed / Deferred
- Deferred: 0
- Dismissed: 0

## Outcome
- Review result: **not clean**
- Recommended next action: corriger les 2 patches UI puis relancer un code review rapide.
