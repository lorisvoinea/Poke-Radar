use rusqlite::{params, Connection, Error as SqlError, ErrorCode};
use thiserror::Error;

use crate::domain::models::{
    MonitorProfile, MonitorProfileWithProducts, NewMonitorProfile, NewProduct, NormalizationStatus,
    Product, ProductReference, UpdateMonitorProfile,
};

#[derive(Debug, Error)]
pub enum ConfigRepositoryError {
    #[error("Une erreur de stockage local est survenue.")]
    Sql(#[from] SqlError),
    #[error("La référence demandée est introuvable.")]
    UnknownReference,
    #[error("Ce code est réservé à un item du référentiel. Sélectionnez cet item plutôt que la saisie libre.")]
    ReservedReferenceCode,
    #[error("Un produit avec ce code existe déjà.")]
    DuplicateSku,
    #[error("La création du produit a été annulée car sa vérification a échoué. Réessayez.")]
    CreatedProductMissing,
}

pub fn create_product(
    connection: &mut Connection,
    input: &NewProduct,
) -> Result<Product, ConfigRepositoryError> {
    let tx = connection.transaction()?;
    match input {
        NewProduct::Reference { reference_id } => {
            let reference =
                get_reference(&tx, reference_id)?.ok_or(ConfigRepositoryError::UnknownReference)?;
            execute_product_insert(
                &tx,
                "INSERT INTO products(sku, title, reference_id, normalization_status)
                 VALUES(?1, ?2, ?3, 'normalized')",
                params![reference.code, reference.name, reference.id],
            )?;
        }
        NewProduct::FreeText { sku, title } => {
            let code_is_reserved = tx.query_row(
                "SELECT EXISTS(SELECT 1 FROM product_references WHERE code = ?1)",
                params![sku],
                |row| row.get::<_, bool>(0),
            )?;
            if code_is_reserved {
                return Err(ConfigRepositoryError::ReservedReferenceCode);
            }
            execute_product_insert(
                &tx,
                "INSERT INTO products(sku, title, reference_id, normalization_status)
                 VALUES(?1, ?2, NULL, 'free_text')",
                params![sku, title],
            )?;
        }
    }
    let id = tx.last_insert_rowid();
    let product = get_product(&tx, id)?.ok_or(ConfigRepositoryError::CreatedProductMissing)?;
    tx.commit()?;
    Ok(product)
}

fn execute_product_insert<P: rusqlite::Params>(
    connection: &Connection,
    sql: &str,
    params: P,
) -> Result<(), ConfigRepositoryError> {
    match connection.execute(sql, params) {
        Ok(_) => Ok(()),
        Err(SqlError::SqliteFailure(error, message))
            if error.code == ErrorCode::ConstraintViolation
                && message
                    .as_deref()
                    .is_some_and(|text| text.contains("products.sku")) =>
        {
            Err(ConfigRepositoryError::DuplicateSku)
        }
        Err(error) => Err(error.into()),
    }
}

pub fn list_product_references(
    connection: &Connection,
) -> Result<Vec<ProductReference>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT id, code, name, set_name, edition, rarity, language
         FROM product_references
         ORDER BY name COLLATE NOCASE, set_name COLLATE NOCASE, code",
    )?;
    let rows = statement.query_map([], map_reference)?;
    rows.collect::<Result<Vec<_>, _>>().map_err(Into::into)
}

pub fn list_products(connection: &Connection) -> Result<Vec<Product>, ConfigRepositoryError> {
    let mut statement = connection.prepare("SELECT p.id, p.sku, p.title, p.created_at, p.normalization_status, r.id, r.code, r.name, r.set_name, r.edition, r.rarity, r.language FROM products p LEFT JOIN product_references r ON r.id = p.reference_id ORDER BY p.id ASC")?;

    let rows = statement.query_map([], map_product)?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(ConfigRepositoryError::from)
}

