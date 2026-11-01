use axum::{
    routing::get,
    Router,
    routing::post,
};
use axum::http::{header, Method};

use tokio::net::TcpListener;
use crate::core::pairing::service::PairingService;
use tower_http::cors::CorsLayer;

pub async fn start_server() -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let pairing = PairingService::new();

    let cors = CorsLayer::new()
        .allow_origin("http://localhost:1420".parse::<axum::http::HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE]);

    let app = Router::new()
        .route("/api/v1/health", get(super::routes::health::health))
        .route("/api/v1/pairing/session", post(super::routes::pairing::create_session))
        .route("/api/v1/pairing/confirm", post(super::routes::pairing::confirm_session))
        .layer(cors)
        .with_state(pairing);

    let listener = TcpListener::bind("0.0.0.0:4242").await?;

    println!("EpiKodi HTTP server listening on port 4242");

    axum::serve(listener, app).await?;

    Ok(())
}