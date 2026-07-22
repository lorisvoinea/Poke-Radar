---
stepsCompleted: [1, 2, 3, 4, 5, 6]
date: 2026-07-22
project_name: Poke-Radar
---

# Implementation Readiness Assessment Report

**Date:** 2026-07-22
**Project:** Poke-Radar

## Document Inventory

| Type | Path | Format |
|------|------|--------|
| PRD | `prd.md` | Whole |
| Architecture | `architecture/architecture-Poke-Radar-2026-07-22/ARCHITECTURE-SPINE.md` | Sharded |
| Epics & Stories | `epics.md` | Whole |
| UX Design | `ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` + `EXPERIENCE.md` | Sharded |

**Issues resolved:**
- `architecture.md` (783 bytes) is a superseded compatibility redirect → using sharded spine instead
- `prds/prd-poke-radar-2026-07-21/` is empty (only `.memlog.md`) → using whole `prd.md`
- `ux-designs/_archive/` contains obsolete Feb 2026 versions → ignored

---

## PRD Analysis

### Functional Requirements

FR-01 **Configuration & référentiels** — Créer/éditer des profils de surveillance (produits, seuils, frais, priorités) ; support de référentiels préenregistrés (sets/éditions) pour limiter les erreurs de saisie.

FR-02 **Collecte de données** — Récupération périodique disponibilité + prix des sources activées ; données horodatées et associées à leur source ; en cas d'échec, marquage d'état et bascule en mode dégradé.

FR-03 **Estimation marché** — Calcul d'une estimation de revente à partir des données disponibles ; affichage du niveau de confiance (valeur directe vs estimée).

FR-04 **Scoring d'opportunité** — Calcul marge brute et nette (achat, frais, commissions, port, coûts transactionnels) ; règles de scoring configurables par utilisateur ; opportunités triables par rentabilité et urgence.

FR-05 **Notification** — Envoi notification quand une opportunité dépasse les seuils ; contenu : produit, prix d'achat, estimation revente, marge nette, source, timestamp.

FR-06 **Tableau de bord opérationnel** — Vue unique (état sources, dernières opportunités, erreurs, actions recommandées) ; historique consultable ; mise à jour temps réel via Server-Sent Events (sans rafraîchissement manuel).

FR-07 **Résilience opérationnelle** — Journalisation des erreurs de collecte/calcul ; retry/backoff sur sources instables ; continuité minimale via saisie/import manuel.

FR-08 **Exposition web** — Accessible navigateur standard (Chrome, Safari, Firefox) desktop/tablette/mobile ; backend expose API HTTP RPC (`POST /api/*`) + sert SPA ; nom de domaine + HTTPS (TLS) obligatoire ; responsive (320 px minimum).

FR-09 **Authentification et accès** — Auth single-user (token ou mot de passe) ; pas de multi-comptes ni rôles ; secrets hors dépôt, injectés via variables d'environnement.

**Total FRs: 9**

### Non-Functional Requirements

NFR-01 **Performance** — Rafraîchissement source selon cadence configurable ; temps d'évaluation opportunité compatible temps quasi réel.

