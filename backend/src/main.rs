use axum::{Router, routing::get, Json};
use serde::Serialize;
use std::sync::{Arc, Mutex};
use tracing::info;

mod app;
mod infrastructure;

use app::state::AppState;
use infrastructure::db;

#[derive(Serialize, serde::Deserialize)]
struct HealthResponse {
    ok: bool,
    db: String,
    version: String,
}

async fn health_check(state: axum::extract::State<Arc<AppState>>) -> Json<HealthResponse> {
    let db_status = match state.db.lock() {
        Ok(conn) => match conn.execute_batch("SELECT 1") {
            Ok(_) => "ok",
            Err(e) => {
                tracing::error!(%e, "DB health check failed");
                "error"
            }
        },
        Err(e) => {
            tracing::error!(%e, "DB lock poisoned");
            "error"
        }
    };

    Json(HealthResponse {
        ok: true,
        db: db_status.to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

#[tokio::main]
async fn main() {
    // Init logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info".into()),
        )
        .init();

    info!("Poke-Radar backend starting...");

    // Init database
    let db_conn = db::initialize().expect("Failed to initialize database");
    info!("Database initialized successfully");

    // Build app state
    let state = Arc::new(AppState {
        db: Mutex::new(db_conn),
    });

    // Build router
    let app = Router::new()
        .route("/api/health", get(health_check))
        .with_state(state);

    // Serve frontend static files in production
    #[cfg(not(debug_assertions))]
    let app = {
        use tower_http::services::ServeDir;
        app.fallback_service(ServeDir::new("frontend/dist"))
    };

    // Bind and serve
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    info!("Server listening on 0.0.0.0:3000");

    axum::serve(listener, app).await.unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::StatusCode;
    use axum::body::Body;
    use tower::ServiceExt;
    use http_body_util::BodyExt;

    fn test_app() -> Router {
        use rusqlite::Connection;
        let conn = Connection::open_in_memory().unwrap();
        infrastructure::db::run_migrations(&conn).unwrap();
        let state = Arc::new(AppState {
            db: Mutex::new(conn),
        });
        Router::new()
            .route("/api/health", get(health_check))
            .with_state(state)
    }

    #[tokio::test]
    async fn health_check_returns_ok() {
        let app = test_app();
        let response = app
            .oneshot(
                axum::http::Request::builder()
                    .uri("/api/health")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body = response.into_body().collect().await.unwrap().to_bytes();
        let health: HealthResponse = serde_json::from_slice(&body).unwrap();
        assert!(health.ok);
        assert_eq!(health.db, "ok");
    }
}
