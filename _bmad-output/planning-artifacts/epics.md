---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-Poke-Radar-2026-07-22/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md
  - _bmad-output/planning-artifacts/implementation-readiness-report-2026-07-22.md
changelog:
  - "2026-07-22: Restructuré selon le readiness report — Epic 2 splitté (collecte vs fondations web), tests intégrés aux stories feature, Dashboard SSE splitté en 3 stories, 5 epics total"
  - "2026-07-22: Readiness report v2 — Epic 5 split en E5 (3 stories alerting/SSE) + E6 (9 stories UI), Epic 3 renommé, StrategyPage ajoutée (story 6.6), 6 epics total"
---

# Poke-Radar - Epic Breakdown

## Overview

Ce document transforme le PRD, l'architecture et la spécification UX en epics et stories prêtes pour l'implémentation.

**Restructuration du 2026-07-22 :** Modifications basées sur l'`implementation-readiness-report-2026-07-22.md` — résolution de 2 issues critiques, 4 majeures et 5 mineures identifiées par le readiness assessment.

## Requirements Inventory

### Functional Requirements

FR-01: L'utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités).
FR-02: Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.
FR-03: Le moteur récupère périodiquement disponibilité et prix des sources activées.
FR-04: Chaque donnée est horodatée et associée à sa source.
FR-05: En cas d'échec source, le système marque l'état et bascule en mode dégradé.
FR-06: Le système calcule une estimation de revente à partir des données disponibles.
FR-07: L'interface affiche le niveau de confiance (valeur directe vs estimée).
FR-08: Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels).
FR-09: Les règles de scoring sont configurables par utilisateur.
FR-10: Les opportunités sont triables par rentabilité et urgence.
FR-11: Le système envoie une notification quand une opportunité dépasse les seuils définis.
FR-12: La notification inclut produit, prix d'achat, estimation revente, marge nette, source, timestamp.
FR-13: Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées.
FR-14: Historique consultable pour analyser la qualité des alertes et ajuster les seuils.
FR-15: Journalisation des erreurs de collecte et de calcul.
FR-16: Mécanisme de retry/backoff sur les sources instables.
FR-17: Continuité minimale du service via saisie/import manuel.
FR-18: L'application est accessible via navigateur web (desktop, tablette, mobile) sur HTTPS, via API HTTP RPC + SPA.
FR-19: L'accès est protégé par authentification single-user (token Bearer), sans gestion multi-comptes.

### NonFunctional Requirements

NFR-01: Latence détection → notification < 60 secondes sur sources prioritaires.
NFR-02: Uptime monitoring > 95 % sur plages actives.
NFR-03: Dégradation progressive sans arrêt global.
NFR-04: Respect RGPD/nLPD, secret management, HTTPS obligatoire, protection XSS/SQLi/rate limiting/CORS/CSP.
NFR-05: Pipeline modulaire maintenable et extensible.
NFR-06: UX orientée décision, responsive mobile-first (320px–1920px), cibles tactiles 44px, animations respectueuses.
NFR-07: Déploiement reproductible : systemd, Caddy, TLS Let's Encrypt, logs journald, migrations SQLite versionnées.
NFR-08: Tests : unitaires métier Rust, intégration pipeline, composants UI (Vitest+RTL), E2E Playwright (4 journeys critiques).

### Additional Requirements

- Implémenter SSE (Server-Sent Events) pour dashboard temps réel (AD-10).
- Déploiement systemd + Caddy + TLS Let's Encrypt (AD-2).
- Auth middleware Bearer token, pas de cookie/session (AD-3).
- Rate limiting par IP sur `/api/auth/verify` et `/api/scan` (AD-17).
- Content-Security-Policy header restrictif (AD-17).
- Requêtes SQL paramétrées anti-injection (AD-17).
- CORS restreint au domaine configuré (AD-17).
- Logging structuré tracing → journald (AD-2).
- Secrets via EnvironmentFile systemd, jamais dans le dépôt (AD-2, AD-3).
- Migrations SQLite appliquées au démarrage (AD-5).
- Tests unitaires Rust domaine métier (AD-13).
- Tests intégration Rust pipeline complet (AD-14).
- Tests composants frontend Vitest + RTL, tous états (AD-15).
- Tests E2E Playwright, 4 parcours critiques (AD-16).
- Conventions nommage : Rust snake_case, TS camelCase, SQL snake_case (AD-18).
- Format uniforme erreurs API `{ error, code }` (AD-18).
- Correlation ID par cycle de collecte et opportunité (AD-18).
- Tous les montants en centimes (i64), timestamps UTC ISO-8601 (AD-5).

### UX Design Requirements

