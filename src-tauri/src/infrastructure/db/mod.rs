use std::path::Path;

use log::info;
use rusqlite::{Connection, Error as SqlError};
use thiserror::Error;

pub mod repositories;

#[derive(Debug, Error)]
pub enum DbError {
    #[error("database open error: {0}")]
    Open(#[source] SqlError),
    #[error("migration failed ({migration}): {source}")]
    Migration {
        migration: String,
        #[source]
        source: SqlError,
    },
}

#[derive(Debug)]
struct Migration {
    version: i64,
    name: &'static str,
    script: &'static str,
}

const MIGRATIONS: &[Migration] = &[
    Migration {
        version: 1,
        name: "001_initial_schema",
        script: include_str!("migrations/001_initial_schema.sql"),
    },
    Migration {
        version: 2,
        name: "002_monitor_profiles",
        script: include_str!("migrations/002_monitor_profiles.sql"),
    },
    Migration {
        version: 3,
        name: "003_product_references",
        script: include_str!("migrations/003_product_references.sql"),
    },
    Migration {
        version: 4,
        name: "004_correct_product_reference_seed",
        script: include_str!("migrations/004_correct_product_reference_seed.sql"),
    },
];

pub fn initialize_database(path: &Path) -> Result<(), DbError> {
    info!("Ouverture DB locale: {}", path.display());
    let mut connection = open_connection(path)?;
    connection
        .execute_batch("PRAGMA foreign_keys = ON;")
        .map_err(|source| DbError::Migration {
            migration: "foreign_keys_on".to_string(),
            source,
        })?;

    info!("Exécution des migrations versionnées");
    apply_migrations(&mut connection, MIGRATIONS)
}

pub fn open_connection(path: &Path) -> Result<Connection, DbError> {
    let connection = Connection::open(path).map_err(DbError::Open)?;
    connection
        .execute_batch("PRAGMA foreign_keys = ON;")
        .map_err(|source| DbError::Open(source))?;
    Ok(connection)
}

fn apply_migrations(connection: &mut Connection, migrations: &[Migration]) -> Result<(), DbError> {
    connection
        .execute(
            "CREATE TABLE IF NOT EXISTS schema_migrations (
                version INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )
        .map_err(|source| DbError::Migration {
            migration: "schema_migrations_init".to_string(),
            source,
        })?;

    let transaction = connection
        .transaction()
        .map_err(|source| DbError::Migration {
            migration: "begin_transaction".to_string(),
            source,
        })?;

    for migration in migrations {
        let already_applied = transaction
            .query_row(
                "SELECT EXISTS(SELECT 1 FROM schema_migrations WHERE version = ?1)",
                [migration.version],
                |row| row.get::<_, i64>(0),
            )
            .map(|exists| exists == 1)
            .map_err(|source| DbError::Migration {
                migration: migration.name.to_string(),
                source,
            })?;

        if already_applied {
            continue;
        }

        transaction
            .execute_batch(migration.script)
            .map_err(|source| DbError::Migration {
                migration: migration.name.to_string(),
                source,
            })?;

        transaction
            .execute(
                "INSERT INTO schema_migrations(version, name) VALUES (?1, ?2)",
                (migration.version, migration.name),
            )
            .map_err(|source| DbError::Migration {
                migration: migration.name.to_string(),
                source,
            })?;
    }

    transaction.commit().map_err(|source| DbError::Migration {
        migration: "commit".to_string(),
        source,
    })
}

#[cfg(test)]
mod tests {
    use std::path::Path;

    use rusqlite::{Connection, OpenFlags};
    use tempfile::tempdir;

    use super::{
        apply_migrations, initialize_database, open_connection, DbError, Migration, MIGRATIONS,
    };

    #[test]
    fn migrations_successfully_apply() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("app.db");

        initialize_database(&database_path).expect("database should initialize");

        let connection = Connection::open(database_path).expect("open db");
        let count: i64 = connection
            .query_row("SELECT COUNT(*) FROM schema_migrations", [], |row| {
                row.get(0)
            })
            .expect("count migrations");

        assert_eq!(count, MIGRATIONS.len() as i64);
    }

    #[test]
    fn invalid_migration_returns_explicit_error() {
        let mut connection = Connection::open_in_memory().expect("open memory db");

        let invalid_migrations = [Migration {
            version: 100,
            name: "100_invalid",
            script: "THIS IS NOT SQL;",
        }];

        let error = apply_migrations(&mut connection, &invalid_migrations).expect_err("must fail");

        match error {
            DbError::Migration { migration, .. } => {
                assert_eq!(migration, "100_invalid");
            }
            _ => panic!("expected migration error"),
        }
    }

    #[test]
    fn locked_database_returns_migration_error() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("locked.db");

        let lock_connection = Connection::open(&database_path).expect("open lock connection");
        lock_connection
            .execute_batch("BEGIN EXCLUSIVE TRANSACTION;")
            .expect("hold exclusive lock");

        let mut blocked_connection =
            Connection::open_with_flags(&database_path, OpenFlags::SQLITE_OPEN_READ_WRITE)
                .expect("open second connection");

        let result = apply_migrations(
            &mut blocked_connection,
            &[Migration {
                version: 3,
                name: "003_locked_test",
                script: "CREATE TABLE IF NOT EXISTS locked_test(id INTEGER PRIMARY KEY);",
            }],
        );

        assert!(matches!(result, Err(DbError::Migration { .. })));

