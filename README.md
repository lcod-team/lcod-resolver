# lcod-resolver Workspace

This repository now hosts the resolver compose as a workspace package. It
expects a `sources.json` file at the project root (or falls back to the
official LCOD catalogue) and expands it into inline registry sources before
running the existing registry helpers.

- `workspace.lcp.toml` describes the workspace namespace and packages.
- `packages/resolver/` contains the resolver package (`lcp.toml`, `compose.yaml`, components).

All helper components are exposed as workspace-scoped entries under `packages/resolver/components/internal/*` and can be referenced via relative IDs (for example `internal/prepare-cache`).

## Useful commands

- `node ../lcod-kernel-js/bin/run-compose.mjs --resolver --compose packages/resolver/compose.yaml --state packages/resolver/state.example.json`
  - add `--sources path/to/sources.json` to exercise custom catalogue pointers.
- `node scripts/test-resolver-sources.mjs` runs the federated `sources.json` fixture end-to-end (override `LCOD_KERNEL_BIN` / `SPEC_REPO_PATH` when needed).
- `cargo test --package lcod-kernel-rs --test resolver`