UX-DR1: Design tokens CSS centralisés — thème dark "Amber Warmth", grille 8px, typographie Inter.
UX-DR2: Composant SignalBadge / ConfidenceBadge (3 niveaux : haute/moyenne/basse).
UX-DR3: Composant Button (Primary / Secondary, tous états : default/hover/focus/active/disabled/loading).
UX-DR4: Composant Card — OpportunityCard, SourceCard.
UX-DR5: Composant Toast / Snackbar avec undo 3s, slide-up + fade-in.
UX-DR6: Composant EmptyState — bordure pointillée, centré, message explicite.
UX-DR7: Composant BottomSheet — sélecteurs contextuels, drag handle, backdrop.
UX-DR8: Composant Panel — conteneur standard avec bordure, radius, shadow.
UX-DR9: Composant FormField — grid label + input, états erreur/succès.
UX-DR10: Composant StatusPill — statut global en haut de page.
UX-DR11: Composant CollapsibleSection — header avec icône rotation, transition hauteur.
UX-DR12: Composant Feedback — info/success/error/warning avec couleurs sémantiques.
UX-DR13: Page RadarPage — tableau priorisé, scroll infini, pull-to-refresh, swipe, filtres persistants.
UX-DR14: Page DetailPage — décomposition marge, sparkline interactive, sections pilables, actions Traiter/Ignorer.
UX-DR15: Page SourcesPage — état sources, scan manuel, bottom sheet ajout, long press menu.
UX-DR16: Page LoginPage — champ token, appel POST /api/auth/verify, stockage localStorage.
UX-DR17: Responsive mobile-first — breakpoints 320/640/960/1280, pas de débordement horizontal, cibles tactiles 44px.
UX-DR18: Accessibilité — contraste AA/AAA, focus clavier visible, labels aria, prefers-reduced-motion, HTML sémantique.
UX-DR19: Hooks personnalisés — useInfiniteScroll, useSwipe, useCollapsible.
UX-DR20: Animations — transitions 150-200ms, pulse nouvelle alerte, animation swipe, respect reduced-motion.

## FR Coverage Map

FR-01: Epic 1 - Configurer le cockpit de surveillance
FR-02: Epic 1 - Configurer le cockpit de surveillance
FR-03: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-04: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-05: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-06: Epic 4 - Transformer les signaux en opportunités rentables
FR-07: Epic 4 - Transformer les signaux en opportunités rentables
FR-08: Epic 4 - Transformer les signaux en opportunités rentables
FR-09: Epic 4 - Transformer les signaux en opportunités rentables
FR-10: Epic 4 - Transformer les signaux en opportunités rentables
FR-11: Epic 5 - Alerter & notifier en temps réel
FR-12: Epic 5 - Alerter & notifier en temps réel
FR-13: Epic 6 - Construire l'interface décisionnelle
FR-14: Epic 6 - Construire l'interface décisionnelle
FR-15: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-16: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-17: Epic 6 - Construire l'interface décisionnelle
FR-18: Epic 3 - Protéger l'accès à mon radar
FR-19: Epic 3 - Protéger l'accès à mon radar

## UX-DR Coverage Map

UX-DR1: Epic 6 - Story 6.1 (Design tokens)
UX-DR2: Epic 6 - Story 6.2 (SignalBadge)
UX-DR3: Epic 6 - Story 6.2 (Button)
UX-DR4: Epic 6 - Story 6.2 (Card)
UX-DR5: Epic 6 - Story 6.2 (Toast)
UX-DR6: Epic 6 - Story 6.2 (EmptyState)
UX-DR7: Epic 6 - Story 6.2 (BottomSheet)
UX-DR8: Epic 6 - Story 6.2 (Panel)
UX-DR9: Epic 6 - Story 6.2 (FormField)
UX-DR10: Epic 6 - Story 6.2 (StatusPill)
UX-DR11: Epic 6 - Story 6.2 (CollapsibleSection)
UX-DR12: Epic 6 - Story 6.2 (Feedback)
UX-DR13: Epic 6 - Story 6.3 (RadarPage)
UX-DR14: Epic 6 - Story 6.4 (DetailPage)
UX-DR15: Epic 6 - Story 6.5 (SourcesPage)
UX-DR16: Epic 3 - Story 3.1 (LoginPage dans auth)
UX-DR17: Epic 6 - Story 6.8 (Responsive)
UX-DR18: Epic 6 - Story 6.8 (Accessibilité)
UX-DR19: Epic 6 - Story 6.7 (Hooks)
UX-DR20: Epic 6 - Story 6.8 (Animations via reduced-motion)

## Epic List

### Epic 1: Configurer le cockpit de surveillance ✅ (COMPLÉTÉ)
Permettre à l'utilisateur de cadrer son univers de suivi (produits, référentiels, seuils, frais) pour lancer un monitoring pertinent dès le premier cycle.
**FRs covered:** FR-01, FR-02.
**Stories:** 1.1 ✅, 1.2 ✅, 1.3 ✅

### Epic 2: Orchestrer la collecte fiable multi-sources
Fournir un runtime robuste de collecte qui récupère, horodate et sécurise les signaux tout en restant résilient aux pannes partielles.
**FRs covered:** FR-03, FR-04, FR-05, FR-15, FR-16.

