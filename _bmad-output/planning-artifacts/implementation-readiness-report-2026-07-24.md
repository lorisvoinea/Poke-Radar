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

# Implementation Readiness Assessment Report

**Date:** 2026-07-24
**Project:** Poke-Radar

## Document Discovery Inventory

### PRD Files Found

**Whole Documents:**

- `_bmad-output/planning-artifacts/prd.md` — 11,819 bytes, modified `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md` — 2,088 bytes, modified `2026-07-24T09:22:19`

**Sharded Documents:**

- None found.

### Architecture Files Found

**Whole Documents:**

- `_bmad-output/planning-artifacts/architecture.md` — 25,650 bytes, modified `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md` — 2,088 bytes, modified `2026-07-24T09:22:19`

**Sharded Documents:**

- None found.

### Epics & Stories Files Found

**Whole Documents:**

- `_bmad-output/planning-artifacts/epics.md` — 38,743 bytes, modified `2026-07-24T09:22:19`

**Sharded Documents:**

- None found.

### UX Design Files Found

**Whole Documents / UX Artifacts:**

- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` — 21,003 bytes, modified `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md` — 9,787 bytes, modified `2026-07-24T09:22:19`
- `_bmad-output/planning-artifacts/ux-designs/_archive/ux-design-specification-2026-02-19.md` — 9,787 bytes, modified `2026-07-24T09:22:19`

**Sharded Documents:**

- Folder: `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/`
  - `DESIGN.md`
  - `EXPERIENCE.md`

## Issues Found

### Potential Duplicate / Cross-Category Match

- `_bmad-output/planning-artifacts/prd-architecture-crosscheck-2026-07-22.md` matched both PRD and Architecture discovery patterns because its filename contains both `prd` and `architecture`.
- Treat this as a supporting crosscheck artifact unless the user explicitly selects it as canonical.

### UX Discovery Correction

- UX files do exist under `_bmad-output/planning-artifacts/ux-designs/`.
- The initial strict UX search missed `DESIGN.md` and `EXPERIENCE.md` because their filenames do not contain `ux`, although their parent directory does.

## Proposed Canonical Documents for Assessment

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Epics & Stories: `_bmad-output/planning-artifacts/epics.md`
- UX Design: `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md`
- UX Experience: `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md`

## Pending Confirmation

Continue only after the user confirms the proposed canonical documents or supplies replacements.

## PRD Analysis

### Functional Requirements

FR-01 Configuration & référentiels:
- L’utilisateur peut créer/éditer des profils de surveillance (produits, seuils, frais, priorités).
- Le système supporte des référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.

FR-02 Collecte de données:
- Le moteur récupère périodiquement disponibilité et prix des sources activées.
- Chaque donnée est horodatée et associée à sa source.
- En cas d’échec source, le système marque l’état et bascule en mode dégradé.

FR-03 Estimation marché:
- Le système calcule une estimation de revente à partir des données disponibles.
- L’interface affiche le niveau de confiance (valeur directe vs estimée).

FR-04 Scoring d’opportunité:
- Le système calcule marge brute et nette (achat, frais, commissions, port, coûts transactionnels).
- Les règles de scoring sont configurables par utilisateur.
- Les opportunités sont triables par rentabilité et urgence.

FR-05 Notification:
- Le système envoie une notification quand une opportunité dépasse les seuils définis.
- La notification inclut : produit, prix d’achat, estimation revente, marge nette, source, timestamp.

FR-06 Tableau de bord opérationnel:
- Vue unique avec état des sources, dernières opportunités, erreurs et actions recommandées.
- Historique consultable pour analyser la qualité des alertes et ajuster les seuils.
- Le dashboard se met à jour en temps réel sans rafraîchissement manuel (Server-Sent Events).

FR-07 Résilience opérationnelle:
- Journalisation des erreurs de collecte et de calcul.
- Mécanisme de retry/backoff sur les sources instables.
- Continuité minimale du service via saisie/import manuel.

FR-08 Exposition web:
- L'application est accessible via un navigateur web standard (Chrome, Safari, Firefox) sur desktop, tablette et mobile.
- Le backend expose une API HTTP RPC (`POST /api/*`) et sert le frontend comme une SPA.
- L'accès se fait via un nom de domaine configuré, avec HTTPS (TLS) obligatoire.
- L'interface est responsive et utilisable sur écrans mobiles (320 px minimum).

FR-09 Authentification et accès:
- L'accès à l'application est protégé par une authentification single-user (token ou mot de passe).
- Aucune gestion multi-comptes ni rôles multiples : un seul utilisateur, une seule session.
- Les secrets (token d'authentification, clés API tierces) sont stockés hors du dépôt et injectés via variables d'environnement ou fichier de configuration protégé.

Total FRs: 9

### Non-Functional Requirements

NFR-01 Performance:
- Rafraîchissement source selon cadence configurable.
- Temps d’évaluation d’une opportunité compatible usage temps quasi réel.

NFR-02 Fiabilité:
- Dégradation progressive plutôt qu’arrêt global en cas de source indisponible.
- Vérification de cohérence des données avant génération d’alerte.

NFR-03 Sécurité & conformité:
- Respect RGPD/nLPD pour les données utilisateur.
- Respect des CGU, robots.txt et pratiques anti-abus pour la collecte.
- Authentification single-user obligatoire pour l'accès web ; pas d'accès anonyme.
- HTTPS obligatoire en production (TLS 1.2+).
- Secret management : tokens, API keys et mot de passe d'accès stockés hors du dépôt (variables d'environnement ou fichier protégé).
- Protection contre les attaques web courantes : XSS, injection SQL (via requêtes paramétrées), rate limiting.

NFR-04 Maintenabilité:
- Pipeline modulaire (ingestion → normalisation → scoring → notification).
- Configuration externalisée pour faciliter ajout de sources/canaux.

NFR-05 UX:
- Interface orientée décision (priorité à lisibilité, tri et filtres essentiels).
- Réduction de la complexité (éviter surcharge d'écrans/options au MVP).
- Design responsive : utilisable de 320 px (mobile) à 1920 px (desktop).
- Cibles tactiles d'au moins 44 px pour l'usage mobile.

NFR-06 Déploiement et exploitation:
- L'application tourne comme un service systemd ou équivalent, avec redémarrage automatique en cas d'arrêt.
- Un reverse proxy (nginx/Caddy) termine le TLS et route les requêtes vers le backend.
- Le build est reproductible : une commande unique produit l'artefact déployable.
- Les logs applicatifs sont accessibles via journald ou un fichier.
- Mise à jour possible sans perte de données (migrations SQLite versionnées conservées).

NFR-07 Qualité et tests:
- Les règles de calcul métier (marge, scoring, normalisation, déduplication) sont couvertes par des tests unitaires.
- Le pipeline complet (ingestion → normalisation → scoring → alerting) est testé en intégration sur des données mockées.
- Les composants UI partagés sont testés pour leurs états (default, loading, error, success).
- Les 4 parcours utilisateur critiques (alerte→décision, recalibrage, source indisponible, saisie manuelle) sont testés de bout en bout (E2E).

Total NFRs: 7

### Additional Requirements

- MVP includes catalogue management, 1–2 stable sources, net-margin opportunity calculation, Telegram alerting, responsive web UI, manual fallback, HTTPS/domain exposure, and VPS deployment with systemd, reproducible build, and isolated secrets.
- Out of scope for MVP: auto-buy, complete multi-channel notifications, exhaustive global retailer coverage, and community/crowdsourcing features.
- Post-MVP candidates: notification channel abstraction, API-first multi-source expansion, favorites/owned cards, Excel export, possible Tauri desktop client, and multi-user roles.
- Principal mitigations include API-first collection, retries, manual fallback, robust default thresholds, legal-source prioritization, strict MVP scope, HTTPS/auth/reverse proxy, and transport isolation to avoid desktop regressions.
- Rollout requires HTTPS VPS deployment, desktop/mobile validation, limited pilot, measurement of latency/actionability/decision time/net margin, scoring and UX adjustments, then progressive expansion.

### PRD Completeness Assessment

- The PRD is sufficiently structured for traceability: it contains explicit FR and NFR sections with stable numbering, plus MVP scope, exclusions, post-MVP scope, risks, mitigations, and rollout guidance.
- Assessment risk: some NFRs are qualitative rather than measurable, especially opportunity evaluation timing, reliability thresholds, source failure limits, and rate limiting specifics.
- Assessment risk: some implementation constraints are present in scope and risk sections rather than the numbered requirements, so epic validation must trace both numbered requirements and additional constraints.

## Epic Coverage Validation

### Coverage Matrix

| PRD FR Number | PRD Requirement | Epic Coverage | Status |
| --- | --- | --- | --- |
| FR-01 | Configuration & référentiels: create/edit monitoring profiles and support pre-recorded references. | Epic 1: Configurer le cockpit de surveillance; Stories 1.2 and 1.3. | ✓ Covered |
| FR-02 | Collecte de données: periodic availability/price collection, timestamp/source association, degraded mode on source failure. | Epic 2: Orchestrer la collecte fiable multi-sources; Stories 2.1, 2.2, 2.3. | ✓ Covered |
| FR-03 | Estimation marché: calculate resale estimate and display confidence level. | Epic 4: Transformer les signaux en opportunités rentables; Story 4.1 and confidence portions of Story 4.3. | ✓ Covered |
| FR-04 | Scoring d’opportunité: gross/net margin, configurable scoring rules, sorting by profitability and urgency. | Epic 4: Stories 4.2 and 4.3. | ✓ Covered |
| FR-05 | Notification: send threshold-based notification containing product, purchase price, resale estimate, net margin, source, timestamp. | Epic 5: Alerter & notifier en temps réel; Stories 5.1 and 5.2. | ✓ Covered |
| FR-06 | Tableau de bord opérationnel: source status, latest opportunities, errors, recommended actions, history, SSE realtime updates. | Epic 6: Construire l'interface décisionnelle; Stories 6.3, 6.4, 6.5; SSE infrastructure in Story 5.3. | ✓ Covered |
| FR-07 | Résilience opérationnelle: error logging, retry/backoff, minimal continuity via manual entry/import. | Epic 2 covers backend resilience; Epic 6 covers manual fallback; Stories 2.2, 2.3, 6.9. | ✓ Covered |
| FR-08 | Exposition web: browser access, HTTP RPC API + SPA, domain, mandatory HTTPS, responsive 320px+. | Epic 3 covers protected exposed API; Epic 6 covers responsive frontend; Stories 3.1, 3.2, 6.8. | ✓ Covered |
| FR-09 | Authentification et accès: single-user auth, no multi-account roles, secrets outside repo and injected by env/protected config. | Epic 3: Protéger l'accès à mon radar; Stories 3.1, 3.2, 3.3. | ✓ Covered |

### Missing Requirements

No PRD Functional Requirements are semantically missing from the epics.

### Coverage Statistics

- Total PRD FRs: 9
- FRs covered in epics: 9
- Coverage percentage: 100%

### Coverage Notes

- The epics document claims `9/9 FRs` covered, and semantic validation agrees.
- Numbering is not perfectly aligned between the PRD and epics inventory: the epics document splits PRD `FR-01 Configuration & référentiels` into separate epics-inventory `FR-01` and `FR-02`, which shifts subsequent labels. Future traceability should prefer canonical PRD numbering or explicitly record the renumbering map.

## UX Alignment Assessment

### UX Document Status

Found. Active UX documents are:

- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md`
- `_bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md`

An archived UX design specification also exists under `_bmad-output/planning-artifacts/ux-designs/_archive/` and should be treated as historical unless explicitly re-selected.

### UX ↔ PRD Alignment

- The UX goal of fast, reliable, traceable purchase decisions aligns with the PRD executive summary and success metric of decision time under five minutes after a priority alert.
- UX mobile-first/responsive expectations align with PRD FR-08 and NFR-05, including browser access and minimum 320 px mobile usability.
- UX decision surfaces align with PRD FR-06: Radar view, detail view, sources view, history, source state, errors, and realtime dashboard behavior.
- UX resilience and manual-entry flows align with PRD FR-07: degraded mode, manual fallback, and continuity during source unavailability.
- UX authentication flow aligns with PRD FR-09 through the LoginPage/token pattern.

### UX ↔ Architecture Alignment

- Architecture explicitly includes the active UX documents as inputs.
- Architecture supports UX realtime needs through AD-10 Server-Sent Events and maps FR-06 to `frontend/src/pages/RadarPage.tsx` plus `GET /api/events`.
- Architecture supports UX component quality through AD-15 frontend component testing and includes frontend structure for LoginPage, RadarPage, DetailPage, StrategyPage, SourcesPage, shared components, hooks, and stores.
- Architecture maps NFR-05 UX to the design system, frontend component tests, and SSE.
- Architecture supports responsive web exposure through Caddy/TLS, backend-served SPA, and browser/mobile access decisions.

### Alignment Issues

- No blocking UX alignment issue found.
- Minor traceability issue: UX requirements are well represented in the epics document as `UX-DR1` through `UX-DR20`, but the PRD only captures UX at a higher level under FR-06, FR-08, and NFR-05. This is acceptable for MVP readiness if epics remain the detailed UX traceability source.
- Minor architecture documentation issue: Architecture maps FR-07 resilience primarily to backend connector runtime, while the PRD also requires continuity through manual entry/import. Epics cover that UI fallback in Story 6.9, but the architecture capability map could make the frontend/manual-entry path explicit.

### Warnings

- Keep `_archive/ux-design-specification-2026-02-19.md` out of canonical validation unless the team deliberately wants historical comparison.
- Before implementation, confirm that UX test expectations for reduced motion, accessibility, swipe, infinite scroll, and bottom sheets are represented in story-level acceptance criteria; most are already present in Epic 6.

## Epic Quality Review

### Overall Result

The epics are broadly implementation-ready and traceable, but the review finds several quality issues that should be addressed before treating the plan as fully ready.

### Epic Structure Validation

| Epic | User Value Focus | Independence | Assessment |
| --- | --- | --- | --- |
| Epic 1 — Configurer le cockpit de surveillance | Strong: enables user configuration of products, thresholds, fees, and references. | Strong: provides foundational persisted configuration. | Pass |
| Epic 2 — Orchestrer la collecte fiable multi-sources | Moderate: user value is reduced manual monitoring, but wording is backend-oriented. | Depends on Epic 1 configuration, which is acceptable. | Pass with minor concern |
| Epic 3 — Protéger l'accès à mon radar | Borderline: security/auth is necessary user value for web exposure, but title is user-centric enough. | Can be built after or alongside early backend API exposure. | Pass |
| Epic 4 — Transformer les signaux en opportunités rentables | Strong: directly enables profitability decisions. | Depends on collected signals from Epic 2, which is acceptable sequencing. | Pass |
| Epic 5 — Alerter & notifier en temps réel | Strong: enables timely action. | Depends on scored opportunities from Epic 4, acceptable sequencing. | Pass |
| Epic 6 — Construire l'interface décisionnelle | Strong user value but very large scope. | Depends on backend capabilities and SSE; acceptable as later epic, but large. | Pass with major sizing concern |

### Story Quality Assessment

#### Strengths

- Stories use user-facing `As a / I want / So that` structure consistently.
- Most acceptance criteria are testable and include both product behavior and test expectations.
- Story-level test expectations are embedded directly in feature stories, reducing standalone test-story drift.
- FR traceability is explicit at epic level and supported by a coverage map.

#### 🔴 Critical Violations

None found.

#### 🟠 Major Issues

1. **Epic 6 may be too large for predictable execution.**
   - Evidence: Epic 6 contains design tokens, full design system components, Radar page, Detail page, Sources page, Strategy page, hooks, responsive/accessibility, manual entry, and E2E tests.
   - Impact: This increases risk of partial completion, hidden dependencies, and review fatigue.
   - Recommendation: Consider splitting Epic 6 into two implementation epics: one for design-system/foundational UI components and one for decision workflows/pages, or keep Epic 6 but enforce small story-level delivery slices.

2. **Story 6.2 is likely oversized.**
   - Evidence: Story 6.2 requires eleven shared components, multiple variants/states, and broad test coverage.
   - Impact: A single story could become an epic-sized implementation unit.
   - Recommendation: Split into smaller component batches, for example primitives (`Button`, `FormField`, `Panel`, `Feedback`), cards/badges, overlays/toasts, and interaction components.

3. **Story 6.9 mixes feature delivery with full E2E journey implementation.**
   - Evidence: Manual opportunity entry and all four Playwright critical journeys are bundled in one story.
   - Impact: Manual-entry completion could be blocked by unrelated end-to-end journey maturity.
   - Recommendation: Keep manual-entry implementation in Story 6.9 and either distribute each E2E journey into the story that owns that journey or create explicit QA automation tasks tied to release readiness.

#### 🟡 Minor Concerns

1. **Epic 2 title and goal are somewhat technical.**
   - It still maps to user value, but could be phrased closer to the user's outcome: “Collecter automatiquement les signaux sans perdre le contrôle en cas de panne.”

2. **FR numbering drift between PRD and epics inventory could confuse traceability.**
   - The epics inventory splits PRD FR-01 into two entries, then shifts subsequent numbering.
   - Recommendation: Add an explicit PRD-to-epics FR numbering map or normalize the epics inventory to PRD numbering.

3. **Architecture capability map under-represents UI manual fallback for FR-07.**
   - Epics cover this through Story 6.9, but architecture maps FR-07 mainly to backend connector runtime.
   - Recommendation: Add `frontend/src/pages/SourcesPage.tsx` or manual-entry flow to the FR-07 architecture map.

4. **Some acceptance criteria use broad coverage targets that may need local test strategy detail.**
   - Example: component coverage ≥80%, branch coverage 100% for margin calculation, axe-core no critical violations.
   - Recommendation: Ensure test tooling and thresholds are configured before story execution, not discovered late.

### Dependency Analysis

- No forward dependency requiring Epic N+1 for Epic N completion was found.
- Epic sequencing is coherent: configuration → collection → web protection → scoring → alerting/realtime → decision UI.
- Story dependencies generally flow backward or within the same epic in acceptable order.
- Database/entity timing appears acceptable: stories introduce persistence needs as they arise rather than mandating all tables upfront in a purely technical setup story.

### Best Practices Compliance Checklist

| Check | Result |
| --- | --- |
| Epics deliver user value | Pass, with minor wording concern for Epic 2 |
| Epics can function independently in sequence | Pass |
| Stories appropriately sized | Partial: Story 6.2 and 6.9 are oversized |
| No forward dependencies | Pass |
| Database tables created when needed | Pass based on available story text |
| Clear acceptance criteria | Pass with minor threshold-configuration concerns |
| Traceability to FRs maintained | Pass semantically, but numbering drift should be fixed |

### Recommendations

1. Normalize FR numbering between PRD and epics before final sign-off.
2. Split or tightly timebox Story 6.2.
3. Separate manual-entry feature delivery from the full E2E automation burden in Story 6.9.
4. Update architecture FR-07 mapping to include manual-entry UI fallback.
5. Confirm test tooling thresholds before implementation begins.

## Summary and Recommendations

### Overall Readiness Status

NEEDS WORK.

The project is close to implementation-ready: required PRD, Architecture, Epics, and active UX documents exist; PRD functional requirements are semantically covered by epics; UX is materially aligned with PRD and Architecture. However, several planning-quality issues should be fixed before using this as a clean implementation baseline.

### Critical Issues Requiring Immediate Action

No critical blockers were found.

### Major Issues Requiring Action Before Final Sign-off

1. **FR numbering drift between PRD and epics.**
   - The epics inventory splits PRD FR-01 into two requirements and shifts subsequent numbering.
   - This does not create semantic missing coverage, but it can cause implementation and review traceability errors.

2. **Epic 6 / Story 6.2 sizing risk.**
   - Epic 6 carries a large UI/design-system/page/E2E scope.
   - Story 6.2 alone includes eleven shared components with variants, states, and tests.

3. **Story 6.9 scope mixing.**
   - Manual-entry implementation and all four Playwright E2E journeys are bundled together.
   - This may block manual-entry delivery on broad release-level QA automation.

4. **Architecture FR-07 mapping is incomplete.**
   - Architecture maps FR-07 mainly to backend connector runtime, while the PRD and epics also require manual-entry/import continuity through the UI.

### Recommended Next Steps

1. Normalize the epics Requirements Inventory and FR Coverage Map to canonical PRD numbering, or add an explicit PRD-FR ↔ Epics-FR translation table.
2. Split Story 6.2 into smaller component batches or define a strict delivery checklist that allows partial review without losing traceability.
3. Split Story 6.9 into manual-entry implementation and E2E journey automation, or distribute the E2E journeys into the owning feature stories.
4. Update `architecture.md` FR-07 capability mapping to include the manual-entry UI path, likely `frontend/src/pages/SourcesPage.tsx` and the manual connector flow.
5. Confirm automated test thresholds and tooling configuration before implementation starts: Vitest/RTL coverage, axe-core checks, Playwright setup, Rust unit/integration coverage expectations.
6. Treat active UX documents as `ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` and `EXPERIENCE.md`; keep `_archive/ux-design-specification-2026-02-19.md` historical unless deliberately selected.

### Final Note

This assessment identified 0 critical blockers, 4 major issues, and 5 minor concerns across document discovery, PRD traceability, UX alignment, architecture mapping, and epic/story quality. Address the major issues before final implementation sign-off. If the team accepts the risks, implementation can proceed with explicit tracking of the recommended corrections.

**Assessor:** Winston — System Architect / Implementation Readiness facilitator
**Assessment completed:** 2026-07-24
