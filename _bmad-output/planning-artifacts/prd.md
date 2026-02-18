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
  - _bmad-output/planning-artifacts/product-brief-bmad-2026-02-18.md
  - market-Poke-Radar-research.md
  - technical-Poke-Radar-research.md
  - rapport_brainstorming.md
  - architecture_technique.md
workflowType: 'prd'
projectClassification: 'brownfield'
projectType: 'Desktop application de market intelligence (B2C niche revendeurs)'
domainComplexity: 'medium'
documentCounts:
  briefCount: 1
  researchCount: 2
  brainstormingCount: 1
  projectDocsCount: 1
lastUpdated: '2026-02-18'
---

# Product Requirements Document - Poke-Radar

**Auteur :** Loris  
**Date :** 2026-02-18

## Executive Summary
Poke-Radar est une application desktop orientée décision qui automatise la veille de stocks Pokémon, évalue la rentabilité de revente et envoie des alertes actionnables en temps réel. Le cœur du produit n’est pas la détection de stock seule, mais la priorisation des opportunités selon la marge nette après frais.

### What Makes This Special
La proposition de valeur repose sur la combinaison de trois briques rarement réunies dans les outils existants : détection retail rapide, estimation marché secondaire crédible, et filtrage par profit net configurable. Cette approche réduit le bruit opérationnel et améliore la qualité des décisions d’achat.

## Project Classification
- **Contexte :** Brownfield (base de réflexion déjà existante via brief, recherches et architecture)
- **Type de produit :** Application desktop locale (Tauri + Rust + React)
- **Marché cible :** Revendeurs Pokémon indépendants
- **Niveau de complexité :** Moyen (scraping multi-sources + calculs économiques + alerting temps réel)

## Success Criteria

### User Success
- Réduire de 70 % le temps de veille manuelle dans les 30 jours.
- Permettre une prise de décision en moins de 5 minutes après détection d’un restock.
- Atteindre >60 % d’alertes jugées réellement actionnables.
- Diminuer les achats non rentables grâce au filtrage par marge nette.

### Business Success
- Augmenter la marge nette moyenne mensuelle sur les opérations de revente.
- Augmenter le nombre d’opportunités exécutées sans augmenter proportionnellement la charge logistique.
- Stabiliser un moteur de sourcing utilisable en continu (24/7) sur un périmètre produit initial.

### Technical Success
- Latence d’alerte (détection → Telegram) <60 secondes sur les sources prioritaires.
- Uptime du moteur local de monitoring >95 % sur les périodes actives.
- Taux d’erreurs critiques de scraping sous seuil opérationnel acceptable avec mécanismes de reprise.

## User Journeys

### Revendeur indépendant (persona Alex)
1. Configure produits, seuil de marge et canaux d’alerte.
2. Reçoit une alerte « rentable » avec contexte prix achat / prix revente estimé.
3. Vérifie rapidement le signal et exécute l’achat.
4. Suit les opportunités dans le dashboard pour affiner ses seuils.

### Flipper premium (persona Sam)
1. Cible des produits à forte valeur potentielle.
2. Reçoit moins d’alertes mais plus qualifiées (ROI élevé).
3. Priorise les signaux selon la liquidité et le niveau de marge.
4. Consolide une stratégie d’achat sélective à forte rentabilité.

### Journey Requirements Summary
- Onboarding simple et rapide.
- Signaux compréhensibles et immédiatement exploitables.
- Historique des opportunités pour ajuster la stratégie.
- Contrôle utilisateur fort sur les paramètres de risque.

## Domain-Specific Requirements
- Respect des conditions d’utilisation des sites scrappés et implémentation de garde-fous anti-abus (cadence, jitter, backoff).
- Prise en compte des frais réels (port, commissions marketplace, coûts transactionnels) dans le calcul de marge.
- Traçabilité des hypothèses de prix (source, timestamp, méthode d’estimation).
- Gestion du risque de faux positifs (stocks volatils, pages dynamiques, disponibilité temporaire).

## Innovation & Novel Patterns

### Detected Innovation Areas
- **Filtrage par profit net** plutôt que signal de disponibilité brut.
- **Décision assistée locale** pour un cas d’usage ultra-spécifique (arbitrage Pokémon).
- **Boucle signal → décision** optimisée pour contrainte de temps.

### Market Context & Competitive Landscape
Le marché propose surtout des outils de monitoring stock ou de suivi prix séparés. Poke-Radar se différencie par une couche décisionnelle orientée exécution rentable, adaptée au contexte retail FR/EU + secondaire.

### Validation Approach
- Comparer performance utilisateur avant/après usage (temps de veille, qualité des décisions).
- Mesurer la précision des alertes et la marge nette observée.
- Valider sur un périmètre MVP réduit avant extension de couverture.

### Risk Mitigation
- Commencer avec un petit set de sources fiables.
- Journaliser les erreurs de scraping et appliquer des stratégies de fallback.
- Prévoir une calibration continue des règles de marge et de scoring.

## Desktop Application Specific Requirements

### Project-Type Overview
Application locale légère, orientée monitoring continu et visualisation opérationnelle rapide. Le choix desktop favorise performance, autonomie et confidentialité.

