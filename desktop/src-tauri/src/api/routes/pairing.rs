use axum::{extract::State, Json};
use local_ip_address::local_ip;
use serde::Serialize;
use uuid::Uuid;

use crate::core::pairing::service::PairingService;

#[derive(Serialize)]
pub struct PairingPayload {
    pub r#type: String,
    pub version: u8,
    pub host: String,
    pub port: u16,
    pub token: String,
}

pub async fn create_session(
    State(pairing): State<PairingService>,
) -> Json<PairingPayload> {
    let host = local_ip()
        .map(|ip| ip.to_string())
        .unwrap_or_else(|_| "127.0.0.1".to_string());

    let token = pairing.create_session().await;

    Json(PairingPayload {
        r#type: "epikodi_pairing".into(),
        version: 1,
        host,
        port: 4242,
        token,
    })
}

#[derive(serde::Deserialize)]
pub struct ConfirmRequest {
    pub token: String,
}

#[derive(Serialize)]
pub struct ConfirmResponse {
    pub success: bool,
    pub access_token: String,
}

pub async fn confirm_session(
    State(pairing): State<PairingService>,
    Json(body): Json<ConfirmRequest>,
) -> Result<Json<ConfirmResponse>, axum::http::StatusCode> {
    if !pairing.validate_session(&body.token).await {
        return Err(axum::http::StatusCode::UNAUTHORIZED);
    }

    Ok(Json(ConfirmResponse {
        success: true,
        access_token: Uuid::new_v4().to_string(),
    }))
}