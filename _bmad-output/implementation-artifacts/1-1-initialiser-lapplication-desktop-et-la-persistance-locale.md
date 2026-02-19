# Story 1.1: Initialiser l’application desktop et la persistance locale

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a revendeur,
I want une application desktop installable avec base locale prête,
so that je peux démarrer ma configuration sans dépendance externe.

## Acceptance Criteria

1. **Given** un poste compatible desktop, **When** l’application est lancée pour la première fois, **Then** le socle Tauri + UI React est opérationnel.
2. **Given** le premier lancement, **When** l’initialisation de persistance s’exécute, **Then** SQLite est initialisée avec migrations versionnées sans erreur.

## Tasks / Subtasks

- [ ] Créer le squelette applicatif desktop Tauri v2 + Rust + React/TypeScript (AC: 1)
  - [ ] Initialiser le projet avec séparation claire `src-tauri/` (backend Rust) et `ui/` (frontend React/TS).
  - [ ] Ajouter une commande Tauri de healthcheck (ex: `app_ready`) pour valider le pont UI ↔ backend.
  - [ ] Afficher dans l’UI un état de démarrage minimal (application prête / erreur initialisation).
- [ ] Mettre en place la persistance SQLite versionnée (AC: 2)
  - [ ] Ajouter un module DB Rust dédié (`infrastructure/db`) avec ouverture de connexion et gestion d’erreurs typées.
  - [ ] Créer un dossier de migrations versionnées et une migration initiale.
  - [ ] Exécuter automatiquement les migrations au démarrage de l’application avant chargement du cockpit.
- [ ] Ajouter l’observabilité et les garde-fous de boot (AC: 1, 2)
  - [ ] Journaliser clairement les étapes d’initialisation (boot app, ouverture DB, migration OK/KO).
  - [ ] Empêcher l’accès UI principal si l’initialisation critique échoue et proposer un message actionnable.
- [ ] Vérifier la qualité via tests ciblés (AC: 1, 2)
  - [ ] Tests unitaires Rust pour le runner de migrations (succès, migration invalide, base verrouillée).
  - [ ] Test d’intégration du premier lancement (DB absente → créée + migration appliquée).
  - [ ] Test UI (smoke) confirmant qu’un état “prêt” est visible après boot nominal.

## Dev Notes

- Cette story doit poser les fondations techniques utilisées par les stories suivantes de l’Epic 1 (configuration profil, seuils, référentiels).
- Respect strict ADR-001: logique métier côté Rust, UI TypeScript limitée à présentation/interactions.
- Respect strict ADR-003: SQLite locale + migrations obligatoires pour toute évolution de schéma.
- Nommage attendu: snake_case en Rust, camelCase en TypeScript.

### Technical Requirements

- Stack cible obligatoire: Tauri v2 + Rust + React/TypeScript.
- Persistance locale: SQLite avec mécanisme de migrations versionnées exécuté au boot.
- Contrat interne via commandes Tauri explicitement défini (au minimum une commande de healthcheck dans cette story).
- L’application doit rester 100% locale (pas de dépendance service externe pour démarrer).

### Architecture Compliance

- Appliquer l’architecture recommandée:
  - Rust backend: orchestration/infra dans `src-tauri/src`.
  - UI frontend: composants/pages dans `ui/src`.
- Préparer la structure cible sans implémenter toutes les briques futures:
  - `src-tauri/src/app`, `src-tauri/src/infrastructure/db/migrations`, `ui/src/pages`.
- Garder la “single source of truth métier” côté Rust (aucun calcul métier côté UI).

### Library & Framework Requirements

- Tauri: v2 (cohérent avec ADR architecture).
- Rust: toolchain stable (version verrouillée via rust-toolchain si présent).
- React + TypeScript: configuration stricte TypeScript recommandée dès le bootstrap.
- SQLite: bibliothèque Rust robuste avec support migration (choix à documenter dans la story implementation record).

### File Structure Requirements

- Créer/maintenir les chemins minimaux suivants:
  - `src-tauri/src/app/commands.rs` (commande(s) Tauri de base)
  - `src-tauri/src/infrastructure/db/` (connexion DB + runner migrations)
  - `src-tauri/src/infrastructure/db/migrations/` (scripts versionnés)
  - `ui/src/` (point d’entrée React + écran de boot minimal)
- Les scripts SQL de migration doivent être idempotents et versionnés (préfixes ordonnés).

### Testing Requirements

- Couvrir les scénarios de base:
  - Boot nominal (app ready)
  - Première initialisation DB (création + migration)
  - Erreur migration (message explicite + blocage contrôlé)
- Les tests doivent être automatisables localement sans service externe.
- Critère de done technique: AC1/AC2 validés par au moins un test automatisé chacun.

### Project Structure Notes

- Le repository actuel est majoritairement orienté artefacts BMAD; le code produit peut ne pas encore exister.
- Cette story autorise la création du squelette applicatif initial en respectant la structure cible d’architecture.

### References

- Story source Epic 1.1: `_bmad/_bmad-output/planning-artifacts/epics.md` (section “Story 1.1”).
- Contraintes stack & séparation responsabilités: `_bmad/_bmad-output/planning-artifacts/architecture.md` (ADR-001).
- Contraintes persistance locale & migrations: `_bmad/_bmad-output/planning-artifacts/architecture.md` (ADR-003).
- Exigences produit de configuration locale desktop: `_bmad/_bmad-output/planning-artifacts/prd.md` (FR-01, contexte produit desktop).

## Dev Agent Record

### Agent Model Used

GPT-5.2-Codex

### Debug Log References

- Story générée via commande demandée: `/bmad-agent-bmm-sm` puis `/bmad-bmm-create-story 1-1`.

### Completion Notes List

- Squelette initial créé: modules Rust `app` + `infrastructure/db`, commande Tauri `app_ready`, écran React de boot minimal.
- Runner de migrations SQLite ajouté avec migration `001_initial_schema.sql` et séquence de boot bloquante/actionnable en cas d'échec critique.
- Tests ajoutés: unitaires Rust (succès/SQL invalide/base verrouillée), intégration premier lancement, smoke test UI.
- Exécution des tests bloquée par la politique réseau du conteneur (403 sur crates.io et npmjs), validation complète en attente d'accès dépendances.

### File List

- _bmad-output/implementation-artifacts/1-1-initialiser-lapplication-desktop-et-la-persistance-locale.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- src-tauri/Cargo.toml
- src-tauri/src/lib.rs
- src-tauri/src/app/mod.rs
- src-tauri/src/app/commands.rs
- src-tauri/src/app/bootstrap.rs
- src-tauri/src/infrastructure/mod.rs
- src-tauri/src/infrastructure/db/mod.rs
- src-tauri/src/infrastructure/db/migrations/001_initial_schema.sql
- src-tauri/tests/first_launch.rs
- ui/package.json
- ui/tsconfig.json
- ui/vitest.config.ts
- ui/src/main.tsx
- ui/src/pages/BootPage.tsx
- ui/src/__tests__/boot-page.test.tsx
- ui/src/test-setup.ts

### Change Log

- 2026-02-19: Démarrage implémentation Story 1.1 (squelette app + persistance SQLite + tests ajoutés, exécution tests bloquée par accès registre dépendances).
