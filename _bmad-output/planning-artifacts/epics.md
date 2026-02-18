---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
  - architecture_technique.md
---

# Poke-Radar - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Poke-Radar, decomposing the requirements from the PRD, UX Design and architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Le système doit permettre d’ajouter/modifier/supprimer des produits cibles et leurs métadonnées.
FR2: Le système doit permettre de configurer les sources retail par produit.
FR3: Le système doit permettre de définir des seuils de marge et paramètres de frais.
FR4: Le système doit interroger périodiquement les sources configurées.
FR5: Le système doit détecter les changements de disponibilité produit.
FR6: Le système doit conserver l’état de dernière observation par source.
FR7: Le système doit récupérer des références de prix secondaire (Cardmarket/eBay ou équivalent).
FR8: Le système doit normaliser les données de prix pour comparabilité.
FR9: Le système doit horodater chaque donnée de prix collectée.
FR10: Le système doit calculer une marge nette estimée en intégrant les frais configurés.
FR11: Le système doit classer/prioriser les opportunités selon rentabilité.
FR12: Le système doit permettre d’exclure des opportunités sous seuil.
FR13: Le système doit envoyer une alerte Telegram lorsqu’une opportunité dépasse le seuil défini.
FR14: L’alerte doit inclure au minimum produit, prix achat, prix revente estimé, marge et source.
FR15: Le système doit éviter le spam de notifications via règles anti-duplication.
FR16: Le système doit afficher les opportunités détectées dans un tableau de bord local.
FR17: Le système doit permettre de consulter l’historique des alertes et signaux.
FR18: Le système doit afficher l’état courant du moteur (actif, erreur, pause).
FR19: Le système doit journaliser erreurs de scraping et événements clés.
FR20: Le système doit appliquer des stratégies de reprise en cas d’échec temporaire.
FR21: Le système doit supporter la mise à jour des paramètres sans redéploiement complet.

### NonFunctional Requirements

NFR1: Le délai détection → alerte doit être inférieur à 60 secondes sur sources prioritaires.
NFR2: Le cycle de monitoring doit rester stable sous charge MVP définie.
NFR3: Les secrets (token Telegram, clés éventuelles) doivent être stockés de manière sécurisée localement.
NFR4: Les logs ne doivent pas exposer de secrets en clair.
NFR5: L’architecture doit permettre l’ajout de nouvelles sources sans refonte globale.
NFR6: Le système doit gérer une montée progressive du nombre de produits surveillés.
NFR7: L’interface doit rester lisible et utilisable pour des sessions longues.
NFR8: L’intégration Telegram doit être fiable et testable par message de contrôle.
NFR9: Les connecteurs de sources doivent exposer une interface homogène.

### Additional Requirements

- Initialiser le projet depuis un starter template Tauri v2 + Rust + React + TypeScript + Vite.
- Implémenter une architecture modulaire avec séparation claire (sourcing, estimation, scoring, alerting, UI).
- Utiliser SQLite comme stockage local (tables produits, URLs suivies, prix marché, opportunités).
- Implémenter cadence/jitter/backoff/retry pour respecter les contraintes de scraping.
- Prévoir rotation d’User-Agents et garde-fous anti-abus pour les connecteurs retail.
- Mettre en place logs structurés et états de santé du moteur local.
- Respecter les patterns UX de dashboard décisionnel (table triable, panneau de détail, filtres persistants).
- Garantir accessibilité (contraste AA, navigation clavier, tailles interactives min 40px).
- Prioriser desktop >=1280px, avec support minimal laptop/tablet.
- Fournir des messages explicatifs « pourquoi cette alerte » dans l’UI.

### FR Coverage Map

