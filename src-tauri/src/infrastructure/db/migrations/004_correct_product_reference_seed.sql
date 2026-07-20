UPDATE product_references
SET code = 'SVI-013-FR',
    name = 'Poussacha',
    set_name = 'Écarlate et Violet',
    edition = 'Standard',
    rarity = 'Commune',
    language = 'fr'
WHERE id = 'pokemon-sv1-fr-001';

UPDATE product_references
SET code = 'MEW-006-FR',
    name = 'Dracaufeu ex',
    set_name = 'Écarlate et Violet – 151',
    edition = 'Standard',
    rarity = 'Double rare',
    language = 'fr'
WHERE id = 'pokemon-sv2-fr-203';

UPDATE product_references
SET code = 'CRZ-160-FR',
    name = 'Pikachu',
    set_name = 'Épée et Bouclier – Zénith Suprême',
    edition = 'Standard',
    rarity = 'Rare secrète',
    language = 'fr'
WHERE id = 'pokemon-swsh12-fr-160';

-- Libère d'abord le code corrigé lorsqu'une saisie libre historique l'occupe.
-- L'identifiant stable rend le renommage déterministe. Si ce SKU de secours
-- est déjà occupé, le CTE récursif choisit le premier suffixe numérique libre.
-- Le titre, l'identité du produit et ses relations de profil restent inchangés.
WITH RECURSIVE
products_to_rename(id, base_sku) AS (
    SELECT id, sku || '-FREE-TEXT-' || id
    FROM products
    WHERE normalization_status = 'free_text'
      AND sku IN ('SVI-013-FR', 'MEW-006-FR', 'CRZ-160-FR')
),
fallback_candidates(id, base_sku, candidate, suffix) AS (
    SELECT id, base_sku, base_sku, 0
    FROM products_to_rename

    UNION ALL

    SELECT candidates.id,
           candidates.base_sku,
           candidates.base_sku || '-' || (candidates.suffix + 1),
           candidates.suffix + 1
    FROM fallback_candidates AS candidates
    WHERE EXISTS (
        SELECT 1
        FROM products AS occupied
        WHERE occupied.id <> candidates.id
          AND occupied.sku = candidates.candidate
    )
),
available_fallbacks(id, candidate) AS (
    SELECT candidates.id, candidates.candidate
    FROM fallback_candidates AS candidates
    WHERE NOT EXISTS (
        SELECT 1
        FROM products AS occupied
        WHERE occupied.id <> candidates.id
          AND occupied.sku = candidates.candidate
    )
)
UPDATE products
SET sku = (
        SELECT candidate
        FROM available_fallbacks
        WHERE available_fallbacks.id = products.id
    )
WHERE id IN (SELECT id FROM products_to_rename);

UPDATE products
SET sku = (
        SELECT code
        FROM product_references
        WHERE product_references.id = products.reference_id
    ),
    title = (
        SELECT name
        FROM product_references
        WHERE product_references.id = products.reference_id
    )
WHERE normalization_status = 'normalized'
  AND reference_id IN (
      'pokemon-sv1-fr-001',
      'pokemon-sv2-fr-203',
      'pokemon-swsh12-fr-160'
  );