fn get_product(
    connection: &Connection,
    product_id: i64,
) -> Result<Option<Product>, ConfigRepositoryError> {
    let mut statement = connection.prepare("SELECT p.id, p.sku, p.title, p.created_at, p.normalization_status, r.id, r.code, r.name, r.set_name, r.edition, r.rarity, r.language FROM products p LEFT JOIN product_references r ON r.id = p.reference_id WHERE p.id = ?1")?;

    let mut rows = statement.query(params![product_id])?;
    if let Some(row) = rows.next()? {
        return Ok(Some(map_product(row)?));
    }

    Ok(None)
}

fn get_reference(
    connection: &Connection,
    reference_id: &str,
) -> Result<Option<ProductReference>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT id, code, name, set_name, edition, rarity, language
         FROM product_references WHERE id = ?1",
    )?;
    let mut rows = statement.query(params![reference_id])?;
    rows.next()?
        .map(map_reference)
        .transpose()
        .map_err(Into::into)
}

fn map_reference(row: &rusqlite::Row<'_>) -> Result<ProductReference, SqlError> {
    Ok(ProductReference {
        id: row.get(0)?,
        code: row.get(1)?,
        name: row.get(2)?,
        set_name: row.get(3)?,
        edition: row.get(4)?,
        rarity: row.get(5)?,
        language: row.get(6)?,
    })
}

fn map_product(row: &rusqlite::Row<'_>) -> Result<Product, SqlError> {
    let status: String = row.get(4)?;
    let reference_id: Option<String> = row.get(5)?;
    let reference = match reference_id {
        Some(id) => Some(ProductReference {
            id,
            code: row.get(6)?,
            name: row.get(7)?,
            set_name: row.get(8)?,
            edition: row.get(9)?,
            rarity: row.get(10)?,
            language: row.get(11)?,
        }),
        None => None,
    };
    Ok(Product {
        id: row.get(0)?,
        sku: row.get(1)?,
        title: row.get(2)?,
        created_at_utc: row.get(3)?,
        normalization_status: if status == "normalized" {
            NormalizationStatus::Normalized
        } else {
            NormalizationStatus::FreeText
        },
        reference,
    })
}

pub fn create_monitor_profile(
    connection: &mut Connection,
    input: &NewMonitorProfile,
) -> Result<MonitorProfileWithProducts, ConfigRepositoryError> {
    let tx = connection.transaction()?;

    if input.make_active {
        tx.execute("UPDATE monitor_profiles SET is_active = 0", [])?;
    }

    tx.execute(
        "INSERT INTO monitor_profiles(name, min_margin_bps, fixed_cost_cents, variable_fee_bps, is_active)
         VALUES (?1, ?2, ?3, ?4, ?5)",
        params![
            input.name,
            input.min_margin_bps,
            input.fixed_cost_cents,
            input.variable_fee_bps,
            if input.make_active { 1 } else { 0 }
        ],
    )?;

    let profile_id = tx.last_insert_rowid();
    for product_id in &input.product_ids {
        tx.execute(
            "INSERT INTO profile_products(profile_id, product_id) VALUES(?1, ?2)",
            params![profile_id, product_id],
        )?;
    }

    tx.commit()?;
    get_monitor_profile(connection, profile_id).map(|p| p.expect("created profile should exist"))
}

pub fn update_monitor_profile(
    connection: &mut Connection,
    input: &UpdateMonitorProfile,
) -> Result<Option<MonitorProfileWithProducts>, ConfigRepositoryError> {
    let tx = connection.transaction()?;

    if input.make_active {
        tx.execute("UPDATE monitor_profiles SET is_active = 0", [])?;
    }

    let updated = tx.execute(
        "UPDATE monitor_profiles
         SET name = ?1,
             min_margin_bps = ?2,
             fixed_cost_cents = ?3,
             variable_fee_bps = ?4,
             is_active = ?5,
             updated_at_utc = strftime('%Y-%m-%dT%H:%M:%SZ','now')
         WHERE id = ?6",
        params![
            input.name,
            input.min_margin_bps,
            input.fixed_cost_cents,
            input.variable_fee_bps,
            if input.make_active { 1 } else { 0 },
            input.id
        ],
    )?;

    if updated == 0 {
        tx.rollback()?;
        return Ok(None);
    }

    tx.execute(
        "DELETE FROM profile_products WHERE profile_id = ?1",
        params![input.id],
    )?;

    for product_id in &input.product_ids {
        tx.execute(
            "INSERT INTO profile_products(profile_id, product_id) VALUES(?1, ?2)",
            params![input.id, product_id],
        )?;
    }

    tx.commit()?;
    get_monitor_profile(connection, input.id)
}

