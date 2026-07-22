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
---

# Poke-Radar - Epic Breakdown

## Overview

Ce document transforme le PRD, l'architecture et la spécification UX en epics et stories prêtes pour l'implémentation.

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
UX-DR4: Composant Card — OpportunityCard, SourceCard, ProfileCard.
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

### FR Coverage Map

FR-01: Epic 1 - Configurer le cockpit de surveillance
FR-02: Epic 1 - Configurer le cockpit de surveillance
FR-03: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-04: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-05: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-06: Epic 3 - Transformer les signaux en opportunités rentables
FR-07: Epic 3 - Transformer les signaux en opportunités rentables
FR-08: Epic 3 - Transformer les signaux en opportunités rentables
FR-09: Epic 3 - Transformer les signaux en opportunités rentables
FR-10: Epic 3 - Transformer les signaux en opportunités rentables
FR-11: Epic 4 - Alerter et piloter la décision opérationnelle
FR-12: Epic 4 - Alerter et piloter la décision opérationnelle
FR-13: Epic 4 - Alerter et piloter la décision opérationnelle
FR-14: Epic 4 - Alerter et piloter la décision opérationnelle
FR-15: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-16: Epic 2 - Orchestrer la collecte fiable multi-sources
FR-17: Epic 4 - Alerter et piloter la décision opérationnelle
FR-18: Epic 2 - Orchestrer la collecte fiable multi-sources (backend HTTP) + Epic 4 (SPA + dashboard web)
FR-19: Epic 2 - Orchestrer la collecte fiable multi-sources (middleware auth)

## Epic List

### Epic 1: Configurer le cockpit de surveillance ✅ (COMPLÉTÉ)
Permettre à l'utilisateur de cadrer son univers de suivi (produits, référentiels, seuils, frais) pour lancer un monitoring pertinent dès le premier cycle.
**FRs covered:** FR-01, FR-02.
**Stories:** 1.1 ✅, 1.2 ✅, 1.3 ✅

### Epic 2: Orchestrer la collecte fiable multi-sources
Fournir un runtime robuste de collecte qui récupère, horodate et sécurise les signaux tout en restant résilient aux pannes partielles. Inclut l'exposition HTTP sécurisée et l'authentification.
**FRs covered:** FR-03, FR-04, FR-05, FR-15, FR-16, FR-18, FR-19.

### Epic 3: Transformer les signaux en opportunités rentables
Convertir les données collectées en opportunités explicables via estimation marché, calcul de marge nette et scoring configurable.
**FRs covered:** FR-06, FR-07, FR-08, FR-09, FR-10.

### Epic 4: Alerter et piloter la décision opérationnelle
Distribuer des alertes exploitables, offrir un dashboard web temps réel avec SSE, implémenter le design system UX complet, et couvrir les tests composants + E2E.
**FRs covered:** FR-11, FR-12, FR-13, FR-14, FR-17.

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

## Epic 2: Orchestrer la collecte fiable & poser les fondations web

Fournir un runtime robuste de collecte qui récupère, horodate et sécurise les signaux tout en restant résilient aux pannes partielles. Inclut l'exposition HTTP sécurisée (auth, rate limiting, CORS, CSP, logging) et les tests backend.

**FRs covered:** FR-03, FR-04, FR-05, FR-15, FR-16, FR-18, FR-19

### Story 2.1: Planifier et exécuter les cycles de collecte multi-sources

As a revendeur,
I want que la collecte tourne automatiquement selon une cadence définie,
So that je n'ai plus à surveiller les boutiques manuellement.

**Acceptance Criteria:**

**Given** des sources actives configurées
**When** le scheduler exécute un cycle
**Then** chaque connecteur est invoqué selon cadence + jitter
**And** les résultats sont enregistrés avec timestamp et origine source.

### Story 2.2: Surveiller la santé des connecteurs et gérer la dégradation

As a revendeur,
I want voir les sources instables et conserver un service partiel,
So that une panne d'une source ne bloque pas tout le radar.

**Acceptance Criteria:**

**Given** un échec de connecteur
**When** le cycle de collecte rencontre une erreur réseau/parsing
**Then** l'état source passe en warn/down avec détail d'erreur
**And** le reste des sources continue à fonctionner sans arrêt global.

