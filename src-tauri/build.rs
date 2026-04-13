/// `build.rs` est exécuté à la compilation (build script Cargo), pas au runtime.
fn main() {
    // Prépare les métadonnées/ressources requises par Tauri pendant le build.
    tauri_build::build()
}
