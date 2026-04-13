/// `pub mod` rend le module public pour qu'il soit utilisable hors de ce fichier.
/// Couche application (orchestration de boot et commandes exposées à l'UI).
pub mod app;

/// Couche infrastructure (persistance locale SQLite, migrations, etc.).
pub mod infrastructure;

/// Configuration du runtime Tauri (enregistrement des commandes IPC).
pub mod tauri_app;
