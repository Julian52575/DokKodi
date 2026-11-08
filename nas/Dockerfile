# Local-dev NAS: SMB + NFS + DLNA over one mounted folder (nas/assets).
# Userspace servers only (samba, unfs3, minidlna): no privileged mode, no kernel modules.
FROM alpine:3

RUN apk add --no-cache samba-server minidlna unfs3 tar zstd

COPY assets.tar.zst /opt/assets.tar.zst

RUN <<'EOF' cat > /entrypoint.sh && chmod +x /entrypoint.sh
#!/bin/sh
set -eu
PORT="${NAS_PORT:-8200}"
ASSETS=/srv/assets

# The folder is bind-mounted; seed it only when empty so user files are never overwritten.
mkdir -p "$ASSETS"
if [ -z "$(ls -A "$ASSETS")" ]; then
    echo "assets folder is empty, extracting the bundled archive"
    tar --zstd -xf /opt/assets.tar.zst -C "$ASSETS"
fi
# Host user must be able to add and delete files.
chmod -R a+rwX "$ASSETS"

cat > /etc/samba/smb.conf <<CONF
[global]
    map to guest = Bad User
    min protocol = SMB2
    load printers = no
    disable spoolss = yes
    log file = /dev/stdout
[assets]
    path = $ASSETS
    guest ok = yes
    read only = no
    force user = root
CONF

echo "$ASSETS (rw,no_root_squash,insecure)" > /etc/exports

cat > /etc/minidlna.conf <<CONF
user=root
media_dir=$ASSETS
port=$PORT
friendly_name=DokKodi NAS
db_dir=/var/cache/minidlna
inotify=yes
CONF
mkdir -p /var/cache/minidlna

smbd --foreground --no-process-group --debug-stdout &
# -p skips rpcbind: clients pass port=2049,mountport=2049.
unfsd -d -p -e /etc/exports -n 2049 -m 2049 &
# A stale pid file survives `docker restart` and makes minidlna refuse to start.
rm -f /run/minidlna.pid
minidlnad -S -f /etc/minidlna.conf -P /run/minidlna.pid &

IP="$(hostname -i)"
echo "NAS ready (container address $IP), serving $ASSETS:"
echo "  SMB   smb://$IP/assets"
echo "  NFS   $IP:$ASSETS (mount -o nfsvers=3,tcp,port=2049,mountport=2049)"
echo "  DLNA  http://$IP:$PORT"

# Exit as soon as one server dies so Docker shows the failure.
wait -n
exit 1
EOF

EXPOSE 445 2049 8200
ENTRYPOINT ["/entrypoint.sh"]
