{
  description = "DokKodi dev environment: Nix + Just, Tauri desktop app and Expo Android app";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
  # Newest prebuilt packages, for the tools with no official binary release
  # (see nix/openssl.nix, nix/curl.nix).
  inputs.nixpkgs-unstable.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = { self, nixpkgs, nixpkgs-unstable }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems (system:
          f nixpkgs.legacyPackages.${system}
            # unstable no longer supports Intel Macs; nix/ falls back to stable there
            (if system == "x86_64-darwin" then null else nixpkgs-unstable.legacyPackages.${system}));
    in
    {
      devShells = forAllSystems (pkgs: unstable: {
        default = pkgs.mkShell {
          # Pinned tools first, so they win on PATH over any nixpkgs copy.
          packages = import ./nix/tools.nix { inherit pkgs unstable; } ++ (with pkgs; [
            pkg-config
          ] ++ lib.optionals stdenv.isLinux [
            # Tauri's Linux system libraries: upstream ships no binaries
            webkitgtk_4_1
            gtk3
            libsoup_3
            librsvg
            glib
            openssl
          ]);

          # The Tauri binary links GTK and WebKit dynamically; point the loader
          # at them so `cargo run` works on hosts that are not NixOS.
          LD_LIBRARY_PATH = pkgs.lib.optionalString pkgs.stdenv.isLinux
            (pkgs.lib.makeLibraryPath (with pkgs; [
              webkitgtk_4_1 gtk3 libsoup_3 librsvg glib openssl
              cairo pango gdk-pixbuf harfbuzz atk dbus
            ]));

          shellHook = ''
            # --- .env ----------------------------------------------------
            if [ ! -e .env ] && [ -f .env.example ]; then
              cp .env.example .env && echo "env: created .env from .env.example"
            fi
            # Carry over variables added to .env.example since .env was made.
            if [ -f .env ] && [ -f .env.example ]; then
              for key in $(sed -nE 's/^([A-Za-z_][A-Za-z0-9_]*)=.*/\1/p' .env.example); do
                if ! grep -qE "^$key=" .env; then
                  grep -E "^$key=" .env.example >> .env
                  echo "env: added $key from .env.example"
                fi
              done
            fi
            # Any value starting with `change-me-` is a placeholder secret:
            # replace it once, so re-entering the shell never rotates it.
            if [ -f .env ] && command -v openssl >/dev/null 2>&1; then
              for key in $(sed -nE 's/^([A-Za-z_][A-Za-z0-9_]*)="?change-me-.*/\1/p' .env); do
                # -i.bak: works with both GNU and BSD (macOS) sed
                sed -i.bak "s|^$key=.*|$key=$(openssl rand -hex 32)|" .env && rm -f .env.bak
                echo "env: generated $key (openssl rand -hex 32)"
              done
            fi
            if [ -f .env ]; then
              set -a
              . ./.env
              set +a
            fi

            # --- Android SDK ---------------------------------------------
            # Installed outside the Nix store (it is large) on the first
            # interactive entry, once you have accepted Google's licences;
            # skipped when present. Set ANDROID_SDK_INSTALL=0 in .env to opt out.
            : "''${ANDROID_HOME:=$HOME/Android/Sdk}"
            export ANDROID_HOME
            export PATH="$ANDROID_HOME/platform-tools:$PATH"
            if [ ! -d "$ANDROID_HOME/platform-tools" ] && [ "''${ANDROID_SDK_INSTALL:-1}" != 0 ]; then
              if [ -t 0 ] && [ -t 1 ]; then
                echo "android: no SDK at $ANDROID_HOME -- installing it (Ctrl-C to skip)"
                mkdir -p "$ANDROID_HOME"
                # Prompts for each licence and waits for your answer.
                sdkmanager --sdk_root="$ANDROID_HOME" --licenses \
                  && sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools" \
                  || echo "android: SDK install did not finish; re-enter the shell to retry" >&2
              else
                echo "android: no SDK at $ANDROID_HOME -- enter 'nix develop' in a terminal to install it" >&2
              fi
            fi

            # --- disk usage ----------------------------------------------
            # The store grows unbounded: warn past 10 GiB.
            nix_kb=$(du -sk /nix/store 2>/dev/null | cut -f1)
            if [ "''${nix_kb:-0}" -ge 10485760 ] 2>/dev/null; then
              echo "nix: warning -- /nix/store is $((nix_kb / 1048576)) GiB; reclaim with 'nix-collect-garbage -d'" >&2
            fi

            # --- Conventional Commits hook ------------------------------
            # Point git at the in-repo hooks so `.githooks/commit-msg` runs
            # (git's default .git/hooks/ is not version-controlled); it execs
            # `.githooks/check-conventional-commit-msg`. Local feedback only --
            # the enforced gate is the PR-title check in
            # .github/workflows/check-conventional-commit-pr-title.yml.
            if git rev-parse --is-inside-work-tree >/dev/null 2>&1 \
               && [ "$(git config --local core.hooksPath 2>/dev/null || true)" != ".githooks" ]; then
              git config --local core.hooksPath .githooks
              echo "git: commit-msg hook enabled (.githooks -- Conventional Commits)"
            fi

            echo "dev shell ready -- run 'just' to see available commands. Using node $(node --version), $(rustc --version)" | lolcat
          '';
        };
      });
    };
}