### Story 2.3: Journaliser et auto-récupérer les incidents de collecte

As a revendeur,
I want un moteur qui se rétablit automatiquement sur erreurs temporaires,
So that je conserve une continuité de détection sans intervention constante.

**Acceptance Criteria:**

**Given** une erreur temporaire sur une source
**When** la stratégie de retry/backoff est appliquée
**Then** l'exécution retente selon une politique bornée
**And** les logs restent exploitables sans exposer de secrets.

### Story 2.4: Implémenter l'authentification single-user par token Bearer

As a revendeur,
I want protéger mon application par un token d'accès unique,
So that personne d'autre ne puisse accéder à mes données de trading.

**Acceptance Criteria:**

**Given** le secret `POKE_RADAR_AUTH_TOKEN` injecté via variable d'environnement
**When** le frontend appelle une route API avec le header `Authorization: Bearer <token>`
**Then** le middleware backend valide le token et rejette les requêtes non authentifiées par HTTP 401.
**And** la page LoginPage affiche un champ de saisie token qui appelle `POST /api/auth/verify`.
**And** si le token est valide, le frontend le stocke dans `localStorage` et l'envoie à chaque appel API.
**And** le token ne transite jamais dans l'URL et aucune session serveur n'est créée.
**And** le middleware est appliqué à toutes les routes `POST /api/*` et `GET /api/events`.

### Story 2.5: Sécuriser l'API HTTP (rate limiting, CORS, CSP, requêtes paramétrées)

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
**And** un test de sécurité vérifie qu'une injection SQL basique est bloquée.

### Story 2.6: Mettre en place le logging structuré et le format d'erreur API uniforme

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

### Story 2.7: Implémenter les tests unitaires du domaine métier Rust

As a dev,
I want des tests unitaires pour les règles de calcul métier,
So that les régressions sur le scoring et la marge sont détectées automatiquement.

**Acceptance Criteria:**

**Given** les fonctions du domaine métier (marge, scoring, normalisation, déduplication)
**When** la suite de tests est exécutée avec `cargo test`
**Then** chaque fonction a au minimum un cas nominal + un cas outlier.
**And** les tests sont écrits en `#[cfg(test)]` dans le même fichier que le code testé.
**And** les connecteurs sont testés avec des fixtures HTTP mockées (wiremock ou httpmock).
**And** la couverture des calculs de marge nette est de 100 % des branches décisionnelles.

### Story 2.8: Implémenter les tests d'intégration du pipeline complet

As a dev,
I want des tests d'intégration qui valident le pipeline de bout en bout,
So that les défauts d'intégration entre étapes sont détectés avant déploiement.

**Acceptance Criteria:**

**Given** le pipeline ingestion → normalisation → scoring → alerting
**When** la suite de tests d'intégration est exécutée
**Then** le pipeline complet est testé sur des données mockées.
**And** les connecteurs externes sont mockés mais le reste du pipeline est réel.
**And** une base SQLite en mémoire (`:memory:`) est utilisée pour l'isolation des tests.
**And** les tests résident dans `backend/tests/integration/`.

## Epic 3: Transformer les signaux en opportunités rentables

Convertir les données collectées en opportunités explicables via estimation marché, calcul de marge nette et scoring configurable.

**FRs covered:** FR-06, FR-07, FR-08, FR-09, FR-10

### Story 3.1: Enrichir les signaux avec des références de marché secondaire

As a revendeur,
I want compléter les prix retail avec des références marché,
So that l'estimation de revente soit crédible et actionnable.

**Acceptance Criteria:**

**Given** un signal retail valide
**When** le module d'estimation collecte des références secondaires
**Then** des points de comparaison exploitables sont stockés
**And** chaque référence inclut source, fraîcheur et niveau de fiabilité.

### Story 3.2: Calculer la marge brute/nette avec explication des hypothèses

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

### Story 3.3: Classer et filtrer les opportunités selon stratégie utilisateur

As a revendeur,
I want prioriser les signaux selon mes seuils,
So that je traite d'abord les opportunités à meilleure valeur.

**Acceptance Criteria:**

**Given** une liste d'opportunités évaluées
**When** les règles de scoring utilisateur sont appliquées
**Then** les opportunités sous seuil sont exclues
**And** la liste restante est triée par rentabilité/urgence avec niveau de confiance (haute/moyenne/basse).

