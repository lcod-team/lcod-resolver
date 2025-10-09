# lcod-resolver Workspace

This repository now hosts the resolver compose as a workspace package.

- `workspace.lcp.toml` describes the workspace namespace and packages.
- `packages/resolver/` contains the resolver package (`lcp.toml`, `compose.yaml`, components).

All helper components are exposed as workspace-scoped entries under `packages/resolver/components/internal/*` and can be referenced via relative IDs (for example `internal/prepare-cache`).

## Useful commands

- `node ../lcod-kernel-js/bin/run-compose.mjs --resolver --compose packages/resolver/compose.yaml --state packages/resolver/state.example.json`
- `cargo test --package lcod-kernel-rs --test resolver`
