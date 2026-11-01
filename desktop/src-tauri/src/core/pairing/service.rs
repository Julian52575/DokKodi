use std::{
    collections::HashMap,
    sync::Arc,
    time::Duration,
};

use tokio::{
    sync::Mutex,
    time::Instant,
};

use uuid::Uuid;

#[derive(Clone)]
pub struct PairingService {
    sessions: Arc<Mutex<HashMap<String, Instant>>>,
}

impl PairingService {
    pub fn new() -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub async fn create_session(&self) -> String {
        let token = Uuid::new_v4().to_string();

        self.sessions
            .lock()
            .await
            .insert(token.clone(), Instant::now() + Duration::from_secs(120));

        token
    }

    pub async fn validate_session(&self, token: &str) -> bool {
        let mut sessions = self.sessions.lock().await;

        match sessions.remove(token) {
            Some(expiration) => expiration > Instant::now(),
            None => false,
        }
    }
}