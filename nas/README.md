# Local NAS

A throwaway NAS for local development. One Alpine container serves the
`nas/assets/` folder over **SMB**, **NFS** and **DLNA**, so the apps can be
tested against real network shares.

## Getting Started

Requires Docker and `just` (both come with `nix develop` / your setup).

```bash
cp .env.example .env   # once; sets NAS_PORT
just nas-up            # build the image and start the NAS
```

`nas-up` prints the endpoints. On the host:

| Protocol | Address                                                           |
| -------- | ----------------------------------------------------------------- |
| SMB      | `smb://localhost:1445/assets` (guest, no password)                |
| NFS      | `localhost:/srv/assets`, mount with `-o nfsvers=3,tcp,port=2049,mountport=2049` |
| DLNA     | `http://127.0.0.1:8200` (`NAS_PORT`; use the IP, not `localhost`) |

Other recipes:

```bash
just nas-down   # stop the container
just nas-rm     # remove the container and image (assets are kept)
```

## Assets

`nas/assets/` is **git-ignored** and bind-mounted into the container, so files
you add or delete on the host show up immediately.

`nas/assets.tar.zst` is the tracked copy of the sample assets. When
`nas/assets/` is empty or missing, the container extracts it on start. Existing
files are never overwritten. To start from scratch, empty the folder and run
`just nas-up` again.

To refresh the archive after changing the assets:

```bash
tar -C nas/assets -c . | zstd -19 -o nas/assets.tar.zst
```

## Notes

- SMB is published on `1445` because the host often owns `445`. NFS uses `2049`.
- DLNA auto-discovery does not cross Docker's bridge network; enter the address
  in the client by hand.