FR1: Epic 1 - Cadrer et piloter la stratégie de sourcing
FR2: Epic 1 - Cadrer et piloter la stratégie de sourcing
FR3: Epic 1 - Cadrer et piloter la stratégie de sourcing
FR4: Epic 2 - Détecter les restocks de façon fiable et exploitable
FR5: Epic 2 - Détecter les restocks de façon fiable et exploitable
FR6: Epic 2 - Détecter les restocks de façon fiable et exploitable
FR7: Epic 3 - Évaluer la rentabilité réelle des opportunités
FR8: Epic 3 - Évaluer la rentabilité réelle des opportunités
FR9: Epic 3 - Évaluer la rentabilité réelle des opportunités
FR10: Epic 3 - Évaluer la rentabilité réelle des opportunités
FR11: Epic 3 - Évaluer la rentabilité réelle des opportunités
FR12: Epic 3 - Évaluer la rentabilité réelle des opportunités
FR13: Epic 4 - Alerter et décider rapidement avec un cockpit actionnable
FR14: Epic 4 - Alerter et décider rapidement avec un cockpit actionnable
FR15: Epic 4 - Alerter et décider rapidement avec un cockpit actionnable
FR16: Epic 4 - Alerter et décider rapidement avec un cockpit actionnable
FR17: Epic 4 - Alerter et décider rapidement avec un cockpit actionnable
FR18: Epic 4 - Alerter et décider rapidement avec un cockpit actionnable
FR19: Epic 2 - Détecter les restocks de façon fiable et exploitable
FR20: Epic 2 - Détecter les restocks de façon fiable et exploitable
FR21: Epic 1 - Cadrer et piloter la stratégie de sourcing

## Epic List

### Epic 1: Cadrer et piloter la stratégie de sourcing
Permettre à l’utilisateur de configurer ses produits, sources et paramètres économiques sur une base projet saine, afin de lancer le moteur avec des règles métier maîtrisées.
**FRs covered:** FR1, FR2, FR3, FR21.

### Epic 2: Détecter les restocks de façon fiable et exploitable
Permettre à l’utilisateur d’obtenir un flux fiable de détection de disponibilité avec état, observabilité et reprise automatique.
**FRs covered:** FR4, FR5, FR6, FR19, FR20.

### Epic 3: Évaluer la rentabilité réelle des opportunités
Permettre à l’utilisateur de transformer un signal de stock en opportunité économique qualifiée (prix marché, marge nette, priorisation).
**FRs covered:** FR7, FR8, FR9, FR10, FR11, FR12.

### Epic 4: Alerter et décider rapidement avec un cockpit actionnable
Permettre à l’utilisateur de recevoir des alertes non bruyantes et de décider rapidement via un dashboard local orienté action.
**FRs covered:** FR13, FR14, FR15, FR16, FR17, FR18.

## Epic 1: Cadrer et piloter la stratégie de sourcing

Établir une fondation de configuration robuste et exploitable, permettant de gérer les cibles et paramètres métier sans redéploiement.

### Story 1.1: Initialiser l’application depuis le starter template Tauri

As a développeur produit,
I want initialiser le projet avec Tauri v2 + Rust + React/TypeScript,
So that l’équipe dispose d’un socle exécutable, sécurisé et aligné avec l’architecture cible.

**Acceptance Criteria:**

**Given** un repository vide ou initial
**When** j’exécute la création du projet depuis le template validé
**Then** la structure Tauri (backend Rust + frontend React) est opérationnelle localement
**And** un fichier de configuration d’environnement est prêt pour les secrets non versionnés.

### Story 1.2: Gérer le catalogue produits cibles

As a revendeur,
I want ajouter, modifier et supprimer des produits avec leurs métadonnées,
So that je maîtrise précisément le périmètre de surveillance.

**Acceptance Criteria:**

**Given** un utilisateur connecté à l’application locale
**When** il crée ou modifie une fiche produit
**Then** les données sont persistées en SQLite avec validation des champs critiques (nom, identifiant, catégorie)
**And** la liste des produits est immédiatement reflétée dans l’UI sans redémarrage.

### Story 1.3: Configurer les sources et règles économiques par produit

As a revendeur,
I want associer des sources retail à chaque produit et définir mes seuils de marge/frais,
So that les calculs de rentabilité utilisent ma réalité opérationnelle.

**Acceptance Criteria:**

**Given** un produit existant
**When** l’utilisateur ajoute/retire une source et met à jour les paramètres de frais/seuils
**Then** les paramètres sont versionnés localement et applicables au prochain cycle de traitement
**And** une mise à jour de configuration est prise en compte à chaud sans redéploiement.

## Epic 2: Détecter les restocks de façon fiable et exploitable

Fournir un moteur de surveillance résilient qui détecte les variations de disponibilité en continu, tout en restant traçable et robuste.

### Story 2.1: Exécuter un moteur de polling planifié des sources

As a revendeur,
I want que les sources configurées soient interrogées périodiquement automatiquement,
So that je n’aie plus à faire de veille manuelle.

**Acceptance Criteria:**

**Given** des produits et sources valides configurés
**When** le scheduler lance un cycle de monitoring
**Then** chaque connecteur retail est appelé selon une cadence configurable avec jitter
**And** le cycle reste stable dans les limites de charge MVP.

