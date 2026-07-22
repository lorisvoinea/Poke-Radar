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
  - _bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
  - _bmad-output/brainstorming/brainstorming-session-2025-02-05.md
workflowType: 'prd'
projectClassification: 'brownfield'
projectType: 'Application web auto-hébergée de market intelligence (revendeurs Pokémon)'
domainComplexity: 'medium'
documentCounts:
  briefCount: 1
  researchCount: 1
  brainstormingCount: 1
  projectDocsCount: 0
lastUpdated: '2026-07-21'
---

# Product Requirements Document - Poke-Radar

**Auteur :** Loris  
**Date :** 2026-02-19  
**Dernière mise à jour :** 2026-07-21 — ajout exposition web

## Executive Summary
Poke-Radar est une application web auto-hébergée qui transforme une veille Pokémon manuelle et lente en décisions d'achat rapides, traçables et rentables. Accessible depuis tout navigateur (desktop, tablette, mobile), l'application tourne sur un VPS et s'utilise de n'importe où. Le produit combine surveillance de disponibilité, estimation de valeur marché et filtrage par marge nette afin d'émettre des alertes réellement exploitables.

### Ce qui différencie Poke-Radar
- **Signal orienté décision** : priorité aux opportunités filtrées par profit net, pas à la simple détection de stock.
- **Approche pragmatique** : MVP utilisable même en mode dégradé (saisie manuelle / fallback).
- **Vitesse opérationnelle** : boucle courte _détection → qualification → notification_.

## Contexte et classification projet
- **Contexte** : brownfield piloté à partir d’un product brief, d’une recherche domaine et d’un brainstorming consolidés.
- **Type produit** : application web auto-hébergée sur VPS (backend HTTP Rust + frontend React SPA + SQLite locale).
- **Cible principale** : revendeurs Pokémon indépendants (France/Suisse en priorité).
- **Complexité** : moyenne (multi-sources, calcul économique, robustesse données, alerting, exposition web sécurisée).

## Objectifs et métriques de succès

### User Success
- Réduire le temps de veille manuelle de **~70 %** sur 30 jours.
- Atteindre un délai de décision **< 5 min** après réception d’une alerte prioritaire.
- Obtenir **> 60 %** d’alertes jugées actionnables par l’utilisateur.

### Business Success
- Améliorer la marge nette moyenne mensuelle sur les opérations de revente.
- Augmenter le volume d’opportunités exécutées sans explosion de charge opérationnelle.
- Valider une base produit suffisamment fiable pour l’extension à d’autres sources et pays.

### Technical Success
- Latence détection → notification < **60 secondes** sur les sources prioritaires.
- Uptime monitoring > **95 %** sur plages actives.
- Taux d’échec critique de collecte sous seuil d’alerte défini, avec reprise automatique.

## Personas & User Journeys

### Persona 1 — Revendeur indépendant (Alex)
1. Configure produits ciblés, seuil de marge, frais et canal de notification.
2. Reçoit des alertes avec contexte complet (prix achat, estimation revente, marge nette).
3. Décide rapidement d’acheter ou d’ignorer selon ROI et liquidité.
4. Consulte l’historique pour recalibrer ses paramètres.

### Persona 2 — Flipper premium (Sam)
1. Paramètre des critères plus stricts (risque faible, marge plus haute).
2. Reçoit moins d’alertes, mais fortement qualifiées.
3. Priorise les signaux à meilleure exécution potentielle.
4. Suit la performance des décisions prises.

### Exigences parcours utilisateur
- Onboarding court et guidé.
- Alertes lisibles, comparables, directement exploitables.
- Contrôle fin des paramètres de risque et de rentabilité.
- Possibilité de fonctionnement manuel si une source est indisponible.

## Scope produit

### MVP (Phase 1)
1. **Catalogue ciblé** : gestion d'une liste de produits/cartes surveillés.
2. **Collecte prix/disponibilité** : 1–2 sources stables au départ.
3. **Calcul d'opportunité** : marge nette avec frais configurables.
4. **Alerting** : un canal prioritaire (Telegram) pour time-to-market.
5. **UI web responsive** : tableau principal (tri, statut, dernière mise à jour), accessible depuis desktop et mobile.
6. **Fallback manuel** : saisie / import simple pour conserver la continuité de service.
7. **Exposition web** : application servie via HTTP(S) sur un nom de domaine, avec reverse proxy et certificats TLS.
8. **Déploiement VPS** : démarrage automatique (systemd), build reproductible, isolation des secrets.

### Hors scope MVP
- Auto-buy / exécution automatique d’achat.
- Multi-canaux complets (Discord, mail, push natif) dès V1.
- Couverture mondiale exhaustive des retailers.
- Fonctions communautaires (crowdsourcing, partage public des données).

### Post-MVP
- Abstraction multi-canaux de notification.
- Extension multi-sources API-first.
- Favoris / cartes possédées.
- Export Excel.
- Extension à d'autres univers (autres TCG, collectibles).
- Client desktop Tauri (si besoin offline ou natif).
- Multi-utilisateur avec rôles.

## Exigences fonctionnelles

### FR-01 Configuration & référentiels
- L’utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités).
- Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.

### FR-02 Collecte de données
- Le moteur récupère périodiquement disponibilité et prix des sources activées.
- Chaque donnée est horodatée et associée à sa source.
- En cas d’échec source, le système marque l’état et bascule en mode dégradé.

### FR-03 Estimation marché
- Le système calcule une estimation de revente à partir des données disponibles.
- L’interface affiche le niveau de confiance (valeur directe vs estimée).