### Technical Architecture Considerations
- Processus backend Rust asynchrone pour collecte/normalisation/calcul.
- Frontend React pour visualisation et configuration.
- SQLite locale pour persistance des produits, prix et opportunités.
- Notification Telegram via API HTTP.

### Implementation Considerations
- Résilience aux changements de DOM.
- Politique de scheduling et de priorité des sources.
- Modularité des connecteurs de scraping.
- Observabilité locale (logs, métriques, états d’exécution).

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
**Approche MVP :** valider rapidement la thèse « moins d’alertes, mais des alertes rentables ».  
**Ressources minimales :** 1 dev fullstack (Rust/React) + support ponctuel produit/data.

### MVP Feature Set (Phase 1)
**Core User Journeys Supported:**
- Configuration des produits/sources/seuils.
- Détection de stock sur sources clés.
- Estimation prix secondaire et calcul marge nette.
- Alerte Telegram conditionnée à la rentabilité.
- Dashboard opportunités (historique + statut).

**Must-Have Capabilities:**
- Monitoring périodique fiable.
- Moteur de pricing minimum viable.
- Paramétrage frais et seuils.
- Logs d’exécution lisibles.

### Post-MVP Features
**Phase 2 (Growth):**
- Extension des sources et catégories produits.
- Scoring avancé (liquidité, volatilité).
- Segmentation des alertes par profil risque.

**Phase 3 (Expansion):**
- Automatisation assistée d’exécution (semi-auto).
- Stratégies multi-marchés internationales.
- Capacités collaboratives/multi-opérateurs.

### Risk Mitigation Strategy
**Risques techniques :** instabilité scraping, latence variable, données marché bruitées.  
**Réponse :** architecture modulaire, retries intelligents, validation multi-sources.  
**Risques marché :** variation rapide des prix, hype cyclique.  
**Réponse :** seuils dynamiques et feedback utilisateur continu.  
**Risques ressources :** disponibilité limitée du porteur de projet.  
**Réponse :** cadrage strict MVP, backlog priorisé par impact.

## Functional Requirements

### Configuration & Product Targeting
- FR-001: Le système doit permettre d’ajouter/modifier/supprimer des produits cibles et leurs métadonnées.
- FR-002: Le système doit permettre de configurer les sources retail par produit.
- FR-003: Le système doit permettre de définir des seuils de marge et paramètres de frais.

### Stock Monitoring
- FR-004: Le système doit interroger périodiquement les sources configurées.
- FR-005: Le système doit détecter les changements de disponibilité produit.
- FR-006: Le système doit conserver l’état de dernière observation par source.

### Market Price Estimation
- FR-007: Le système doit récupérer des références de prix secondaire (Cardmarket/eBay ou équivalent).
- FR-008: Le système doit normaliser les données de prix pour comparabilité.
- FR-009: Le système doit timestamp chaque donnée de prix collectée.

### Opportunity Scoring & Margin Calculation
- FR-010: Le système doit calculer une marge nette estimée en intégrant frais configurés.
- FR-011: Le système doit classer/prioriser les opportunités selon rentabilité.
- FR-012: Le système doit permettre d’exclure des opportunités sous seuil.

### Alerting & Notification
- FR-013: Le système doit envoyer une alerte Telegram lorsqu’une opportunité dépasse le seuil défini.
- FR-014: L’alerte doit inclure au minimum produit, prix achat, prix revente estimé, marge et source.
- FR-015: Le système doit éviter le spam de notifications via règles anti-duplication.

### Dashboard & Tracking
- FR-016: Le système doit afficher les opportunités détectées dans un tableau de bord local.
- FR-017: Le système doit permettre de consulter l’historique des alertes et signaux.
- FR-018: Le système doit afficher l’état courant du moteur (actif, erreur, pause).

### Reliability & Operations
- FR-019: Le système doit journaliser erreurs de scraping et événements clés.
- FR-020: Le système doit appliquer des stratégies de reprise en cas d’échec temporaire.
- FR-021: Le système doit supporter la mise à jour des paramètres sans redéploiement complet.

## Non-Functional Requirements

### Performance
- NFR-001: Le délai détection → alerte doit être inférieur à 60 secondes sur sources prioritaires.
- NFR-002: Le cycle de monitoring doit rester stable sous charge MVP définie.

### Security
- NFR-003: Les secrets (token Telegram, clés éventuelles) doivent être stockés de manière sécurisée localement.
- NFR-004: Les logs ne doivent pas exposer de secrets en clair.

### Scalability
- NFR-005: L’architecture doit permettre l’ajout de nouvelles sources sans refonte globale.
- NFR-006: Le système doit gérer une montée progressive du nombre de produits surveillés.

### Accessibility
- NFR-007: L’interface doit rester lisible et utilisable pour des sessions longues (contrastes, hiérarchie visuelle claire).

### Integration
- NFR-008: L’intégration Telegram doit être fiable et testable par message de contrôle.
- NFR-009: Les connecteurs de sources doivent exposer une interface homogène pour simplifier maintenance et extension.

## Conclusion
Ce PRD formalise une trajectoire orientée exécution : commencer petit, prouver la valeur économique rapidement, puis étendre de manière maîtrisée. Toutes les phases aval (UX, architecture détaillée, epics/stories) doivent rester alignées sur le différenciateur central : transformer un bruit de marché en décisions d’achat rentables et rapides.