### Epic 3: Protéger l'accès à mon radar
Protéger l'accès à l'application, durcir l'API HTTP exposée, et structurer les logs pour un diagnostic rapide en production.
**FRs covered:** FR-18, FR-19.

### Epic 4: Transformer les signaux en opportunités rentables
Convertir les données collectées en opportunités explicables via estimation marché, calcul de marge nette et scoring configurable.
**FRs covered:** FR-06, FR-07, FR-08, FR-09, FR-10.

### Epic 5: Alerter & notifier en temps réel
Distribuer des alertes exploitables via Telegram et poser l'infrastructure SSE pour le dashboard temps réel. Tous les tests sont intégrés dans les AC de leur story respective.
**FRs covered:** FR-11, FR-12.

### Epic 6: Construire l'interface décisionnelle
Implémenter le design system UX complet (tokens, composants, pages, hooks, responsive, accessibilité), la saisie manuelle d'opportunité, et les tests E2E. Tous les tests sont intégrés dans les AC de leur story respective.
**FRs covered:** FR-13, FR-14, FR-17.

---

## Epic 1: Configurer le cockpit de surveillance

Poser des bases produit stables pour que le revendeur paramètre rapidement sa stratégie sans erreur de configuration.

### Story 1.1: Initialiser l'application et la persistance locale ✅

As a revendeur,
I want une application avec base locale prête,
So that je peux démarrer ma configuration sans dépendance externe.

**Acceptance Criteria:**

**Given** un environnement de développement
**When** l'application est lancée pour la première fois
**Then** le socle backend Rust + UI React est opérationnel
**And** SQLite est initialisée avec migrations versionnées sans erreur.

### Story 1.2: Configurer produits, profils de surveillance et paramètres économiques ✅

As a revendeur,
I want gérer mes produits cibles, seuils de marge et frais,
So that le système reflète ma stratégie réelle de revente.

**Acceptance Criteria:**

**Given** une application initialisée
**When** je crée ou modifie un profil de surveillance
**Then** les paramètres produits/seuils/frais sont persistés localement
**And** ils sont réutilisés automatiquement au prochain cycle de monitoring.
**And** l'écran reste intégralement utilisable de 320 px jusqu'au desktop, sans défilement horizontal de page, avec champs et actions adaptés au tactile.

### Story 1.3: Exploiter des référentiels préenregistrés pour limiter les erreurs ✅

As a revendeur,
I want sélectionner des sets/éditions depuis un référentiel,
So that je réduis les erreurs de saisie et les ambiguïtés produit.

**Acceptance Criteria:**

**Given** un référentiel disponible
**When** je configure un produit suivi
**Then** je peux choisir un item de référentiel avec métadonnées
**And** la saisie libre reste possible mais est signalée comme non normalisée.

---

## Epic 2: Orchestrer la collecte fiable multi-sources

Fournir un runtime robuste de collecte qui récupère, horodate et sécurise les signaux tout en restant résilient aux pannes partielles. Les tests unitaires sont intégrés directement dans les acceptance criteria de chaque story — pas de story de test standalone.

**FRs covered:** FR-03, FR-04, FR-05, FR-15, FR-16

### Story 2.1: Planifier et exécuter les cycles de collecte multi-sources

As a revendeur,
I want que la collecte tourne automatiquement selon une cadence définie,
So that je n'ai plus à surveiller les boutiques manuellement.

**Acceptance Criteria:**

**Given** des sources actives configurées
**When** le scheduler exécute un cycle
**Then** chaque connecteur est invoqué selon cadence + jitter
**And** les résultats sont enregistrés avec timestamp et origine source.

**Given** un connecteur avec des fixtures HTTP mockées (wiremock/httpmock)
**When** les tests unitaires sont exécutés
**Then** le connecteur est testé avec au moins un cas nominal + un cas d'erreur réseau
**And** les tests résident en `#[cfg(test)]` dans le même fichier que le connecteur.

### Story 2.2: Surveiller la santé des connecteurs et gérer la dégradation

As a revendeur,
I want voir les sources instables et conserver un service partiel,
So that une panne d'une source ne bloque pas tout le radar.

**Acceptance Criteria:**

**Given** un échec de connecteur
**When** le cycle de collecte rencontre une erreur réseau/parsing
**Then** l'état source passe en warn/down avec détail d'erreur
**And** le reste des sources continue à fonctionner sans arrêt global.

**Given** le mécanisme de health check
**When** les tests unitaires sont exécutés
**Then** chaque transition d'état source (ok→warn→down→recovery) est testée
**And** le scénario de dégradation partielle est testé (1 source down, 2 OK).

### Story 2.3: Journaliser et auto-récupérer les incidents de collecte

As a revendeur,
I want un moteur qui se rétablit automatiquement sur erreurs temporaires,
So that je conserve une continuité de détection sans intervention constante.

**Acceptance Criteria:**

**Given** une erreur temporaire sur une source
**When** la stratégie de retry/backoff est appliquée
**Then** l'exécution retente selon une politique bornée (max retries, délai exponentiel)
**And** les logs restent exploitables sans exposer de secrets.

