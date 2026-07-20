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
