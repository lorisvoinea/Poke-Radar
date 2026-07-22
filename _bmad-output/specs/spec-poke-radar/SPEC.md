---
id: SPEC-poke-radar
companions:
  - glossary.md
  - docs/DESIGN.md
  - docs/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/EXPERIENCE.md
sources:
  - _bmad-output/planning-artifacts/prds/prd-poke-radar-2026-07-21/.memlog.md
  - _bmad-output/planning-artifacts/ux-designs/ux-Poke-Radar-2026-07-21/.memlog.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# SPEC Poke-Radar — Exposition Web Responsive Single-User

## Why

Poke-Radar started as a Tauri desktop app for Pokémon TCG market arbitrage monitoring. The user (Loris, single-user) needs to access it from anywhere — specifically from his iPhone — without being tied to a desktop. The VPS hosting the app already has a domain name. The goal is to expose the existing Rust + React stack as a responsive web interface served over HTTPS via reverse proxy, keeping the same single-user, no-SaaS architecture. This is a **pain to solve** (no mobile access to the tool) combined with an **opportunity to capture** (existing VPS + domain ready to serve).

## Capabilities

- **CAP-1**: Web dashboard accessible via domain name from any browser. Single-user personal deployment on VPS.
  - **intent:** User can open a browser on any device and access the Poke-Radar dashboard at a domain name.
  - **success:** Opening the domain URL in Safari on an iPhone displays the Radar screen with current opportunities.

- **CAP-2**: Opportunity radar — prioritized list of buy/sell opportunities from all configured sources, sorted by net margin score, with swipe actions on mobile and table view on desktop.
  - **intent:** User sees all active opportunities ranked by their configured scoring, and can act on each (treat/ignore) with a gesture.
  - **success:** A Cardmarket opportunity for a tracked card appears in the radar list; user swipes right to mark it treated; it disappears from the active queue and is logged.

- **CAP-3**: Opportunity detail — full margin breakdown (purchase price, shipping, platform commission, transaction fees), confidence score justification, sparkline price history, link to source.
  - **intent:** User can inspect the financial breakdown behind any opportunity score before making a decision.
  - **success:** Tapping an opportunity card opens a detail view showing the line-item breakdown, and the net margin matches the displayed total within 0,01 €.

- **CAP-4**: Strategy configuration — adjustable thresholds (min margin, min ROI, min confidence, max risk), scoring weights, notification preferences, saved presets (Standard/Aggressive/Conservative/Custom).
  - **intent:** User tunes the scoring engine to match their trading style across named presets.
  - **success:** Switching from "Standard" to "Aggressive" preset changes the threshold sliders and immediately re-ranks the opportunity list.

- **CAP-5**: Source management — add, configure, and remove data sources (Cardmarket, eBay, manual entry), per-source health monitoring with color status, manual scan trigger, error journal.
  - **intent:** User manages where price data comes from and sees at a glance if a source is healthy.
  - **success:** Configuring a Cardmarket source and triggering a manual scan populates the radar with new opportunities within 30 seconds.

- **CAP-6**: Automated collection — periodic scanning of configured sources for card availability and pricing, normalized across sources, with configurable frequency.
  - **intent:** The system automatically gathers pricing data on a schedule without user intervention.
  - **success:** With a scan interval of 15 minutes, new Cardmarket listings for tracked cards appear in the radar within 20 minutes of being posted.

- **CAP-7**: Net margin scoring — configurable scoring engine combining rentability (net margin, ROI), urgency (freshness, price trend), and confidence (source count, data quality) into a single actionable score.
  - **intent:** Every opportunity gets a single score that reflects the user's configured priorities across multiple dimensions.
  - **success:** Two opportunities with identical net margin but different source freshness get different scores when the urgency weight is non-zero.

- **CAP-8**: Telegram notifications — critical alerts pushed to Telegram when an opportunity exceeds configured thresholds, with summary data and a direct link to the radar.
  - **intent:** User receives a push notification on their phone when a high-value opportunity is detected, without needing to have the dashboard open.
  - **success:** A message appears in the configured Telegram chat within 60 seconds of scanner detecting an opportunity above the alert threshold, containing card name, margin, confidence, and a link.

- **CAP-9**: Decision history — per-opportunity action logging (treated/ignored/watched), stats dashboard for weekly calibration, and missed-opportunity analysis.
  - **intent:** User reviews past decisions to calibrate their strategy and identify patterns in missed or false-positive alerts.
  - **success:** A weekly stats view shows counts of treated/ignored/watched, the median time-to-decision, and the false-positive rate.

- **CAP-10**: Manual opportunity entry — inject an opportunity manually (product, purchase price, fees, estimated resale) when sources are unavailable or for niche finds.
  - **intent:** User continues working when automated sources are down or for opportunities found outside configured sources.
  - **success:** Entering a manual card with purchase price and estimated resale creates a scored opportunity in the radar with a blue "Manual" badge.

