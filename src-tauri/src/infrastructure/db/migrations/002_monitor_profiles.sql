CREATE TABLE IF NOT EXISTS monitor_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  min_margin_bps INTEGER NOT NULL CHECK(min_margin_bps >= 0),
  fixed_cost_cents INTEGER NOT NULL CHECK(fixed_cost_cents >= 0),
  variable_fee_bps INTEGER NOT NULL CHECK(variable_fee_bps >= 0),
  is_active INTEGER NOT NULL DEFAULT 0 CHECK(is_active IN (0,1)),
  created_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  updated_at_utc TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now'))
);

CREATE TABLE IF NOT EXISTS profile_products (
  profile_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  PRIMARY KEY(profile_id, product_id),
  FOREIGN KEY(profile_id) REFERENCES monitor_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_profile_products_profile_id ON profile_products(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_products_product_id ON profile_products(product_id);