## Epic 4: Alerter, piloter la décision & UX décisionnelle

Distribuer des alertes exploitables, offrir un dashboard web temps réel avec SSE, implémenter le design system UX complet (composants, pages, responsive, accessibilité), et couvrir les tests frontend + E2E.

**FRs covered:** FR-11, FR-12, FR-13, FR-14, FR-17

### Story 4.1: Envoyer des alertes Telegram exploitables et non bloquantes

As a revendeur,
I want recevoir des alertes complètes dès qu'une opportunité est qualifiée,
So that je peux agir rapidement sur les meilleures fenêtres d'achat.

**Acceptance Criteria:**

**Given** une opportunité au-dessus du seuil
**When** le dispatcher d'alertes traite l'événement
**Then** un message Telegram contient produit, prix achat/revente, marge nette, source et timestamp.
**And** l'envoi est asynchrone pour ne pas bloquer le pipeline principal.

### Story 4.2: Réduire le bruit grâce à la déduplication et à l'historisation des statuts

As a revendeur,
I want éviter les alertes répétées pour un même signal,
So that mon canal reste utile et actionnable.

**Acceptance Criteria:**

**Given** plusieurs événements proches pour une même opportunité
**When** la règle de déduplication est évaluée
**Then** une seule alerte est envoyée dans la fenêtre définie.
**And** le statut d'alerte (sent/failed/suppressed) est historisé.

### Story 4.3: Implémenter le dashboard décisionnel avec SSE temps réel

As a revendeur,
I want un dashboard qui se met à jour en temps réel sans rafraîchissement manuel,
So that je vois immédiatement les nouvelles opportunités et les changements d'état source.

**Acceptance Criteria:**

**Given** le backend expose `GET /api/events` en SSE
**When** une opportunité est créée, mise à jour, une alerte est envoyée ou la santé d'une source change
**Then** les événements `opportunity.new`, `opportunity.updated`, `alert.sent`, `source.health_changed` sont poussés au frontend.
**And** le frontend utilise l'API `EventSource` native du navigateur pour se connecter.
**And** le dashboard se met à jour sans rafraîchissement manuel.
**And** la connexion SSE est ré-établie automatiquement en cas de perte.
**And** un mode saisie/import manuel est disponible quand une source est indisponible.
**And** le tableau affiche les colonnes : produit, source, prix achat, estimation revente, marge nette, confiance, fraîcheur.
**And** les opportunités sont triables par rentabilité et urgence.

### Story 4.4: Implémenter les design tokens CSS et le thème dark

As a frontend dev,
I want des variables CSS centralisées pour le thème dark "Amber Warmth",
So that tous les composants partagent une cohérence visuelle sans duplication.

**Acceptance Criteria:**

**Given** le fichier de styles global
**When** un composant référence un token CSS
**Then** les variables `--color-bg-*`, `--color-text-*`, `--color-signal-*`, `--space-*`, `--radius-*`, `--font-size-*` sont disponibles.
**And** le thème dark est appliqué globalement : fond `#0B1020`, surface `#131A2E`, texte `#F5F7FF`.
**And** la typographie Inter est chargée avec fallback système sans-serif.
**And** les formats monétaires (`XX,XX €`), dates (`JJ/MM/AA`), et temps relatifs (« il y a X min ») sont standardisés.
**And** l'alignement tabulaire est activé sur toutes les colonnes de chiffres.

### Story 4.5: Créer les composants UI partagés du design system

As a frontend dev,
I want des composants réutilisables couvrant tous les cas d'usage,
So that les pages peuvent être assemblées rapidement et de façon cohérente.

**Acceptance Criteria:**

**Given** le design system défini dans DESIGN.md
**When** les composants sont implémentés
**Then** les 11 composants suivants sont disponibles avec tous leurs états (default, hover, focus, active, disabled, loading, error) :
- **SignalBadge / ConfidenceBadge** : 3 niveaux (haute/moyenne/basse) avec couleurs associées.
- **Button** : Primary et Secondary, min-height 48px, radius 11px.
- **Card** : variants OpportunityCard, SourceCard.
- **Toast / Snackbar** : slide-up + fade-in, undo 3s, position bas centre.
- **EmptyState** : bordure pointillée, message centré.
- **BottomSheet** : drag handle, backdrop avec fermeture au tap, border-radius top 18px.
- **Panel** : border `#2A345A`, radius 18px, shadow.
- **FormField** : grid label + input, min-height 48px.
- **StatusPill** : pillule de statut global.
- **CollapsibleSection** : rotation icône ▼/▶, transition hauteur.
- **Feedback** : info/success/error/warning avec couleurs sémantiques.