- **CAP-11**: Responsive layout — mobile-first from 320px to 1920px+. Mobile: 1-column cards, bottom tab bar (Radar/Detail/Settings/Sources). Desktop ≥1024px: split-view Radar+Detail, side navigation, dense table.
  - **intent:** The same web interface is usable on a phone held in one hand and on a desktop monitor.
  - **success:** No horizontal scroll on a 320px-wide viewport; all interactive elements have touch targets ≥44px.

- **CAP-12**: Product referential — managed catalog of tracked products (cards, sets, series) with auto-completion for manual entry, import/export capabilities.
  - **intent:** User maintains a list of cards they care about so the scanner knows what to track.
  - **success:** Adding "Dracaufeu VMAX Épée et Bouclier" to the tracked products list causes the next scan to include that card in results.

- **CAP-13**: Authentication — single-user token-based login protecting the web dashboard. Token configured via environment variable, verified on every API request. Unauthenticated visitors see only the login page.
  - **intent:** Only the authorized user can access the dashboard, view opportunities, and manage the system.
  - **success:** Navigating to `pokeradar.lumpy.top` without a token shows only a login form; submitting a valid token grants access to the full dashboard. Invalid tokens or API requests without a token return 401.

- **CAP-14**: Real-time dashboard updates — SSE connection from frontend to backend pushes new opportunities, source status changes, and system notifications to the dashboard without manual refresh.
  - **intent:** Dashboard stays current without the user needing to reload or poll; new data appears automatically.
  - **success:** A new opportunity scored above threshold appears on the radar within 5 seconds of the scanner completing, without any user action, while the dashboard is open.

## Constraints

- **Deployed at `pokeradar.lumpy.top`** via reverse proxy (nginx/caddy) for HTTPS termination. No built-in TLS in the app.
- **Single-user deployment on VPS.** Not designed for multi-tenancy or concurrent users.
- **Single-user token authentication required.** Token stored as environment variable, verified on every API request. No anonymous access to dashboard or API.
- **Rust backend + React frontend.** Stack is fixed — no framework migration, no language change.
- **SQLite database.** No external database server dependency. All queries via parameterized statements — no string concatenation for SQL.
- **French UI language mandatory.** i18n architecture present but no other locale implemented for MVP.
- **Touch targets ≥44px on mobile.** AA contrast minimum, AAA on KPIs. Keyboard navigable. Respects `prefers-reduced-motion`.
- **Amber Warmth light theme** (`#FFFDF7` background, `#D97706` amber accent, `#2D2412` primary text). Dark mode deferred post-MVP.
- **Unit tests mandatory** on business rules: margin calculation, scoring, normalization, deduplication. **Integration tests** on the full pipeline (ingest → normalize → score → alert). **UI component tests** covering all states: default, loading, error, success. **E2E tests** covering the 4 critical user journeys (alert→decide, recalibrate, source-unavailable, manual-entry).
- **XSS prevention** on all user-facing output. **Rate limiting** on API endpoints. **RGPD/nLPD compliant** for personal data storage and processing.

## Non-goals

- **Multi-tenancy, SaaS, user accounts, roles.** One user, one token. Auth UI is a login form — no registration, password reset, or multi-user management.
- **Dark mode, push notifications, PWA, native mobile apps.** All deferred post-MVP. The MVP is a responsive web app in light mode with Telegram as the push channel.
- **Multiple languages beyond French.** i18n infrastructure is wired but translation is out of scope.
- **Automated purchasing, payment integration, or inventory management.** The tool stops at the decision. Buying is manual.
- **WebSocket push.** Real-time updates use SSE; WebSocket is post-MVP.

## Success signal

Loris opens Poke-Radar from his iPhone, authenticates with his token, sees a Cardmarket alert for a tracked card with net margin above his threshold appear via SSE without refreshing, reviews the margin breakdown, swipes right to treat it, and the decision is logged — all within 5 minutes of the alert firing and without touching a desktop computer.

## Assumptions

- VPS has a domain configured and a reverse proxy (nginx/caddy) will handle HTTPS termination.
- The existing Tauri Rust backend can be adapted to serve HTTP without major refactoring — Tauri commands become REST/RPC endpoints.
- `docs/DESIGN.md` will be regenerated separately to reflect the light-mode theme (currently contains the archived dark palette which is a reference for post-MVP dark mode).
- Cardmarket and eBay data access (API or structured scraping) is feasible within their respective terms of use and rate limits.
- Authentication token will be provisioned at deploy time via environment variable — no registration flow needed.

## Open Questions

- **Cardmarket API access** pending verification — rate limits and terms of use must be confirmed before implementing CAP-5/CAP-6 for this source. Pending verification does not block other capabilities.
