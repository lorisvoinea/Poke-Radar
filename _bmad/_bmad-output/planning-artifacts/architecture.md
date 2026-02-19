---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad/_bmad-output/planning-artifacts/prd.md
  - _bmad/_bmad-output/planning-artifacts/ux-design-specification.md
  - _bmad/_bmad-output/planning-artifacts/epics.md
  - _bmad/_bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
workflowType: 'architecture'
project_name: 'Poke-Radar'
user_name: 'Loris'
date: '2026-02-19'
lastStep: 8
status: 'complete'
completedAt: '2026-02-19'
---

# Architecture Decision Document — Poke-Radar

## 1) Contexte et cadre de décision

Cette architecture est alignée sur les artefacts actifs du projet (PRD, UX spec, epics) et vise un MVP desktop orienté décision pour revendeurs Pokémon.

### Objectifs techniques prioritaires
- Boucle **détection → scoring → notification** en quasi temps réel.
- Signal d’opportunité **actionnable** (marge nette explicable + confiance).
- Résilience opérationnelle (sources instables, mode dégradé, reprise automatique).
- Extensibilité progressive (nouvelles sources, nouveaux canaux de notification).

### Contraintes structurantes
- Exécution locale desktop continue avec empreinte maîtrisée.
- Intégration de connecteurs hétérogènes (retail + marché secondaire).
- Conformité opérationnelle (secret management local, logs sans fuite, garde-fous scraping).
- UX décisionnelle (lisibilité, tri, filtres persistants, accessibilité clavier/contraste).

## 2) Décisions d’architecture (ADRs)

### ADR-001 — Stack desktop hybride Tauri v2 + Rust + React/TypeScript
**Décision**
Adopter une application desktop Tauri v2 avec backend Rust (orchestration, domaine, persistance) et frontend React/TypeScript (cockpit décisionnel).

**Rationale**
- Tauri minimise empreinte mémoire et distribution locale.
- Rust apporte robustesse pour scheduler, connecteurs et pipeline concurrent.
- React/TS accélère l’itération UX sur table priorisée et panneaux de détail.

**Conséquences**
- Contrat API interne explicite via commandes Tauri.
- Séparation stricte: logique métier en Rust, UI en TypeScript.

### ADR-002 — Architecture pipeline modulaire (ingestion → normalisation → scoring → alerting)
**Décision**
Implémenter un pipeline déterministe en étapes isolées, chacune testable indépendamment.

**Rationale**
- Réduction des conflits d’implémentation entre agents/modules.
- Observabilité plus fine (latence et erreurs par étape).

**Conséquences**
- Interfaces de données stables entre étapes.
- Possibilité de fallback étape par étape (ex: estimation indisponible mais collecte stock valide).

### ADR-003 — Persistance locale SQLite + migrations versionnées
**Décision**
Utiliser SQLite pour stocker configurations, snapshots de collecte, opportunités et historique alertes.

**Rationale**
- Zéro dépendance infra côté utilisateur.
- Bonne adéquation MVP desktop + besoin de traçabilité historique.

**Conséquences**
- Migrations obligatoires pour évolution de schéma.
- Indexation ciblée pour requêtes dashboard et déduplication d’alertes.

### ADR-004 — Connecteurs par source avec stratégie de résilience unifiée
**Décision**
Chaque source (retail ou marché) est un adaptateur implémentant une interface commune: collecte, mapping, health status, erreurs typées.

**Rationale**
- Ajouter/supprimer une source sans refonte globale.
- Harmoniser retry/backoff/jitter et règles anti-abus.

**Conséquences**
- Contrat commun `Connector` + policy runtime partagée.
- Suivi de santé par source pour alimenter l’écran "Santé des sources & fallback".

### ADR-005 — Moteur de marge nette centralisé et explicable
**Décision**
Centraliser le calcul économique (frais, commissions, port, hypothèses) dans un service Rust unique.

**Rationale**
- Éviter toute divergence entre UI, alertes Telegram et exports futurs.
- Garantir le "Pourquoi cette alerte ?" demandé par l’UX.

**Conséquences**
- Détail de calcul persisté avec chaque opportunité.
- Jeux de tests unitaires sur scénarios nominal/outliers.

### ADR-006 — Alerting asynchrone Telegram avec anti-duplication
**Décision**
Découpler l’émission d’alertes du pipeline principal via file interne et worker dédié.

**Rationale**
- Le délai API Telegram ne doit pas bloquer la détection.
- Le bruit d’alertes doit être maîtrisé par règles de déduplication.

**Conséquences**
- Gestion de retry/backoff par canal.
- Journalisation explicite des statuts d’envoi (pending/sent/failed/suppressed).

## 3) Architecture logique cible

1. **Scheduler Service**
   - Lance les cycles selon cadence configurable.
   - Applique jitter et quotas par source.

