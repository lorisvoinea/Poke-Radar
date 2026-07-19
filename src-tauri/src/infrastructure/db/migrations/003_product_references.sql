CREATE TABLE product_references (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    set_name TEXT NOT NULL,
    edition TEXT NOT NULL,
    language TEXT NOT NULL
);

INSERT OR IGNORE INTO product_references(id, code, name, set_name, edition, language) VALUES
    ('pokemon-sv1-fr-001', 'SV1-001-FR', 'Poussacha', 'Écarlate et Violet', 'Écarlate et Violet', 'fr'),
    ('pokemon-sv2-fr-203', 'SV2-203-FR', 'Dracaufeu ex', '151', 'Ultra rare', 'fr'),
    ('pokemon-swsh12-fr-160', 'SWSH12-160-FR', 'Pikachu VMAX', 'Zénith Suprême', 'Holo rare VMAX', 'fr');

ALTER TABLE products ADD COLUMN reference_id TEXT REFERENCES product_references(id);
ALTER TABLE products ADD COLUMN normalization_status TEXT NOT NULL DEFAULT 'free_text'
    CHECK (normalization_status IN ('normalized', 'free_text'));
CREATE INDEX idx_products_reference_id ON products(reference_id);

CREATE TRIGGER products_normalization_insert
BEFORE INSERT ON products
WHEN (NEW.normalization_status = 'normalized' AND NEW.reference_id IS NULL)
  OR (NEW.normalization_status = 'free_text' AND NEW.reference_id IS NOT NULL)
BEGIN
  SELECT RAISE(ABORT, 'invalid product normalization');
END;

CREATE TRIGGER products_normalization_update
BEFORE UPDATE OF reference_id, normalization_status ON products
WHEN (NEW.normalization_status = 'normalized' AND NEW.reference_id IS NULL)
  OR (NEW.normalization_status = 'free_text' AND NEW.reference_id IS NOT NULL)
BEGIN
  SELECT RAISE(ABORT, 'invalid product normalization');
END;
