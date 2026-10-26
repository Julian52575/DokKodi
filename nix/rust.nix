# Rust (stable), official standalone installer: rustc, cargo, clippy, rustfmt.
# Bump: version, then the four hashes (the .sha256 file next to each tarball
# on static.rust-lang.org/dist, or `nix store prefetch-file <url>`).
{ pkgs, ... }:
let
  system = pkgs.stdenv.hostPlatform.system;
  target = {
    x86_64-linux = "x86_64-unknown-linux-gnu";
    aarch64-linux = "aarch64-unknown-linux-gnu";
    x86_64-darwin = "x86_64-apple-darwin";
    aarch64-darwin = "aarch64-apple-darwin";
  }.${system};
  hash = {
    x86_64-linux = "sha256-Ix/K5H7pUGITdHJbX8O1RB0vvaKVWsRd19yBbYh2z+c=";
    aarch64-linux = "sha256-pI+x6FO+Vs6bjidR9UZNvV4WRAzYHiN5IPOl5+gGMz4=";
    x86_64-darwin = "sha256-E7I30ClLrTu3sY1VlReUftg0jqJYEvo7RoyQSZb4DjQ=";
    aarch64-darwin = "sha256-MJdjeLaq79GGG6R1kFxroipEyYFBjOUihQBq8mM3+Yw=";
  }.${system};
in
pkgs.stdenvNoCC.mkDerivation rec {
  pname = "rust";
  version = "1.99.1";
  src = pkgs.fetchurl {
    url = "https://static.rust-lang.org/dist/rust-${version}-${target}.tar.xz";
    inherit hash;
  };
  # Linux binaries are dynamically linked: patch them for NixOS too.
  nativeBuildInputs = pkgs.lib.optionals pkgs.stdenv.isLinux [ pkgs.autoPatchelfHook ];
  buildInputs = pkgs.lib.optionals pkgs.stdenv.isLinux [ pkgs.stdenv.cc.cc.lib pkgs.zlib ];
  dontStrip = true;
  installPhase = ''
    bash ./install.sh --prefix=$out --disable-ldconfig \
      --components=rustc,cargo,rust-std-${target},clippy-preview,rustfmt-preview
  '';
}
