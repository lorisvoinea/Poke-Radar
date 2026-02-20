use std::path::PathBuf;

use crate::app::bootstrap::{run_boot_sequence, BootState};

#[tauri::command]
pub fn app_ready() -> Result<&'static str, String> {
    let database_path = default_database_path();

    match run_boot_sequence(&database_path) {
        BootState::Ready => Ok("application prête"),
        BootState::Blocked(message) => Err(message),
    }
}

fn default_database_path() -> PathBuf {
    std::env::current_dir()
        .unwrap_or_else(|_| PathBuf::from("."))
        .join("poke-radar.db")
}
