use axum::Json;
use serde::Serialize;

#[derive(Serialize)]
pub struct HealthResponse {
    status: String,
    name: String,
    version: String,
}

pub async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".into(),
        name: "EpiKodi".into(),
        version: env!("CARGO_PKG_VERSION").into(),
    })
}