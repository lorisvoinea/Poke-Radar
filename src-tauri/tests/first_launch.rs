use tempfile::tempdir;

use poke_radar_tauri::infrastructure::db::initialize_database;

/// Test d'intégration: valide le scénario "premier lancement".
#[test]
fn first_launch_creates_db_and_applies_migration() {
    // `tempdir()` crée un dossier temporaire supprimé automatiquement en fin de test.
    let directory = tempdir().expect("tempdir");
    let database_path = directory.path().join("integration.db");

    // Pré-condition: la DB n'existe pas encore.
    assert!(!database_path.exists());

    // Action: initialiser la DB (création fichier + migrations).
    initialize_database(&database_path).expect("db init should succeed");

    // Post-condition 1: le fichier SQLite a bien été créé.
    assert!(database_path.exists());

    // Post-condition 2: la table `products` provenant de la migration existe.
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