**Given** le mécanisme de retry/backoff
**When** les tests unitaires sont exécutés
**Then** les scénarios suivants sont testés : succès au 1er retry, succès au 3e retry, échec après max retries, backoff exponentiel respecté.

---

## Epic 3: Protéger l'accès à mon radar

Protéger l'accès à l'application, durcir l'API HTTP exposée, et structurer les logs pour un diagnostic rapide en production. Les tests sont intégrés directement dans les AC de chaque story.

**FRs covered:** FR-18, FR-19

### Story 3.1: Protéger l'accès à l'application par token Bearer

As a revendeur,
I want que mon application soit protégée par un token d'accès unique,
So that personne d'autre ne puisse accéder à mes données de trading.

**Acceptance Criteria:**

**Given** le secret `POKE_RADAR_AUTH_TOKEN` injecté via variable d'environnement
**When** le frontend appelle une route API avec le header `Authorization: Bearer <token>`
**Then** le middleware backend valide le token et rejette les requêtes non authentifiées par HTTP 401
**And** le middleware est appliqué à toutes les routes `POST /api/*` et `GET /api/events`.
**And** la page LoginPage (UX-DR16) affiche un champ de saisie token qui appelle `POST /api/auth/verify`.
**And** si le token est valide, le frontend le stocke dans `localStorage` et l'envoie à chaque appel API.
**And** le token ne transite jamais dans l'URL et aucune session serveur n'est créée.

**Given** le middleware d'authentification
**When** les tests unitaires sont exécutés
**Then** un token valide retourne 200, un token invalide retourne 401, une requête sans header retourne 401
**And** le test vérifie que le token n'apparaît jamais dans les réponses d'erreur.

### Story 3.2: Sécuriser l'API HTTP (rate limiting, CORS, CSP, SQL paramétré)

As a ops,
I want que l'API soit protégée contre les attaques web courantes,
So that l'application exposée sur le web public reste résiliente.

**Acceptance Criteria:**

**Given** l'API HTTP exposée
**When** des requêtes arrivent
**Then** le rate limiting limite les appels à `POST /api/auth/verify` et `POST /api/scan` par IP.
**And** CORS est restreint au domaine configuré (pas de wildcard `*`).
**And** le header `Content-Security-Policy` restrictif est présent sur chaque réponse.
**And** toutes les requêtes SQL utilisent des requêtes paramétrées (pas de concaténation de chaînes).

**Given** les protections de sécurité
**When** les tests de sécurité sont exécutés
**Then** une injection SQL basique est bloquée
**And** une requête cross-origin depuis un domaine non autorisé est rejetée par CORS
**And** le rate limiting bloque après le seuil configuré par IP
**And** le header CSP est présent avec les directives restrictives attendues.

### Story 3.3: Mettre en place le logging structuré et le format d'erreur unifié

As a ops,
I want des logs structurés et un format d'erreur cohérent,
So that je peux diagnostiquer rapidement les problèmes en production.

**Acceptance Criteria:**

**Given** le backend en production
**When** une erreur ou un événement significatif se produit
**Then** les logs sont émis via `tracing` → `journald` avec niveaux (error, warn, info, debug).
**And** chaque log inclut un `correlation_id` unique par cycle de collecte et par opportunité.
**And** toutes les réponses d'erreur API suivent le format `{ "error": string, "code": string }`.
**And** toutes les réponses API réussies suivent le format `{ "ok": true, "data": ... }`.
**And** les secrets (token, API keys) ne sont jamais loggés même en niveau debug.

**Given** le logger structuré
**When** les tests de logging sont exécutés
**Then** une entrée de log en erreur contient le correlation_id et le message sans secret
**And** un appel API réussi produit une réponse au format `{ "ok": true, "data": ... }`
**And** un appel API en erreur produit `{ "error": "...", "code": "..." }`
**And** une injection volontaire d'un secret dans un message de log est détectée comme absente des sorties.

---

## Epic 4: Transformer les signaux en opportunités rentables

Convertir les données collectées en opportunités explicables via estimation marché, calcul de marge nette et scoring configurable. Les tests unitaires et d'intégration sont intégrés directement dans les AC de chaque story.

**FRs covered:** FR-06, FR-07, FR-08, FR-09, FR-10

### Story 4.1: Enrichir les signaux avec des références de marché secondaire

As a revendeur,
I want compléter les prix retail avec des références marché,
So that l'estimation de revente soit crédible et actionnable.

**Acceptance Criteria:**

**Given** un signal retail valide
**When** le module d'estimation collecte des références secondaires
**Then** des points de comparaison exploitables sont stockés
**And** chaque référence inclut source, fraîcheur et niveau de fiabilité.

**Given** le module d'estimation
**When** les tests unitaires sont exécutés
**Then** un cas nominal avec 3 références valides produit les 3 points stockés
**And** un cas outlier avec zéro référence retourne une estimation marquée "basse confiance" sans erreur
**And** les timestamps sont en UTC ISO-8601.

