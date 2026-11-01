mod api;
mod core;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|_app| {
            tauri::async_runtime::spawn(async move {
                if let Err(e) = api::server::start_server().await {
                    eprintln!("Failed to start server: {}", e);
                }
            });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::greet;

    #[test]
    fn greet_names_the_caller() {
        assert_eq!(greet("Ada"), "Hello, Ada! You've been greeted from Rust!");
    }

    #[test]
    fn greet_accepts_an_empty_name() {
        assert_eq!(greet(""), "Hello, ! You've been greeted from Rust!");
    }
}
