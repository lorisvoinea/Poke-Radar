//! Point d'entrée desktop Tauri.

fn main() {
    poke_radar_tauri::tauri_app::configure_builder(tauri::Builder::default())
        .run(tauri::generate_context!())
        .expect("Erreur fatale au démarrage du runtime Tauri");
}
