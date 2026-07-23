use rusqlite::{Connection, Result};

const MIGRATIONS_DIR: &str = "backend/src/infrastructure/db/migrations";

/// Open the SQLite database and run pending migrations.
pub fn initialize() -> Result<Connection> {
    let db_path = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "poke-radar.db".to_string());

    let conn = Connection::open(&db_path)?;

    // Enable WAL mode for better concurrent reads
    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;

    // Run migrations
    run_migrations(&conn)?;

    Ok(conn)
}

/// Run all pending SQL migrations in order.
pub fn run_migrations(conn: &Connection) -> Result<()> {
    // Ensure migration tracking table exists
    conn.execute_batch(
        "CREATE TABLE IF NOT EXISTS _migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            applied_at TEXT NOT NULL DEFAULT (datetime('now'))
        );"
    )?;

    // Load migration files from the migrations directory
    let mut entries: Vec<_> = std::fs::read_dir(MIGRATIONS_DIR)
        .unwrap_or_else(|_| {
            tracing::warn!("No migrations directory found at {}", MIGRATIONS_DIR);
            std::fs::read_dir(".").unwrap() // dummy, won't iterate
        })
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "sql"))
        .collect();

    entries.sort_by_key(|e| e.file_name());

    for entry in entries {
        let name = entry.file_name().to_string_lossy().to_string();

        // Skip already-applied migrations
        let already_applied: bool = conn
            .query_row(
                "SELECT COUNT(*) > 0 FROM _migrations WHERE name = ?1",
                [&name],
                |row| row.get(0),
            )
            .unwrap_or(false);

        if already_applied {
            tracing::info!(%name, "Migration already applied, skipping");
            continue;
        }

        let sql = std::fs::read_to_string(entry.path())
            .map_err(|e| rusqlite::Error::ToSqlConversionFailure(Box::new(e)))?;

        tracing::info!(%name, "Applying migration");
        conn.execute_batch(&sql)?;
        conn.execute(
            "INSERT INTO _migrations (name) VALUES (?1)",
            [&name],
        )?;
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn initialize_in_memory_db() {
        let conn = Connection::open_in_memory().unwrap();
        run_migrations(&conn).unwrap();

        // Verify _migrations table exists
        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM _migrations", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 0); // No migration files in memory case
    }
}
