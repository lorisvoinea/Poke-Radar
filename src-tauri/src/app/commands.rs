use std::{fs, path::PathBuf};

use serde::{Deserialize, Serialize};
use tauri::Manager;

use crate::{
    app::bootstrap::{run_boot_sequence, BootState},
    domain::{
        models::{NewMonitorProfile, UpdateMonitorProfile},
        services::{validate_new_profile, validate_update_profile},
    },
    infrastructure::db::{
        open_connection,
        repositories::{
            create_monitor_profile, create_product, delete_monitor_profile, list_monitor_profiles,
            list_products, update_monitor_profile,
        },
    },
};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateProductInput {
    pub sku: String,
    pub title: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProductDto {
    pub id: i64,
    pub sku: String,
    pub title: String,
    pub created_at_utc: String,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateMonitorProfileInput {
    pub name: String,
    pub min_margin_bps: i64,
    pub fixed_cost_cents: i64,
    pub variable_fee_bps: i64,
    pub product_ids: Vec<i64>,
    pub make_active: bool,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateMonitorProfileInput {
    pub id: i64,
    pub name: String,
    pub min_margin_bps: i64,
    pub fixed_cost_cents: i64,
    pub variable_fee_bps: i64,
    pub product_ids: Vec<i64>,
    pub make_active: bool,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitorProfileDto {
    pub id: i64,
    pub name: String,
    pub min_margin_bps: i64,
    pub fixed_cost_cents: i64,
    pub variable_fee_bps: i64,
    pub is_active: bool,
    pub product_ids: Vec<i64>,
    pub created_at_utc: String,
    pub updated_at_utc: String,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MonitoringCycleStubResult {
    pub active_profile: Option<MonitorProfileDto>,
    pub message: String,
}

#[tauri::command]
pub fn app_ready<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<&'static str, String> {
    let database_path = default_database_path(&app_handle)?;

    match run_boot_sequence(&database_path) {
        BootState::Ready => Ok("application prête"),
        BootState::Blocked(message) => Err(message),
    }
}

#[tauri::command]
pub fn create_product_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
    input: CreateProductInput,
) -> Result<ProductDto, String> {
    if input.sku.trim().is_empty() || input.title.trim().is_empty() {
        return Err("Les champs `sku` et `title` sont obligatoires.".to_string());
    }

    let db_path = default_database_path(&app_handle)?;
    let connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    let product = create_product(&connection, &input.sku, &input.title)
        .map_err(|error| format!("Impossible de créer le produit: {error}"))?;

    Ok(ProductDto {
        id: product.id,
        sku: product.sku,
        title: product.title,
        created_at_utc: product.created_at_utc,
    })
}

#[tauri::command]
pub fn list_products_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<Vec<ProductDto>, String> {
    let db_path = default_database_path(&app_handle)?;
    let connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    let products = list_products(&connection)
        .map_err(|error| format!("Impossible de charger les produits: {error}"))?;

    Ok(products
        .into_iter()
        .map(|product| ProductDto {
            id: product.id,
            sku: product.sku,
            title: product.title,
            created_at_utc: product.created_at_utc,
        })
        .collect())
}

#[tauri::command]
pub fn create_monitor_profile_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
    input: CreateMonitorProfileInput,
) -> Result<MonitorProfileDto, String> {
    let payload = NewMonitorProfile {
        name: input.name,
        min_margin_bps: input.min_margin_bps,
        fixed_cost_cents: input.fixed_cost_cents,
        variable_fee_bps: input.variable_fee_bps,
        product_ids: input.product_ids,
        make_active: input.make_active,
    };

    validate_new_profile(&payload).map_err(|error| error.to_string())?;

    let db_path = default_database_path(&app_handle)?;
    let mut connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    let profile = create_monitor_profile(&mut connection, &payload)
        .map_err(|error| format!("Impossible de créer le profil: {error}"))?;

    Ok(map_profile(profile))
}

#[tauri::command]
pub fn list_monitor_profiles_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<Vec<MonitorProfileDto>, String> {
    let db_path = default_database_path(&app_handle)?;
    let connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    let profiles = list_monitor_profiles(&connection)
        .map_err(|error| format!("Impossible de charger les profils: {error}"))?;

    Ok(profiles.into_iter().map(map_profile).collect())
}

#[tauri::command]
pub fn update_monitor_profile_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
    input: UpdateMonitorProfileInput,
) -> Result<MonitorProfileDto, String> {
    let payload = UpdateMonitorProfile {
        id: input.id,
        name: input.name,
        min_margin_bps: input.min_margin_bps,
        fixed_cost_cents: input.fixed_cost_cents,
        variable_fee_bps: input.variable_fee_bps,
        product_ids: input.product_ids,
        make_active: input.make_active,
    };

    validate_update_profile(&payload).map_err(|error| error.to_string())?;

    let db_path = default_database_path(&app_handle)?;
    let mut connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    let updated = update_monitor_profile(&mut connection, &payload)
        .map_err(|error| format!("Impossible de mettre à jour le profil: {error}"))?;

    updated
        .map(map_profile)
        .ok_or_else(|| "Profil introuvable".to_string())
}

#[tauri::command]
pub fn delete_monitor_profile_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
    profile_id: i64,
) -> Result<bool, String> {
    let db_path = default_database_path(&app_handle)?;
    let connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    delete_monitor_profile(&connection, profile_id)
        .map_err(|error| format!("Impossible de supprimer le profil: {error}"))
}

#[tauri::command]
pub fn run_monitoring_cycle_stub_command<R: tauri::Runtime>(
    app_handle: tauri::AppHandle<R>,
) -> Result<MonitoringCycleStubResult, String> {
    let db_path = default_database_path(&app_handle)?;
    let connection = open_connection(&db_path).map_err(|error| error.to_string())?;
    let profiles = list_monitor_profiles(&connection)
        .map_err(|error| format!("Impossible de lire les profils: {error}"))?;

    let active_profile = profiles
        .into_iter()
        .find(|profile| profile.profile.is_active)
        .map(map_profile);

    let message = if active_profile.is_some() {
        "Cycle stub exécuté: profil actif rechargé et réutilisé automatiquement.".to_string()
    } else {
        "Cycle stub exécuté: aucun profil actif détecté, sélection explicite requise.".to_string()
    };

    Ok(MonitoringCycleStubResult {
        active_profile,
        message,
    })
}

pub(crate) fn default_database_path<R: tauri::Runtime>(
    app_handle: &tauri::AppHandle<R>,
) -> Result<PathBuf, String> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|error| format!("Impossible de résoudre le dossier applicatif: {error}"))?;

    fs::create_dir_all(&app_data_dir).map_err(|error| {
        format!(
            "Impossible de créer le dossier de données local ({}): {error}",
            app_data_dir.display()
        )
    })?;

    Ok(app_data_dir.join("poke-radar.db"))
}

fn map_profile(profile: crate::domain::models::MonitorProfileWithProducts) -> MonitorProfileDto {
    MonitorProfileDto {
        id: profile.profile.id,
        name: profile.profile.name,
        min_margin_bps: profile.profile.min_margin_bps,
        fixed_cost_cents: profile.profile.fixed_cost_cents,
        variable_fee_bps: profile.profile.variable_fee_bps,
        is_active: profile.profile.is_active,
        product_ids: profile.product_ids,
        created_at_utc: profile.profile.created_at_utc,
        updated_at_utc: profile.profile.updated_at_utc,
    }
}
