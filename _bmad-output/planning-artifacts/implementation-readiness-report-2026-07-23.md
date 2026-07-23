---
stepsCompleted: [1, 2, 3, 4, 5, 6]
files:
  prd: prd.md
  architecture: architecture.md
  epics: epics.md
  ux: ux-designs/ux-Poke-Radar-2026-07-21/
---

# Implementation Readiness Assessment Report

**Date:** 2026-07-23
**Project:** Poke-Radar

## Document Inventory

| Document | Status | Source |
|----------|--------|--------|
| PRD | ✅ Clean | `prd.md` |
| Architecture | ✅ Clean | `architecture.md` |
| Epics & Stories | ✅ Clean | `epics.md` |
| UX Design | ✅ Clean | `ux-designs/ux-Poke-Radar-2026-07-21/` |

No duplicates or conflicts found.

---

## PRD Analysis

### Functional Requirements

**FR-01 — Configuration & référentiels**
L'utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités). Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.

**FR-02 — Collecte de données**
Le moteur récupère périodiquement disponibilité et prix des sources activées. Chaque donnée est horodatée et associée à sa source. En cas d'échec source, le système marque l'état et bascule en mode dégradé.

**FR-03 — Estimation marché**
Le système calcule une estimation de revente à partir des données disponibles. L'interface affiche le niveau de confiance (valeur directe vs estimée).

**FR-04 — Scoring d'opportunité**
Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels). Les règles de scoring sont configurables par utilisateur. Les opportunités sont triables par rentabilité et urgence.

**FR-05 — Notification**
Le système envoie une notification quand une opportunité dépasse les seuils définis. La notification inclut : produit, prix d'achat, estimation revente, marge nette, source, timestamp.

**FR-06 — Tableau de bord opérationnel**
Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées. Historique consultable pour analyser la qualité des alertes et ajuster les seuils. Le dashboard se met à jour en temps réel sans rafraîchissement manuel (Server-Sent Events).

**FR-07 — Résilience opérationnelle**
Journalisation des erreurs de collecte et de calcul. Mécanisme de retry/backoff sur les sources instables. Continuité minimale du service via saisie/import manuel.

**FR-08 — Exposition web**
L'application est accessible via un navigateur web standard (Chrome, Safari, Firefox) sur desktop, tablette et mobile. Le backend expose une API HTTP RPC (`POST /api/*`) et sert le frontend comme une SPA. L'accès se fait via un nom de domaine configuré, avec HTTPS (TLS) obligatoire. L'interface est responsive et utilisable sur écrans mobiles (320 px minimum).

**FR-09 — Authentification et accès**
L'accès à l'application est protégé par une authentification single-user (token ou mot de passe). Aucune gestion multi-comptes ni rôles multiples : un seul utilisateur, une seule session. Les secrets (token d'authentification, clés API tierces) sont stockés hors du dépôt et injectés via variables d'environnement ou fichier de configuration protégé.

**Total FRs: 9**

### Non-Functional Requirements

**NFR-01 — Performance**
Rafraîchissement source selon cadence configurable. Temps d'évaluation d'une opportunité compatible usage temps quasi réel.

**NFR-02 — Fiabilité**
Dégradation progressive plutôt qu'arrêt global en cas de source indisponible. Vérification de cohérence des données avant génération d'alerte.

**NFR-03 — Sécurité & conformité**
Respect RGPD/nLPD pour les données utilisateur. Respect des CGU, robots.txt et pratiques anti-abus pour la collecte. Authentification single-user obligatoire pour l'accès web ; pas d'accès anonyme. HTTPS obligatoire en production (TLS 1.2+). Secret management : tokens, API keys et mot de passe d'accès stockés hors du dépôt (variables d'environnement ou fichier protégé). Protection contre les attaques web courantes : XSS, injection SQL (via requêtes paramétrées), rate limiting.

**NFR-04 — Maintenabilité**
Pipeline modulaire (ingestion → normalisation → scoring → notification). Configuration externalisée pour faciliter ajout de sources/canaux.

