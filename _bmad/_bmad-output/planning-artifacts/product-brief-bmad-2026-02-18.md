---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - _bmad/_bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
  - _bmad/_bmad-output/brainstorming/brainstorming-session-2025-02-05.md
  - _bmad/_bmad-output/planning-artifacts/architecture.md
  - _bmad/_bmad-output/planning-artifacts/prd.md
  - _bmad/_bmad-output/planning-artifacts/epics.md
date: 2026-02-18
author: Loris
---

# Product Brief: Poke-Radar

## Executive Summary

Poke-Radar est une application desktop de market intelligence Pokémon TCG qui transforme un flux de signaux bruités (stocks retail + prix secondaires) en décisions d’achat actionnables. Le produit vise un résultat simple: détecter vite, filtrer mieux, agir uniquement sur les opportunités réellement rentables.

Le brief est aligné sur les artefacts actuels du projet (recherche domaine, brainstorming, architecture, PRD et epics) afin de consolider une vision unique avant exécution.

---

## Core Vision

### Problem Statement

Les revendeurs indépendants Pokémon perdent des opportunités car la veille manuelle multi-sites est lente, peu fiable et difficile à arbitrer économiquement en temps réel.

### Problem Impact

- Veille manuelle coûteuse en temps et en attention.
- Opportunités manquées sur des restocks à fenêtre courte.
- Achats non optimisés faute de calcul net (frais, commissions, shipping, risque de liquidité).
- Fatigue décisionnelle due à trop de signaux peu exploitables.

### Why Existing Solutions Fall Short

- Les solutions existantes sont souvent centrées sur la disponibilité brute, pas sur la rentabilité nette.
- Les workflows restent fragmentés entre monitoring, pricing et décision.
- Peu d’outils sont adaptés au contexte local desktop et au besoin d’itération rapide sur seuils métier.

### Proposed Solution

Une application desktop locale (Tauri + Rust + React + SQLite) qui:

1. Surveille automatiquement des sources retail priorisées.
2. Enrichit les signaux avec des références de prix secondaire.
3. Calcule une marge nette estimée traçable et configurable.
4. Notifie sur Telegram uniquement les opportunités au-dessus des seuils.
5. Offre un dashboard local pour piloter configuration, état moteur et historique.

### Key Differentiators

- Filtrage orienté profit net plutôt que simple alerte stock.
- Exécution locale (contrôle, confidentialité, faible friction d’usage).
- Architecture modulaire conçue pour résilience scraping + scalabilité progressive des connecteurs.
- Positionnement de niche: arbitrage Pokémon TCG pour revendeurs indépendants.

## Target Users

### Primary Users

1. **Revendeur indépendant Pokémon (persona Alex, 28 ans)**
   - Activité d’achat/revente en complément d’une activité principale.
   - Besoin: réduire le temps de veille et augmenter la qualité des décisions d’achat.

2. **Flipper premium (persona Sam, 33 ans)**
   - Focus sur des unités à plus forte valeur et rotation sélective.
   - Besoin: recevoir moins de signaux, mais avec un ROI attendu plus élevé.

### Secondary Users

- **Partenaire opérationnel** qui aide à l’exécution logistique et souhaite une visibilité claire des signaux.
- **Collaborateur ponctuel** qui applique des règles d’achat définies à l’avance.

### User Journey

1. **Onboarding**: configuration produits, sources, frais et seuils.
2. **Monitoring**: le moteur tourne en continu et détecte les changements de stock.
3. **Qualification**: les signaux sont enrichis et scorés par marge nette.
4. **Action**: l’utilisateur reçoit une alerte Telegram contextualisée et décide rapidement.
5. **Amélioration continue**: ajustement des paramètres via historique et feedback des résultats.

## Success Metrics

### User Success Metrics

- Réduction du temps de veille manuelle: **-70%** sous 30 jours.
- Délai décisionnel après détection d’un restock: **< 5 minutes**.
- Taux d’alertes jugées actionnables: **> 60%**.

### Business Objectives

- Augmenter la marge nette moyenne mensuelle par opération.
- Augmenter le volume d’opportunités exécutables sans surcharge logistique.
- Stabiliser un flux d’aide à la décision exploitable en continu.

### Key Performance Indicators

- **Précision des alertes rentables** = alertes profitables / alertes totales.
- **Latence détection → notification** (objectif prioritaire < 60s).
- **Uptime moteur de monitoring** sur les périodes actives.
- **Marge nette moyenne** des opportunités exécutées.
- **Taux d’erreurs connecteurs** et capacité de reprise.

## MVP Scope

### Core Features

1. Gestion du catalogue produits cibles.
2. Configuration des sources et paramètres économiques.
3. Monitoring périodique avec état de dernière observation.
4. Collecte de prix secondaires + normalisation.
5. Calcul de marge nette et priorisation des opportunités.
6. Alerting Telegram anti-duplication.
7. Dashboard local (opportunités, statut moteur, historique).

### Out of Scope for MVP

- Auto-checkout / exécution d’achat automatisée.
- Version cloud multi-utilisateur.
- Couverture internationale exhaustive dès la phase initiale.
- Prédictions avancées IA long terme.

### MVP Success Criteria

- Pipeline vertical stable: détection → qualification → alerte → suivi dashboard.
- Mesures de performance conformes aux objectifs MVP (latence, actionnabilité, stabilité).
- Adoption quotidienne par l’utilisateur cible avec amélioration mesurable de la décision.

### Future Vision

- Extension multi-sources et multi-catégories (sealed, singles, gradées).
- Scoring avancé (liquidité, volatilité, confiance multi-signaux).
- Scénarios semi-automatisés d’exécution assistée.

---

**Statut workflow:** Terminé (create-product-brief)
**Prochaine étape recommandée:** `create-prd`
