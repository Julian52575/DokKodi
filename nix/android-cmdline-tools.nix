# Android command-line tools (sdkmanager, avdmanager), Google's official
# release, which fetches the rest of the SDK on demand (see the Android block
# of the shellHook in flake.nix).
#
# Pinned to 20.0 (build 14742923), deliberately not the latest: from 23.0 on,
# sdkmanager is a shim that downloads an unpinned `android` binary at first
# run, collects usage metrics and no longer asks for licences. 20.0 is the
# last build with the classic interactive `sdkmanager --licenses`.
# Bump only once the licence prompt exists again: build number and hashes
# (`nix store prefetch-file <url>`). The zip is Java, so aarch64 Linux uses
# the Linux build, and macOS ships one build for both architectures.
{ pkgs, ... }:
let
  system = pkgs.stdenv.hostPlatform.system;
  build = "14742923";
  os = {
    x86_64-linux = "linux";
    aarch64-linux = "linux";
    x86_64-darwin = "mac";
    aarch64-darwin = "mac";
  }.${system};
  hash = {
    linux = "sha256-BEUwZrVAQJ2XXGdteB2hR3R53eN2ExDxp+uSod+xWvc=";
    mac = "sha256-7TBMXt43GFQeT5eOSuhwpNhT23SvbBbZIFiNSFI7ne4=";
  }.${os};
in
pkgs.stdenvNoCC.mkDerivation {
  pname = "android-cmdline-tools";
  version = build;
  src = pkgs.fetchurl {
    url = "https://dl.google.com/android/repository/commandlinetools-${os}-${build}_latest.zip";
    inherit hash;
  };
  nativeBuildInputs = [ pkgs.unzip ];
  sourceRoot = "cmdline-tools";
  installPhase = ''
    mkdir -p $out/share/android-cmdline-tools $out/bin
    cp -r . $out/share/android-cmdline-tools/
    for tool in sdkmanager avdmanager; do
      ln -s $out/share/android-cmdline-tools/bin/$tool $out/bin/$tool
    done
  '';
}
