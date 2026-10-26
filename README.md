<!-- The badge stays empty until the first Scorecard PR is merged (see openssf-scorecard.yml). -->
[![OpenSSF Scorecard](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2FJulian52575%2FDokKodi%2Fmain%2F.readme-badges%2Fscorecard-badge.json)](.readme-badges/scorecard-results.json)

# DokKodi

One repository, two apps, one dev shell:

| App | Folder | Stack |
| --- | ------ | ----- |
| Desktop | [`desktop/`](desktop/) | [Tauri 2](https://tauri.app/): [React](https://react.dev/) + [Vite](https://vite.dev/) + [Tailwind](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) frontend, Rust backend (`desktop/src-tauri/`) |
| Mobile | [`mobile/`](mobile/) | [Expo](https://expo.dev/) / [React Native](https://reactnative.dev/) + [NativeWind](https://www.nativewind.dev/), Android |

## Quick start

1. Install [Nix](https://install.determinate.systems/) with flakes enabled
   (Linux or macOS; on Windows use [WSL 2](https://learn.microsoft.com/windows/wsl/install),
   see [Requirements](#requirements)).
2. Clone the repo and enter the dev shell. The first run downloads every tool:

   ```bash
   nix develop
   ```

3. Install the dependencies and start working:

   ```bash
   just install        # npm ci in desktop/ and mobile/
   just dev            # desktop window + Expo dev server, together
   ```

   `just dev` installs missing dependencies itself, so step 3's first line is
   optional. Work on one app only with `just desktop-dev` or `just mobile-start`.
4. **Mobile only:** the first `nix develop` in a terminal (step 2) also installs the
   Android SDK into `ANDROID_HOME` (default `~/Android/Sdk`) and asks you to
   accept Google's licences (it links them). It is skipped when the SDK is already
   there, or with `ANDROID_SDK_INSTALL=0` in `.env`. Press `a` in the Expo terminal
   to open the app on an emulator or a connected device, or run
   `just mobile-android`. Desktop work needs no Android SDK.
5. Before opening a pull request, run `just ci` and read
   [CONTRIBUTING.md](CONTRIBUTING.md) (commit signing, Conventional Commits).

`just` on its own lists every command.

### Requirements

- [Nix](https://install.determinate.systems/) with flakes enabled, on Linux or macOS.
- **Windows:** the flake does not run natively. Either
  - **use WSL 2** (recommended) with the repo in the Linux filesystem (`~/…`,
    not `/mnt/c/…`); the desktop window needs WSLg; or
  - **skip the flake** and install [Git for Windows](https://gitforwindows.org/)
    (its bash runs the `justfile` and git hooks), [just](https://just.systems/man/en/packages.html),
    [Node.js 24](https://nodejs.org/), [Rust](https://rustup.rs/) and the
    [Tauri prerequisites](https://tauri.app/start/prerequisites/). For
    Android, also [Android Studio](https://developer.android.com/studio) and
    a JDK 17, with `ANDROID_HOME` set.
- **Linux without Nix:** the same tools, plus the Tauri system libraries for
  your distribution (WebKitGTK 4.1, GTK 3, libsoup 3, librsvg, OpenSSL).

> **Disk usage:** the Nix store grows quietly and can reach tens of GB, and
> a desktop plus Android setup needs about 20 GB. The shell warns when
> `/nix/store` exceeds 10 GiB; check with `du -sh /nix/store`, reclaim with
> `nix-collect-garbage -d`. See the NixOS wiki's
> [Storage optimization](https://wiki.nixos.org/wiki/Storage_optimization)
> for more ways to shrink it, and
> [docs/troubleshooting/nix/disk-space.md](docs/troubleshooting/nix/disk-space.md)
> for WSL.

Optional: [direnv](https://direnv.net/) + [nix-direnv](https://github.com/nix-community/nix-direnv)
and `direnv allow` load the shell automatically on `cd`.

### What the shell does

`nix develop` does the steps below on every entry. Without Nix, run the
command under each step once from the repo root instead.

1. **Puts the pinned tools on `PATH`**: `just`, `node`/`npm`, `cargo`,
   `rustc`, `clippy`, `rustfmt`, a JDK 17, `sdkmanager`, `jq`, `openssl`,
   `curl`, `actionlint`, `shellcheck`, `check-jsonschema`, `zizmor` and
   `pin-github-action`, plus the Tauri system libraries on Linux (see
   `flake.nix` and `nix/tools.nix`).

2. **Creates `.env`** from `.env.example`, adds variables that are new in
   `.env.example` to an existing `.env`, and replaces every `change-me-*`
   value with a random secret, once. `just` loads `.env` itself
   (`set dotenv-load`).

   ```bash
   [ -e .env ] || cp .env.example .env
   for key in $(sed -nE 's/^([A-Za-z_][A-Za-z0-9_]*)=.*/\1/p' .env.example); do
     grep -qE "^$key=" .env || grep -E "^$key=" .env.example >> .env
   done
   for key in $(sed -nE 's/^([A-Za-z_][A-Za-z0-9_]*)="?change-me-.*/\1/p' .env); do
     sed -i.bak "s|^$key=.*|$key=$(openssl rand -hex 32)|" .env && rm -f .env.bak
   done
   ```

3. **Locates the Android SDK**: `ANDROID_HOME` (else `~/Android/Sdk`) is
   exported and its `platform-tools` added to `PATH`. When there is no SDK
   and the shell is interactive, it links to
   [Google's licence terms](https://developer.android.com/studio/terms) and
   asks once whether you accept; on `y` it accepts the licences and installs
   `platform-tools`, and Gradle fetches the rest on the first build.
   Non-interactive entries (CI, scripts) never install.

   ```bash
   yes | sdkmanager --sdk_root="$ANDROID_HOME" --licenses
   sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools"
   ```

4. **Enables the git hooks** in `.githooks/` (Conventional Commit, signed
   and signed-off commits — see [CONTRIBUTING.md](CONTRIBUTING.md)):

   ```bash
   git config --local core.hooksPath .githooks
   ```

### Just commands

| command | purpose |
| ------- | ------- |
| `just install` | `npm ci` in `desktop/` and `mobile/` |
| `just dev` | run the desktop app and the Expo dev server together (installs missing `node_modules` first) |
| `just desktop-dev` | run the desktop app with hot reload (`tauri dev`) |
| `just desktop-build` | build the desktop installers into `desktop/src-tauri/target/release/bundle` |
| `just desktop-check` | type-check and build the frontend; `cargo fmt --check`, `clippy`, `cargo test` |
| `just mobile-start` | start the Expo dev server |
| `just mobile-android` | build and run on a connected device or emulator |
| `just mobile-prebuild` | generate the native project in `mobile/android` (git-ignored) |
| `just mobile-apk` | build a release APK with Gradle |
| `just mobile-check` | eslint, prettier and `tsc` on the mobile app |
| `just ci` | everything above plus `lint-workflows` |
| `just lint-workflows` | actionlint + zizmor + schema check, as CI does |

## Governance

The rules (issue → branch → PR, Conventional Commits, required checks) are in
**[CONTRIBUTING.md](CONTRIBUTING.md)**. They are enforced by repository
settings that one script applies, using an authenticated [`gh`](https://cli.github.com/):

```bash
scripts/apply-governance.sh [owner/name]
```

It is safe to re-run, and sets:

- **Branch ruleset** from `.github/rulesets/main.json`: PR with 1 approval
  (code owners when a `CODEOWNERS` exists), resolved threads, the single
  required check `ci-required` on an up-to-date branch, linear history, no force-push or deletion, no bypass. It can also be
  imported by hand: *Settings → Rules → Rulesets → Import*.
  See [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).
- **Merges:** squash only, PR title as the commit, branches auto-deleted,
  auto-merge allowed.
- **Actions:** read-only default `GITHUB_TOKEN`.
- **Security** (best-effort, depends on your plan): Dependabot alerts and
  fixes, secret scanning + push protection, private vulnerability reporting.
- The issue labels used by the issue forms.

To also *enforce* signed commits on GitHub, add `{ "type": "required_signatures" }`
to the ruleset's `rules` and re-run.

## CI and automation

All workflows follow the same hardening: actions pinned to a commit SHA
(`# vX.Y.Z` comment, maintained with `pin-github-action`), least-privilege
`permissions:`, `timeout-minutes`, `step-security/harden-runner`,
`persist-credentials: false`, and no `${{ … }}` inside `run:`. Background:
[GitHub's security hardening guide](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions).

| Workflow | Does |
| -------- | ---- |
| `ci.yml` | on a PR, only the jobs whose files changed run (see [CONTRIBUTING.md](CONTRIBUTING.md)); flake evaluation, lint + type-check + build of each app, `cargo fmt`/`clippy`/`test` on the Tauri crate, actionlint, zizmor, [osv-scanner](https://google.github.io/osv-scanner/) dependency audit (npm and Cargo lockfiles); all gated by the single `ci-required` job |
| `ci-sast.yml` | [CodeQL](https://codeql.github.com/docs/) always, [SonarQube Cloud](https://docs.sonarsource.com/sonarqube-cloud/) when its token is set; see [`.sast/README.md`](.sast/README.md) |
| `check-conventional-commit-pr-title.yml` | PR title is a Conventional Commit (advisory, not required) |
| `openssf-scorecard.yml` | weekly [OpenSSF Scorecard](https://scorecard.dev/); results go to the `openssf-update` branch and an issue with a one-click PR link. The README badge reads the merged result from `main`. |
| `release-please.yml` | keeps a [release-please](https://github.com/googleapis/release-please) Release PR open; merging it tags and publishes the release |
| `release-to-installer.yml` | on release: builds `DokKodi-Desktop-linux-amd64.deb`, `DokKodi-Desktop-windows-x64.msi` and `DokKodi-Remote-android-universal.apk` and attaches them to the release that triggered it |
| `make-pr-draft.yml` | opt-in (`MAKE_PR_DRAFT=true` variable): new PRs start as drafts |
| `notify-discord-review-requested.yml` | opt-in (`DISCORD_WEBHOOK_URL` secret): posts review requests to a Discord channel |

### Actions secrets and variables

| Name | Kind | Needed for |
| ---- | ---- | ---------- |
| `RELEASE_PLEASE_GITHUB_TOKEN` | secret, **required** | `release-please.yml`: fine-grained PAT or GitHub App token with *Contents* and *Pull requests* read/write. The built-in token is not used on purpose: releases it creates do not trigger `release-to-installer.yml`. |
| `SONARQUBE_TOKEN` | secret | the SonarQube job; skipped when unset |
| `SAST_REPORT_TOKEN` | secret | committing SAST reports to `main`; needs a ruleset bypass |
| `DISCORD_WEBHOOK_URL` | secret | Discord review notifications |
| `MAKE_PR_DRAFT` | variable | `true` makes new PRs drafts |

`.github/actions/setup-devshell` installs Nix and caches the store in the
GitHub Actions cache (no account needed).

## Layout

```
desktop/                               Tauri app: src/ (React), src-tauri/ (Rust)
mobile/                                Expo app: App.tsx, src/ (React Native + NativeWind)
flake.nix, flake.lock, nix/            dev shell; one file per pinned tool
justfile                               project commands
.env.example                           template for .env
.githooks/                             commit-msg checks
.github/workflows/, .github/actions/   CI, release and audit workflows
.github/rulesets/main.json             branch ruleset
.github/ISSUE_TEMPLATE/, PULL_REQUEST_TEMPLATE.md
.sast/                                 SAST config and report scripts
scripts/apply-governance.sh            applies the repository settings
release-please-config.json, .release-please-manifest.json
docs/troubleshooting/                  incident log, one subfolder per area
CONTRIBUTING.md, AGENTS.md
```

## Working on the apps

- **Tools:** every dev-shell tool is pinned in its own `nix/<tool>.nix`
  (listed in `nix/tools.nix`) to its latest **prebuilt** release, so
  `nix develop` only downloads. Each file says how to bump it. Only the
  Tauri Linux libraries come from nixpkgs, as upstream ships no binary.
- **Desktop commands:** Rust functions marked `#[tauri::command]` in
  `desktop/src-tauri/src/lib.rs` are called from React with `invoke`. See
  [calling Rust](https://tauri.app/develop/calling-rust/).
- **Mobile:** the native `mobile/android` project is generated by
  `expo prebuild` and never committed; configure the app in `mobile/app.json`.
- **Release installers:** the release workflow ships the desktop app as `.deb`
  and `.msi`, and the mobile app as an `.apk` (an Android app has no
  `.deb`/`.msi`). The APK is signed with Expo's debug keystore, fine for
  sideloading; add a release keystore before publishing on the Play Store.

## AI usage disclosure

Parts of this repository were drafted with Claude Code. Every AI-assisted
change is reviewed and tested by a human, and carries a `Co-Authored-By:`
trailer naming the assistant.

---

© 2026 Julian Bottiglione &lt;julian.bottiglione@epitech.eu&gt;
