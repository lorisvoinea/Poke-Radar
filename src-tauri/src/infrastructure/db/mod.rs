use std::path::Path;

use log::info;
use rusqlite::{Connection, Error as SqlError};
use thiserror::Error;

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
];

pub fn initialize_database(path: &Path) -> Result<(), DbError> {
    info!("Ouverture DB locale: {}", path.display());
    let mut connection = open_connection(path)?;

    info!("Exécution des migrations versionnées");
    apply_migrations(&mut connection, MIGRATIONS)
}

pub fn open_connection(path: &Path) -> Result<Connection, DbError> {
    Connection::open(path).map_err(DbError::Open)
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

    let transaction = connection.transaction().map_err(|source| DbError::Migration {
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

    use super::{apply_migrations, initialize_database, open_connection, DbError, Migration, MIGRATIONS};

    #[test]
    fn migrations_successfully_apply() {
        let directory = tempdir().expect("tempdir");
        let database_path = directory.path().join("app.db");

        initialize_database(&database_path).expect("database should initialize");

        let connection = Connection::open(database_path).expect("open db");
        let count: i64 = connection
            .query_row("SELECT COUNT(*) FROM schema_migrations", [], |row| row.get(0))
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

        let mut blocked_connection = Connection::open_with_flags(
            &database_path,
            OpenFlags::SQLITE_OPEN_READ_WRITE,
        )
        .expect("open second connection");

        let result = apply_migrations(
            &mut blocked_connection,
            &[Migration {
                version: 2,
                name: "002_locked_test",
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
}