        lock_connection
            .execute_batch("ROLLBACK;")
            .expect("release lock");
    }

    #[test]
    fn open_connection_creates_database_on_first_launch() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("first-launch.db");

        assert!(!Path::new(&database_path).exists());
        let _connection = open_connection(&database_path).expect("first launch should create db");
        assert!(Path::new(&database_path).exists());
    }

    #[test]
    fn migration_v3_preserves_historical_products_and_profile_links() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("upgrade.db");
        let mut connection = Connection::open(&database_path).expect("open db");
        apply_migrations(&mut connection, &MIGRATIONS[..2]).expect("migrate to v2");
        connection
            .execute(
                "INSERT INTO products(sku, title) VALUES('OLD-1', 'Produit historique')",
                [],
            )
            .expect("old product");
        let product_id = connection.last_insert_rowid();
        connection
            .execute("INSERT INTO monitor_profiles(name, min_margin_bps, fixed_cost_cents, variable_fee_bps) VALUES('Historique', 1000, 0, 0)", [])
            .expect("old profile");
        let profile_id = connection.last_insert_rowid();
        connection
            .execute(
                "INSERT INTO profile_products(profile_id, product_id) VALUES(?1, ?2)",
                (profile_id, product_id),
            )
            .expect("old link");

        apply_migrations(&mut connection, MIGRATIONS).expect("migrate to v3");

        let historical: (i64, String, String, String, Option<String>) = connection
            .query_row(
                "SELECT id, sku, title, normalization_status, reference_id FROM products WHERE id = ?1",
                [product_id],
                |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?, row.get(4)?)),
            )
            .expect("historical product");
        assert_eq!(
            historical,
            (
                product_id,
                "OLD-1".into(),
                "Produit historique".into(),
                "free_text".into(),
                None
            )
        );
        let link_count: i64 = connection
            .query_row(
                "SELECT COUNT(*) FROM profile_products WHERE profile_id = ?1 AND product_id = ?2",
                (profile_id, product_id),
                |row| row.get(0),
            )
            .expect("link count");
        assert_eq!(link_count, 1);
    }

    #[test]
    fn reference_seed_is_deterministic_and_migrations_are_idempotent() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("seed.db");
        initialize_database(&database_path).expect("first init");
        initialize_database(&database_path).expect("second init");
        let connection = Connection::open(database_path).expect("open db");
        let count: i64 = connection
            .query_row("SELECT COUNT(*) FROM product_references", [], |row| {
                row.get(0)
            })
            .expect("reference count");
        assert_eq!(count, 3);

        let mut statement = connection
            .prepare(
                "SELECT id, code, name, set_name, edition, rarity, language \
                 FROM product_references ORDER BY id",
            )
            .expect("seed query");
        let references = statement
            .query_map([], |row| {
                Ok((
                    row.get::<_, String>(0)?,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                    row.get::<_, String>(3)?,
                    row.get::<_, String>(4)?,
                    row.get::<_, String>(5)?,
                    row.get::<_, String>(6)?,
                ))
            })
            .expect("seed rows")
            .collect::<Result<Vec<_>, _>>()
            .expect("seed values");
        assert_eq!(
            references,
            vec![
                (
                    "pokemon-sv1-fr-001".into(),
                    "SVI-013-FR".into(),
                    "Poussacha".into(),
                    "Écarlate et Violet".into(),
                    "Standard".into(),
                    "Commune".into(),
                    "fr".into()
                ),
                (
                    "pokemon-sv2-fr-203".into(),
                    "MEW-006-FR".into(),
                    "Dracaufeu ex".into(),
                    "Écarlate et Violet – 151".into(),
                    "Standard".into(),
                    "Double rare".into(),
                    "fr".into()
                ),
                (
                    "pokemon-swsh12-fr-160".into(),
                    "CRZ-160-FR".into(),
                    "Pikachu".into(),
                    "Épée et Bouclier – Zénith Suprême".into(),
                    "Standard".into(),
                    "Rare secrète".into(),
                    "fr".into()
                ),
            ]
        );
    }

    #[test]
    fn corrective_migration_updates_seed_from_an_already_applied_v3() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("v3-seed.db");
        let mut connection = Connection::open(database_path).expect("open db");

        apply_migrations(&mut connection, &MIGRATIONS[..3]).expect("migrate to v3");
        connection
            .execute(
                "INSERT INTO products(sku, title, reference_id, normalization_status) \
                 VALUES('SV2-203-FR', 'Ancien Dracaufeu', 'pokemon-sv2-fr-203', 'normalized')",
                [],
            )
            .expect("normalized product created before corrective migration");
        apply_migrations(&mut connection, MIGRATIONS).expect("apply corrective migration");

        let corrected: (String, String, String, String) = connection
            .query_row(
                "SELECT code, name, set_name, rarity FROM product_references \
                 WHERE id = 'pokemon-sv2-fr-203'",
                [],
                |row| Ok((row.get(0)?, row.get(1)?, row.get(2)?, row.get(3)?)),
            )
            .expect("corrected reference");

        assert_eq!(
            corrected,
            (
                "MEW-006-FR".into(),
                "Dracaufeu ex".into(),
                "Écarlate et Violet – 151".into(),
                "Double rare".into()
            )
        );

        let corrected_product: (String, String) = connection
            .query_row(
                "SELECT sku, title FROM products \
                 WHERE reference_id = 'pokemon-sv2-fr-203'",
                [],
                |row| Ok((row.get(0)?, row.get(1)?)),
            )
            .expect("corrected normalized product");
        assert_eq!(
            corrected_product,
            ("MEW-006-FR".into(), "Dracaufeu ex".into())
        );
    }
}
