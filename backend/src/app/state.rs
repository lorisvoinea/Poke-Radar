use rusqlite::Connection;
use std::sync::Mutex;

/// Shared application state passed to all Axum handlers.
pub struct AppState {
    pub db: Mutex<Connection>,
}
