# Story 1.2: Configurer produits, profils de surveillance et paramètres économiques

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a revendeur,
I want gérer mes produits cibles, seuils de marge et frais,
so that le système reflète ma stratégie réelle de revente.

## Acceptance Criteria

1. **Given** une application initialisée, **When** je crée ou modifie un profil de surveillance, **Then** les paramètres produits/seuils/frais sont persistés localement.
2. **Given** des profils de surveillance existants, **When** je redémarre l’application puis relance un cycle de monitoring, **Then** les paramètres sauvegardés sont rechargés automatiquement et réutilisés sans ressaisie.

## Tasks / Subtasks

- [ ] Modéliser et persister les entités de configuration (AC: 1, 2)
  - [ ] Ajouter les tables/migrations SQLite nécessaires: `products`, `monitor_profiles` (et tables de liaison si nécessaire) avec contraintes d’intégrité minimales.
  - [ ] Stocker les montants économiques en centimes (`i64`) et timestamps en UTC ISO-8601, conformément aux règles d’architecture.
  - [ ] Prévoir une stratégie d’évolution de schéma compatible stories suivantes (référentiels Story 1.3).

- [ ] Exposer les commandes Tauri de gestion de profil (AC: 1)
  - [ ] Implémenter des commandes Rust pour créer, lister, mettre à jour et supprimer les produits/profils surveillés.
  - [ ] Centraliser la validation métier côté Rust (seuils, frais, champs obligatoires) avec erreurs typées et messages actionnables.
  - [ ] Garantir que l’UI ne contient pas de calcul métier/scoring (presentation only).

- [ ] Implémenter l’écran stratégie/paramètres (AC: 1)
  - [ ] Créer une UI React/TypeScript pour éditer les produits ciblés, seuils de marge et frais principaux.
  - [ ] Ajouter validation formulaire côté UI (ergonomie), tout en laissant la validation d’autorité au backend Rust.
  - [ ] Afficher l’état de sauvegarde (succès/erreur) et les messages de correction utilisateur.

- [ ] Rechargement au démarrage et réutilisation au cycle (AC: 2)
  - [ ] Charger la configuration persistée au boot applicatif (ou à l’entrée de page) sans interaction manuelle.
  - [ ] Brancher la lecture des profils dans le cycle de monitoring existant (ou stub d’orchestration prêt pour Epic 2) pour prouver la réutilisation automatique.
  - [ ] Prévoir un comportement déterministe si plusieurs profils existent (profil actif par défaut ou sélection explicite).

- [ ] Vérification qualité et non-régression (AC: 1, 2)
  - [ ] Ajouter tests unitaires Rust sur validation et repository config (cas nominal + valeurs invalides).
  - [ ] Ajouter test d’intégration: création profil -> redémarrage simulé -> relecture identique.
  - [ ] Ajouter test UI (smoke/interaction) couvrant création ou édition d’un profil et retour visuel de persistance.

## Dev Notes

- Cette story prolonge directement la Story 1.1 (socle desktop + SQLite) et doit **réutiliser** l’infrastructure DB/migrations déjà en place, sans la réinventer.
- Priorité produit: rendre la stratégie utilisateur réellement persistante pour préparer Epic 2 (collecte) et Epic 3 (scoring).
- Le périmètre de cette story n’inclut pas encore la normalisation référentiel complète (Story 1.3), mais le schéma doit rester extensible.

### Technical Requirements

- Respect ADR-001: logique métier et validation de configuration côté Rust; UI TypeScript limitée à interactions/présentation.
- Respect ADR-003: persistance SQLite locale avec migration versionnée obligatoire pour tout changement de schéma.
- Respect FR-01: gestion complète des profils (produits, seuils, frais, priorités si disponibles dans l’UI).
- Respect du mapping data architecture:
  - `products` pour le périmètre surveillé.
  - `monitor_profiles` pour paramètres économiques de stratégie.

### Architecture Compliance

- Backend attendu (Rust):
  - `src-tauri/src/domain/models` pour modèles de configuration.
  - `src-tauri/src/domain/services` pour règles/validations métier.
  - `src-tauri/src/infrastructure/db/repositories` pour accès SQLite.
  - `src-tauri/src/app/commands.rs` pour surface Tauri UI ↔ backend.
- Frontend attendu (React/TS):
  - `ui/src/pages/strategy` pour écran stratégie.
  - `ui/src/components` pour formulaires et états d’erreur/succès.
- Nommage: snake_case Rust, camelCase TypeScript.

### Library & Framework Requirements

- Conserver stack active du projet: Tauri v2 + Rust + React/TypeScript + SQLite local.
- Réutiliser la librairie DB et le runner de migration introduits en Story 1.1 (pas de second mécanisme concurrent).
- Les commandes Tauri doivent rester explicites, typées, et testables localement.