### FR-04 Scoring d’opportunité
- Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels).
- Les règles de scoring sont configurables par utilisateur.
- Les opportunités sont triables par rentabilité et urgence.

### FR-05 Notification
- Le système envoie une notification quand une opportunité dépasse les seuils définis.
- La notification inclut : produit, prix d’achat, estimation revente, marge nette, source, timestamp.

### FR-06 Tableau de bord opérationnel
- Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées.
- Historique consultable pour analyser la qualité des alertes et ajuster les seuils.
- Le dashboard se met à jour en temps réel sans rafraîchissement manuel (Server-Sent Events).

### FR-07 Résilience opérationnelle
- Journalisation des erreurs de collecte et de calcul.
- Mécanisme de retry/backoff sur les sources instables.
- Continuité minimale du service via saisie/import manuel.

### FR-08 Exposition web
- L'application est accessible via un navigateur web standard (Chrome, Safari, Firefox) sur desktop, tablette et mobile.
- Le backend expose une API HTTP RPC (`POST /api/*`) et sert le frontend comme une SPA.
- L'accès se fait via un nom de domaine configuré, avec HTTPS (TLS) obligatoire.
- L'interface est responsive et utilisable sur écrans mobiles (320 px minimum).

### FR-09 Authentification et accès
- L'accès à l'application est protégé par une authentification single-user (token ou mot de passe).
- Aucune gestion multi-comptes ni rôles multiples : un seul utilisateur, une seule session.
- Les secrets (token d'authentification, clés API tierces) sont stockés hors du dépôt et injectés via variables d'environnement ou fichier de configuration protégé.

## Exigences non fonctionnelles

### NFR-01 Performance
- Rafraîchissement source selon cadence configurable.
- Temps d’évaluation d’une opportunité compatible usage temps quasi réel.

### NFR-02 Fiabilité
- Dégradation progressive plutôt qu’arrêt global en cas de source indisponible.
- Vérification de cohérence des données avant génération d’alerte.

### NFR-03 Sécurité & conformité
- Respect RGPD/nLPD pour les données utilisateur.
- Respect des CGU, robots.txt et pratiques anti-abus pour la collecte.
- Authentification single-user obligatoire pour l'accès web ; pas d'accès anonyme.
- HTTPS obligatoire en production (TLS 1.2+).
- Secret management : tokens, API keys et mot de passe d'accès stockés hors du dépôt (variables d'environnement ou fichier protégé).
- Protection contre les attaques web courantes : XSS, injection SQL (via requêtes paramétrées), rate limiting.

### NFR-04 Maintenabilité
- Pipeline modulaire (ingestion → normalisation → scoring → notification).
- Configuration externalisée pour faciliter ajout de sources/canaux.

### NFR-05 UX
- Interface orientée décision (priorité à lisibilité, tri et filtres essentiels).
- Réduction de la complexité (éviter surcharge d'écrans/options au MVP).
- Design responsive : utilisable de 320 px (mobile) à 1920 px (desktop).
- Cibles tactiles d'au moins 44 px pour l'usage mobile.

### NFR-06 Déploiement et exploitation
- L'application tourne comme un service systemd ou équivalent, avec redémarrage automatique en cas d'arrêt.
- Un reverse proxy (nginx/Caddy) termine le TLS et route les requêtes vers le backend.
- Le build est reproductible : une commande unique produit l'artefact déployable.
- Les logs applicatifs sont accessibles via journald ou un fichier.
- Mise à jour possible sans perte de données (migrations SQLite versionnées conservées).

### NFR-07 Qualité et tests
- Les règles de calcul métier (marge, scoring, normalisation, déduplication) sont couvertes par des tests unitaires.
- Le pipeline complet (ingestion → normalisation → scoring → alerting) est testé en intégration sur des données mockées.
- Les composants UI partagés sont testés pour leurs états (default, loading, error, success).
- Les 4 parcours utilisateur critiques (alerte→décision, recalibrage, source indisponible, saisie manuelle) sont testés de bout en bout (E2E).

## Risques principaux et mitigations
- **Fragilité de collecte** → stratégie API-first + retries + fallback manuel.
- **Bruit d’alertes** → seuils par défaut robustes + calibration continue.
- **Contrainte légale sur les sources** → prioriser flux autorisés/partenariats.
- **Complexité excessive trop tôt** → scope MVP strict, extensions en phases.
- **Exposition web non sécurisée** → HTTPS obligatoire, auth single-user, reverse proxy, pas d'ouverture de ports inutiles.
- **Régression desktop** → la couche domaine/services reste identique ; le changement de transport (Tauri → HTTP) est isolé.

## Validation et rollout
1. Déployer la version web sur le VPS avec accès HTTPS via le nom de domaine.
2. Valider l'accès depuis desktop et mobile (iPhone/Safari, Android/Chrome).
3. Lancer un pilote utilisateur sur périmètre réduit (sources et produits limités).
4. Mesurer métriques clés (latence, actionnabilité, temps de décision, marge nette).
5. Ajuster règles de scoring et UX avant élargissement.
6. Étendre progressivement la couverture sources/canaux.

## Conclusion
Ce PRD positionne Poke-Radar comme un **outil de décision rentable** plutôt qu’un simple tracker de stock. La stratégie retenue privilégie un MVP minimal, robuste et actionnable, ancré dans les artefacts actuels (brief/research/brainstorming) et prêt pour une montée en puissance progressive.
