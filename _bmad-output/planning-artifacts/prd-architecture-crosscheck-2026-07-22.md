# PRD ↔ Architecture Spine — Cross-check du 2026-07-22

**Reviewer:** John (PM)
**PRD:** `_bmad-output/planning-artifacts/prd.md` (màj 2026-07-21)
**Architecture:** `_bmad-output/planning-artifacts/architecture/architecture-Poke-Radar-2026-07-22/ARCHITECTURE-SPINE.md` (Winston, 2026-07-22)
**Ancienne archi (obsolète) :** `_bmad-output/planning-artifacts/architecture.md` (fév 2026, Tauri desktop)

---

## Verdict : ✅ Aligné — 3 points à discuter

Le spine de Winston est fidèle au PRD. Le pivot Tauri → web est correct. Aucune divergence critique.

---

## Points à voir avec Winston

### 🔴 1. Ancien `architecture.md` à marquer comme obsolète

L'ancien fichier d'architecture (fév 2026) décrit encore Tauri v2 + `src-tauri/`. Il est listé comme input dans le frontmatter du PRD. Le nouveau spine le remplace.

**Demander à Winston :** ajouter un bandeau `⚠️ SUPERSEDED` en haut de l'ancien `architecture.md`.

---

### 🟡 2. Terminologie « REST » dans le PRD

Le PRD FR-08 dit « API HTTP (REST ou similaire) ». Le spine (AD-1) choisit des endpoints RPC `POST /api/*` plutôt que du REST CRUD.

**Demander à Winston :** est-ce qu'on met à jour le PRD pour dire « API HTTP RPC » au lieu de « REST ou similaire » ? (Non bloquant, le PRD couvre déjà avec « ou similaire ».)

---

### 🟢 3. SSE absent du PRD

Le spine AD-10 introduit Server-Sent Events (`GET /api/events`) pour le temps réel dashboard. Le PRD FR-06 ne mentionne pas le mécanisme de mise à jour.

**Demander à Winston :** est-ce qu'on ajoute une ligne dans FR-06 genre « Le dashboard se met à jour en temps réel sans rafraîchissement manuel » ? (Nice-to-have, pas bloquant.)

---

## Notes additionnelles (pas des problèmes)

- **Caddy vs nginx** : le PRD dit « nginx/Caddy », le spine choisit Caddy → cohérent.
- **Environnement unique** (AD-11) : le spine dit pas de staging. OK pour MVP, à garder en tête si ça coince plus tard.
- **Stratégie de test** (AD-13→AD-16) : le spine est plus détaillé que le PRD, normal — PRD = quoi, archi = comment.