### Story 4.2: Calculer la marge brute/nette avec explication des hypothèses

As a revendeur,
I want comprendre exactement comment la marge est calculée,
So that je décide en confiance sur chaque opportunité.

**Acceptance Criteria:**

**Given** un prix d'achat et une estimation de revente
**When** le moteur de scoring exécute le calcul économique
**Then** la marge brute et nette sont calculées côté Rust.
**And** le détail des hypothèses (frais, commissions, port) est persisté.
**And** tous les montants sont stockés en centimes (`i64`).
**And** aucun calcul de marge n'est effectué côté frontend TypeScript.

**Given** les fonctions de calcul de marge
**When** les tests unitaires sont exécutés
**Then** au minimum : cas nominal (marge positive), cas limite (marge nulle), cas outlier (tous les frais à zéro, frais > prix revente)
**And** la couverture des branches décisionnelles du calcul de marge nette est de 100%.

### Story 4.3: Classer et filtrer les opportunités selon stratégie utilisateur

As a revendeur,
I want prioriser les signaux selon mes seuils,
So that je traite d'abord les opportunités à meilleure valeur.

**Acceptance Criteria:**

**Given** une liste d'opportunités évaluées
**When** les règles de scoring utilisateur sont appliquées
**Then** les opportunités sous seuil sont exclues
**And** la liste restante est triée par rentabilité/urgence avec niveau de confiance (haute/moyenne/basse).