### Story 2.2: Détecter les changements de disponibilité et mémoriser le dernier état

As a revendeur,
I want être notifié uniquement lors d’un vrai changement de statut stock,
So that je réduis les faux positifs et la fatigue décisionnelle.

**Acceptance Criteria:**

**Given** un historique d’état par produit/source
**When** un statut passe de rupture à disponible (ou l’inverse)
**Then** un événement de changement est généré avec horodatage
**And** le dernier état observé est persisté pour comparaison au cycle suivant.

### Story 2.3: Assurer observabilité et reprise automatique du moteur

As a revendeur,
I want que les erreurs temporaires soient journalisées et auto-récupérées,
So that le service reste fiable sans supervision continue.

**Acceptance Criteria:**

**Given** une erreur de scraping réseau ou parsing
**When** l’exécution d’un connecteur échoue
**Then** l’incident est loggé sans exposer de secret
**And** une stratégie de retry/backoff redémarre le flux sans interrompre tout le moteur.

## Epic 3: Évaluer la rentabilité réelle des opportunités

Transformer les signaux de stock en opportunités priorisées via enrichissement marché, normalisation et calcul de marge nette.

### Story 3.1: Collecter les références de prix du marché secondaire

As a revendeur,
I want récupérer des prix eBay/Cardmarket pertinents pour un produit détecté,
So that je dispose d’un benchmark réaliste de revente.

**Acceptance Criteria:**

**Given** un produit détecté comme disponible
**When** le module d’estimation interroge les sources marché secondaires
**Then** des références de prix exploitables sont collectées avec provenance de source
**And** chaque enregistrement est horodaté pour mesurer la fraîcheur des données.

### Story 3.2: Normaliser les données et calculer la marge nette estimée

As a revendeur,
I want convertir des données hétérogènes en une marge nette comparable,
So that je puisse décider sur des chiffres cohérents.

**Acceptance Criteria:**

**Given** des prix d’achat retail et des prix de revente collectés
**When** le moteur applique les règles de normalisation et les frais configurés
**Then** une marge nette estimée est calculée de façon explicable
**And** les hypothèses de calcul sont traçables (frais, commissions, timestamp, source).

### Story 3.3: Prioriser et filtrer les opportunités selon la rentabilité

As a revendeur,
I want voir uniquement les opportunités au-dessus de mon seuil et classées par valeur,
So that je concentre mon temps sur les meilleures décisions.

**Acceptance Criteria:**

**Given** un ensemble d’opportunités calculées
**When** le module de scoring applique le seuil utilisateur
**Then** les opportunités sous seuil sont exclues
**And** le reste est trié selon un score de rentabilité priorisé.

## Epic 4: Alerter et décider rapidement avec un cockpit actionnable

Orchestrer la diffusion d’alertes et l’aide à la décision via un dashboard clair, réactif et orienté exécution.

### Story 4.1: Envoyer des alertes Telegram riches et testables

As a revendeur,
I want recevoir une alerte Telegram complète dès qu’une opportunité rentable apparaît,
So that je peux agir en moins de 5 minutes.

**Acceptance Criteria:**

**Given** une opportunité dont le score dépasse le seuil configuré
**When** le module d’alerting déclenche une notification
**Then** le message inclut produit, source, prix achat, prix revente estimé et marge
**And** un message de contrôle permet de valider la fiabilité de l’intégration Telegram.

### Story 4.2: Réduire le bruit avec anti-duplication et état d’alerte

As a revendeur,
I want éviter les notifications répétitives pour le même signal,
So that je garde un canal d’alerte exploitable.

**Acceptance Criteria:**

**Given** plusieurs détections proches pour une même opportunité
**When** la règle anti-duplication s’applique
**Then** une seule alerte pertinente est envoyée dans la fenêtre de déduplication
**And** l’historique conserve l’état (envoyée, ignorée, traitée) pour audit.

### Story 4.3: Exploiter un dashboard local orienté décision

As a revendeur,
I want visualiser les opportunités, l’historique et l’état moteur dans une UI lisible,
So that je décide vite tout en gardant une vision globale de mon activité.

**Acceptance Criteria:**

**Given** des opportunités et événements déjà collectés
**When** l’utilisateur ouvre l’application desktop
**Then** un tableau triable affiche opportunités, score, marge nette et fraîcheur
**And** l’interface respecte les contraintes UX d’accessibilité (contraste, navigation clavier, lisibilité longue session).
