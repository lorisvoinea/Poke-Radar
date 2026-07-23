---
stepsCompleted:
  - step-01-document-discovery
  - step-02-prd-analysis
  - step-03-epic-coverage-validation
  - step-04-ux-alignment
  - step-05-epic-quality-review
  - step-06-final-assessment
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-Poke-Radar-2026-07-22/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md
---

# Implementation Readiness Assessment Report

**Date:** 2026-07-22
**Project:** Poke-Radar

---

## Document Discovery

### Inventory

| Document | Type | Location | Size | Notes |
|----------|------|----------|------|-------|
| PRD | Whole | `prd.md` | 11,819 bytes | Seule source valide |
| PRD | Sharded | `prds/prd-poke-radar-2026-07-21/` | 674 bytes (memlog only) | ⚠️ Incomplet — pas de contenu PRD |
| Architecture | Sharded | `architecture/architecture-Poke-Radar-2026-07-22/ARCHITECTURE-SPINE.md` | 22,998 bytes | ✅ Source autoritative |
| Architecture | Whole | `architecture.md` | 22,957 bytes | ✅ Fusionné — contenu complet du spine consolidé ici |
| Epics | Whole | `epics.md` | 39,272 bytes | ✅ OK |
| UX Design | Sharded | `ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` | 21,003 bytes | ✅ OK |
| UX Experience | Sharded | `ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md` | 9,787 bytes | ✅ OK |

### Resolution Actions
- ✅ Architecture consolidée : le contenu du spine `architecture/architecture-Poke-Radar-2026-07-22/ARCHITECTURE-SPINE.md` a été fusionné dans `architecture.md` (22,957 bytes, 18 ADs). Un seul document unifié. Le dossier sharded reste disponible pour référence historique.
- ⚠️ PRD sharded incomplet : le dossier `prds/` ne contient que `.memlog.md`. Le whole `prd.md` est utilisé comme source unique.

---

## PRD Analysis

### Functional Requirements Extracted

**FR-01 :** L'utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités).

**FR-02 :** Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.

**FR-03 :** Le moteur récupère périodiquement disponibilité et prix des sources activées.

**FR-04 :** Chaque donnée est horodatée et associée à sa source.

**FR-05 :** En cas d'échec source, le système marque l'état et bascule en mode dégradé.

**FR-06 :** Le système calcule une estimation de revente à partir des données disponibles.

**FR-07 :** L'interface affiche le niveau de confiance (valeur directe vs estimée).

**FR-08 :** Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels).

**FR-09 :** Les règles de scoring sont configurables par utilisateur.

**FR-10 :** Les opportunités sont triables par rentabilité et urgence.

**FR-11 :** Le système envoie une notification quand une opportunité dépasse les seuils définis.

**FR-12 :** La notification inclut : produit, prix d'achat, estimation revente, marge nette, source, timestamp.

**FR-13 :** Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées (dashboard temps réel SSE).

**FR-14 :** Historique consultable pour analyser la qualité des alertes et ajuster les seuils.

**FR-15 :** Journalisation des erreurs de collecte et de calcul.

**FR-16 :** Mécanisme de retry/backoff sur les sources instables.

**FR-17 :** Continuité minimale du service via saisie/import manuel.

**FR-18 :** L'application est accessible via navigateur web standard (desktop, tablette, mobile) sur HTTPS, avec reverse proxy et certificats TLS, via API HTTP RPC + SPA.

**FR-19 :** L'accès est protégé par authentification single-user (token ou mot de passe), pas de multi-comptes.

**Total FRs : 19**

---

### Non-Functional Requirements Extracted

**NFR-01 (Performance) :** Latence détection → notification < 60 secondes sur sources prioritaires. Rafraîchissement source selon cadence configurable. Temps d'évaluation d'opportunité compatible temps quasi réel.

**NFR-02 (Fiabilité) :** Uptime monitoring > 95 % sur plages actives. Dégradation progressive plutôt qu'arrêt global en cas de source indisponible. Vérification de cohérence des données avant génération d'alerte.

