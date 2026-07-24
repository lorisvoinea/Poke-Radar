use tempfile::tempdir;

use poke_radar_tauri::{
    domain::models::{NewMonitorProfile, NewProduct},
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
    let product = create_product(
        &mut first_connection,
        &NewProduct::FreeText {
            sku: "PS5-DISC".into(),
            title: "Console PS5".into(),
        },
    )
    .expect("create product");

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

// ============================================================
// ATDD Extension — Story 1.2 AC2: persistence after modification + DB resilience
// ============================================================

use poke_radar_tauri::domain::models::UpdateMonitorProfile;
use poke_radar_tauri::infrastructure::db::repositories::update_monitor_profile;

// S4 (P1): Modified profile survives restart
#[test]
fn modified_profile_survives_restart_simulation() {
    let dir = tempdir().expect("tempdir");
    let db_path = dir.path().join("modified-restart.db");

    initialize_database(&db_path).expect("init database");

    // Phase 1: create product + profile
    let mut first_connection = open_connection(&db_path).expect("first connection");
    let product = create_product(
        &mut first_connection,
        &NewProduct::FreeText {
            sku: "MOD-SKU".into(),
            title: "Produit modifiable".into(),
        },
    )
    .expect("create product");

    let profile = create_monitor_profile(
        &mut first_connection,
        &NewMonitorProfile {
            name: "Profil original".to_string(),
            min_margin_bps: 1500,
            fixed_cost_cents: 200,
            variable_fee_bps: 500,
            product_ids: vec![product.id],
            make_active: true,
        },
    )
    .expect("create profile");

    // Phase 2: modify profile
    update_monitor_profile(
        &mut first_connection,
        &UpdateMonitorProfile {
            id: profile.profile.id,
            name: "Profil modifié".to_string(),
            min_margin_bps: 2500,
            fixed_cost_cents: 350,
            variable_fee_bps: 700,
            product_ids: vec![product.id],
            make_active: true,
        },
    )
    .expect("update profile");

    drop(first_connection);

    // Phase 3: restart — reload and verify modifications persisted
    let second_connection = open_connection(&db_path).expect("second connection");
    let profiles = list_monitor_profiles(&second_connection).expect("list profiles");

    assert_eq!(profiles.len(), 1, "a single profile must survive restart");
    assert_eq!(profiles[0].profile.name, "Profil modifié");
    assert_eq!(profiles[0].profile.min_margin_bps, 2500);
    assert_eq!(profiles[0].profile.fixed_cost_cents, 350);
    assert_eq!(profiles[0].profile.variable_fee_bps, 700);
    assert!(profiles[0].profile.is_active);
    assert_eq!(profiles[0].product_ids, vec![product.id]);
}

// S5 (P2): Resilient startup when database file is absent
#[test]
fn fresh_start_without_database_initializes_clean_state() {
    let dir = tempdir().expect("tempdir");
    let db_path = dir.path().join("missing.db");

    // Pre-condition: DB does not exist
    assert!(!db_path.exists());

    // Action: initialize as if first launch
    initialize_database(&db_path).expect("init should succeed from nothing");

    // Post-condition: DB exists with expected tables
    assert!(db_path.exists());
    let connection = open_connection(&db_path).expect("open after init");

    // Verify schema is complete (all three migrations)
    let tables: Vec<String> = {
        let mut stmt = connection
            .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
            .expect("table query");
        let rows = stmt
            .query_map([], |row| row.get(0))
            .expect("query tables");
        rows.filter_map(|r| r.ok()).collect()
    };

    assert!(tables.contains(&"products".to_string()), "products table must exist");
    assert!(tables.contains(&"product_references".to_string()), "references table must exist");
    assert!(tables.contains(&"monitor_profiles".to_string()), "profiles table must exist");
    assert!(tables.contains(&"profile_products".to_string()), "profile_products table must exist");

    // Verify clean state: no profiles, no user-created products
    let profiles = list_monitor_profiles(&connection).expect("list profiles");
    assert!(profiles.is_empty(), "fresh DB must have zero profiles");
}
