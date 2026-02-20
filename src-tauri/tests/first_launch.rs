use tempfile::tempdir;

use poke_radar_tauri::infrastructure::db::initialize_database;

#[test]
fn first_launch_creates_db_and_applies_migration() {
    let directory = tempdir().expect("tempdir");
    let database_path = directory.path().join("integration.db");

    assert!(!database_path.exists());

    initialize_database(&database_path).expect("db init should succeed");

    assert!(database_path.exists());

    let connection = rusqlite::Connection::open(&database_path).expect("open db");
    let table_exists: i64 = connection
        .query_row(
            "SELECT EXISTS(SELECT 1 FROM sqlite_master WHERE type='table' AND name='products')",
            [],
            |row| row.get(0),
        )
        .expect("table lookup");

    assert_eq!(table_exists, 1);
}
