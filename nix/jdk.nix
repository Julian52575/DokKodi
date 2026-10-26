# JDK 17 (Temurin), official binary release, for Gradle and React Native.
# Bump: per system, path and hash (api.adoptium.net/v3/assets/latest/17/hotspot
# lists the link and sha256 of each build; releases differ per platform).
{ pkgs, ... }:
let
  system = pkgs.stdenv.hostPlatform.system;
  build = {
    x86_64-linux = {
      path = "jdk-17.0.21%2B9/OpenJDK17U-jdk_x64_linux_hotspot_17.0.21_9";
      hash = "sha256-i5thHZF+Pf2EGdNWa1lJIm9psFL+1+EJwTaK3R3+hxE=";
    };
    aarch64-linux = {
      path = "jdk-17.0.21%2B9/OpenJDK17U-jdk_aarch64_linux_hotspot_17.0.21_9";
      hash = "sha256-Pk7Kfq0IjwgK8UdgB97PAQokCh604eeMVPoy+8w0cIQ=";
    };
    x86_64-darwin = {
      path = "jdk-17.0.20.1%2B1/OpenJDK17U-jdk_x64_mac_hotspot_17.0.20.1_1";
      hash = "sha256-wBl12hLtQjUlD/iR/ou6c6nnMDfURLJpydCSK128jgo=";
    };
    aarch64-darwin = {
      path = "jdk-17.0.21%2B9/OpenJDK17U-jdk_aarch64_mac_hotspot_17.0.21_9";
      hash = "sha256-eLCMf1oFmCQtVxnAIuGUectKOqRcN8GXJqdXpGntHBU=";
    };
  }.${system};
in
pkgs.stdenvNoCC.mkDerivation {
  pname = "temurin-jdk";
  version = "17";
  src = pkgs.fetchurl {
    url = "https://github.com/adoptium/temurin17-binaries/releases/download/${build.path}.tar.gz";
    inherit (build) hash;
  };
  nativeBuildInputs = pkgs.lib.optionals pkgs.stdenv.isLinux [ pkgs.autoPatchelfHook ];
  buildInputs = pkgs.lib.optionals pkgs.stdenv.isLinux (with pkgs; [ stdenv.cc.cc.lib zlib alsa-lib freetype fontconfig xorg.libX11 xorg.libXext xorg.libXi xorg.libXrender xorg.libXtst ]);
  autoPatchelfIgnoreMissingDeps = true;
  dontStrip = true;
  installPhase = ''
    # macOS archives nest the JDK in Contents/Home
    if [ -d Contents/Home ]; then cp -r Contents/Home $out; else cp -r . $out; fi
  '';
  setupHook = pkgs.writeText "jdk-setup-hook" "export JAVA_HOME=@out@";
}
