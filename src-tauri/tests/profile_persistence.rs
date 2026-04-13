use tempfile::tempdir;

use poke_radar_tauri::{
    domain::models::NewMonitorProfile,
    infrastructure::db::{
        initialize_database, open_connection,
        repositories::{create_monitor_profile, create_product, list_monitor_profiles},
    },
};

#[test]
fn profile_roundtrip_survives_restart_simulation() {
    let dir = tempdir().expect("tempdir");
    let db_path = dir.path().join("roundtrip.db");

    initialize_database(&db_path).expect("init database");

    let mut first_connection = open_connection(&db_path).expect("first connection");
    let product =
        create_product(&first_connection, "PS5-DISC", "Console PS5").expect("create product");

    create_monitor_profile(
        &mut first_connection,
        &NewMonitorProfile {
            name: "Profil actif".to_string(),
            min_margin_bps: 1800,
            fixed_cost_cents: 250,
            variable_fee_bps: 600,
            product_ids: vec![product.id],
            make_active: true,
        },
    )
    .expect("create profile");

    drop(first_connection);

    let second_connection = open_connection(&db_path).expect("second connection");
    let profiles = list_monitor_profiles(&second_connection).expect("list profiles");

    assert_eq!(profiles.len(), 1);
    assert_eq!(profiles[0].profile.name, "Profil actif");
    assert!(profiles[0].profile.is_active);
    assert_eq!(profiles[0].product_ids, vec![product.id]);
}
