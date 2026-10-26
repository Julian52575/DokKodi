# DokKodi desktop

Tauri 2 app: React + Vite + Tailwind frontend in `src/`, Rust backend in
`src-tauri/`. From the repo root, in the Nix shell:

```bash
just desktop-dev     # run with hot reload
just desktop-build   # build the installers
just desktop-check   # lint, type-check, cargo fmt/clippy/test
```

Recommended editor setup: [VS Code](https://code.visualstudio.com/) +
[Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) +
[rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).
