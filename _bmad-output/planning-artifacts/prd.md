---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - market-Poke-Radar-research.md
  - technical-Poke-Radar-research.md
  - rapport_brainstorming.md
  - architecture_technique.md
workflowType: prd
projectName: Poke-Radar
author: Loris
date: '2026-02-18'
classification:
  problemType: Greenfield
  domain: E-commerce intelligence / Arbitrage cartes Pokémon
  complexity: Medium
documentCounts:
  productBriefCount: 0
  researchCount: 2
  brainstormingCount: 1
  projectDocsCount: 1
---

# Product Requirements Document - Poke-Radar

**Author:** Loris  
**Date:** 2026-02-18

## Executive Summary
Poke-Radar est une application desktop permettant de détecter en quasi temps réel des opportunités d'arbitrage sur les produits Pokémon scellés.
Le système surveille les stocks de revendeurs primaires (ex. Fnac, Cultura), recoupe les prix de revente observables (Cardmarket, eBay ventes réalisées), puis alerte l'utilisateur via Telegram lorsqu'une opportunité dépasse un seuil de rentabilité défini.

Objectif produit: transformer une activité artisanale de veille manuelle en un flux outillé, rapide et piloté par données.

## Success Criteria

### Business Outcomes
- Réduire de 80% le temps de veille manuelle hebdomadaire.
- Générer au moins 10 alertes qualifiées/semaine (marge brute > seuil configurable).
- Maintenir un taux d'alertes exploitables > 60% (pas de faux positifs évidents).

### User Outcomes
- Détecter une opportunité en moins de 2 minutes après remise en stock.
- Comprendre immédiatement le rationnel financier d'une alerte (prix achat, prix revente estimé, marge nette estimée).
- Configurer en autonomie les sources, seuils et produits suivis.

### Product Outcomes
- Disponibilité de l'application > 99% sur la période active de monitoring.
- Temps moyen d'actualisation d'un produit suivi < 60 s.
- Aucune perte de données critiques (opportunités, historiques prix) lors de redémarrages.

## User Journeys

### Journey 1: Configuration initiale
1. L'utilisateur installe Poke-Radar sur son poste.
2. Il ajoute les produits/URLs à surveiller.
3. Il configure ses seuils (marge minimale, budget max, fréquence scan).
4. Il connecte un bot Telegram.

### Journey 2: Détection d'opportunité
1. Le moteur détecte une remise en stock.
2. Le système récupère les références de prix de revente.
3. Il calcule la marge (brute + estimation nette frais inclus).
4. Si seuil atteint, il envoie une alerte Telegram + affiche la ligne en vert dans le dashboard.

### Journey 3: Décision d'achat
1. L'utilisateur ouvre le détail d'alerte.
2. Il vérifie source, timestamp et hypothèses de coûts.
3. Il clique le lien source et décide d'acheter ou d'ignorer.
4. L'opportunité est marquée en statut (actionnée / ignorée).

## Domain & Constraints
- Marché volatile: prix de revente instables selon état, langue, timing.
- Risques anti-bot des sites cibles (throttling, captcha, blocage IP).
- Données hétérogènes selon marketplace (format prix, frais, sold listings).
- Contraintes légales/ToS des plateformes: architecture défensive et respect des limites.

## Innovation & Product Principles
- Priorité à la valeur décisionnelle, pas à la “feature list”.
- MVP orienté vitesse de détection + qualité de la marge estimée.
- Transparence de calcul: chaque alerte explicite les hypothèses.
- Approche desktop-first (Tauri) pour réduire overhead et simplifier l'exploitation locale.

## Project Type & Technical Approach
Projet **greenfield** avec architecture modulaire:
- Frontend: React + TypeScript (dashboard et configuration).
- Backend: Rust (orchestration scans, calcul arbitrage, persistence).
- Base locale: SQLite (historique prix/opportunités/config).
- Notifications: Telegram Bot API.
- Scraping dynamique: headless_chrome/chromiumoxide (à valider selon stabilité).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
Construire le plus petit système capable de produire des alertes rentables et traçables.