**Given** le module de scoring
**When** les tests unitaires sont exécutés
**Then** le scénario de tri multi-critères est testé (2 opportunités avec même marge mais fraîcheur différente → la plus fraîche d'abord)
**And** le scénario de seuil configurable est testé (changement du seuil → exclusion différente)
**And** le scénario de déduplication est testé (2 signaux identiques → 1 opportunité conservée).

---

## Epic 5: Alerter & notifier en temps réel

Distribuer des alertes exploitables via Telegram et poser l'infrastructure SSE pour le dashboard temps réel. Tous les tests sont intégrés dans les AC de leur story respective.

**FRs covered:** FR-11, FR-12

**Stories:** 5.1, 5.2, 5.3

### Story 5.1: Envoyer des alertes Telegram exploitables et asynchrones

As a revendeur,
I want recevoir des alertes complètes dès qu'une opportunité est qualifiée,
So that je peux agir rapidement sur les meilleures fenêtres d'achat.

**Acceptance Criteria:**

**Given** une opportunité au-dessus du seuil
**When** le dispatcher d'alertes traite l'événement
**Then** un message Telegram contient produit, prix achat/revente, marge nette, source et timestamp.
**And** l'envoi est asynchrone pour ne pas bloquer le pipeline principal.

**Given** le dispatcher Telegram
**When** les tests unitaires sont exécutés
**Then** un scénario succès (mock Telegram → 200 OK) produit une alerte avec statut "sent"
**And** un scénario échec (mock Telegram → 500/timeout) produit une alerte avec statut "failed" sans bloquer le pipeline.

### Story 5.2: Réduire le bruit par déduplication et historisation des statuts

As a revendeur,
I want éviter les alertes répétées pour un même signal,
So that mon canal reste utile et actionnable.

**Acceptance Criteria:**

**Given** plusieurs événements proches pour une même opportunité
**When** la règle de déduplication est évaluée
**Then** une seule alerte est envoyée dans la fenêtre définie.
**And** le statut d'alerte (sent/failed/suppressed) est historisé.

**Given** le pipeline ingestion → normalisation → scoring → alerting
**When** la suite de tests d'intégration est exécutée
**Then** le pipeline complet est testé sur des données mockées.
**And** les connecteurs externes sont mockés mais le reste du pipeline est réel.
**And** une base SQLite en mémoire (`:memory:`) est utilisée pour l'isolation des tests.
**And** les tests résident dans `backend/tests/integration/`.

### Story 5.3: Implémenter l'infrastructure SSE backend + connexion frontend temps réel

As a dev,
I want un canal SSE fiable entre backend et frontend,
So that le dashboard reçoit les événements en temps réel sans polling.

**Acceptance Criteria:**

**Given** le backend expose `GET /api/events` en SSE
**When** une opportunité est créée, mise à jour, une alerte est envoyée ou la santé d'une source change
**Then** les événements `opportunity.new`, `opportunity.updated`, `alert.sent`, `source.health_changed` sont poussés au frontend.
**And** chaque événement inclut un `correlation_id`.
**And** le frontend utilise l'API `EventSource` native du navigateur pour se connecter.
**And** la connexion SSE est ré-établie automatiquement en cas de perte.

**Given** l'endpoint SSE
**When** les tests d'intégration SSE sont exécutés
**Then** une connexion valide reçoit les événements push
**And** une déconnexion suivie d'une reconnexion automatique est testée
**And** la fermeture du flux côté serveur est gérée sans erreur.

---

## Epic 6: Construire l'interface décisionnelle

Implémenter le design system UX complet (tokens, composants, pages, hooks, responsive, accessibilité), la saisie manuelle d'opportunité, et les tests E2E. Tous les tests sont intégrés dans les AC de leur story respective.

**FRs covered:** FR-13, FR-14, FR-17

**Stories:** 6.1-6.9

### Story 6.1: Implémenter les design tokens CSS et le thème dark "Amber Warmth"

As a frontend dev,
I want des variables CSS centralisées pour le thème dark,
So that tous les composants partagent une cohérence visuelle sans duplication.

**Acceptance Criteria:**

**Given** le fichier de styles global
**When** un composant référence un token CSS
**Then** les variables `--color-bg-*`, `--color-text-*`, `--color-signal-*`, `--space-*` (grille 8px), `--radius-*`, `--font-size-*` sont disponibles.
**And** le thème dark est appliqué globalement : fond `#0B1020`, surface `#131A2E`, texte `#F5F7FF` (UX-DR1).
**And** la typographie Inter est chargée avec fallback système sans-serif (UX-DR1).
**And** les formats monétaires (`XX,XX €`), dates (`JJ/MM/AA`), et temps relatifs (« il y a X min ») sont standardisés.
**And** l'alignement tabulaire est activé sur toutes les colonnes de chiffres.

**Given** les design tokens
**When** les tests de styles sont exécutés
**Then** chaque token CSS est vérifié comme défini et utilisé
**And** le contraste AA est respecté sur le texte standard, AAA sur les KPI critiques (marge, ROI).

### Story 6.2: Créer les composants UI partagés du design system

As a frontend dev,
I want des composants réutilisables couvrant tous les cas d'usage,
So that les pages peuvent être assemblées rapidement et de façon cohérente.

**Acceptance Criteria:**

1. **SignalBadge / ConfidenceBadge (UX-DR2):** Affichage 3 niveaux (haute/moyenne/basse) avec couleurs associées. Testé pour chaque niveau.

2. **Button (UX-DR3):** Variants Primary et Secondary, 6 états (default, hover, focus, active, disabled, loading), min-height 48px, radius 11px. Testé pour chaque état × variant.

3. **Card (UX-DR4):** Variants OpportunityCard et SourceCard. Testés pour rendu avec données mockées.

4. **Toast / Snackbar (UX-DR5):** Slide-up + fade-in, undo 3s, position bas centre. Testé pour apparition, disparition automatique, undo, callback après timeout.

5. **EmptyState (UX-DR6):** Bordure pointillée, message centré. Testé pour rendu avec message personnalisé.

6. **BottomSheet (UX-DR7):** Drag handle, backdrop avec fermeture au tap, border-radius top 18px. Testé pour ouverture, fermeture backdrop, fermeture drag.

7. **Panel (UX-DR8):** Border `#2A345A`, radius 18px, shadow. Testé pour rendu avec children.

8. **FormField (UX-DR9):** Grid label + input, min-height 48px, états erreur/succès. Testé pour chaque état.

9. **StatusPill (UX-DR10):** Pillule de statut global. Testée pour variantes OK/Dégradé/Bloqué.

10. **CollapsibleSection (UX-DR11):** Rotation icône ▼/▶, transition hauteur. Testé pour expansion/réduction, accessibilité aria-expanded.

11. **Feedback (UX-DR12):** 4 variantes info/success/error/warning avec couleurs sémantiques. Testé pour chaque variante.

**And** tous les tests composants utilisent Vitest + React Testing Library, résident dans `frontend/tests/components/`, et couvrent ≥ 80% des lignes.

### Story 6.3: Construire la page Radar (tableau priorisé, scroll infini, swipe, temps réel)

As a revendeur,
I want une vue principale temps réel de toutes mes opportunités classées par pertinence,
So that je peux scanner rapidement et agir.

**Acceptance Criteria:**

**Given** des opportunités persistées et la connexion SSE active
**When** j'ouvre la page Radar
**Then** je vois un tableau priorisé avec les colonnes : produit, source, prix achat, estimation revente, marge nette, confiance, fraîcheur (UX-DR13).
**And** le scroll infini charge par lot de 20 via le hook `useInfiniteScroll`.
**And** le pull-to-refresh est fonctionnel.
**And** le swipe gauche → Ignorer, swipe droite → Traité (avec animation + undo toast 3s) via le hook `useSwipe`.
**And** le tap sur une carte navigue vers la page Détail.
**And** le long press affiche un menu contextuel (Traiter / Ignorer / Suivre).
**And** une barre de recherche filtre en temps réel.
**And** les filtres rapides (Tous / Critiques / Suivis) persistent en session.
**And** le tableau se met à jour en temps réel via SSE sans rafraîchissement manuel.
**And** l'écran est intégralement utilisable de 320 px jusqu'au desktop, sans débordement horizontal.

**Given** la page Radar
**When** les tests composants sont exécutés (Vitest + RTL, MSW pour le backend)
**Then** le rendu avec des données mockées est testé (opportunités, états loading, empty, error)
**And** la pagination par lot de 20 est testée.

### Story 6.4: Construire la page Détail (décomposition marge, sparkline, historique)

As a revendeur,
I want voir le détail complet d'une opportunité avec la décomposition de sa marge,
So that je décide en toute confiance d'acheter ou non.

**Acceptance Criteria:**

**Given** une opportunité sélectionnée
**When** j'ouvre la page Détail
**Then** je vois l'illustration de la carte, le nom, le set et le niveau de confiance (UX-DR14).
**And** la section "Décomposition de la marge" affiche : prix achat, frais port, commission plateforme, frais transaction, coût total, prix revente, marge nette, marge brute, ROI net — tous en format monétaire FR.
**And** la section "Source" affiche l'état, le vendeur, l'état de la carte, la langue, et un lien "Ouvrir la source" en nouvel onglet.
**And** la section "Historique" montre une sparkline interactive des prix avec min/max et date de première détection.
**And** toutes les sections sont pilables (CollapsibleSection).
**And** les boutons "Traité" et "Ignorer" sont en bas de page.
**And** le swipe gauche → Ignorer, swipe droite → Traité (animations).
**And** un bouton ← de retour en haut à gauche.

**Given** la page Détail
**When** les tests composants sont exécutés (Vitest + RTL, MSW)
**Then** le rendu avec une opportunité mockée complète est testé
**And** l'expansion/réduction des sections pilables est testée.

### Story 6.5: Construire la page Sources (état, scan manuel, gestion)

As a revendeur,
I want voir l'état de chaque source et pouvoir lancer un scan manuel,
So that je garde le contrôle sur la collecte de données.

**Acceptance Criteria:**

**Given** des sources configurées avec différents états de santé
**When** j'ouvre la page Sources
**Then** je vois une liste regroupée par état : actives / en pause (UX-DR15).
**And** chaque carte source affiche : icône d'état (🟢 OK / 🟡 Dégradé / 🔴 Bloqué / 🔵 Manuel), nom, dernier scan, nombre d'opportunités trouvées, cartes suivies.
**And** un bouton ⋯ Paramètres ouvre une mini-fiche avec les seuils spécifiques à la source.
**And** un bouton 🔄 Scan lance un scan manuel avec spinner.
**And** un bouton "Ajouter une source" ouvre un BottomSheet avec les connecteurs disponibles.
**And** le long press sur une source affiche un menu contextuel (Pause / Retirer / Dupliquer config).
**And** la saisie manuelle affiche un bouton "+ Ajouter une entrée".

**Given** la page Sources
**When** les tests composants sont exécutés (Vitest + RTL, MSW)
**Then** le rendu avec sources mockées (OK, dégradé, bloqué) est testé
**And** l'ouverture/fermeture du BottomSheet est testée.

### Story 6.6: Construire la page Stratégie (sliders, presets, toggles, référentiels)

As a revendeur,
I want un écran central de stratégie pour ajuster mes paramètres de trading,
So that je peux affiner ma stratégie sans naviguer dans des écrans séparés.

**Acceptance Criteria:**

**Given** l'écran Stratégie & Réglages
**When** je l'ouvre depuis la navigation principale
**Then** je vois les sections suivantes :

**Section Scoring & Marges :**
- Slider marge minimale cible (%) avec valeur affichée en € estimé
- Slider ROI minimum cible (%) avec valeur affichée en € estimé
- Toggle « Alertes uniquement si ROI > seuil »
- Toggle « Ignorer les opportunités sous le prix plancher »

**Section Presets de Stratégie :**
- Sélecteur de preset : Conservateur / Équilibré / Agressif
- Chaque preset pré-remplit les sliders avec des valeurs prédéfinies
- Bouton « Sauvegarder comme preset personnalisé » avec nom

**Section Notifications :**
- Toggle « Activer les alertes Telegram »
- Toggle « Résumé quotidien » (actif/inactif)
- Slider « Fréquence minimale entre alertes » (minutes)
- Statut de connexion Telegram (connecté/déconnecté)

**Section Référentiels :**
- Liste des sets/éditions suivis avec badges de statut
- Bouton « Ajouter un référentiel » ouvrant un BottomSheet de sélection
- Recherche textuelle dans les référentiels disponibles
- Badge « Non normalisé » sur les produits saisis manuellement sans référentiel

**And** tous les sliders ont un pas défini (marge : 1%, ROI : 5%, fréquence : 5 min)
**And** les modifications sont sauvegardées automatiquement avec debounce 500ms
**And** un toast de confirmation apparaît à chaque sauvegarde
**And** l'écran est intégralement utilisable de 320 px jusqu'au desktop, sans débordement horizontal

**Given** la page Stratégie
**When** les tests composants sont exécutés (Vitest + RTL, MSW)
**Then** le rendu complet avec les 4 sections est testé
**And** le changement de preset met à jour les sliders
**And** le toggle de notification Telegram est testé (activé/désactivé)
**And** l'ajout d'un référentiel via BottomSheet est testé
**And** la sauvegarde automatique avec debounce est testée (pas d'appel API pendant le debounce, appel après)

### Story 6.7: Développer les hooks personnalisés (infiniteScroll, swipe, collapsible)

As a frontend dev,
I want des hooks réutilisables pour les patterns d'interaction courants,
So that les pages partagent une expérience utilisateur cohérente.

**Acceptance Criteria:**

**Given** les besoins d'interaction identifiés dans le design system
**When** les hooks sont implémentés

**Then** `useInfiniteScroll` (UX-DR19):
- Charge par lot de 20 avec détection du scroll en bas de page
- Expose les états : loading, hasMore, error
- Appelle un callback `fetchMore` configurable

**Then** `useSwipe` (UX-DR19):
- Gère les gestes tactiles swipe gauche/droite avec seuil configurable (px)
- Produit une animation de sortie (translateX + opacity)
- Appelle `onSwipeLeft` / `onSwipeRight` une fois le seuil franchi

**Then** `useCollapsible` (UX-DR19):
- Gère l'expansion/réduction avec état `isOpen`
- Produit une rotation d'icône ▼/▶ via CSS transform
- Applique une transition de hauteur CSS fluide

**Given** les hooks
**When** les tests unitaires sont exécutés
**Then** chaque hook est testé pour son comportement nominal et ses cas limites
**And** `useInfiniteScroll` est testé pour : chargement initial, fin de liste, erreur de chargement
**And** `useSwipe` est testé pour : swipe gauche franchit le seuil, swipe droite ne franchit pas le seuil
**And** `useCollapsible` est testé pour : toggle, état initial fermé, double-toggle.

### Story 6.8: Implémenter le responsive mobile-first et l'accessibilité

As a utilisateur mobile,
I want que l'application soit pleinement utilisable sur mon téléphone,
So that je peux scanner les opportunités en déplacement.

**Acceptance Criteria:**

**Given** l'application ouverte sur différents viewports
**When** le layout s'adapte

**Then** responsive (UX-DR17):
- L'application est utilisable de 320 px (mobile) à 1920 px (desktop) sans défilement horizontal
- Les breakpoints suivent : mobile 320-639 px (empilé), tablette 640-959 px, desktop ≥ 960 px (dashboard 2 colonnes)
- Toutes les cibles tactiles font au minimum 44×44 px

**Then** accessibilité (UX-DR18):
- Le contraste AA est respecté sur tout le texte, AAA sur les KPI critiques (marge, ROI)
- La navigation complète au clavier est fonctionnelle (Tab, Enter, Escape, flèches)
- Les icônes et badges ont des labels `aria-label` explicites
- Les landmarks HTML sémantiques sont présents (main, nav, headings hiérarchiques h1→h4)

**Then** animations (UX-DR20):
- Les transitions utilisent 150-200ms
- `prefers-reduced-motion: reduce` désactive toutes les animations
- Le pulse de nouvelle alerte et l'animation de swipe respectent la préférence

**Given** l'accessibilité et le responsive
**When** les tests sont exécutés
**Then** les tests d'accessibilité automatisés (axe-core) ne rapportent aucune violation critique
**And** les composants sont testés avec `prefers-reduced-motion: reduce`.

### Story 6.9: Implémenter la saisie manuelle d'opportunité et les tests E2E

As a revendeur,
I want ajouter manuellement une opportunité quand les sources sont indisponibles,
So that le radar reste utile même en mode dégradé.

**Acceptance Criteria:**

**Given** une source indisponible ou l'utilisateur souhaite une entrée manuelle
**When** j'accède au formulaire de saisie manuelle depuis la page Sources
**Then** je peux renseigner : produit, prix d'achat, estimation revente, source, notes.
**And** l'entrée manuelle est intégrée dans le pipeline de scoring comme une opportunité normale.
**And** si l'opportunité dépasse les seuils, une notification est envoyée.

**Given** la saisie manuelle
**When** les tests composants sont exécutés (Vitest + RTL)
**Then** le formulaire est testé pour : saisie valide → intégration pipeline, saisie invalide → erreur champ, succès → toast confirmation.

**Given** l'application déployée localement
**When** la suite Playwright E2E est exécutée
**Then** les 4 parcours critiques suivants sont testés :
- **Journey 1** Alerte → Décision : réception alerte, ouverture Radar, vérification marge, décision.
- **Journey 2** Recalibrage : consultation historique, ajustement seuils, sauvegarde preset.
- **Journey 3** Source indisponible : détection panne, mode dégradé, fallback manuel, reprise auto.
- **Journey 4** Saisie manuelle : ajout manuel d'une entrée, intégration dans le pipeline, notification si qualifiée.
**And** le backend réel est lancé avant les tests.
**And** la base SQLite de test est recréée à chaque run.
**And** les connecteurs sont mockés au niveau HTTP.
**And** les tests résident dans `e2e/tests/`.
