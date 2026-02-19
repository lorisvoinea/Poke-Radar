---
stepsCompleted: [1, 2, 3, 4, 5, 6]
inputDocuments:
  - _bmad/_bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
  - _bmad/_bmad-output/brainstorming/brainstorming-session-2025-02-05.md
date: 2026-02-18
author: Loris
---

# Product Brief: Poke-Radar

## Executive Summary

Poke-Radar est un produit de veille et d’aide à la décision pour la revente Pokémon TCG. Le besoin principal est de passer d’une veille manuelle lente à une détection d’opportunités exploitable rapidement, avec un focus sur la rentabilité réelle plutôt que sur le simple signal de disponibilité.

Ce brief est régénéré uniquement depuis les artefacts de brainstorming et de research, pour rester fidèle à l’exploration marché/produit actuelle.

---

## Core Vision

### Problem Statement

Les revendeurs Pokémon indépendants perdent des opportunités car ils doivent surveiller de multiples sources, comparer manuellement les prix, et arbitrer trop tard dans un marché volatil.

### Problem Impact

- Charge mentale et temps élevés liés à la veille manuelle.
- Opportunités manquées sur des fenêtres de restock très courtes.
- Décisions d’achat biaisées par des données incomplètes (frais, liquidité, fraîcheur du prix).
- Difficulté à scaler l’activité sans augmenter fortement la charge opérationnelle.

### Why Existing Solutions Fall Short

- La plupart des outils se concentrent sur un seul maillon (stock, prix ou alerte), rarement sur la chaîne complète de décision.
- La comparaison des prix détaillants FR/EU reste partiellement couverte.
- La fraîcheur des données et la transparence de source ne sont pas toujours explicites.

### Proposed Solution

Un assistant de décision qui:

1. Agrège des signaux de disponibilité produits depuis des sources retail ciblées.
2. Enrichit chaque signal avec des références de marché secondaire.
3. Estime la marge nette en tenant compte des paramètres économiques réels.
4. Priorise les opportunités et réduit le bruit de notification.
5. Fournit une traçabilité claire (source, timestamp, hypothèses de calcul).

### Key Differentiators

- Positionnement centré sur la **qualité décisionnelle** (actionnable vs bruit).
- Approche **multi-sources** (retail + secondaire) pour limiter la dépendance à un acteur unique.
- Logique métier orientée **profit net**, pas seulement vitesse d’alerte.
- Alignement avec les bonnes pratiques marché: transparence source/prix/date.

## Target Users

### Primary Users

1. **Revendeur indépendant Pokémon (persona Alex, 28 ans)**
   - Activité d’achat/revente en parallèle.
   - Objectif: gagner du temps et fiabiliser les arbitrages d’achat.

2. **Flipper premium (persona Sam, 33 ans)**
   - Vise des opportunités moins fréquentes mais plus rentables.
   - Objectif: filtrer fortement les signaux et prioriser le ROI.

### Secondary Users

- **Partenaire logistique** qui exécute des achats selon des critères définis.
- **Collaborateur occasionnel** qui a besoin de signaux clairs et contextualisés.

### User Journey

1. **Paramétrage initial**: produits cibles, sources, règles économiques.
2. **Veille continue**: collecte de signaux et actualisation des données de prix.
3. **Qualification**: calcul net, scoring, priorisation.
4. **Décision**: réception d’une alerte contextualisée et action rapide.
5. **Amélioration**: ajustement des règles selon résultats observés.

## Success Metrics

### User Success Metrics

- Réduction du temps de veille manuelle: **-70%** sous 30 jours.
- Délai décisionnel après détection d’un signal prioritaire: **< 5 minutes**.
- Taux d’alertes perçues comme réellement actionnables: **> 60%**.

### Business Objectives

- Améliorer la marge nette moyenne des opérations de revente.
- Augmenter le nombre d’opportunités exploitables sans surcharge logistique.
- Stabiliser une routine de décision reproductible et pilotée par la donnée.

### Key Performance Indicators

- **Précision d’alerte rentable** = alertes rentables / alertes totales.
- **Latence signal → notification** sur le périmètre MVP.
- **Fraîcheur des données prix** (écart entre capture et décision).
- **Marge nette moyenne** par opportunité exécutée.
- **Taux de faux positifs** (opportunités non exécutables après vérification).

## MVP Scope

### Core Features

1. Définition d’un catalogue de produits cibles.
2. Configuration de sources retail prioritaires.
3. Agrégation de références de prix secondaire.
4. Calcul de marge nette avec paramètres de frais.
5. Priorisation et filtrage des opportunités.
6. Notification rapide sur opportunités qualifiées.
7. Historique des signaux et décisions pour apprentissage.

### Out of Scope for MVP

- Achat automatisé (auto-checkout).
- Couverture exhaustive de tous les marchés et toutes les catégories.
- Prédiction avancée de prix long terme par IA.
- Fonctions collaboratives complexes.

### MVP Success Criteria

- Le flux complet signal → qualification → alerte est stable sur un périmètre limité.
- Les utilisateurs confirment une amélioration mesurable de la réactivité et de la qualité de décision.
- Les KPI critiques (actionnabilité, latence, faux positifs) atteignent les seuils cibles.

### Future Vision

- Extension progressive des sources FR/EU et catégories produits.
- Scoring avancé intégrant liquidité, volatilité et confiance multi-source.
- Recommandations d’exécution semi-assistée selon profil de risque.

---

**Statut workflow:** Terminé (create-product-brief)
**Prochaine étape recommandée:** `create-prd`
