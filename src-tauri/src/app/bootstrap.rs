use std::path::Path;

use log::info;

use crate::infrastructure::db::{initialize_database, DbError};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BootState {
    Ready,
    Blocked(String),
}

pub fn run_boot_sequence(db_path: &Path) -> BootState {
    info!("Boot app: démarrage de l'initialisation");

    match initialize_database(db_path) {
        Ok(()) => {
            info!("Boot app: ouverture DB et migrations réussies");
            BootState::Ready
        }
        Err(error) => {
            info!("Boot app: échec d'initialisation critique: {error}");
            BootState::Blocked(actionable_error_message(error))
        }
    }
}

fn actionable_error_message(error: DbError) -> String {
    format!(
        "Initialisation impossible. Vérifiez les permissions du dossier de données, puis relancez l'application. Détail: {error}"
    )
}
