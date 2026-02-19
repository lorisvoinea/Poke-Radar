---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad/_bmad-output/planning-artifacts/prd.md
  - _bmad/_bmad-output/planning-artifacts/architecture.md
  - _bmad/_bmad-output/planning-artifacts/ux-design-specification.md
---

# Poke-Radar - Epic Breakdown

## Overview

Ce document transforme le PRD, l’architecture et la spécification UX en epics et stories prêtes pour l’implémentation.

## Requirements Inventory

### Functional Requirements

FR-01: L’utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités).
FR-02: Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.
FR-03: Le moteur récupère périodiquement disponibilité et prix des sources activées.
FR-04: Chaque donnée est horodatée et associée à sa source.
FR-05: En cas d’échec source, le système marque l’état et bascule en mode dégradé.
FR-06: Le système calcule une estimation de revente à partir des données disponibles.
FR-07: L’interface affiche le niveau de confiance (valeur directe vs estimée).
FR-08: Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels).
FR-09: Les règles de scoring sont configurables par utilisateur.
FR-10: Les opportunités sont triables par rentabilité et urgence.
FR-11: Le système envoie une notification quand une opportunité dépasse les seuils définis.
FR-12: La notification inclut produit, prix d’achat, estimation revente, marge nette, source, timestamp.
FR-13: Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées.
FR-14: Historique consultable pour analyser la qualité des alertes et ajuster les seuils.
FR-15: Journalisation des erreurs de collecte et de calcul.
FR-16: Mécanisme de retry/backoff sur les sources instables.
FR-17: Continuité minimale du service via saisie/import manuel.

### NonFunctional Requirements

NFR-01: Latence détection → notification < 60 secondes sur sources prioritaires.
NFR-02: Uptime monitoring > 95 % sur plages actives.
NFR-03: Dégradation progressive sans arrêt global.
NFR-04: Respect RGPD/nLPD et secret management local.
NFR-05: Pipeline modulaire maintenable et extensible.
NFR-06: UX orientée décision, lisible et accessible.

### Additional Requirements

- Initialiser le socle desktop avec Tauri v2 + Rust + React/TypeScript.
- Utiliser SQLite local avec migrations versionnées.
- Isoler les connecteurs source via interface commune et erreurs typées.
- Centraliser le moteur de scoring/marge côté Rust pour éviter les divergences.
- Implémenter alerting Telegram asynchrone avec anti-duplication.
- Exposer la santé des sources et les statuts d’alertes dans l’UI.
- Respecter les patterns UX du cockpit (table priorisée, panneau détail, filtres persistants).

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

## Epic List

### Epic 1: Configurer le cockpit de surveillance
Permettre à l’utilisateur de cadrer son univers de suivi (produits, référentiels, seuils, frais) pour lancer un monitoring pertinent dès le premier cycle.
**FRs covered:** FR-01, FR-02.

### Epic 2: Orchestrer la collecte fiable multi-sources
Fournir un runtime robuste de collecte qui récupère, horodate et sécurise les signaux tout en restant résilient aux pannes partielles.
**FRs covered:** FR-03, FR-04, FR-05, FR-15, FR-16.

### Epic 3: Transformer les signaux en opportunités rentables
Convertir les données collectées en opportunités explicables via estimation marché, calcul de marge nette et scoring configurable.
**FRs covered:** FR-06, FR-07, FR-08, FR-09, FR-10.

### Epic 4: Alerter et piloter la décision opérationnelle
Distribuer des alertes exploitables et offrir un cockpit local qui soutient la décision et la continuité en mode dégradé.
**FRs covered:** FR-11, FR-12, FR-13, FR-14, FR-17.

## Epic 1: Configurer le cockpit de surveillance

Poser des bases produit stables pour que le revendeur paramètre rapidement sa stratégie sans erreur de configuration.

### Story 1.1: Initialiser l’application desktop et la persistance locale

As a revendeur,
I want une application desktop installable avec base locale prête,
So that je peux démarrer ma configuration sans dépendance externe.

**Acceptance Criteria:**

**Given** un poste compatible desktop
**When** l’application est lancée pour la première fois
**Then** le socle Tauri + UI React est opérationnel
**And** SQLite est initialisée avec migrations versionnées sans erreur.

### Story 1.2: Configurer produits, profils de surveillance et paramètres économiques

As a revendeur,
I want gérer mes produits cibles, seuils de marge et frais,
So that le système reflète ma stratégie réelle de revente.

**Acceptance Criteria:**

**Given** une application initialisée
**When** je crée ou modifie un profil de surveillance
**Then** les paramètres produits/seuils/frais sont persistés localement
**And** ils sont réutilisés automatiquement au prochain cycle de monitoring.

### Story 1.3: Exploiter des référentiels préenregistrés pour limiter les erreurs

As a revendeur,
I want sélectionner des sets/éditions depuis un référentiel,
So that je réduis les erreurs de saisie et les ambiguïtés produit.

**Acceptance Criteria:**

