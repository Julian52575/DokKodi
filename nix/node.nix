# Node.js (24 LTS), official binary release. Bump: version, then the four hashes
# (`nix store prefetch-file <url>`). Provides node, npm and npx.
{ pkgs, ... }:
let
  system = pkgs.stdenv.hostPlatform.system;
  target = {
    x86_64-linux = "linux-x64";
    aarch64-linux = "linux-arm64";
    x86_64-darwin = "darwin-x64";
    aarch64-darwin = "darwin-arm64";
  }.${system};
  hash = {
    x86_64-linux = "sha256-bBcqmrZxj3uAH7WnvUhq8u5eMnWAhqBLhPzOKqdwleY=";
    aarch64-linux = "sha256-26v3ocv5R+YFn/rSwnuABB25feoeVTtir97n8T/KM24=";
    x86_64-darwin = "sha256-ZeRQ+Qpuqs1QAPYRhhxM5l+tyH+BN5XcTtDA5fL8otQ=";
    aarch64-darwin = "sha256-ZUunneYVVkfiIyGTK0Xyocy3BZdswzfJuOJ4vrCFpig=";
  }.${system};
in
pkgs.stdenvNoCC.mkDerivation rec {
  pname = "nodejs";
  version = "24.22.1";
  src = pkgs.fetchurl {
    url = "https://nodejs.org/dist/v${version}/node-v${version}-${target}.tar.xz";
    inherit hash;
  };
  dontStrip = true;
  installPhase = ''
    mkdir -p $out
    cp -r bin lib include share $out/
  '';
}
