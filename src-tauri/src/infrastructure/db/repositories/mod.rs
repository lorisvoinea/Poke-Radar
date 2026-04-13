use rusqlite::{params, Connection, Error as SqlError};
use thiserror::Error;

use crate::domain::models::{
    MonitorProfile, MonitorProfileWithProducts, NewMonitorProfile, Product, UpdateMonitorProfile,
};

#[derive(Debug, Error)]
pub enum ConfigRepositoryError {
    #[error("database error: {0}")]
    Sql(#[from] SqlError),
}

pub fn create_product(
    connection: &Connection,
    sku: &str,
    title: &str,
) -> Result<Product, ConfigRepositoryError> {
    connection.execute(
        "INSERT INTO products(sku, title) VALUES(?1, ?2)",
        params![sku, title],
    )?;

    let id = connection.last_insert_rowid();
    get_product(connection, id).map(|p| p.expect("created product should exist"))
}

pub fn list_products(connection: &Connection) -> Result<Vec<Product>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT id, sku, title, created_at AS created_at_utc FROM products ORDER BY id ASC",
    )?;

    let rows = statement.query_map([], |row| {
        Ok(Product {
            id: row.get(0)?,
            sku: row.get(1)?,
            title: row.get(2)?,
            created_at_utc: row.get(3)?,
        })
    })?;

    rows.collect::<Result<Vec<_>, _>>()
        .map_err(ConfigRepositoryError::from)
}

fn get_product(
    connection: &Connection,
    product_id: i64,
) -> Result<Option<Product>, ConfigRepositoryError> {
    let mut statement = connection.prepare(
        "SELECT id, sku, title, created_at AS created_at_utc FROM products WHERE id = ?1",
    )?;

    let mut rows = statement.query(params![product_id])?;
    if let Some(row) = rows.next()? {
        return Ok(Some(Product {
            id: row.get(0)?,
            sku: row.get(1)?,
            title: row.get(2)?,
            created_at_utc: row.get(3)?,
        }));
    }

    Ok(None)
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
        domain::models::NewMonitorProfile,
        infrastructure::db::{initialize_database, open_connection},
    };

    use super::{create_monitor_profile, create_product, list_monitor_profiles};

    #[test]
    fn persists_and_reloads_profile() {
        let dir = tempdir().expect("tempdir");
        let db_path = dir.path().join("repo-test.db");
        initialize_database(&db_path).expect("db init");
        let mut connection = open_connection(&db_path).expect("db open");

        let product = create_product(&connection, "SKU-1", "Produit 1").expect("product");
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
}