**Given** un référentiel disponible
**When** je configure un produit suivi
**Then** je peux choisir un item de référentiel avec métadonnées
**And** la saisie libre reste possible mais est signalée comme non normalisée.

## Epic 2: Orchestrer la collecte fiable multi-sources

Mettre en place une collecte continue et résiliente, orientée traçabilité et stabilité opérationnelle.

### Story 2.1: Planifier et exécuter les cycles de collecte multi-sources

As a revendeur,
I want que la collecte tourne automatiquement selon une cadence définie,
So that je n’ai plus à surveiller les boutiques manuellement.

**Acceptance Criteria:**

**Given** des sources actives configurées
**When** le scheduler exécute un cycle
**Then** chaque connecteur est invoqué selon cadence + jitter
**And** les résultats sont enregistrés avec timestamp et origine source.

### Story 2.2: Surveiller la santé des connecteurs et gérer la dégradation

As a revendeur,
I want voir les sources instables et conserver un service partiel,
So that une panne d’une source ne bloque pas tout le radar.

**Acceptance Criteria:**

**Given** un échec de connecteur
**When** le cycle de collecte rencontre une erreur réseau/parsing
**Then** l’état source passe en warn/down avec détail d’erreur
**And** le reste des sources continue à fonctionner sans arrêt global.

### Story 2.3: Journaliser et auto-récupérer les incidents de collecte

As a revendeur,
I want un moteur qui se rétablit automatiquement sur erreurs temporaires,
So that je conserve une continuité de détection sans intervention constante.

**Acceptance Criteria:**

**Given** une erreur temporaire sur une source
**When** la stratégie de retry/backoff est appliquée
**Then** l’exécution retente selon une politique bornée
**And** les logs restent exploitables sans exposer de secrets.

## Epic 3: Transformer les signaux en opportunités rentables

Produire un score économique fiable et explicable pour guider des décisions rapides.

### Story 3.1: Enrichir les signaux avec des références de marché secondaire

As a revendeur,
I want compléter les prix retail avec des références marché,
So that l’estimation de revente soit crédible et actionnable.

**Acceptance Criteria:**

**Given** un signal retail valide
**When** le module d’estimation collecte des références secondaires
**Then** des points de comparaison exploitables sont stockés
**And** chaque référence inclut source, fraîcheur et niveau de fiabilité.

### Story 3.2: Calculer la marge brute/nette avec explication des hypothèses

As a revendeur,
I want comprendre exactement comment la marge est calculée,
So that je décide en confiance sur chaque opportunité.

**Acceptance Criteria:**

**Given** un prix d’achat et une estimation de revente
**When** le moteur de scoring exécute le calcul économique
**Then** la marge brute et nette sont calculées côté Rust
**And** le détail des hypothèses (frais, commissions, port) est persisté.

### Story 3.3: Classer et filtrer les opportunités selon stratégie utilisateur

As a revendeur,
I want prioriser les signaux selon mes seuils,
So that je traite d’abord les opportunités à meilleure valeur.

**Acceptance Criteria:**

**Given** une liste d’opportunités évaluées
**When** les règles de scoring utilisateur sont appliquées
**Then** les opportunités sous seuil sont exclues
**And** la liste restante est triée par rentabilité/urgence avec niveau de confiance.

## Epic 4: Alerter et piloter la décision opérationnelle

Fournir un canal d’alerte fiable et un cockpit local permettant d’agir, d’analyser et de continuer en mode dégradé.

### Story 4.1: Envoyer des alertes Telegram exploitables et non bloquantes

As a revendeur,
I want recevoir des alertes complètes dès qu’une opportunité est qualifiée,
So that je peux agir rapidement sur les meilleures fenêtres d’achat.

**Acceptance Criteria:**

**Given** une opportunité au-dessus du seuil
**When** le dispatcher d’alertes traite l’événement
**Then** un message Telegram contient produit, prix achat/revente, marge nette, source et timestamp
**And** l’envoi est asynchrone pour ne pas bloquer le pipeline principal.

### Story 4.2: Réduire le bruit grâce à la déduplication et à l’historisation des statuts

As a revendeur,
I want éviter les alertes répétées pour un même signal,
So that mon canal reste utile et actionnable.

**Acceptance Criteria:**

**Given** plusieurs événements proches pour une même opportunité
**When** la règle de déduplication est évaluée
**Then** une seule alerte est envoyée dans la fenêtre définie
**And** le statut d’alerte (sent/failed/suppressed) est historisé.

### Story 4.3: Exploiter un dashboard décisionnel avec fallback manuel

As a revendeur,
I want une vue unifiée opportunités + santé sources + historique,
So that je peux décider vite et continuer même si une source tombe.

**Acceptance Criteria:**

**Given** des opportunités et états source persistés
**When** j’ouvre le cockpit desktop
**Then** je vois un tableau priorisé, l’état des sources et l’historique des alertes
**And** un mode saisie/import manuel est disponible quand une source est indisponible.