2. **Connector Runtime**
   - Exécute les connecteurs retail/market.
   - Convertit les réponses en événements normalisés.

3. **Normalization Service**
   - Harmonise devises, format produit, granularité temporelle.
   - Ajoute métadonnées de confiance.

4. **Pricing & Scoring Engine**
   - Calcule marge brute/nette et score priorisé.
   - Filtre selon seuils utilisateur.

5. **Opportunity Store**
   - Persiste snapshots, opportunités, historiques d’état.
   - Expose des lectures optimisées dashboard.

6. **Alert Dispatcher**
   - Déduplique puis envoie via Telegram.
   - Émet événements d’observabilité.

7. **Desktop UI**
   - Radar (table priorisée), détail opportunité, stratégie, santé sources.
   - Actions décisionnelles rapides (traiter/ignorer/ouvrir source).

## 4) Modèle de données v1

### Entités principales
- `products`: périmètre surveillé (identifiants, set, langue, statut).
- `sources`: configuration source + type + paramètres runtime.
- `monitor_profiles`: paramètres économiques (seuils, frais, priorités).
- `listing_snapshots`: observations retail horodatées.
- `market_snapshots`: références marché secondaire horodatées.
- `opportunities`: résultat scoring + score confiance + explication.
- `alerts`: statut émission Telegram + motif suppression/dédoublonnage.
- `connector_health`: état runtime par source (ok/warn/down, dernier incident).

### Règles de persistance
- Timestamps en UTC ISO-8601.
- Montants stockés en centimes entiers (`i64`).
- Conservation d’un audit minimal de calcul pour explicabilité.

## 5) Contrats d’intégration internes

### Contrat Connecteur
Entrée: cible de collecte + configuration source.
Sortie: `ConnectorResult { snapshots, status, errors, collected_at }`.

### Contrat Scoring
Entrée: snapshot retail + références marché + profil utilisateur.
Sortie: `OpportunityEvaluation { margin_net, confidence, reasons[], should_alert }`.

### Contrat Alerting
Entrée: opportunité qualifiée.
Sortie: `AlertDelivery { channel, status, dedupe_key, sent_at, error? }`.

## 6) Patterns d’implémentation anti-conflits (agents/dev)

- **Single source of truth métier**: toute règle économique vit côté Rust domaine.
- **UI = présentation + interactions**: pas de calcul de marge en TypeScript.
- **Error taxonomy unique**: erreurs domaine/infrastructure normalisées avant affichage.
- **Config hot-reload maîtrisé**: changements de seuils pris en compte au cycle suivant.
- **Observabilité systématique**: correlation_id par cycle et par opportunité.
- **Nommage**: snake_case Rust, camelCase TS, schéma SQL explicite.
- **Feature toggles MVP**: connecteurs non stabilisés derrière flags.

## 7) Structure projet recommandée

```text
src-tauri/
  src/
    app/
      commands.rs
      state.rs
    domain/
      models/
      services/
      policies/
    connectors/
      retail/
      market/
      runtime.rs
    workflows/
      monitor_cycle.rs
      scoring_cycle.rs
      alert_cycle.rs
    infrastructure/
      db/
        migrations/
        repositories/
      telemetry/
      secrets/
      notifications/
        telegram.rs

ui/
  src/
    pages/
      radar/
      opportunity-detail/
      strategy/
      source-health/
    components/
    stores/
    services/
    design-system/
```

## 8) Qualité, sécurité, conformité

### Qualité runtime
- Retry/backoff bornés + circuit breaker léger par source.
- Dégradation progressive: source KO ≠ arrêt global.
- Protection contre spam (fenêtre temporelle + signature opportunité).

### Sécurité locale
- Secrets Telegram stockés hors logs et hors VCS.
- Nettoyage systématique des données sensibles en télémétrie.

### Conformité scraping
- Politique source-by-source documentée (cadence, limites, fallback).
- Priorisation API/flux autorisés quand disponibles.

## 9) Validation finale d’alignement

### Coherence Validation ✅
Les ADRs sont cohérents entre eux: stack, pipeline, persistance et UX cockpit convergent vers un MVP desktop décisionnel.

### Requirements Coverage Validation ✅
- FRs couverts via configuration, collecte, scoring, alerting, dashboard et résilience.
- NFRs couverts via modularité, observabilité, sécurité locale et performance de boucle.

### Implementation Readiness Validation ✅
La structure cible, les contrats internes, les patterns anti-conflits et le modèle de données fournissent un cadre exécutable pour lancer les stories techniques.

### Gap Analysis Results
- **Critique**: formaliser la matrice légale/source (CGU, fréquence autorisée, stratégie fallback).
- **Important**: définir les seuils de confiance initiaux par famille de produits.
- **Optionnel**: préparer abstraction multi-canaux notification (Discord/mail) pour post-MVP.
