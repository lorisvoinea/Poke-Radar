use std::{fs, path::PathBuf};

use tauri::Manager;

use crate::app::bootstrap::{run_boot_sequence, BootState};

/// `pub` expose la fonction hors du module, ici pour que Tauri puisse l'appeler.
/// `fn` déclare une fonction nommée `app_ready`.
/// `<R: tauri::Runtime>` est un "générique": `R` peut être n'importe quel runtime Tauri
/// tant qu'il respecte (`:`) le trait `Runtime`.
/// `-> Result<&'static str, String>` signifie:
/// - `Ok(&'static str)` en cas de succès (une chaîne statique en mémoire),
/// - `Err(String)` en cas d'échec (message d'erreur lisible par l'UI).
///
/// En pratique, cette commande déclenche un boot minimal et ne renvoie "application prête"
/// que si la base locale est disponible et migrée.
#[tauri::command]
pub fn app_ready<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<&'static str, String> {
    // `let` crée une variable immuable; `?` propage immédiatement une erreur éventuelle.
    let database_path = default_database_path(&app_handle)?;

    // `match` compare une valeur à plusieurs cas possibles (comme un switch plus sûr).
    // Chaque "branche" doit retourner un type compatible, ici `Result<_, _>`.
    match run_boot_sequence(&database_path) {
        BootState::Ready => Ok("application prête"),
        BootState::Blocked(message) => Err(message),
    }
}

/// `fn default_database_path` calcule le chemin de la base SQLite.
/// Le paramètre `&tauri::AppHandle<R>` est une référence empruntée (`&`): on lit
/// l'état de l'application sans en prendre possession.
///
/// On évite `current_dir()` car il varie selon le mode de lancement
/// (double-clic, terminal, service) et n'est pas toujours inscriptible.
fn default_database_path<R: tauri::Runtime>(
    app_handle: &tauri::AppHandle<R>,
) -> Result<PathBuf, String> {
    // `map_err` transforme l'erreur technique en message métier compréhensible.
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|error| format!("Impossible de résoudre le dossier applicatif: {error}"))?;

    // `create_dir_all` crée le dossier (et ses parents) seulement si nécessaire.
    // Le bloc `|error| { ... }` est une closure (fonction anonyme) passée à `map_err`.
    fs::create_dir_all(&app_data_dir).map_err(|error| {
        format!(
            "Impossible de créer le dossier de données local ({}): {error}",
            app_data_dir.display()
        )
    })?;

    // `PathBuf::join` concatène proprement les segments de chemin, selon l'OS.
    Ok(app_data_dir.join("poke-radar.db"))
}
