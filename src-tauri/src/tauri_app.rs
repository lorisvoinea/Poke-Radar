/// Applique la configuration runtime Tauri commune à l'application.
///
/// Le but principal est d'enregistrer explicitement les commandes IPC exposées
/// au frontend afin de rendre l'intégration UI ↔ backend réellement exécutable.
pub fn configure_builder<R: tauri::Runtime>(builder: tauri::Builder<R>) -> tauri::Builder<R> {
    builder.invoke_handler(tauri::generate_handler![crate::app::commands::app_ready])
}
