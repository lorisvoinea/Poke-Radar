---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - architecture_technique.md
  - rapport_brainstorming.md
  - technical-Poke-Radar-research.md
  - market-Poke-Radar-research.md
  - _bmad/_bmad-output/planning-artifacts/research/domain-tcg-pokemon-prix-marche-research-2025-02-05.md
workflowType: 'architecture'
project_name: 'bmad'
user_name: 'Loris'
date: '2026-02-18'
lastStep: 8
status: 'complete'
completedAt: '2026-02-18'
---

# Document de Décision d’Architecture — Poke-Radar

## 1) Contexte projet et contraintes

Poke-Radar est une application desktop orientée opportunités d’arbitrage Pokémon TCG : détection stock retail (Fnac/Cultura/Pokémon Center), estimation de revente (Cardmarket/eBay), puis alerte temps réel (Telegram).

### Contraintes clés
- Exécution continue en local avec faible empreinte mémoire.
- Scraping de sites dynamiques (anti-bot, changements DOM).
- Calcul de marge traçable et reproductible.
- Time-to-market rapide malgré une stack moderne.

## 2) Décisions d’architecture (ADR synthétiques)

### ADR-001 — Architecture desktop hybride (Tauri v2 + Rust + React)
**Décision :** adopter Tauri v2 avec backend Rust et frontend React/TypeScript.

**Pourquoi :**
- Performance et empreinte RAM nettement meilleures qu’Electron.
- Rust adapté aux workers concurrents et à la robustesse long-terme.
- React/Vite accélère l’itération UI.

**Conséquence :** séparation nette “core métier Rust” vs “présentation React”, communication via commandes Tauri.

### ADR-002 — Persistance locale SQLite
**Décision :** base SQLite locale, migrations versionnées, accès via `sqlx`.

**Pourquoi :**
- Zéro infra côté utilisateur.
- Requêtes analytiques simples pour historique prix et opportunités.

**Conséquence :** un schéma minimal mais extensible (produits, sources, snapshots prix, opportunités, alertes).

### ADR-003 — Scraping multi-source orienté résilience
**Décision :** stratégie mixte HTTP parsing + navigateur headless selon source.

**Pourquoi :**
- Réduire coût CPU lorsque HTML statique suffit.
- Garder headless pour pages JS/anti-bot.

**Conséquence :** adaptateurs par site, sélecteurs versionnés, mécanisme de fallback et scoring de confiance.

### ADR-004 — Moteur de pricing et arbitrage centralisé
**Décision :** calcul de marge centralisé dans un service Rust unique.

**Pourquoi :**
- Empêcher divergence de logique entre UI, alerting et exports.
- Faciliter tests unitaires sur règles business.

**Conséquence :** formule de marge normalisée, simulation “what-if”, traçabilité par exécution.

### ADR-005 — Notification asynchrone Telegram
**Décision :** pipeline d’alertes découplé (queue interne + worker notification).

**Pourquoi :**
- Éviter que latence API Telegram bloque le scraping.
- Gérer retry/backoff et déduplication.

**Conséquence :** meilleure fiabilité et suppression des notifications spam.

## 3) Vue logique des composants

1. **Scheduler**: planifie les scans par source/produit.
2. **Source Connectors**: modules Fnac/Cultura/PokémonCenter/eBay/Cardmarket.
3. **Normalizer**: harmonise nommage produit, devise, frais et qualité de signal.
4. **Pricing Engine**: calcule prix de revente net et marge estimée.
5. **Opportunity Evaluator**: applique seuils, règles de risque et déduplication.
6. **Alert Dispatcher**: envoie Telegram + journalise état.
7. **Desktop UI**: dashboard statut, historique et configuration.

## 4) Modèle de données cible (v1)

- `products(id, name, set_code, language, rarity, ean, created_at)`
- `sources(id, name, type, reliability_score)`
- `listings(id, source_id, product_id, url, price_gross, shipping, currency, status, captured_at)`
- `market_snapshots(id, source_id, product_id, sold_median, sold_p25, sold_p75, sample_size, captured_at)`
- `opportunities(id, product_id, buy_listing_id, expected_sell_net, estimated_margin, margin_pct, confidence, detected_at)`
- `alerts(id, opportunity_id, channel, status, sent_at, error_message)`
- `settings(id, alert_margin_min, confidence_min, scan_interval_sec, telegram_chat_id, updated_at)`

## 5) Patterns d’implémentation pour éviter les conflits d’agents

- **Naming convention**: snake_case Rust, camelCase côté front TypeScript.
- **Boundaries**: aucune règle métier dans React (UI only).
- **Errors**: erreurs typées Rust (`thiserror`) + mapping unifié vers messages UI.
- **Time**: stocker toutes les dates en UTC ISO-8601.
- **Money**: calculs en centimes (`i64`) pour éviter les flottants.
- **Observability**: logs structurés (`tracing`) avec correlation id par scan.

## 6) Structure projet recommandée

```text
src-tauri/
  src/
    app/
      mod.rs
      commands.rs
    domain/
      product.rs
      pricing.rs
      opportunity.rs
    infra/
      db/
        migrations/
        repository.rs
      scraping/
        connectors/
          fnac.rs
          cultura.rs
          pokemon_center.rs
          ebay.rs
          cardmarket.rs
        anti_bot.rs
      notifications/
        telegram.rs
    workflows/
      scheduler.rs
      scan_pipeline.rs
      alert_pipeline.rs

ui/
  src/
    pages/
    components/
    stores/
    services/
```

## 7) Validation de cohérence

### Cohérence des décisions ✅
- Les choix techniques sont alignés avec les contraintes de performance desktop.
- Le découplage scraping/pricing/alerting réduit le risque de régressions croisées.

### Couverture des besoins ✅
- Détection stock : couverte via connecteurs spécialisés.
- Estimation revente : couverte via snapshots marché + moteur de pricing.
- Alerting temps réel : couvert via dispatcher asynchrone.

### Readiness d’implémentation ✅
- Composants, schéma de données, conventions et structure de dossiers sont définis.
- Les points à risque (anti-bot, drift des sélecteurs, bruit des prix) ont une stratégie explicite.

## 8) Risques et mitigations

- **Risque anti-bot élevé** → jitter, rotation user-agent, backoff, quotas par domaine.
- **Risque qualité donnée marché** → médianes, exclusion outliers, score de confiance.
- **Risque dette technique rapide** → ADRs versionnés et tests de régression parsing.

## 9) Prochaines actions recommandées

1. Implémenter une première tranche verticale: Fnac → SQLite → Dashboard → Telegram.
2. Ajouter tests unitaires du moteur de marge (cas nominal + frais + outliers).
3. Mettre en place snapshots DOM pour détecter la casse des sélecteurs.
4. Étendre aux sources Cardmarket/eBay avec normalisation commune.

## Architecture Validation Results

### Coherence Validation ✅
Décisions compatibles entre elles, aucun conflit structurel détecté.

### Requirements Coverage Validation ✅
Les capacités métier essentielles sont couvertes avec traçabilité des calculs.

### Implementation Readiness Validation ✅
Le système est prêt pour lancer l’implémentation en stories techniques.

### Gap Analysis Results
- **Critique**: absence actuelle de PRD formalisé (à compléter pour priorisation produit).
- **Important**: politique de conformité légale scraping à formaliser par source.
- **Optionnel**: stratégie d’auto-update signée (Tauri updater) pour v1.1.
