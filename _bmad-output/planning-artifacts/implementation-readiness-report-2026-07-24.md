---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
filesIncluded:
  prd:
    - _bmad-output/planning-artifacts/prd.md
  architecture:
    - _bmad-output/planning-artifacts/architecture.md
  epics:
    - _bmad-output/planning-artifacts/epics.md
  ux:
    - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md
    - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md
supportingArtifacts:
  - _bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md
---

# Rapport d’évaluation de préparation à l’implémentation

**Date :** 2026-07-24
**Projet :** Poke-Radar

## Inventaire de découverte documentaire

### Fichiers PRD trouvés

**Documents complets :**

- `_bmad-output/planning-artifacts/prd.md` — 11 819 octets, modifié le `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md` — 2 088 octets, modifié le `2026-07-24T09:22:19`

**Documents fragmentés :**

- Aucun trouvé.

### Fichiers d’architecture trouvés

**Documents complets :**

- `_bmad-output/planning-artifacts/architecture.md` — 25 650 octets, modifié le `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md` — 2 088 octets, modifié le `2026-07-24T09:22:19`

**Documents fragmentés :**

- Aucun trouvé.

### Fichiers epics & stories trouvés

**Documents complets :**

- `_bmad-output/planning-artifacts/epics.md` — 38 743 octets, modifié le `2026-07-24T09:22:19`

**Documents fragmentés :**

- Aucun trouvé.

### Fichiers de design UX trouvés

**Documents / artefacts UX complets :**

- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` — 21 003 octets, modifié le `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md` — 9 787 octets, modifié le `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/ux-designs/_archive/ux-design-specification-2026-02-19.md` — 9 787 octets, modifié le `2026-07-24T09:22:19`

**Documents fragmentés :**

- Dossier : `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/`
  - `DESIGN.md`
  - `EXPERIENCE.md`

## Problèmes identifiés

### Correspondance potentiellement ambiguë / multi-catégorie

- `_bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md` correspond à la fois aux motifs de découverte PRD et Architecture, car son nom contient `prd` et `architecture`.
- Ce fichier doit être traité comme un artefact de support de cross-check, sauf si l’utilisateur le sélectionne explicitement comme document canonique.

### Correction de découverte UX

- Des fichiers UX existent bien sous `_bmad-output/planning-artifacts/ux-designs/`.
- La recherche UX initiale, trop stricte, a manqué `DESIGN.md` et `EXPERIENCE.md`, car leurs noms de fichiers ne contiennent pas `ux`, même si leur dossier parent le contient.

## Documents canoniques proposés pour l’évaluation

- PRD : `_bmad-output/planning-artifacts/prd.md`
- Architecture : `_bmad-output/planning-artifacts/architecture.md`
- Epics & Stories : `_bmad-output/planning-artifacts/epics.md`
- Design UX : `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md`
- Expérience UX : `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md`


## Analyse du PRD

### Exigences fonctionnelles

FR-01 Configuration & référentiels :
- L’utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités).
- Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.

FR-02 Collecte de données :
- Le moteur récupère périodiquement disponibilité et prix des sources activées.
- Chaque donnée est horodatée et associée à sa source.
- En cas d’échec source, le système marque l’état et bascule en mode dégradé.

FR-03 Estimation marché :
- Le système calcule une estimation de revente à partir des données disponibles.
- L’interface affiche le niveau de confiance (valeur directe vs estimée).

FR-04 Scoring d’opportunité :
- Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels).
- Les règles de scoring sont configurables par utilisateur.
- Les opportunités sont triables par rentabilité et urgence.

FR-05 Notification :
- Le système envoie une notification quand une opportunité dépasse les seuils définis.
- La notification inclut : produit, prix d’achat, estimation revente, marge nette, source, timestamp.

FR-06 Tableau de bord opérationnel :
- Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées.
- Historique consultable pour analyser la qualité des alertes et ajuster les seuils.
- Le dashboard se met à jour en temps réel sans rafraîchissement manuel (Server-Sent Events).

FR-07 Résilience opérationnelle :
- Journalisation des erreurs de collecte et de calcul.
- Mécanisme de retry/backoff sur les sources instables.
- Continuité minimale du service via saisie/import manuel.

FR-08 Exposition web :
- L’application est accessible via un navigateur web standard (Chrome, Safari, Firefox) sur desktop, tablette et mobile.
- Le backend expose une API HTTP RPC (`POST /api/*`) et sert le frontend comme une SPA.
- L’accès se fait via un nom de domaine configuré, avec HTTPS (TLS) obligatoire.
- L’interface est responsive et utilisable sur écrans mobiles (320 px minimum).

FR-09 Authentification et accès :
- L’accès à l’application est protégé par une authentification single-user (token ou mot de passe).
- Aucune gestion multi-comptes ni rôles multiples : un seul utilisateur, une seule session.
- Les secrets (token d’authentification, clés API tierces) sont stockés hors du dépôt et injectés via variables d’environnement ou fichier de configuration protégé.

Total FR : 9

### Exigences non fonctionnelles

NFR-01 Performance :
- Rafraîchissement source selon cadence configurable.
- Temps d’évaluation d’une opportunité compatible usage temps quasi réel.

NFR-02 Fiabilité :
- Dégradation progressive plutôt qu’arrêt global en cas de source indisponible.
- Vérification de cohérence des données avant génération d’alerte.

NFR-03 Sécurité & conformité :
- Respect RGPD/nLPD pour les données utilisateur.
- Respect des CGU, robots.txt et pratiques anti-abus pour la collecte.
- Authentification single-user obligatoire pour l’accès web ; pas d’accès anonyme.
- HTTPS obligatoire en production (TLS 1.2+).
- Gestion des secrets : tokens, API keys et mot de passe d’accès stockés hors du dépôt (variables d’environnement ou fichier protégé).
- Protection contre les attaques web courantes : XSS, injection SQL (via requêtes paramétrées), rate limiting.

NFR-04 Maintenabilité :
- Pipeline modulaire (ingestion → normalisation → scoring → notification).
- Configuration externalisée pour faciliter ajout de sources/canaux.

NFR-05 UX :
- Interface orientée décision (priorité à lisibilité, tri et filtres essentiels).
- Réduction de la complexité (éviter surcharge d’écrans/options au MVP).
- Design responsive : utilisable de 320 px (mobile) à 1920 px (desktop).
- Cibles tactiles d’au moins 44 px pour l’usage mobile.

NFR-06 Déploiement et exploitation :
- L’application tourne comme un service systemd ou équivalent, avec redémarrage automatique en cas d’arrêt.
- Un reverse proxy (nginx/Caddy) termine le TLS et route les requêtes vers le backend.
- Le build est reproductible : une commande unique produit l’artefact déployable.
- Les logs applicatifs sont accessibles via journald ou un fichier.
- Mise à jour possible sans perte de données (migrations SQLite versionnées conservées).

NFR-07 Qualité et tests :
- Les règles de calcul métier (marge, scoring, normalisation, déduplication) sont couvertes par des tests unitaires.
- Le pipeline complet (ingestion → normalisation → scoring → alerting) est testé en intégration sur des données mockées.
- Les composants UI partagés sont testés pour leurs états (default, loading, error, success).
- Les 4 parcours utilisateur critiques (alerte→décision, recalibrage, source indisponible, saisie manuelle) sont testés de bout en bout (E2E).

Total NFR : 7

### Exigences complémentaires

- Le MVP inclut la gestion du catalogue, 1 à 2 sources stables, le calcul d’opportunité en marge nette, l’alerting Telegram, une UI web responsive, un fallback manuel, l’exposition HTTPS/domaine et un déploiement VPS avec systemd, build reproductible et secrets isolés.
- Hors scope MVP : auto-buy, notifications multi-canaux complètes, couverture mondiale exhaustive des retailers et fonctionnalités communautaires/crowdsourcing.
- Candidats post-MVP : abstraction des canaux de notification, extension multi-sources API-first, favoris/cartes possédées, export Excel, possible client desktop Tauri et rôles multi-utilisateur.
- Les mitigations principales incluent collecte API-first, retries, fallback manuel, seuils par défaut robustes, priorisation des sources légales, scope MVP strict, HTTPS/auth/reverse proxy et isolation du changement de transport pour éviter les régressions desktop.
- Le rollout nécessite déploiement VPS HTTPS, validation desktop/mobile, pilote limité, mesure de la latence/actionnabilité/temps de décision/marge nette, ajustements scoring et UX, puis extension progressive.

### Évaluation de complétude du PRD

- Le PRD est suffisamment structuré pour la traçabilité : il contient des sections FR et NFR explicites avec une numérotation stable, ainsi que le scope MVP, les exclusions, le post-MVP, les risques, les mitigations et le rollout.
- Risque d’évaluation : certaines NFR sont qualitatives plutôt que mesurables, notamment le temps d’évaluation d’une opportunité, les seuils de fiabilité, les limites d’échec source et les détails de rate limiting.
- Risque d’évaluation : certaines contraintes d’implémentation apparaissent dans les sections scope et risques plutôt que dans les exigences numérotées ; la validation des epics doit donc tracer à la fois les exigences numérotées et les contraintes complémentaires.

## Validation de couverture des epics

### Matrice de couverture

| Numéro FR PRD | Exigence PRD | Couverture Epic | Statut |
| --- | --- | --- | --- |
| FR-01 | Configuration & référentiels : créer/éditer des profils de surveillance et supporter des référentiels préenregistrés. | Epic 1 : Configurer le cockpit de surveillance ; Stories 1.2 et 1.3. | ✓ Couvert |
| FR-02 | Collecte de données : collecte périodique disponibilité/prix, association timestamp/source, mode dégradé en cas d’échec source. | Epic 2 : Orchestrer la collecte fiable multi-sources ; Stories 2.1, 2.2, 2.3. | ✓ Couvert |
| FR-03 | Estimation marché : calculer une estimation de revente et afficher le niveau de confiance. | Epic 4 : Transformer les signaux en opportunités rentables ; Story 4.1 et parties confiance de la Story 4.3. | ✓ Couvert |
| FR-04 | Scoring d’opportunité : marge brute/nette, règles configurables, tri par rentabilité et urgence. | Epic 4 : Stories 4.2 et 4.3. | ✓ Couvert |
| FR-05 | Notification : envoyer une notification au-dessus du seuil avec produit, prix d’achat, estimation revente, marge nette, source, timestamp. | Epic 5 : Alerter & notifier en temps réel ; Stories 5.1 et 5.2. | ✓ Couvert |
| FR-06 | Tableau de bord opérationnel : état source, dernières opportunités, erreurs, actions recommandées, historique, mises à jour temps réel SSE. | Epic 6 : Construire l’interface décisionnelle ; Stories 6.3, 6.4, 6.5 ; infrastructure SSE en Story 5.3. | ✓ Couvert |
| FR-07 | Résilience opérationnelle : journalisation, retry/backoff, continuité minimale via saisie/import manuel. | Epic 2 couvre la résilience backend ; Epic 6 couvre le fallback manuel ; Stories 2.2, 2.3, 6.9. | ✓ Couvert |
| FR-08 | Exposition web : accès navigateur, API HTTP RPC + SPA, domaine, HTTPS obligatoire, responsive 320 px+. | Epic 3 couvre l’API exposée protégée ; Epic 6 couvre le frontend responsive ; Stories 3.1, 3.2, 6.8. | ✓ Couvert |
| FR-09 | Authentification et accès : auth single-user, pas de rôles multi-comptes, secrets hors dépôt injectés par env/config protégée. | Epic 3 : Protéger l’accès à mon radar ; Stories 3.1, 3.2, 3.3. | ✓ Couvert |

### Exigences manquantes

Aucune exigence fonctionnelle du PRD n’est sémantiquement absente des epics.

### Statistiques de couverture

- Total FR PRD : 9
- FR couvertes dans les epics : 9
- Pourcentage de couverture : 100 %

### Notes de couverture

- Le document epics annonce `9/9 FRs` couvertes, et la validation sémantique confirme ce résultat.
- La numérotation n’est pas parfaitement alignée entre le PRD et l’inventaire des epics : le document epics scinde le `FR-01 Configuration & référentiels` du PRD en deux entrées d’inventaire (`FR-01` et `FR-02`), ce qui décale les libellés suivants. La traçabilité future doit privilégier la numérotation canonique du PRD ou documenter explicitement la table de renumérotation.

## Évaluation d’alignement UX

### Statut des documents UX

Trouvés. Les documents UX actifs sont :

- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md`
- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md`

Une spécification UX archivée existe également sous `_bmad-output/planning-artifacts/ux-designs/_archive/` et doit être traitée comme historique, sauf sélection explicite.

### Alignement UX ↔ PRD

- L’objectif UX de décisions d’achat rapides, fiables et traçables s’aligne avec l’executive summary du PRD et la métrique de succès de décision en moins de cinq minutes après une alerte prioritaire.
- Les attentes UX mobile-first/responsive s’alignent avec PRD FR-08 et NFR-05, notamment l’accès navigateur et l’utilisabilité mobile à partir de 320 px.
- Les surfaces décisionnelles UX s’alignent avec PRD FR-06 : vue Radar, vue détail, vue sources, historique, état source, erreurs et comportement temps réel du dashboard.
- Les flux UX de résilience et de saisie manuelle s’alignent avec PRD FR-07 : mode dégradé, fallback manuel et continuité pendant l’indisponibilité d’une source.
- Le flux UX d’authentification s’aligne avec PRD FR-09 via le pattern LoginPage/token.

### Alignement UX ↔ Architecture

- L’architecture inclut explicitement les documents UX actifs comme entrées.
- L’architecture supporte les besoins UX temps réel via AD-10 Server-Sent Events et mappe FR-06 vers `frontend/src/pages/RadarPage.tsx` plus `GET /api/events`.
- L’architecture supporte la qualité des composants UX via AD-15 tests frontend et inclut la structure frontend pour LoginPage, RadarPage, DetailPage, StrategyPage, SourcesPage, composants partagés, hooks et stores.
- L’architecture mappe NFR-05 UX vers le design system, les tests de composants frontend et SSE.
- L’architecture supporte l’exposition web responsive via Caddy/TLS, SPA servie par le backend et décisions d’accès navigateur/mobile.

### Problèmes d’alignement

- Aucun problème bloquant d’alignement UX n’a été trouvé.
- Problème mineur de traçabilité : les exigences UX sont bien représentées dans le document epics sous `UX-DR1` à `UX-DR20`, mais le PRD ne capture l’UX qu’à un niveau plus macro via FR-06, FR-08 et NFR-05. C’est acceptable pour la préparation MVP si les epics restent la source détaillée de traçabilité UX.
- Problème mineur de documentation d’architecture : l’architecture mappe principalement la résilience FR-07 au runtime backend des connecteurs, alors que le PRD exige aussi la continuité via saisie/import manuel. Les epics couvrent ce fallback UI en Story 6.9, mais la capability map d’architecture devrait expliciter le chemin frontend/saisie manuelle.

### Avertissements

- Garder `_archive/ux-design-specification-2026-02-19.md` hors validation canonique, sauf volonté explicite de comparaison historique.
- Avant implémentation, confirmer que les attentes de tests UX pour reduced motion, accessibilité, swipe, infinite scroll et bottom sheets sont représentées dans les critères d’acceptation story-level ; la plupart sont déjà présentes dans l’Epic 6.

## Revue qualité des epics

### Résultat global

Les epics sont globalement traçables et proches d’un état prêt pour l’implémentation, mais la revue identifie plusieurs problèmes qualité à résoudre avant de les considérer comme une base d’implémentation propre.

### Validation de structure des epics

| Epic | Focalisation valeur utilisateur | Indépendance | Évaluation |
| --- | --- | --- | --- |
| Epic 1 — Configurer le cockpit de surveillance | Forte : permet à l’utilisateur de configurer produits, seuils, frais et référentiels. | Forte : fournit une configuration persistée fondationnelle. | Réussi |
| Epic 2 — Orchestrer la collecte fiable multi-sources | Moyenne : la valeur utilisateur est la réduction de veille manuelle, mais le libellé reste orienté backend. | Dépend de la configuration d’Epic 1, ce qui est acceptable. | Réussi avec réserve mineure |
| Epic 3 — Protéger l’accès à mon radar | Limite mais acceptable : sécurité/auth est une valeur nécessaire pour l’exposition web, et le titre reste centré utilisateur. | Peut être construit après ou en parallèle de la première exposition API backend. | Réussi |
| Epic 4 — Transformer les signaux en opportunités rentables | Forte : permet directement les décisions de rentabilité. | Dépend des signaux collectés par Epic 2, séquence acceptable. | Réussi |
| Epic 5 — Alerter & notifier en temps réel | Forte : permet une action rapide. | Dépend des opportunités scorées par Epic 4, séquence acceptable. | Réussi |
| Epic 6 — Construire l’interface décisionnelle | Forte valeur utilisateur, mais scope très large. | Dépend des capacités backend et SSE ; acceptable en epic tardif, mais volumineux. | Réussi avec réserve majeure de sizing |

### Évaluation qualité des stories

#### Forces

- Les stories utilisent de manière cohérente la structure utilisateur `As a / I want / So that`.
- La plupart des critères d’acceptation sont testables et incluent à la fois comportement produit et attentes de test.
- Les attentes de test story-level sont intégrées directement aux stories fonctionnelles, ce qui réduit la dérive des stories de test autonomes.
- La traçabilité FR est explicite au niveau epic et soutenue par une matrice de couverture.

#### 🔴 Violations critiques

Aucune trouvée.

#### 🟠 Problèmes majeurs

1. **Epic 6 est probablement trop volumineux pour une exécution prévisible.**
   - Preuve : Epic 6 contient design tokens, design system complet, page Radar, page Détail, page Sources, page Stratégie, hooks, responsive/accessibilité, saisie manuelle et tests E2E.
   - Impact : risque de complétion partielle, dépendances cachées et fatigue de review.
   - Recommandation : envisager de scinder Epic 6 en deux epics d’implémentation — fondations UI/design system et workflows/pages décisionnels — ou conserver Epic 6 avec des tranches story-level petites et strictes.

2. **Story 6.2 est probablement surdimensionnée.**
   - Preuve : Story 6.2 exige onze composants partagés, plusieurs variantes/états et une couverture de tests large.
   - Impact : une story unique peut devenir une unité d’implémentation de taille epic.
   - Recommandation : scinder en lots de composants plus petits, par exemple primitives (`Button`, `FormField`, `Panel`, `Feedback`), cartes/badges, overlays/toasts et composants d’interaction.

3. **Story 6.9 mélange livraison fonctionnelle et E2E complet.**
   - Preuve : la saisie manuelle d’opportunité et les quatre parcours critiques Playwright sont groupés dans une seule story.
   - Impact : la livraison de la saisie manuelle peut être bloquée par une maturité E2E release-level sans rapport direct.
   - Recommandation : garder l’implémentation de saisie manuelle dans Story 6.9 et distribuer chaque parcours E2E dans la story propriétaire du parcours, ou créer des tâches QA explicites liées à la préparation release.

#### 🟡 Réserves mineures

1. **Le titre et l’objectif de l’Epic 2 restent assez techniques.**
   - Il mappe tout de même une valeur utilisateur, mais pourrait être formulé plus près du résultat utilisateur : « Collecter automatiquement les signaux sans perdre le contrôle en cas de panne. »

2. **La dérive de numérotation FR entre PRD et inventaire epics peut perturber la traçabilité.**
   - L’inventaire epics scinde le FR-01 du PRD en deux entrées, puis décale la numérotation suivante.
   - Recommandation : ajouter une table explicite PRD-FR ↔ Epics-FR ou normaliser l’inventaire epics sur la numérotation PRD.

3. **La capability map d’architecture sous-représente le fallback manuel UI pour FR-07.**
   - Les epics le couvrent via Story 6.9, mais l’architecture mappe surtout FR-07 au runtime backend des connecteurs.
   - Recommandation : ajouter `frontend/src/pages/SourcesPage.tsx` ou le flux de saisie manuelle à la capability map FR-07.

4. **Certains critères d’acceptation utilisent des cibles de couverture larges nécessitant une stratégie de test locale.**
   - Exemple : couverture composants ≥ 80 %, couverture de branches 100 % pour le calcul de marge, aucune violation critique axe-core.
   - Recommandation : s’assurer que l’outillage et les seuils de test sont configurés avant l’exécution des stories, pas découverts tardivement.

### Analyse des dépendances

- Aucune dépendance prospective exigeant Epic N+1 pour compléter Epic N n’a été trouvée.
- La séquence des epics est cohérente : configuration → collecte → protection web → scoring → alerting/temps réel → UI décisionnelle.
- Les dépendances de stories remontent généralement vers l’arrière ou restent dans le même epic avec un ordre acceptable.
- Le timing base de données/entités semble acceptable : les stories introduisent les besoins de persistance au fil de l’eau plutôt que d’imposer toutes les tables upfront dans une story purement technique.

### Checklist de conformité aux bonnes pratiques

| Vérification | Résultat |
| --- | --- |
| Les epics livrent une valeur utilisateur | Réussi, avec réserve mineure sur le libellé de l’Epic 2 |
| Les epics peuvent fonctionner indépendamment en séquence | Réussi |
| Les stories sont correctement dimensionnées | Partiel : Story 6.2 et 6.9 sont surdimensionnées |
| Pas de dépendances prospectives | Réussi |
| Tables créées au moment du besoin | Réussi sur la base du texte disponible |
| Critères d’acceptation clairs | Réussi avec réserves mineures sur la configuration des seuils |
| Traçabilité FR maintenue | Réussi sémantiquement, mais la dérive de numérotation doit être corrigée |

### Recommandations

1. Normaliser la numérotation FR entre PRD et epics avant validation finale.
2. Scinder ou timeboxer strictement Story 6.2.
3. Séparer la livraison fonctionnelle de saisie manuelle de la charge d’automatisation E2E complète dans Story 6.9.
4. Mettre à jour la cartographie architecture FR-07 pour inclure le fallback manuel UI.
5. Confirmer les seuils et l’outillage de tests avant le début de l’implémentation.

## Synthèse et recommandations

### Statut global de préparation

TRAVAIL NÉCESSAIRE.

Le projet est proche d’un état prêt pour l’implémentation : les documents PRD, Architecture, Epics et UX actifs existent ; les exigences fonctionnelles du PRD sont sémantiquement couvertes par les epics ; l’UX est matériellement alignée avec le PRD et l’architecture. Cependant, plusieurs problèmes de qualité de planification doivent être corrigés avant d’utiliser ce rapport comme baseline d’implémentation propre.

### Problèmes critiques nécessitant une action immédiate

Aucun bloqueur critique n’a été trouvé.

### Problèmes majeurs à traiter avant validation finale

1. **Dérive de numérotation FR entre PRD et epics.**
   - L’inventaire epics scinde le FR-01 du PRD en deux exigences et décale la numérotation suivante.
   - Cela ne crée pas d’absence de couverture sémantique, mais peut provoquer des erreurs de traçabilité en implémentation et review.

2. **Risque de sizing Epic 6 / Story 6.2.**
   - Epic 6 porte un scope large UI/design system/pages/E2E.
   - Story 6.2 contient à elle seule onze composants partagés avec variantes, états et tests.

3. **Mélange de scope dans Story 6.9.**
   - L’implémentation de la saisie manuelle et les quatre parcours E2E Playwright sont groupés.
   - Cela peut bloquer la livraison de la saisie manuelle sur une automatisation QA de niveau release.

4. **Cartographie architecture FR-07 incomplète.**
   - L’architecture mappe principalement FR-07 au runtime backend des connecteurs, alors que le PRD et les epics exigent aussi la continuité via saisie/import manuel côté UI.

### Prochaines étapes recommandées

1. Normaliser l’inventaire d’exigences et la carte de couverture FR des epics sur la numérotation canonique du PRD, ou ajouter une table explicite PRD-FR ↔ Epics-FR.
2. Scinder Story 6.2 en lots de composants plus petits ou définir une checklist de livraison stricte permettant des reviews partielles sans perte de traçabilité.
3. Scinder Story 6.9 entre implémentation de saisie manuelle et automatisation des parcours E2E, ou distribuer les parcours E2E dans les stories propriétaires.
4. Mettre à jour `architecture.md` pour que la cartographie FR-07 inclue le chemin UI de saisie manuelle, probablement `frontend/src/pages/SourcesPage.tsx` et le flux connecteur manuel.
5. Confirmer les seuils et la configuration des tests automatisés avant l’implémentation : couverture Vitest/RTL, contrôles axe-core, setup Playwright, attentes de couverture Rust unitaires/intégration.
6. Traiter les documents UX actifs comme `ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` et `EXPERIENCE.md` ; garder `_archive/ux-design-specification-2026-02-19.md` historique sauf sélection explicite.

### Note finale

Cette évaluation identifie 0 bloqueur critique, 4 problèmes majeurs et 5 réserves mineures sur la découverte documentaire, la traçabilité PRD, l’alignement UX, la cartographie architecture et la qualité epics/stories. Corriger les problèmes majeurs avant la validation finale d’implémentation. Si l’équipe accepte les risques, l’implémentation peut démarrer avec un suivi explicite des corrections recommandées.

**Évaluateur :** Winston — Architecte système / facilitateur Implementation Readiness
**Évaluation terminée :** 2026-07-24
