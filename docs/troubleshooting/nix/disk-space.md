# Disk fills up: WSL crashes with little free space

**Error:** WSL crashes or freezes while building; the Windows drive has only a
few GB free even though `df` inside WSL reports hundreds of GB.

**Occurrences:** 2026-10-26 (WSL2, Ubuntu 24.04).

**Cause:** WSL's virtual disk (`ext4.vhdx`) only grows, so the Windows drive
fills up while `df` in WSL still shows the virtual 1 TB. The project adds
about 10 GB for desktop work and about 20 GB with the Android build:

| Item | Size |
| ---- | ---- |
| `desktop/src-tauri/target` (debug build, `line-tables-only`) | ~1.7 GB |
| `desktop/node_modules`, `mobile/node_modules` | ~0.75 GB |
| Nix tools (Rust, JDK, Node, WebKit/GTK libraries) | ~4 GB |
| Android SDK, Gradle caches, NDK, `mobile/android` | 6–9 GB |
| Android emulator and system image | 3–5 GB |

**Solution:**

- Desktop-only work: set `ANDROID_SDK_INSTALL=0` in `.env`.
- `cargo clean` in `desktop/src-tauri` drops the build output.
- Free the Nix store with `nix-collect-garbage`; see
  [Storage optimization](https://wiki.nixos.org/wiki/Storage_optimization)
  (automatic garbage collection, `nix-store --optimise`, `nix-collect-garbage -d`).
  Paths that no GC root points to are deleted and downloaded again on the
  next `nix develop`.
- Give the space back to Windows, from PowerShell, after deleting files:

  ```powershell
  wsl --shutdown
  wsl --manage <distro> --set-sparse true
  ```
