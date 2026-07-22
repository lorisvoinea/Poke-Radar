# Glossary — Poke-Radar

## Confidence Levels

| Level | Icon | Definition | Source Requirement |
|-------|------|------------|--------------------|
| **High** | ★★★ | Price confirmed across multiple independent sources with recent timestamps. | ≥2 active sources, <1h freshness |
| **Medium** | ★★☆ | Single source with sufficient historical data to validate the estimate. | 1 source + ≥3 historical data points |
| **Low** | ★☆☆ | Single source, limited or no historical context. | 1 source, no history |
| **None** | ⚠ | Manual entry with no automated verification. | 0 sources |

## Source States

| State | Icon | Label | Trigger | User Action |
|-------|------|-------|---------|-------------|
| **OK** | 🟢 | Active | Last scan successful within expected interval. | None |
| **Degraded** | 🟡 | Slow / rate-limited | Response time > threshold or rate limit near exhaustion. | Wait or reduce scan frequency |
| **Blocked** | 🔴 | Unavailable | Timeout, CAPTCHA, parse error, or consecutive failures. | Manual entry fallback or source reconfiguration |
| **Manual** | 🔵 | Manual entry | User-initiated data injection. | Active use or archival |

## Margin Calculation

| Term | Formula / Definition |
|------|---------------------|
| **Purchase price** | Listed price from source (€). |
| **Shipping cost** | Delivery fee from seller, per-item or combined. |
| **Platform commission** | Marketplace fee (percentage of sale price). |
| **Transaction fee** | Payment processing fee (PayPal, Stripe, etc.). |
| **Total cost** | Purchase + shipping + commission + transaction. |
| **Estimated resale** | Market-based estimate for the same card in same condition. |
| **Gross margin** | Resale − Purchase (before fees). |
| **Net margin** | Resale − Total cost (after all fees). |
| **ROI (net)** | Net margin ÷ Total cost × 100 (%). |

## Pokémon TCG Domain Terms

| Term | Definition |
|------|------------|
| **Set** | A named expansion release (e.g., "Épée et Bouclier", "151"). |
| **Series** | A block of sets within a generation (e.g., "Sword & Shield", "Scarlet & Violet"). |
| **Card** | Individual card identified by name + set + collector number. |
| **Condition** | Card physical state: Mint, Near Mint (NM), Excellent (EX), Good (GD), Played (PL). |
| **Language** | Card print language: FR, EN, JP, DE, IT, ES, etc. |
| **VMAX / EX / GX / V** | Special card rarity tiers with different market values. |
| **First Edition / 1st Ed** | Initial print run, typically higher value. |

## Scoring Dimensions

| Dimension | Weight | Components |
|-----------|--------|------------|
| **Rentability** | Configurable | Net margin, ROI, margin-to-risk ratio. |
| **Urgency** | Configurable | Freshness (time since listing), price trend direction and velocity. |
| **Confidence** | Configurable | Source count, data recency, historical accuracy of source. |

## Decision States

| State | Symbol | Meaning |
|-------|--------|---------|
| **Treated** | ✅ | User acted on the opportunity (purchased or decided to purchase). |
| **Ignored** | ❌ | User dismissed the opportunity (no action, undo available for 3s). |
| **Watched** | 👁 | User is monitoring but hasn't decided yet. Stays in radar. |
