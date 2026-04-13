use std::path::Path;

use log::info;

use crate::infrastructure::db::{initialize_database, DbError};

/// `enum` définit un type somme: une valeur est soit `Ready`, soit `Blocked(String)`.
/// C'est pratique pour modéliser explicitement les états possibles d'un boot.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BootState {
    Ready,
    Blocked(String),
}

/// Lance la séquence d'initialisation et convertit les erreurs DB en état lisible.
pub fn run_boot_sequence(db_path: &Path) -> BootState {
    info!("Boot app: démarrage de l'initialisation");

    // `match` force à traiter tous les cas (`Ok` et `Err`), ce qui évite les oublis.
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

/// Transforme une erreur technique (`DbError`) en consigne actionnable pour l'utilisateur.
fn actionable_error_message(error: DbError) -> String {
    format!(
        "Initialisation impossible. Vérifiez les permissions du dossier de données, puis relancez l'application. Détail: {error}"
    )
}