### File Structure Requirements

- Fichiers/modifications cibles minimales (indicatives):
  - `src-tauri/src/app/commands.rs` (nouvelles commandes config profil)
  - `src-tauri/src/domain/models/*` (modèles produits/profils)
  - `src-tauri/src/domain/services/*` (validation stratégie)
  - `src-tauri/src/infrastructure/db/migrations/*` (migration story 1.2)
  - `src-tauri/src/infrastructure/db/repositories/*` (CRUD persistance)
  - `ui/src/pages/strategy/*` (écran paramètres)
  - `ui/src/components/*` (formulaires réutilisables)

### Testing Requirements

- Unit tests Rust:
  - Validation seuils/frais (bornes, valeurs négatives, champs requis).
  - Persistance/relecture repository SQLite.
- Integration tests Rust:
  - Roundtrip complet création/mise à jour puis rechargement après redémarrage simulé.
- UI tests:
  - Création/édition d’un profil depuis interface avec feedback succès/erreur.
- Non-régression:
  - Vérifier que le boot Story 1.1 (init DB, écran de démarrage) reste fonctionnel.

### Previous Story Intelligence

- Story 1.1 a déjà structuré le socle `src-tauri` + `ui`, avec séquence de boot et migrations SQLite actives.
- Plusieurs corrections récentes ont porté sur le runtime Tauri/UI (build React réel, hooks simplifiés, stabilité de lancement): éviter toute modification qui casse ce chemin.
- Le chemin DB côté desktop a été aligné sur `app_data_dir`; toute nouvelle persistance doit rester cohérente avec ce choix pour éviter des écarts entre environnements.

### Git Intelligence Summary

- Les 5 derniers commits pertinents indiquent une forte sensibilité aux régressions de runbook/build desktop (hooks `beforeDevCommand`, CWD, pipeline React/Tauri).
- Recommandation d’implémentation: isoler les changements de cette story aux couches domaine/persistance + page stratégie, et minimiser les modifications à la config Tauri/build sauf nécessité absolue.
- Les revues précédentes ont corrigé des faux positifs de boot; conserver des tests explicites de parcours réel (pas uniquement mocks).

### Latest Tech Information

- Aucune contrainte de version additionnelle bloquante détectée pour cette story au-delà des choix architecture existants.
- Prioriser la stabilité de l’écosystème déjà en place (Tauri v2/Rust/React/SQLite) plutôt qu’une mise à niveau opportuniste pendant l’implémentation de Story 1.2.

### Project Context Reference

- Config BMAD détectée: communication/documentation en français, niveau utilisateur intermédiaire.
- Les artefacts de planning sont localisés sous `_bmad/_bmad-output/planning-artifacts` (et non sous `_bmad-output/planning-artifacts`); garder cette réalité en tête pour les workflows suivants.

### Story Completion Status

- Story context créé avec statut **ready-for-dev**.
- Note de complétion: **Ultimate context engine analysis completed - comprehensive developer guide created**.

## Project Structure Notes

- La structure recommandée par l’architecture est plus large que l’état actuel du repo; implémenter de façon incrémentale en privilégiant la cohérence avec le code déjà présent.
- Éviter d’introduire une nouvelle hiérarchie concurrente si des modules équivalents existent déjà.

## References

- Epic / Story source: `_bmad/_bmad-output/planning-artifacts/epics.md` (Epic 1, Story 1.2).
- Exigences produit: `_bmad/_bmad-output/planning-artifacts/prd.md` (FR-01, contexte MVP desktop).
- Décisions d’architecture: `_bmad/_bmad-output/planning-artifacts/architecture.md` (ADR-001, ADR-003, modèle de données v1).
- Contraintes UX stratégie/configuration: `_bmad/_bmad-output/planning-artifacts/ux-design-specification.md` (Écran 3 — Stratégie & paramètres).
- Learnings Story précédente: `_bmad-output/implementation-artifacts/1-1-initialiser-lapplication-desktop-et-la-persistance-locale.md`.

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex

### Debug Log References

- Workflow exécuté: `bmad-create-story 1.2`
- Analyse des artefacts: epics/prd/architecture/ux + story 1.1 + `git log` récent.

### Completion Notes List

- Story 1.2 générée avec contexte dev exhaustif, tâches actionnables et garde-fous anti-régression.
- Statut story positionné à `ready-for-dev` dans le fichier story et dans `sprint-status.yaml`.
- Chemin planning effectif documenté pour éviter les erreurs de résolution de fichiers lors des prochains workflows.

### File List

- _bmad-output/implementation-artifacts/1-2-configurer-produits-profils-de-surveillance-et-parametres-economiques.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