NFR-02 **Fiabilité** — Dégradation progressive (pas d'arrêt global) ; vérification cohérence des données avant génération d'alerte.

NFR-03 **Sécurité & conformité** — RGPD/nLPD ; respect CGU, robots.txt, pratiques anti-abus ; auth single-user obligatoire ; HTTPS (TLS 1.2+) ; secret management hors dépôt ; protection XSS, injection SQL, rate limiting.

NFR-04 **Maintenabilité** — Pipeline modulaire (ingestion → normalisation → scoring → notification) ; configuration externalisée.

NFR-05 **UX** — Interface orientée décision ; réduction complexité MVP ; design responsive 320px–1920px ; cibles tactiles ≥ 44 px.

NFR-06 **Déploiement et exploitation** — Service systemd avec redémarrage auto ; reverse proxy (nginx/Caddy) pour TLS ; build reproductible (une commande) ; logs via journald ou fichier ; mise à jour sans perte de données (migrations SQLite versionnées).

NFR-07 **Qualité et tests** — Tests unitaires sur règles de calcul métier ; tests d'intégration pipeline complet ; tests composants UI partagés (états) ; tests E2E sur 4 parcours utilisateur critiques (alerte→décision, recalibrage, source indisponible, saisie manuelle).

**Total NFRs: 7**

### Additional Requirements & Constraints

- **MVP strict** : catalogue ciblé, 1–2 sources, 1 canal notification (Telegram), fallback manuel, déploiement VPS
- **Hors scope MVP** : auto-buy, multi-canaux, couverture mondiale, fonctions communautaires
- **Post-MVP** : multi-canaux, multi-sources API-first, favoris, export Excel, multi-univers TCG, multi-utilisateur avec rôles
- **Risques documentés** : fragilité collecte, bruit d'alertes, contrainte légale sources, complexité excessive, exposition web non sécurisée, régression desktop
- **Business constraints** : cible revendeurs indépendants France/Suisse en priorité ; single-user à la V1

### PRD Completeness Assessment

PRD complet et bien structuré : les 9 FRs couvrent l'ensemble du flux métier (configuration → collecte → estimation → scoring → notification → dashboard → résilience → exposition web → auth). Les 7 NFRs couvrent performance, fiabilité, sécurité, maintenabilité, UX, déploiement et qualité. Le scope MVP est clairement délimité avec une section hors-scope explicite. Les risques sont identifiés avec des mitigations. **Le PRD est prêt pour la validation de couverture par les epics.**

---

## Epic Coverage Validation

> Note : Les epics décomposent les 9 FRs du PRD en 19 FRs plus granulaires pour une traçabilité précise.

### Coverage Matrix

| PRD FR | Description | Epic FR(s) | Epic Coverage | Status |
|--------|-------------|------------|---------------|--------|
| FR-01 | Configuration & référentiels | FR-01, FR-02 | Epic 1 — Cockpit de surveillance | ✓ Covered |
| FR-02 | Collecte de données | FR-03, FR-04, FR-05 | Epic 2 — Collecte fiable multi-sources | ✓ Covered |
| FR-03 | Estimation marché | FR-06, FR-07 | Epic 4 — Signaux → Opportunités | ✓ Covered |
| FR-04 | Scoring d'opportunité | FR-08, FR-09, FR-10 | Epic 4 — Signaux → Opportunités | ✓ Covered |
| FR-05 | Notification | FR-11, FR-12 | Epic 5 — Alerter, piloter & UX | ✓ Covered |
| FR-06 | Tableau de bord opérationnel | FR-13, FR-14 | Epic 5 — Alerter, piloter & UX | ✓ Covered |
| FR-07 | Résilience opérationnelle | FR-15, FR-16, FR-17 | Epic 2 + Epic 5 | ✓ Covered |
| FR-08 | Exposition web | FR-18 | Epic 3 — Fondations web sécurisées | ✓ Covered |
| FR-09 | Authentification et accès | FR-19 | Epic 3 — Fondations web sécurisées | ✓ Covered |

### Coverage Statistics

- **Total PRD FRs:** 9
- **Total Epic-level FRs:** 19 (décomposition granulaire)
- **FRs covered in epics:** 19 / 19
- **Coverage percentage:** **100%**
- **Missing FRs:** 0

### Assessment

✅ **All PRD functional requirements are fully traced to epics.** La décomposition du PRD en 19 FRs au niveau des epics améliore la granularité sans rien perdre. Chaque FR a au moins une story avec des acceptance criteria dédiés. Aucun gap détecté.

---

## UX Alignment Assessment

### UX Document Status
✅ **Found** — Sharded UX documentation exists:
- `ux-designs/ux-Poke-Radar-2026-07-21/DESIGN.md` — Design system complet (tokens, composants, écrans, accessibilité)
- `ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md` — Stratégie UX, personas, journeys, émotions, patterns

### UX ↔ PRD Alignment

| UX Element | PRD Coverage | Status |
|-----------|-------------|--------|
| Personas Alex & Sam | PRD §Personas & User Journeys (Alex + Sam) | ✓ Aligned |
| 4 user journeys (alerte→décision, recalibrage, source down, manuel) | PRD §Personas & User Journeys (4 parcours) | ✓ Aligned |
| Décision < 5 min | PRD §Objectifs user success | ✓ Aligned |
| Marge nette explicable | FR-04 Scoring d'opportunité | ✓ Aligned |
| Fallback manuel | FR-07 Résilience opérationnelle | ✓ Aligned |
| Responsive mobile-first 320–1920px | NFR-05 UX (responsive, cibles 44px) | ✓ Aligned |
| Accessibilité (contraste AA/AAA, clavier, aria) | NFR-05 UX (implicit via « interface orientée décision ») | ✓ Aligned |
| Dark theme "Amber Warmth" | Pas explicitement dans le PRD | ⚪ UX-level detail — PRD ne spécifie pas de thème visuel, ce qui est normal |
| Notifications Telegram | FR-05 Notification | ✓ Aligned |
| Dashboard temps réel SSE | FR-06 Tableau de bord (SSE mentionné explicitement) | ✓ Aligned |

### UX ↔ Architecture Alignment

| UX Requirement | Architecture Support | Status |
|---------------|---------------------|--------|
| React SPA + Vite | AD-1 (SPA React/TypeScript, Vite) | ✓ |
| Design tokens CSS (`--color-*`, `--space-*`) | AD-15 (tests composants), AD-12 (structure frontend) | ✓ |
| Composants réutilisables (Badge, Button, Card, Toast, etc.) | Structural Seed — `frontend/src/components/shared/` | ✓ |
| SSE temps réel dashboard | AD-10 (Server-Sent Events, `GET /api/events`) | ✓ |
| Mobile-first responsive | AD-15 (tests frontend Vitest+RTL), AD-16 (E2E Playwright) | ✓ |
| Accessibilité (contraste, clavier, reduced-motion) | AD-15, AD-16 (tests automatisés) | ✓ |
| Format monétaire FR (XX,XX €) | AD-18 (conventions) — pas de locale string explicite mais compatible | ✓ |
| Auth → LoginPage | AD-3 (token Bearer, `POST /api/auth/verify`, `localStorage`) | ✓ |
| HTTPS + déploiement VPS | AD-2 (Caddy reverse proxy, TLS Let's Encrypt, systemd) | ✓ |
| Protection XSS/SQLi/rate limiting | AD-17 (Sécurité web) | ✓ |
| Pipeline ingestion → scoring → notification | AD-4 (Pipeline modulaire), AD-7 (Marge centralisée), AD-8 (Alerting async) | ✓ |

### Alignment Issues

**Aucun problème de fond.** Les documents UX, PRD et Architecture forment une chaîne cohérente :
- Le PRD définit les FRs que l'UX concrétise en écrans, composants et flows
- L'architecture spine fournit les décisions techniques (AD-1 à AD-18) pour chaque besoin UX
- Les epics transforment le tout en stories actionnables avec acceptance criteria

**Observation mineure :** Les UX docs sont en français et les epics/stories en anglais mixé français. L'architecture spine est en anglais. Pas un bloquant mais mérite d'être noté pour la cohérence future de la codebase.

### Warnings

⚠️ **UX mentions 4 écrans cœur + LoginPage** → les epics couvrent RadarPage (5.6), DetailPage (5.7), StrategyPage (implicite dans Epic 1 stories), SourcesPage (5.8), LoginPage (3.1). **L'écran StrategyPage n'a pas de story dédiée explicite dans Epic 5** — il est partiellement couvert par Epic 1 (stories 1.2, 1.3) qui gère la configuration. Vérifier si les wireframes UX pour l'écran Stratégie sont entièrement adressés.

---

### UX Alignment Verdict: ✅ ALIGNED

L'UX, le PRD et l'Architecture sont alignés. Les 4 écrans UX sont couverts par les epics (Radar, Détail, Sources, Stratégie). Le design system est complet (11 composants partagés, 20 UX-DRs, tokens, responsive, accessibilité). L'architecture spine supporte tous les besoins UX avec 18 décisions architecturales traçables. **1 observation mineure** (StrategyPage sans story dédiée dans Epic 5).

---

## Epic Quality Review

### Epic Structure Validation

#### User Value Focus

| Epic | User-Centric? | Verdict |
|------|---------------|--------|
| E1 — Configurer le cockpit de surveillance | ✅ Le revendeur paramètre sa stratégie | PASS |
| E2 — Orchestrer la collecte fiable multi-sources | ✅ Collecte automatisée multi-sources | PASS |
| E3 — Poser les fondations web sécurisées | ⚠️ Titre technique, mais stories orientées utilisateur (login, accès protégé) | BORDERLINE |
| E4 — Transformer les signaux en opportunités rentables | ✅ Cœur métier du produit | PASS |
| E5 — Alerter, piloter & UX décisionnelle | ✅ Dashboard, alertes temps réel, UX | PASS |

#### Epic Independence

- E2 dépend de E1 (profiles de surveillance) — backward, naturel ✅
- E3 dépend de E1/E2 (DB existante, routes API) — backward ✅
- E4 dépend de E2 (données collectées) — backward ✅
- E5 dépend de E4 (opportunités scorées) — backward ✅
- **Aucune forward dependency** — E5 n'est requis par aucun epic antérieur ✅

#### Story Quality Assessment

Les 17 stories suivent le format **Given/When/Then**, couvrent les cas d'erreur, et intègrent les critères de test dans les ACs (pas de stories de test standalone). La qualité des ACs est **excellente** : chaque story spécifie exactement ce qui doit être testé (cas nominaux, cas limites, erreurs).

### Issues Found

#### 🟠 MAJOR — Epic 5 oversize (11 stories)

E1, E2, E3, E4 ont 3 stories chacun. E5 en a 11 :
- Alerting (5.1–5.2)
- SSE infrastructure (5.3)
- Design system complet (5.4–5.5)
- 3 pages (5.6–5.8)
- Hooks (5.9)
- Responsive + a11y (5.10)
- Manuel + E2E (5.11)

**Recommandation :** La partie UX pure (5.4→5.11, 8 stories) pourrait être extraite en un **Epic 6 — Construire l'interface décisionnelle**. Ça alignerait la granularité des epics (3-4 stories chacun) et réduirait la dette de planification.

#### 🟠 MAJOR — StrategyPage UX partiellement couverte

L'écran "Stratégie & Réglages" UX définit : sliders marge/ROI/risque, presets de stratégie, produits suivis, toggles notification, gestion référentiels. Epic 1 couvre la config des profils/seuils (1.2, 1.3) mais pas l'écran complet. Pas de story `StrategyPage.tsx` dédiée dans Epic 5 (contrairement à RadarPage 5.6, DetailPage 5.7, SourcesPage 5.8). La section notification UX n'a pas de contrepartie UI dashboard — elle est purement backend (5.1).

#### 🟡 MINOR — Epic 3 naming

"Poser les fondations web sécurisées" sonne technique. Un titre user-centric comme "Protéger l'accès à mon radar" refléterait mieux le contenu (login + sécurité). Les stories individuelles sont correctes.

#### 🟡 MINOR — Couplage 5.1 / 5.2

5.1 (alertes Telegram) et 5.2 (déduplication + test intégration pipeline) sont étroitement liées. La déduplication sans canal d'envoi n'a pas de sens isolément. Fonctionnellement acceptable car 5.2 couvre aussi l'historisation et le test d'intégration du pipeline complet.

#### 🟡 MINOR — Mix linguistique

Titres d'epics en français, ACs en anglais, UX docs en français, Architecture en anglais. Pas bloquant mais une convention explicite éviterait la dérive.

### Best Practices Compliance

| Check | Status |
|-------|--------|
| Epics deliver user value | ✅ 4/5 PASS, E3 borderline |
| Epics independently viable | ✅ All backward-only deps |
| Stories appropriately sized | ✅ 17 stories bien dimensionnées |
| No forward dependencies | ✅ Aucune |
| DB tables created when needed | ✅ Migrations au démarrage, chaque story ajoute ses tables |
| Clear acceptance criteria | ✅ GWT + scénarios de test |
| FR traceability maintained | ✅ Coverage map complète |

### Quality Verdict: ⚠️ PASS WITH RECOMMENDATIONS

Les epics sont de **très bonne qualité globale** — la couverture FR est à 100%, les ACs sont détaillées et testables, les dépendances sont saines. **2 issues majeures** (Epic 5 oversize, StrategyPage gap) sont des améliorations de structure recommandées mais pas des blocages à l'implémentation. Les 3 issues mineures sont cosmétiques.

---

## Summary and Recommendations

### Overall Readiness Status

## ✅ READY FOR IMPLEMENTATION

Le projet Poke-Radar est prêt pour la Phase 4 d'implémentation. Tous les artéfacts de planification sont présents, cohérents entre eux, et traçables.

---

### Assessment Summary

| Dimension | Score | Détail |
|-----------|-------|--------|
| **Documents présents** | ✅ | PRD, Architecture, Epics, UX — tous localisés et versionnés |
| **PRD → Epics Coverage** | ✅ 100% | 9 FRs PRD → 19 FRs epics, toutes couvertes |
| **UX Alignment** | ✅ | DESIGN.md + EXPERIENCE.md alignés avec PRD et Architecture |
| **Architecture Support** | ✅ | 18 ADs couvrant toutes les FRs, NFRs et besoins UX |
| **Epic Quality** | ⚠️ | 2 issues majeures, 3 mineures (voir ci-dessous) |
| **Story Quality** | ✅ | 17 stories avec ACs Given/When/Then + critères de test |
| **Dependency Health** | ✅ | Aucune forward dependency, backward-only chaînage |

---

### Issues Summary

#### 🔴 Critical (0)
*Aucune issue critique détectée.*

#### 🟠 Major (2)

1. **Epic 5 oversize (11 stories)** — Contient alerting + SSE + design system entier + 3 pages + hooks + responsive/a11y + E2E. Recommandation : extraire la partie UX (stories 5.4→5.11) en Epic 6 "Construire l'interface décisionnelle".

2. **StrategyPage UX partiellement couverte** — L'écran Stratégie & Réglages UX n'a pas de story dédiée dans Epic 5. Epic 1 couvre la config des profils (1.2, 1.3) mais pas l'écran complet (sliders, presets, section notifications UI, référentiels).

#### 🟡 Minor (3)

1. **Epic 3 naming** — Titre technique, suggéré : "Protéger l'accès à mon radar"
2. **Couplage 5.1/5.2** — Fort couplage alerting/déduplication, acceptable car 5.2 couvre aussi l'intégration pipeline
3. **Mix linguistique** — Français/Anglais non uniforme entre docs

---

### Recommended Next Steps

1. **Résoudre les 2 issues majeures** — Décider si Epic 5 est splitté et si une story StrategyPage est ajoutée, ou accepter en l'état.

2. **Commencer l'implémentation par Epic 1** — Les 3 stories d'Epic 1 sont marquées ✅ (complétées). Epic 2 (collecte) est le prochain sur la chaîne de dépendances.

3. **Maintenir la traçabilité** — Le coverage map FRs→Epics est déjà dans `epics.md`. Le maintenir à jour si des stories sont ajoutées/modifiées.

4. **Standardiser la langue** — Choisir une convention (tout anglais ou tout français) pour les titres d'epics/stories et s'y tenir.

---

### Final Note

This assessment identified **0 critical issues**, **2 major recommendations**, and **3 minor observations** across 6 validation dimensions. Le projet peut démarrer l'implémentation immédiatement — les 2 issues majeures sont des optimisations de structure, pas des blocages fonctionnels.

**Assesseur :** John (Product Manager, BMAD)
**Date :** 2026-07-22
