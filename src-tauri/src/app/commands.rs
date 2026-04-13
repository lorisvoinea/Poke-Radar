use std::{fs, path::PathBuf};

use crate::app::bootstrap::{run_boot_sequence, BootState};

/// Commande Tauri appelée par l'UI pour vérifier que le backend est prêt.
///
/// Cette commande réalise un boot minimal et renvoie un message succès
/// seulement quand la base locale est correctement initialisée.
#[tauri::command]
pub fn app_ready(app_handle: tauri::AppHandle) -> Result<&'static str, String> {
    // On résout d'abord un chemin de base de données sûr pour un contexte desktop.
    let database_path = default_database_path(&app_handle)?;

    // On exécute la séquence de boot applicative (ouverture DB + migrations).
    match run_boot_sequence(&database_path) {
        BootState::Ready => Ok("application prête"),
        BootState::Blocked(message) => Err(message),
    }
}

/// Construit le chemin de la base SQLite dans le répertoire applicatif Tauri.
///
/// On évite volontairement `current_dir()` car il dépend du contexte de lancement
/// (double-clic, service, terminal, etc.) et peut ne pas être accessible en écriture.
fn default_database_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    // `app_data_dir` est le dossier persistant recommandé pour une app desktop.
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|error| format!("Impossible de résoudre le dossier applicatif: {error}"))?;

    // On crée explicitement le dossier si nécessaire pour sécuriser le premier lancement.
    fs::create_dir_all(&app_data_dir).map_err(|error| {
        format!(
            "Impossible de créer le dossier de données local ({}): {error}",
            app_data_dir.display()
        )
    })?;

    // Le nom du fichier reste stable pour garantir la continuité de la persistance locale.
    Ok(app_data_dir.join("poke-radar.db"))
}
