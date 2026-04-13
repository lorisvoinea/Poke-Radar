//! Point d'entrée desktop Tauri.

/// `fn main` est le point d'entrée obligatoire d'un binaire Rust.
fn main() {
    // `::` navigue dans les modules (comme un chemin de namespace).
    // `Builder::default()` construit une configuration de base du runtime Tauri.
    poke_radar_tauri::tauri_app::configure_builder(tauri::Builder::default())
        // `.run(...)` démarre réellement la boucle d'événements desktop.
        .run(tauri::generate_context!())
        // `expect(...)` arrête le programme avec un message clair si une erreur survient.
        .expect("Erreur fatale au démarrage du runtime Tauri");
}
