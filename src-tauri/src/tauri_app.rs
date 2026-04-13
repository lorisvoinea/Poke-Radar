pub fn configure_builder<R: tauri::Runtime>(builder: tauri::Builder<R>) -> tauri::Builder<R> {
    builder.invoke_handler(tauri::generate_handler![
        crate::app::commands::app_ready,
        crate::app::commands::create_product_command,
        crate::app::commands::list_products_command,
        crate::app::commands::create_monitor_profile_command,
        crate::app::commands::list_monitor_profiles_command,
        crate::app::commands::update_monitor_profile_command,
        crate::app::commands::delete_monitor_profile_command,
        crate::app::commands::run_monitoring_cycle_stub_command
    ])
}
