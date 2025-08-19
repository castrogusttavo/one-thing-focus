use tauri::Manager;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{LogicalSize, Size};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // Configure o tamanho da janela principal
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_size(Size::Logical(LogicalSize {
                    width: 1024.0,
                    height: 720.0,
                }));
                let _ = window.center();
            }

            let handle = app.handle();

            let show = MenuItem::with_id(handle, "show", "Show", true, None::<&str>)?;
            let hide = MenuItem::with_id(handle, "hide", "Hide", true, None::<&str>)?;
            let quit = MenuItem::with_id(handle, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(handle, &[&show, &hide, &quit])?;

            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .tooltip("one-thing-focus")
                .on_menu_event(move |app, event| {
                    if let Some(window) = app.get_webview_window("main") {
                        match event.id().as_ref() {
                            "quit" => {
                                app.exit(0);
                            }
                            "hide" => {
                                let _ = window.hide();
                            }
                            "show" => {
                                let _ = window.show();
                            }
                            _ => {}
                        }
                    }
                })
                .build(app)?;

            Ok(())
        });

    builder
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| {
            if let tauri::RunEvent::ExitRequested { .. } = event {
                // Exit requested, app will shutdown
            }
        });
}