pub fn delete_monitor_profile(
    connection: &Connection,
    profile_id: i64,
) -> Result<bool, ConfigRepositoryError> {
    let deleted = connection.execute(
        "DELETE FROM monitor_profiles WHERE id = ?1",
        params![profile_id],
    )?;
    Ok(deleted > 0)
}

pub fn list_monitor_profiles(
    connection: &Connection,
) -> Result<Vec<MonitorProfileWithProducts>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT id, name, min_margin_bps, fixed_cost_cents, variable_fee_bps, is_active, created_at_utc, updated_at_utc
         FROM monitor_profiles ORDER BY id ASC",
    )?;

    let rows = statement.query_map([], |row| {
        Ok(MonitorProfile {
            id: row.get(0)?,
            name: row.get(1)?,
            min_margin_bps: row.get(2)?,
            fixed_cost_cents: row.get(3)?,
            variable_fee_bps: row.get(4)?,
            is_active: row.get::<_, i64>(5)? == 1,
            created_at_utc: row.get(6)?,
            updated_at_utc: row.get(7)?,
        })
    })?;

    let profiles = rows.collect::<Result<Vec<_>, _>>()?;
    let mut output = Vec::with_capacity(profiles.len());
    for profile in profiles {
        let product_ids = get_profile_product_ids(connection, profile.id)?;
        output.push(MonitorProfileWithProducts {
            profile,
            product_ids,
        });
    }

    Ok(output)
}

pub fn get_monitor_profile(
    connection: &Connection,
    profile_id: i64,
) -> Result<Option<MonitorProfileWithProducts>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT id, name, min_margin_bps, fixed_cost_cents, variable_fee_bps, is_active, created_at_utc, updated_at_utc
         FROM monitor_profiles WHERE id = ?1",
    )?;

    let mut rows = statement.query(params![profile_id])?;
    if let Some(row) = rows.next()? {
        let profile = MonitorProfile {
            id: row.get(0)?,
            name: row.get(1)?,
            min_margin_bps: row.get(2)?,
            fixed_cost_cents: row.get(3)?,
            variable_fee_bps: row.get(4)?,
            is_active: row.get::<_, i64>(5)? == 1,
            created_at_utc: row.get(6)?,
            updated_at_utc: row.get(7)?,
        };
        let product_ids = get_profile_product_ids(connection, profile_id)?;
        return Ok(Some(MonitorProfileWithProducts {
            profile,
            product_ids,
        }));
    }

    Ok(None)
}

fn get_profile_product_ids(
    connection: &Connection,
    profile_id: i64,
) -> Result<Vec<i64>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT product_id FROM profile_products WHERE profile_id = ?1 ORDER BY product_id ASC",
    )?;

    let rows = statement.query_map(params![profile_id], |row| row.get(0))?;
    rows.collect::<Result<Vec<_>, _>>()
        .map_err(ConfigRepositoryError::from)
}

#[cfg(test)]
mod tests {
    use tempfile::tempdir;

    use crate::{
        domain::models::{NewMonitorProfile, NewProduct},
        infrastructure::db::{initialize_database, open_connection},
    };

    use super::{
        create_monitor_profile, create_product, list_monitor_profiles, list_product_references,
        list_products, ConfigRepositoryError,
    };

    #[test]
    fn persists_and_reloads_profile() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("repo-test.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");

        let product = create_product(
            &mut connection,
            &NewProduct::FreeText {
                sku: "SKU-1".into(),
                title: "Produit 1".into(),
            },
        )
        .expect("product");
        create_monitor_profile(
            &mut connection,
            &NewMonitorProfile {
                name: "Marge 20%".to_string(),
                min_margin_bps: 2_000,
                fixed_cost_cents: 100,
                variable_fee_bps: 500,
                product_ids: vec![product.id],
                make_active: true,
            },
        )
        .expect("profile");