### MVP Feature Set (Phase 1)
- Gestion catalogue produits suivis (CRUD simple).
- Connecteurs de scraping pour 2 retailers prioritaires.
- Connecteurs revente pour eBay sold listings + Cardmarket.
- Moteur de calcul marge avec frais configurables.
- Alertes Telegram + dashboard statut en temps réel.
- Historique local des prix et opportunités.

### Post-MVP Features (Phase 2+)
- Ajout de nouvelles marketplaces et enrichissement anti-detection.
- Scoring de fiabilité des opportunités.
- Backtesting de stratégies de seuils/marges.
- Synchronisation cloud optionnelle et profils multi-portefeuilles.

### Risk Mitigation Strategy
- Circuit breaker par source en cas d'échec répétitif.
- Caching local et retry exponentiel.
- Feature flags pour activer/désactiver un connecteur sans redéploiement.

## Functional Requirements

### FR-01 Acquisition & Monitoring
- Le système doit surveiller périodiquement les URLs sources configurées.
- Le système doit enregistrer timestamp, prix affiché, statut stock et source.
- Le système doit permettre une fréquence de scan configurable par source.

### FR-02 Intelligence de Prix
- Le système doit récupérer des références de prix de revente (eBay sold, Cardmarket).
- Le système doit normaliser les prix dans une devise unique.
- Le système doit historiser les observations marché pour analyse.

### FR-03 Moteur d'Arbitrage
- Le système doit calculer marge brute et marge nette estimée.
- Le système doit intégrer des coûts configurables (frais plateforme, livraison, buffer risque).
- Le système doit qualifier une opportunité si la marge nette dépasse le seuil.

### FR-04 Alerting & Workflow Décision
- Le système doit envoyer une alerte Telegram détaillée lorsqu'une opportunité est qualifiée.
- Le système doit fournir un lien direct vers la source d'achat.
- Le système doit permettre à l'utilisateur de marquer une opportunité (actionnée/ignorée).

### FR-05 Dashboard & Configuration
- Le système doit afficher l'état des produits surveillés en temps réel.
- Le système doit permettre l'édition des seuils, sources, et paramètres de frais.
- Le système doit afficher les opportunités récentes et leurs métriques clés.

## Non-Functional Requirements

### Performance
- NFR-P1: Traitement d'une alerte qualifiée en < 5 secondes après collecte des données.
- NFR-P2: Rafraîchissement UI sans blocage perceptible (< 200 ms pour interactions usuelles).

### Reliability
- NFR-R1: Redémarrage sans perte des configurations et historiques persistés.
- NFR-R2: Tolérance aux échecs réseau ponctuels avec stratégie retry.

### Security
- NFR-S1: Stockage local chiffré/semi-chiffré des secrets (token Telegram).
- NFR-S2: Validation stricte des entrées utilisateur côté backend.

### Maintainability
- NFR-M1: Architecture à connecteurs isolés pour faciliter l'ajout de sources.
- NFR-M2: Logs structurés pour diagnostic des erreurs scraping/pricing.

### Compliance / Ethics
- NFR-C1: Respect des limites de requêtes et identification des risques ToS.
- NFR-C2: Documentation claire sur l'usage responsable de l'outil.

## Open Questions
- Priorité exacte des retailers pour V1 (Fnac/Cultura/Micromania/Amazon).
- Paramétrage cible des frais selon canal de revente.
- Niveau d'automatisation souhaité (simple alerte vs assistant d'exécution).
- Politique de conservation des historiques (rétention locale).

## Next Steps
1. Lancer le workflow de validation PRD.
2. Enchaîner sur la création des Epics & Stories.
3. Vérifier l'implementation readiness avant architecture finale.
