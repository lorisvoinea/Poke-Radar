---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - technical-Poke-Radar-research.md
  - market-Poke-Radar-research.md
  - rapport_brainstorming.md
date: 2026-02-18
author: Loris
---

# Product Brief: Poke-Radar

## Executive Summary

Poke-Radar est un assistant desktop qui surveille automatiquement le marché Pokémon pour identifier des opportunités de revente rentables, puis alerte l’utilisateur en temps réel. Le produit vise à remplacer une veille manuelle chronophage par un système décisionnel basé sur des données de stock et de prix vérifiées.

L’objectif est de transformer une activité limitée par la logistique (volume de colis, stockage, temps opérationnel) en activité pilotée par l’information et la rapidité d’exécution.

---

## Core Vision

### Problem Statement

Les revendeurs indépendants Pokémon perdent des opportunités car ils doivent surveiller manuellement plusieurs boutiques, comparer les prix à la main, et décider trop tard quand les produits disparaissent rapidement.

### Problem Impact

- Temps perdu en rafraîchissement manuel des pages.
- Opportunités manquées sur les restocks “hype”.
- Risque d’acheter des produits non rentables faute d’analyse nette (frais + commissions).
- Limite de croissance à cause de la charge opérationnelle.

### Why Existing Solutions Fall Short

- Les outils existants signalent parfois la disponibilité, mais rarement la rentabilité réelle.
- Peu de solutions orientées arbitrage local (achat retail FR/EU + revente secondaire).
- Les workflows restent fragmentés (alerte d’un côté, analyse de marge de l’autre).

### Proposed Solution

Un outil desktop local (Rust + Tauri + React + SQLite) qui:

1. Scrape des sources retail ciblées pour détecter les disponibilités.
2. Croise les prix d’achat avec des références marché secondaire.
3. Calcule une marge nette estimée après frais.
4. Envoie une alerte Telegram uniquement si le seuil de rentabilité est atteint.

### Key Differentiators

- Décision orientée marge nette, pas simple disponibilité.
- Exécution locale “privacy by design” (données utilisateur non externalisées).
- Stack performante et légère adaptée à un usage 24/7.
- Ciblage métier très spécialisé (trading Pokémon).

## Target Users

### Primary Users

1. **Revendeur indépendant Pokémon (persona: Alex, 28 ans)**
   - Gère achat/revente en parallèle d’une activité principale.
   - Douleur: manque de réactivité sur les restocks et incertitude sur les marges.
   - Objectif: augmenter son profit mensuel sans multiplier la charge logistique.

2. **Flipper orienté cartes à forte valeur (persona: Sam, 33 ans)**
   - Se concentre sur la densification de valeur (cartes/unités premium).
   - Douleur: sourcing dispersé et difficile à prioriser.
   - Objectif: détecter des deals à fort ROI rapidement.

### Secondary Users

- **Partenaire opérationnel/familial** qui peut aider sur la logistique et a besoin de visibilité sur les décisions d’achat.
- **Collaborateur occasionnel** qui exécute les commandes selon des signaux prédéfinis.

### User Journey

1. **Découverte**: l’utilisateur comprend que la veille manuelle ne scale plus.
2. **Onboarding**: configuration des produits cibles, seuils de marge, canaux d’alerte.
3. **Usage quotidien**: réception d’alertes filtrées et priorisées.
4. **Moment “aha”**: opportunité rentable captée avant rupture, avec décision rapide et sûre.
5. **Habitude long terme**: Poke-Radar devient la couche de veille par défaut pour toutes les décisions d’achat.

## Success Metrics

### User Success Metrics

- Réduction du temps de veille manuelle: **-70%** sous 30 jours.
- Délai moyen entre restock et décision d’achat: **< 5 minutes**.
- Taux d’alertes jugées “actionnables” par l’utilisateur: **> 60%**.

### Business Objectives

- Atteindre un moteur de sourcing stable qui supporte l’objectif de revenus mensuels ciblés.
- Réduire les achats non rentables grâce à une validation systématique de marge.
- Augmenter le nombre d’opportunités exploitables sans augmenter la charge logistique.

### Key Performance Indicators

- **Precision d’alerte rentable** = alertes profitables / alertes totales.
- **Opportunités captées** par semaine (avec preuve de marge).
- **Marge nette moyenne** par opportunité exécutée.
- **Disponibilité du moteur de monitoring** (uptime local).
- **Latence de notification** entre détection et envoi Telegram.

## MVP Scope

### Core Features

1. Catalogue de produits cibles configurable.
2. Surveillance automatique des sources retail prioritaires.
3. Normalisation et comparaison des prix avec références secondaires.
4. Calcul de marge nette estimée (frais paramétrables).
5. Alertes Telegram filtrées par seuil.
6. Dashboard local de suivi des opportunités.

### Out of Scope for MVP

- Automatisation d’achat (“auto-checkout”).
- Multi-utilisateur cloud/SaaS.
- Couverture exhaustive de tous marchés internationaux.
- Modèles IA avancés de prédiction de prix long terme.

### MVP Success Criteria

- Le système détecte et alerte de façon fiable sur un périmètre initial de produits/sources.
- L’utilisateur confirme une amélioration nette de réactivité et de qualité de décision.
- Les métriques clés (latence, précision, actionnabilité) atteignent les seuils définis.

### Future Vision

- Extension vers plus de marketplaces et catégories (scellé, singles, gradées).
- Scoring d’opportunité avancé (liquidité, volatilité, profondeur de marché).
- Scénarios semi-automatisés d’exécution assistée.

---

**Statut workflow:** Terminé (create-product-brief)
**Prochaine étape recommandée:** `create-prd`