        let profiles = list_monitor_profiles(&connection).expect("list profiles");
        assert_eq!(profiles.len(), 1);
        assert_eq!(profiles[0].product_ids, vec![product.id]);
    }

    #[test]
    fn creates_normalized_and_free_text_products() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("products.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");
        let references = list_product_references(&connection).expect("references");

        let normalized = create_product(
            &mut connection,
            &NewProduct::Reference {
                reference_id: references[0].id.clone(),
            },
        )
        .expect("normalized product");
        let free_text = create_product(
            &mut connection,
            &NewProduct::FreeText {
                sku: "LIBRE-1".into(),
                title: "Carte non cataloguée".into(),
            },
        )
        .expect("free text product");

        assert_eq!(
            normalized.normalization_status,
            crate::domain::models::NormalizationStatus::Normalized
        );
        assert_eq!(normalized.reference, Some(references[0].clone()));
        assert_eq!(
            free_text.normalization_status,
            crate::domain::models::NormalizationStatus::FreeText
        );
        assert!(free_text.reference.is_none());
    }

    #[test]
    fn rejects_unknown_reference() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("unknown.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");

        let error = create_product(
            &mut connection,
            &NewProduct::Reference {
                reference_id: "missing".into(),
            },
        )
        .expect_err("unknown reference");
        assert!(matches!(error, ConfigRepositoryError::UnknownReference));
        assert!(list_products(&connection).expect("products").is_empty());
    }

    #[test]
    fn rejects_free_text_using_a_reference_code() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("reserved-reference-code.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");
        let reference = list_product_references(&connection).expect("references")[0].clone();

        let error = create_product(
            &mut connection,
            &NewProduct::FreeText {
                sku: reference.code,
                title: "Fausse saisie libre".into(),
            },
        )
        .expect_err("reference code must stay reserved");

        assert!(matches!(
            error,
            ConfigRepositoryError::ReservedReferenceCode
        ));
        assert!(list_products(&connection).expect("products").is_empty());
    }

    #[test]
    fn reports_duplicate_sku_as_an_actionable_error() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("duplicate-sku.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");
        let input = NewProduct::FreeText {
            sku: "DUPLICATE-1".into(),
            title: "Premier produit".into(),
        };
        create_product(&mut connection, &input).expect("first product");

        let error = create_product(
            &mut connection,
            &NewProduct::FreeText {
                sku: "DUPLICATE-1".into(),
                title: "Second produit".into(),
            },
        )
        .expect_err("duplicate sku");

        assert!(matches!(error, ConfigRepositoryError::DuplicateSku));
        assert_eq!(error.to_string(), "Un produit avec ce code existe déjà.");
    }

    #[test]
    fn rolls_back_creation_if_product_disappears_before_commit() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("deleted-after-insert.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");
        connection
            .execute_batch(
                "CREATE TABLE product_insert_audit(product_id INTEGER NOT NULL);
                 CREATE TRIGGER delete_created_product AFTER INSERT ON products
                 BEGIN
                   INSERT INTO product_insert_audit(product_id) VALUES(NEW.id);
                   DELETE FROM products WHERE id = NEW.id;
                 END;",
            )
            .expect("delete trigger");

        let error = create_product(
            &mut connection,
            &NewProduct::FreeText {
                sku: "VANISH-1".into(),
                title: "Produit éphémère".into(),
            },
        )
        .expect_err("missing committed product");

        assert!(matches!(
            error,
            ConfigRepositoryError::CreatedProductMissing
        ));
        assert_eq!(
            error.to_string(),
            "La création du produit a été annulée car sa vérification a échoué. Réessayez."
        );
        let audit_count: i64 = connection
            .query_row("SELECT COUNT(*) FROM product_insert_audit", [], |row| {
                row.get(0)
            })
            .expect("audit count");
        assert_eq!(
            audit_count, 0,
            "a failed reload must roll back the still-uncommitted creation"
        );
    }
}
