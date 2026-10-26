# Dev-shell CLIs, one file per tool, each pinned to its latest release as a
# prebuilt binary: nothing here compiles on `nix develop`. Only the Tauri
# system libraries come from nixpkgs (see flake.nix), as upstream ships no
# binary for them. Each file says how to bump it.
{ pkgs, unstable }:
# Only each tool's binaries: a `dev` output (curl's) would also put nixpkgs'
# own openssl on PATH.
map (file: pkgs.lib.getBin (import file { inherit pkgs unstable; })) [
  ./actionlint.nix
  ./android-cmdline-tools.nix
  ./check-jsonschema.nix
  ./curl.nix
  ./jdk.nix
  ./jq.nix
  ./just.nix
  ./lolcat.nix
  ./node.nix
  ./openssl.nix
  ./pin-github-action.nix
  ./rust.nix
  ./shellcheck.nix
  ./zizmor.nix
]
