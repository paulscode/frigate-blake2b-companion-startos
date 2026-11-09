# AGENTS.md

A StartOS service package: Frigate Electrum Server (SHA256) Companion, `frigate-sha256-companion`.
Built locally with the workspace's `release.sh`, never in CI. SDK 3.1.1.

- **Two packages, one codebase.** This package and `frigate-blake2b-companion-startos` are identical
  except `startos/chain.ts`, the icons, `README.md`, `instructions.md` and the package name. Edit
  here, then run `/mnt/Black/frigate-companions/tools/sync-packages.sh`.
- **Frigate's changes are `patches/`**, generated from a working tree in the frigate-companions
  project (`work/frigate-src`); never edit a patch file by hand. See UPDATING.md.
- **No autoconfig task on the node, ever.** Pruned support is the point of this package.
- **Never run `npm install` or `npm update`.** The lockfile pins `github:` dependencies that move
  upstream. `npm ci` only.
- i18n: `python3 /mnt/Black/fulcrum-pruned/packaging/gen-i18n-dict.py .` regenerates the default
  dictionary from the source; `translations.ts` stays empty.
- Version ranges: check with the SDK's comparator (`node_modules/@start9labs/start-sdk/node_modules/@start9labs/start-core/exver`), not by reading.
