set dotenv-load := true
set shell := ["bash", "-eu", "-c"]

# List available recipes
default:
    @just --list

#### Setup

# Install the dependencies of both apps from their lockfiles
install:
    cd desktop && npm ci
    cd mobile && npm ci

# (internal) install each app's dependencies when node_modules is missing
_deps:
    [ -d desktop/node_modules ] || (cd desktop && npm ci)
    [ -d mobile/node_modules ] || (cd mobile && npm ci)

#### Run

# Run both apps: the desktop window and the Expo dev server (Ctrl-C stops both)
[parallel]
dev: desktop-dev mobile-start

#### Desktop (Tauri)

# Run the desktop app with hot reload
desktop-dev: _deps
    cd desktop && npm run tauri dev

# Build the desktop installers into desktop/src-tauri/target/release/bundle
desktop-build:
    cd desktop && npm run tauri build

# Lint, test (with coverage) and build the desktop app, then fmt, clippy and test the Rust crate
desktop-check:
    cd desktop && npm run lint && npm test && npm run build
    cd desktop/src-tauri && cargo fmt --check && cargo clippy --all-targets -- -D warnings && cargo test

#### Mobile (Expo, Android)

# Start the Expo dev server
mobile-start: _deps
    cd mobile && npm run start

# Build and run the app on a connected device or emulator
mobile-android: _deps
    cd mobile && npm run android

# Generate the native Android project in mobile/android (git-ignored)
mobile-prebuild: _deps
    cd mobile && npx expo prebuild --platform android

# Build a release APK for one CPU architecture (a local build is ~4x cheaper than CI's universal APK)
mobile-apk abi="arm64-v8a": mobile-prebuild
    cd mobile/android && ./gradlew assembleRelease --no-daemon --console=plain -x lint -PreactNativeArchitectures={{abi}}

# Lint, type-check and test (with coverage) the mobile app
mobile-check:
    cd mobile && npm run lint && npx tsc --noEmit && npm test

#### Everything

# Run every check, as CI does
ci: desktop-check mobile-check lint-workflows

#### Lint

# Lint every workflow: syntax + shellcheck, security audit, schema
lint-workflows:
    actionlint
    zizmor .github/
    check-jsonschema --builtin-schema vendor.github-workflows .github/workflows/*.yml