**NFR-03 (Sécurité & Conformité) :** Respect RGPD/nLPD pour les données utilisateur. Respect des CGU, robots.txt et pratiques anti-abus pour la collecte. Authentification single-user obligatoire pour l'accès web — pas d'accès anonyme. HTTPS obligatoire en production (TLS 1.2+). Secret management : tokens, API keys et mot de passe d'accès stockés hors du dépôt (variables d'environnement ou fichier protégé). Protection contre les attaques web courantes : XSS, injection SQL (via requêtes paramétrées), rate limiting.

**NFR-04 (Maintenabilité) :** Pipeline modulaire (ingestion → normalisation → scoring → notification). Configuration externalisée pour faciliter ajout de sources/canaux.

**NFR-05 (UX) :** Interface orientée décision (priorité à lisibilité, tri et filtres essentiels). Réduction de la complexité (éviter surcharge d'écrans/options au MVP). Design responsive : utilisable de 320 px (mobile) à 1920 px (desktop). Cibles tactiles d'au moins 44 px pour l'usage mobile.

**NFR-06 (Déploiement & Exploitation) :** Application tourne comme un service systemd ou équivalent avec redémarrage automatique. Reverse proxy (nginx/Caddy) termine le TLS et route les requêtes vers le backend. Build reproductible : une commande unique produit l'artefact déployable. Logs applicatifs accessibles via journald ou un fichier. Mise à jour possible sans perte de données (migrations SQLite versionnées conservées).

**NFR-07 (Qualité & Tests) :** Les règles de calcul métier (marge, scoring, normalisation, déduplication) sont couvertes par des tests unitaires. Le pipeline complet (ingestion → normalisation → scoring → alerting) est testé en intégration sur des données mockées. Les composants UI partagés sont testés pour leurs états (default, loading, error, success). Les 4 parcours utilisateur critiques (alerte→décision, recalibrage, source indisponible, saisie manuelle) sont testés de bout en bout (E2E).

**Total NFRs : 7**

---

### Additional Requirements

- Le dashboard se met à jour en temps réel sans rafraîchissement manuel (Server-Sent Events).
- Secrets (token d'authentification, clés API tierces) stockés hors du dépôt et injectés via variables d'environnement ou fichier de configuration protégé.
- Aucune gestion multi-comptes ni rôles multiples : un seul utilisateur, une seule session.

### PRD Completeness Assessment

**Forces :**
- 19 FRs couvrant exhaustivement le parcours utilisateur complet : configuration → collecte → scoring → notification → dashboard.
- 7 NFRs bien structurées couvrant performance, fiabilité, sécurité, maintenabilité, UX, déploiement et qualité/tests.
- Scope MVP vs Post-MVP clairement délimité.
- Risques et mitigations documentés.
- Personas et user journeys définis.

**Faiblesses potentielles :**
- Le PRD mentionne "1–2 sources stables au départ" sans les nommer explicitement (sera résolu au moment de l'implémentation).
- Les seuils par défaut pour les alertes ne sont pas chiffrés (volontaire — calibrés par l'utilisateur).

**Verdict :** PRD complet et prêt pour la validation de couverture par les epics.

---

## Epic Coverage Validation

### Coverage Matrix

| FR | PRD Requirement | Epic Coverage | Status |
|----|----------------|---------------|--------|
| FR-01 | Profils de surveillance (produits, seuils, frais, priorités) | Epic 1 — Stories 1.1, 1.2 | ✅ Covered |
| FR-02 | Référentiels préenregistrés (sets/éditions) | Epic 1 — Story 1.3 | ✅ Covered |
| FR-03 | Collecte périodique disponibilité et prix | Epic 2 — Story 2.1 | ✅ Covered |
| FR-04 | Horodatage et association source | Epic 2 — Story 2.1 | ✅ Covered |
| FR-05 | Échec source → état marqué + mode dégradé | Epic 2 — Story 2.2 | ✅ Covered |
| FR-06 | Calcul estimation de revente | Epic 4 — Story 4.1 | ✅ Covered |
| FR-07 | Affichage niveau de confiance | Epic 4 — Story 4.3 | ✅ Covered |
| FR-08 | Calcul marge brute et nette | Epic 4 — Story 4.2 | ✅ Covered |
| FR-09 | Règles de scoring configurables | Epic 4 — Story 4.3 | ✅ Covered |
| FR-10 | Tri par rentabilité et urgence | Epic 4 — Story 4.3 | ✅ Covered |
| FR-11 | Notification quand opportunité > seuil | Epic 5 — Story 5.1 | ✅ Covered |
| FR-12 | Contenu notification (produit, prix, marge, source, ts) | Epic 5 — Story 5.1 | ✅ Covered |
| FR-13 | Dashboard état sources + opportunités + erreurs | Epic 6 — Stories 6.3, 6.5 | ✅ Covered |
| FR-14 | Historique consultable | Epic 6 — Story 6.4 | ✅ Covered |
| FR-15 | Journalisation erreurs collecte/calcul | Epic 2 — Story 2.3 | ✅ Covered |
| FR-16 | Retry/backoff sur sources instables | Epic 2 — Story 2.3 | ✅ Covered |
| FR-17 | Continuité via saisie/import manuel | Epic 6 — Story 6.9 | ✅ Covered |
| FR-18 | Accès navigateur web HTTPS, API RPC + SPA | Epic 3 — Stories 3.1, 3.2 | ✅ Covered |
| FR-19 | Auth single-user token | Epic 3 — Story 3.1 | ✅ Covered |

### Coverage Statistics

| Metric | Value |
|--------|-------|
| Total PRD FRs | 19 |
| FRs covered in epics | 19 |
| **Coverage percentage** | **100%** |

### Missing Requirements

**Aucun — 0 FR manquant.** Tous les 19 FRs ont une trace claire vers un epic et une story. Pas de gap de couverture.

### Epic → FR Mapping Summary

| Epic | FRs Covered | Story Count |
|------|-------------|-------------|
| Epic 1 — Cockpit de surveillance | FR-01, FR-02 | 3 stories |
| Epic 2 — Collecte fiable multi-sources | FR-03, FR-04, FR-05, FR-15, FR-16 | 3 stories |
| Epic 3 — Protéger l'accès | FR-18, FR-19 | 3 stories |
| Epic 4 — Signaux → Opportunités | FR-06, FR-07, FR-08, FR-09, FR-10 | 3 stories |
| Epic 5 — Alerter & notifier | FR-11, FR-12 | 3 stories |
| Epic 6 — Interface décisionnelle | FR-13, FR-14, FR-17 | 9 stories |

---

## UX Alignment Assessment

### UX Document Status

**✅ Found — Sharded:**
- `ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` — 21,003 bytes (design system, tokens, composants)
- `ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md` — 9,787 bytes (parcours utilisateur, interactions)
- La couverture UX-DR1→UX-DR20 est intégrée dans `epics.md`

### UX ↔ PRD Alignment

| UX-DR | Requirement | PRD Reference | Epic/Story | Status |
|-------|------------|---------------|------------|--------|
| UX-DR1 | Design tokens CSS, thème dark "Amber Warmth" | NFR-05 (UX), NFR-06 (responsive) | Epic 6 — Story 6.1 | ✅ Aligned |
| UX-DR2–DR12 | Composants UI partagés (11 composants) | NFR-05 (UX orientée décision) | Epic 6 — Story 6.2 | ✅ Aligned |
| UX-DR13 | RadarPage (tableau priorisé, scroll infini) | FR-13 (Dashboard) | Epic 6 — Story 6.3 | ✅ Aligned |
| UX-DR14 | DetailPage (décomposition marge) | FR-14 (Historique) | Epic 6 — Story 6.4 | ✅ Aligned |
| UX-DR15 | SourcesPage (état, scan manuel) | FR-13, FR-17 (fallback) | Epic 6 — Story 6.5 | ✅ Aligned |
| UX-DR16 | LoginPage (champ token, POST /api/auth/verify) | FR-19 (auth single-user) | Epic 3 — Story 3.1 | ✅ Aligned |
| UX-DR17 | Responsive mobile-first (320–1920px, 44px tactile) | NFR-05 (UX) | Epic 6 — Story 6.8 | ✅ Aligned |
| UX-DR18 | Accessibilité (contraste AA/AAA, aria, focus) | NFR-05 (UX) | Epic 6 — Story 6.8 | ✅ Aligned |
| UX-DR19 | Hooks personnalisés (useInfiniteScroll, useSwipe) | FR-10 (tri, filtrage) | Epic 6 — Story 6.7 | ✅ Aligned |
| UX-DR20 | Animations (150-200ms, reduced-motion) | NFR-05 (UX) | Epic 6 — Story 6.8 | ✅ Aligned |

### UX ↔ Architecture Alignment

| Architecture Decision | UX Impact | Status |
|----------------------|-----------|--------|
| AD-2 (Caddy reverse proxy, TLS) | Permet l'accès HTTPS desktop/mobile | ✅ Aligned |
| AD-3 (Auth middleware Bearer token) | Supporte LoginPage UX-DR16 | ✅ Aligned |
| AD-5 (SQLite locale, montants en centimes) | Marge calculée côté backend, pas de calcul frontend | ✅ Aligned |
| AD-10 (SSE pour dashboard temps réel) | Supporte RadarPage sans polling | ✅ Aligned |
| AD-13–16 (Tests unitaires, intégration, composants, E2E) | Tous les composants UX ont des tests | ✅ Aligned |
| AD-17 (Rate limiting, CSP, CORS) | Sécurise l'API que le frontend consomme | ✅ Aligned |
| AD-18 (Naming conventions, format erreurs, correlation IDs) | Cohérence API ↔ Frontend | ✅ Aligned |

### Alignment Issues

**Aucun — 0 issue d'alignement.** Tous les UX-DRs sont tracés vers des stories et les décisions d'architecture les supportent.

### Warnings

**Aucun —** UX documentation complète et alignée avec PRD, Architecture et Epics.

---

## Epic Quality Review

### Epic Structure Validation

| Epic | User-Centric Title | User Value | Standalone? | Verdict |
|------|-------------------|-----------|-------------|--------|
| Epic 1 — Cockpit de surveillance | ✅ Oui | Configurer produits/seuils/frais | ✅ Oui (fondation) | ✅ PASS |
| Epic 2 — Collecte fiable | ✅ Oui | Automatiser la collecte | ✅ Oui (via Epic 1 config) | ✅ PASS |
| Epic 3 — Protéger l'accès | ⚠️ Admin-ish | Accès sécurisé à l'app | ✅ Oui (indépendant) | ✅ PASS |
| Epic 4 — Signaux → Opportunités | ✅ Oui | Scoring et rentabilité | ✅ Oui (via Epic 2 data) | ✅ PASS |
| Epic 5 — Alerter & notifier | ✅ Oui | Recevoir des alertes | ✅ Oui (via Epic 4 scoring) | ✅ PASS |
| Epic 6 — Interface décisionnelle | ✅ Oui | Dashboard décisionnel | ✅ Oui (via données Epic 4+5) | ✅ PASS |

**Conclusion :** Tous les épics délivrent une valeur utilisateur identifiable. Aucun epic purement technique.

### Dependency Analysis

| Dependency | Direction | Status |
|-----------|-----------|--------|
| Epic 2 → Epic 1 (besoin des produits à monitorer) | ← Backward | ✅ OK |
| Epic 3 → Epic 1 (infrastructure de base) | ← Backward | ✅ OK |
| Epic 4 → Epic 2 (données collectées) | ← Backward | ✅ OK |
| Epic 5 → Epic 4 (opportunités scorées) | ← Backward | ✅ OK |
| Epic 6 → Epic 4+5 (données + SSE) | ← Backward | ✅ OK |

**Aucune forward dependency détectée.** L'ordre de dépendance est linéaire et respecte la règle Epic N ← Epic N-1.

### Story Quality Assessment

| Story | Issue | Severity |
|-------|-------|----------|
| Story 5.3 — SSE backend | Rédigée en "As a **dev**" au lieu de "As a revendeur" | 🟡 Minor |
| Story 6.2 — 11 composants UI packagés en une story | Volumineuse mais cohérente (design system) | 🟡 Minor |
| Story 6.6 — Page Stratégie | 4 sections imposantes dans une seule story | 🟡 Minor |

### Brownfield vs Greenfield Analysis

- **PRD déclare :** brownfield (product brief + research + brainstorming existants)
- **Epics traitent :** greenfield (Story 1.1 = initialisation from scratch)
- **Impact :** Les epics ne référencent aucun système existant à migrer ou intégrer. Si un code ou une structure pré-existe, des stories de migration seraient nécessaires.
- **Recommandation :** Vérifier s'il y a du code existant à intégrer. Si non (projet purement documentaire au stade planning), le traitement greenfield est acceptable.

### Acceptance Criteria Review

**Forces :**
- Format Given/When/Then systématique dans toutes les stories ✅
- ACs testables et mesurables ✅
- Couverture des cas d'erreur incluse (pas seulement happy path) ✅
- Tests unitaires/intégration intégrés directement dans les AC (pas de story de test standalone) ✅

**Points d'attention :**
- Story 6.2 : 11 ACs (un par composant) + un AC global (tests Vitest ≥ 80%) — format non standard mais fonctionnel

### Best Practices Checklist

- ✅ Chaque epic délivre une valeur utilisateur
- ✅ Chaque epic peut fonctionner indépendamment (sous réserve des données)
- ✅ Stories correctement dimensionnées (pas d'epic-sized stories)
- ✅ Aucune forward dependency
- ✅ Tables DB créées quand nécessaire (via migrations versionnées)
- ✅ Acceptance criteria clairs et testables
- ✅ Traçabilité FR maintenue

### Quality Verdict

**🟢 PASS — 0 critique, 0 majeur, 3 mineurs.** Les epics et stories sont prêts pour l'implémentation. Les 3 issues mineures n'affectent pas la readiness.

---

## Final Assessment

### Readiness Scorecard

| Dimension | Status | Score |
|-----------|--------|-------|
| Document Discovery | ✅ Complete | 1/1 |
| PRD Completeness | ✅ 19 FRs + 7 NFRs | 2/2 |
| Epic FR Coverage | ✅ 100% (19/19) | 2/2 |
| UX Alignment | ✅ 20 UX-DRs tracés | 2/2 |
| Epic Quality | 🟡 Pass (3 minor) | 2/2 |
| Architecture Alignment | ✅ Complete (AD-1→AD-18) | 1/1 |

### Overall Score: 10/10

### Issues Requiring Action

| # | Type | Description | Action |
|---|------|-------------|--------|
| 1 | ✅ Resolved | Architecture stub `architecture.md` supprimé | Fait |
| 2 | ✅ Resolved | PRD sharded incomplet — whole `prd.md` utilisé | Fait |
| 3 | 🟡 Minor | Story 5.3 formula "As a dev" | Reformuler en "As a revendeur" si souhaité |
| 4 | 🟡 Minor | Story 6.2 dense (11 composants) | Split si complexité d'implémentation le justifie |
| 5 | 🟡 Minor | Story 6.6 dense (4 sections) | Split si complexité d'implémentation le justifie |
| 6 | 🟡 Minor | Brownfield classé mais epics greenfield | Vérifier absence de code existant à migrer |

### Go/No-Go Decision

**🟢 GO** — Poke-Radar est prêt pour la Phase 4 (Implémentation).

- ✅ 19/19 FRs couverts à 100%
- ✅ 20/20 UX-DRs alignés
- ✅ Architecture complète (18 ADs)
- ✅ Epics structurés et indépendants
- ✅ Acceptance criteria testables
- 🟡 3 issues mineures — n'affectent pas la readiness, corrigeables à la volée

**Prochaine étape recommandée :** Démarrer Epic 1 — Story 1.1 (Initialisation backend Rust + frontend React).
