-- Migration 001: Initial schema
-- Creates the foundational tables for Poke-Radar

-- Products being monitored
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    set_name TEXT,
    card_number TEXT,
    reference_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Monitoring profiles (strategy configuration per product)
CREATE TABLE IF NOT EXISTS monitor_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL REFERENCES products(id),
    min_margin_percent INTEGER NOT NULL DEFAULT 15,
    max_purchase_price_cents INTEGER,
    shipping_cost_cents INTEGER NOT NULL DEFAULT 0,
    platform_fee_percent INTEGER NOT NULL DEFAULT 5,
    transaction_fee_percent INTEGER NOT NULL DEFAULT 3,
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- External data sources
CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    connector_type TEXT NOT NULL,
    health TEXT NOT NULL DEFAULT 'ok',
    last_collected_at TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Listing snapshots collected from sources
CREATE TABLE IF NOT EXISTS listing_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_id INTEGER NOT NULL REFERENCES sources(id),
    product_id INTEGER,
    title TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'EUR',
    url TEXT,
    collected_at TEXT NOT NULL DEFAULT (datetime('now')),
    correlation_id TEXT NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_listings_product ON listing_snapshots(product_id);
CREATE INDEX IF NOT EXISTS idx_listings_collected ON listing_snapshots(collected_at);
CREATE INDEX IF NOT EXISTS idx_profiles_product ON monitor_profiles(product_id);