### Story 4.6: Construire la page Radar (tableau priorisé, scroll infini, swipe)

As a revendeur,
I want une vue principale qui liste toutes mes opportunités classées par pertinence,
So that je peux scanner rapidement et agir.

**Acceptance Criteria:**

**Given** des opportunités persistées
**When** j'ouvre la page Radar
**Then** je vois un tableau priorisé avec scroll infini (chargement par lot de 20).
**And** le pull-to-refresh est fonctionnel.
**And** le swipe gauche → Ignorer, swipe droite → Traité (avec animation + undo toast 3s).
**And** le tap sur une carte navigue vers la page Détail.
**And** le long press affiche un menu contextuel (Traiter / Ignorer / Suivre).
**And** une barre de recherche filtre en temps réel.
**And** les filtres rapides (Tous / Critiques / Suivis) persistent en session.
**And** l'écran est intégralement utilisable de 320 px jusqu'au desktop, sans débordement horizontal.

### Story 4.7: Construire la page Détail (décomposition marge, sparkline)

As a revendeur,
I want voir le détail complet d'une opportunité avec la décomposition de sa marge,
So that je décide en toute confiance d'acheter ou non.

**Acceptance Criteria:**

**Given** une opportunité sélectionnée
**When** j'ouvre la page Détail
**Then** je vois l'illustration de la carte, le nom, le set et le niveau de confiance.
**And** la section "Décomposition de la marge" affiche : prix achat, frais port, commission plateforme, frais transaction, coût total, prix revente, marge nette, marge brute, ROI net — tous en format monétaire FR.
**And** la section "Source" affiche l'état, le vendeur, l'état de la carte, la langue, et un lien "Ouvrir la source" en nouvel onglet.
**And** la section "Historique" montre une sparkline interactive des prix avec min/max et date de première détection.
**And** toutes les sections sont pilables (CollapsibleSection).
**And** les boutons "Traité" et "Ignorer" sont en bas de page.
**And** le swipe gauche → Ignorer, swipe droite → Traité (animations).
**And** un bouton ← de retour en haut à gauche.

### Story 4.8: Construire la page Sources (état, scan manuel)

As a revendeur,
I want voir l'état de chaque source et pouvoir lancer un scan manuel,
So that je garde le contrôle sur la collecte de données.

**Acceptance Criteria:**

**Given** des sources configurées avec différents états de santé
**When** j'ouvre la page Sources
**Then** je vois une liste regroupée par état (actives / en pause).
**And** chaque carte source affiche : icône d'état (🟢 OK / 🟡 Dégradé / 🔴 Bloqué / 🔵 Manuel), nom, dernier scan, nombre d'opportunités trouvées, cartes suivies.
**And** un bouton ⋯ Paramètres ouvre une mini-fiche avec les seuils spécifiques à la source.
**And** un bouton 🔄 Scan lance un scan manuel avec spinner.
**And** un bouton "Ajouter une source" ouvre un BottomSheet avec les connecteurs disponibles.
**And** le long press sur une source affiche un menu contextuel (Pause / Retirer / Dupliquer config).
**And** la saisie manuelle affiche un bouton "+ Ajouter une entrée".

### Story 4.9: Implémenter le responsive mobile-first et l'accessibilité

As a utilisateur mobile,
I want que l'application soit pleinement utilisable sur mon téléphone,
So that je peux scanner les opportunités en déplacement.

**Acceptance Criteria:**

**Given** l'application ouverte sur différents viewports
**When** le layout s'adapte
**Then** l'application est utilisable de 320 px (mobile) à 1920 px (desktop) sans défilement horizontal.
**And** les breakpoints suivent la grille : mobile 320-639 px (empilé), tablette 640-959 px, desktop ≥ 960 px (dashboard 2 colonnes).
**And** toutes les cibles tactiles font au minimum 44×44 px.
**And** le contraste AA est respecté sur tout le texte, AAA sur les KPI critiques (marge, ROI).
**And** la navigation complète au clavier est fonctionnelle (Tab, Enter, Escape, flèches).
**And** les icônes et badges ont des labels aria explicites.
**And** les landmarks HTML sémantiques sont présents (main, nav, headings hiérarchiques).
**And** `prefers-reduced-motion: reduce` désactive toutes les animations.