**NFR-05 — UX**
Interface orientée décision (priorité à lisibilité, tri et filtres essentiels). Réduction de la complexité (éviter surcharge d'écrans/options au MVP). Design responsive : utilisable de 320 px (mobile) à 1920 px (desktop). Cibles tactiles d'au moins 44 px pour l'usage mobile.

**NFR-06 — Déploiement et exploitation**
L'application tourne comme un service systemd ou équivalent, avec redémarrage automatique en cas d'arrêt. Un reverse proxy (nginx/Caddy) termine le TLS et route les requêtes vers le backend. Le build est reproductible : une commande unique produit l'artefact déployable. Les logs applicatifs sont accessibles via journald ou un fichier. Mise à jour possible sans perte de données (migrations SQLite versionnées conservées).

**NFR-07 — Qualité et tests**
Les règles de calcul métier (marge, scoring, normalisation, déduplication) sont couvertes par des tests unitaires. Le pipeline complet (ingestion → normalisation → scoring → alerting) est testé en intégration sur des données mockées. Les composants UI partagés sont testés pour leurs états (default, loading, error, success). Les 4 parcours utilisateur critiques (alerte→décision, recalibrage, source indisponible, saisie manuelle) sont testés de bout en bout (E2E).

**Total NFRs: 7**

### Additional Requirements

- **MVP Scope** : Catalogue ciblé, 1-2 sources, calcul d'opportunité, alerting Telegram, UI responsive, fallback manuel, exposition web HTTPS, déploiement VPS systemd.
- **Hors scope MVP** : Auto-buy, multi-canaux complets, couverture mondiale, fonctions communautaires.
- **Post-MVP** : Abstraction multi-canaux, extension multi-sources, favoris, export Excel, extension autres TCG, client Tauri, multi-utilisateur.
- **Risques identifiés** : Fragilité de collecte, bruit d'alertes, contrainte légale, complexité excessive, exposition web non sécurisée, régression desktop.

### PRD Completeness Assessment

**Strengths:**
- FRs are well-structured, numbered, and specific enough for traceability.
- NFRs cover all critical dimensions: performance, reliability, security, maintainability, UX, deployment, and testing.
- Clear MVP scope boundaries with explicit exclusions.
- User personas and journeys provide context for requirements.
- Success metrics are defined across user, business, and technical dimensions.

**Gaps noted:**
- NFR-01 "Temps d'évaluation quasi réel" could benefit from a concrete target (e.g., < 2s).
- No explicit data retention/privacy policy for user data beyond RGPD mention.

---

## Epic Coverage Validation

### Coverage Matrix

| PRD FR | Requirement Summary | Epic Coverage | Story-Level Detail | Status |
|--------|-------------------|---------------|---------------------|--------|
| FR-01 | Configuration & référentiels (profils de surveillance + sets/éditions) | Epic 1 — Configurer le cockpit de surveillance | S1.2 (profils), S1.3 (référentiels) | ✅ Covered |
| FR-02 | Collecte de données (périodique, horodatée, dégradation) | Epic 2 — Orchestrer la collecte fiable multi-sources | S2.1 (cycles), S2.2 (santé sources) | ✅ Covered |
| FR-03 | Estimation marché (estimation revente + niveau de confiance) | Epic 4 — Transformer les signaux en opportunités rentables | S4.1 (références marché, confiance) | ✅ Covered |
| FR-04 | Scoring d'opportunité (marge brute/nette, règles configurables, tri) | Epic 4 — Transformer les signaux en opportunités rentables | S4.2 (calcul marge), S4.3 (classement/filtrage) | ✅ Covered |
| FR-05 | Notification (alerte avec prix, marge, source, timestamp) | Epic 5 — Alerter & notifier en temps réel | S5.1 (Telegram), S5.2 (déduplication) | ✅ Covered |
| FR-06 | Tableau de bord opérationnel (SSE, historique, état sources) | Epic 6 — Construire l'interface décisionnelle | S6.3 (RadarPage), S6.4 (DetailPage), S6.5 (SourcesPage), S6.6 (StrategiePage), S5.3 (SSE) | ✅ Covered |
| FR-07 | Résilience opérationnelle (retry/backoff, journalisation, fallback manuel) | Epic 2 (backend) + Epic 6 (UI) | S2.2 (dégradation), S2.3 (retry/logging), S6.9 (saisie manuelle) | ✅ Covered |
| FR-08 | Exposition web (navigateur standard, HTTPS, API + SPA, responsive 320px) | Epic 3 — Protéger l'accès à mon radar | S3.2 (API sécurisée), S3.3 (logging) + couvert transversalement par E6 (responsive) | ✅ Covered |
| FR-09 | Authentification et accès (single-user token, secrets hors dépôt) | Epic 3 — Protéger l'accès à mon radar | S3.1 (Bearer token, LoginPage), S3.2 (rate limiting, CORS, CSP) | ✅ Covered |

### NFR Coverage (Ancillary Check)

| NFR | Coverage | Status |
|-----|----------|--------|
| NFR-01 (Performance) | S2.1 (cadence configurable), S5.1 (async), explicit in epics requirements inventory | ✅ |
| NFR-02 (Fiabilité) | S2.2 (dégradation progressive), S2.3 (retry/backoff) | ✅ |
| NFR-03 (Sécurité) | S3.1 (auth), S3.2 (CORS/CSP/SQLi/rate limiting), S3.3 (pas de secret dans logs) | ✅ |
| NFR-04 (Maintenabilité) | Pipeline modulaire dans E2 + E4 + E5, configuration externalisée S1.2 | ✅ |
| NFR-05 (UX) | S6.1 (tokens), S6.2 (composants), S6.8 (responsive + a11y) | ✅ |
| NFR-06 (Déploiement) | S3.3 + Additional Requirements (systemd, Caddy, Let's Encrypt, journald, migrations) | ✅ |
| NFR-07 (Qualité) | Tests intégrés aux AC de chaque story (unitaires E2/E4, intégration S5.2, composants S6.2, E2E S6.9) | ✅ |

### Coverage Statistics

- **Total PRD FRs:** 9
- **FRs covered in epics:** 9
- **Coverage percentage:** 100%
- **Total PRD NFRs:** 7
- **NFRs with traceable implementation path:** 7

### Gap Analysis

**No missing FRs.** All 9 functional requirements from the PRD have explicit epic and story-level coverage with detailed acceptance criteria. The epics document was restructured based on the previous readiness report (2026-07-22) and a delta review on 2026-07-23, consolidating from 19 to 9 FRs to match the PRD v2026-07-21.

**Notable:** The epics document embeds test criteria directly into story acceptance criteria (no standalone test stories), which improves traceability but requires discipline to ensure all test types (unit, integration, component, E2E) are accounted for during implementation.

---

## UX Alignment Assessment

### UX Document Status

✅ **Found** — Sharded: `ux-designs/ux-Poke-Radar-2026-07-21/`
- `DESIGN.md` (21,003 bytes) — Full design system
- `EXPERIENCE.md` (9,787 bytes) — UX specification

### UX ↔ PRD Alignment: ✅ Aligned
- Personas match (Alex, Sam)
- 4 user journeys map directly to PRD
- 4 UX screens map to all major FRs
- Success metrics pulled from PRD
- Direction B "Decision Assistant" aligns with PRD MVP philosophy

### UX ↔ Architecture Alignment: ✅ Aligned
- All 14 checks passed (SSE, token auth, centralized Rust margin calc, component/hook/page coverage in structural seed)
- Architecture seed explicitly lists every component, page, and hook specified in UX
- All 20 UX Design Requirements (UX-DR1–DR20) traced to Epic stories

### Potential Gaps

| Issue | Severity | Detail |
|-------|----------|--------|
| StrategyPage evolution | 🟡 Minor | UX shows simplified strategy screen; epics S6.6 has richer version. Note as intentional detail variance. |
| Sparkline interactive | 🟡 Minor | Touch+hover sparkline complexity to validate during dev |
| Pull-to-refresh + scroll infini | 🟡 Minor | Pattern conflict risk on mobile — careful implementation needed |

### UX Alignment Verdict: ✅ ALIGNED

---

## Epic Quality Review

### Epic Structure Validation

#### A. User Value Focus — ✅ ALL PASS

| Epic | Title | Verdict |
|------|-------|---------|
| E1 | Configurer le cockpit de surveillance | ✅ User configures their monitoring cockpit |
| E2 | Orchestrer la collecte fiable multi-sources | ✅ Reliable collection engine — user benefits directly |
| E3 | Protéger l'accès à mon radar | ✅ "Protéger l'accès à MON radar" — user-centric framing |
| E4 | Transformer les signaux en opportunités rentables | ✅ User gets actionable, scored opportunities |
| E5 | Alerter & notifier en temps réel | ✅ User receives timely alerts |
| E6 | Construire l'interface décisionnelle | ✅ User interacts with a decision-oriented UI |

**Zero technical-only epics.** No "Setup Database", "API Development", or "Infrastructure Setup". ✅

#### B. Epic Independence — ✅ ALL PASS

| Epic | Depends On | Forward Dependency? |
|------|-----------|---------------------|
| E1 | Nothing | ✅ Standalone |
| E2 | E1 (products/profiles to monitor) | ✅ Backward |
| E3 | E1 (running app to secure) | ✅ Backward |
| E4 | E2 (collected signals to score) | ✅ Backward |
| E5 | E4 (scored opportunities to alert on) | ✅ Backward |
| E6 | E3 (auth), E5.3 (SSE infra), E2 (health), E4 (data) | ✅ All backward |

**Zero forward references.** Epic N never requires Epic N+1. ✅

### Story Quality Assessment

#### 🔴 Critical Violations

None. ✅

#### 🟠 Major Issues

**M1 — Story 6.2 scope risk (11 composants + tests in single story)**
- 11 composants with their individual acceptance criteria (SignalBadge, Button, Card, Toast, EmptyState, BottomSheet, Panel, FormField, StatusPill, CollapsibleSection, Feedback) — each with multiple states and ≥80% test coverage
- Risk: Multi-sprint sprawl, difficult for a single dev to complete in one go
- Recommendation: Consider splitting into 2-3 stories: foundational (Button, Panel, FormField, Feedback) → interactive (BottomSheet, Toast, CollapsibleSection) → display (SignalBadge, Card, EmptyState, StatusPill). Not a blocker for readiness — just a sprint-planning concern.

**M2 — Story 6.6 scope risk (StrategyPage avec 4 sections complètes)**
- Scoring & Marges (sliders, toggles) + Strategy Presets (select, save) + Notifications (toggles, slider, connection status) + Référentiels (search, badges, BottomSheet add)
- Risk: 4 distinct feature clusters in one story; each has complex ACs (debounce, auto-save, preset fill)
- Recommendation: Split into sections across 2-3 stories. Not a blocker — implementation teams can negotiate this during sprint planning.

#### 🟡 Minor Concerns

**m1 — S3.1 couples backend auth middleware + LoginPage frontend**
- Practical for a single-user app where auth is one concept. Tightly coupled by design.
- Mitigation: The story's ACs clearly separate the two concerns (middleware behavior tests + LoginPage rendering tests).

**m2 — S6.7 (hooks) ordered after S6.3–6.6 (pages that consume hooks)**
- Pages (S6.3 RadarPage, S6.4 DetailPage, S6.5 SourcesPage) reference `useInfiniteScroll`, `useSwipe`, `useCollapsible` in their ACs, but hooks are developed in S6.7.
- Mitigation: Pages can be built with stub/placeholder hooks, refactored when S6.7 delivers real implementations. Acceptable if the team is aware.

**m3 — Database tables via startup migrations, not per-story**
- Architecture AD-5 applies all migrations sequentially at startup (single-file SQLite).
- Deviates from create-epics-and-stories ideal ("create tables when first needed"), but pragmatic for single-process SQLite. Already established as architectural decision, not an epic defect.

### Acceptance Criteria Quality: ✅ GOOD

- Consistent Given/When/Then BDD format throughout
- Each AC includes testable outcomes with specific values
- Test ACs embedded directly in stories (intentional design — "tests intégrés aux AC de leur story respective")
- Error conditions covered (network failure S2.1, auth failure S3.1, empty states S6.3)
- Quantitative coverage targets where appropriate (≥80% line coverage S6.2, 100% branch coverage S4.2)

### Best Practices Compliance Checklist

| Criterion | Status |
|-----------|--------|
| Epics deliver user value | ✅ 6/6 |
| Epics are independently shippable | ✅ 6/6 |
| No forward dependencies | ✅ |
| Stories appropriately sized (majority) | 🟠 2 stories oversized (6.2, 6.6) |
| Acceptance criteria are testable | ✅ |
| FR traceability maintained | ✅ 9/9 FRs covered |
| NFRs have implementation path | ✅ 7/7 NFRs covered |
| Database creation approach documented | 🟡 Migrations-at-startup, intentional (AD-5) |

### Summary

- **0 critical violations**
- **2 major issues** (story sizing — M1, M2)
- **3 minor concerns** (coupling, ordering, DB approach)
- **Overall quality: HIGH.** The epics have been through multiple revision cycles (2026-07-22 restructuring, 2026-07-23 delta review), and it shows. The document is mature, well-structured, and implementation-ready.