### Story 4.10: Développer les hooks personnalisés (infiniteScroll, swipe, collapsible)

As a frontend dev,
I want des hooks réutilisables pour les patterns d'interaction courants,
So that les pages partagent une expérience utilisateur cohérente.

**Acceptance Criteria:**

**Given** les besoins d'interaction identifiés dans le design system
**When** les hooks sont implémentés
**Then** `useInfiniteScroll` gère le chargement par lot de 20, avec détection du scroll en bas de page, état loading et fin de liste.
**And** `useSwipe` gère les gestes tactiles swipe gauche/droite avec seuil configurable, animation de sortie, callback onSwipeLeft/onSwipeRight.
**And** `useCollapsible` gère l'expansion/réduction avec rotation d'icône ▼/▶ et transition de hauteur CSS.

### Story 4.11: Implémenter les tests composants UI (Vitest + RTL)

As a dev,
I want que chaque composant partagé soit testé pour tous ses états,
So that les régressions visuelles et fonctionnelles sont détectées en CI.

**Acceptance Criteria:**

**Given** les composants partagés du design system
**When** la suite de tests frontend est exécutée avec Vitest
**Then** chaque composant partagé est testé pour ses états : default, disabled, loading, error, success.
**And** les pages sont testées avec MSW (Mock Service Worker) pour simuler le backend.
**And** les tests résident dans `frontend/tests/components/`.
**And** la couverture minimale est de 80 % sur les composants partagés.

### Story 4.12: Implémenter les tests E2E Playwright (4 parcours critiques)

As a QA,
I want des tests end-to-end qui valident les parcours utilisateur critiques,
So that les régressions sur les flux métier sont détectées avant déploiement.

**Acceptance Criteria:**

**Given** l'application déployée localement
**When** la suite Playwright est exécutée
**Then** les 4 parcours suivants sont testés :
- **Journey 1** Alerte → Décision : réception alerte, ouverture Radar, vérification marge, décision.
- **Journey 2** Recalibrage : consultation historique, ajustement seuils, sauvegarde preset.
- **Journey 3** Source indisponible : détection panne, mode dégradé, fallback manuel, reprise auto.
- **Journey 4** Saisie manuelle : ajout manuel d'une entrée, intégration dans le pipeline.
**And** le backend réel est lancé avant les tests.
**And** la base SQLite de test est recréée à chaque run.
**And** les connecteurs sont mockés au niveau HTTP.
**And** les tests résident dans `e2e/tests/`.

## FR Coverage Map

FR-01: Epic 1 - Configurer le cockpit de surveillance
FR-02: Epic 1 - Configurer le cockpit de surveillance
FR-03: Epic 2 - Orchestrer la collecte fiable & fondations web
FR-04: Epic 2 - Orchestrer la collecte fiable & fondations web
FR-05: Epic 2 - Orchestrer la collecte fiable & fondations web
FR-06: Epic 3 - Transformer les signaux en opportunités rentables
FR-07: Epic 3 - Transformer les signaux en opportunités rentables
FR-08: Epic 3 - Transformer les signaux en opportunités rentables
FR-09: Epic 3 - Transformer les signaux en opportunités rentables
FR-10: Epic 3 - Transformer les signaux en opportunités rentables
FR-11: Epic 4 - Alerter, piloter & UX décisionnelle
FR-12: Epic 4 - Alerter, piloter & UX décisionnelle
FR-13: Epic 4 - Alerter, piloter & UX décisionnelle
FR-14: Epic 4 - Alerter, piloter & UX décisionnelle
FR-15: Epic 2 - Orchestrer la collecte fiable & fondations web
FR-16: Epic 2 - Orchestrer la collecte fiable & fondations web
FR-17: Epic 4 - Alerter, piloter & UX décisionnelle
FR-18: Epic 2 - Orchestrer la collecte fiable & fondations web
FR-19: Epic 2 - Orchestrer la collecte fiable & fondations web
