# lcod-resolver

LCOD compose that reads an `lcp.toml` descriptor and emits an `lcp.lock`. The package exposes the
workflow `lcod://tooling/resolver@0.1.0`, defined in `compose.yaml` alongside the package manifest
`lcp.toml`.

## Layout

- `compose.yaml` — resolution pipeline (descriptor load, config fallbacks, dependency loop).
- `schema/resolve.in.json` — input schema (`projectPath` required, optional `configPath`/`outputPath`).
- `schema/resolve.out.json` — output schema (`lockPath`, `components`, `warnings`).
- `resolve.config.example.json` — sample resolver configuration with custom sources.
- `state.example.json` — minimal state pointing `projectPath` to the current directory.

## Prerequisites

Keep the LCOD runtimes next to this repo, for example:

```bash
../lcod-kernel-js
../lcod-kernel-rs
```

## Run with the Node kernel

```bash
node ../lcod-kernel-js/bin/run-compose.mjs \
  --core --resolver \
  --compose ./compose.yaml \
  --state ./state.example.json
```

- `projectPath` must reference the directory containing `lcp.toml` (here `.`).
- `configPath` can point to a JSON resolver config (see `resolve.config.example.json`).
- `outputPath` is optional; if omitted the compose writes `./lcp.lock`.

The contract `lcod://contract/tooling/resolve-dependency@1` is currently a stub that returns
entries from `config.sources` (or a mock reference). Runtimes can provide a real resolution
implementation later.

## Output

After execution, `lcp.lock` looks like:

```toml
schemaVersion = "1.0"
resolverVersion = "0.1.0"
[[components]]
id = "lcod://tooling/resolver@0.1.0"
resolved = "lcod://tooling/resolver@0.1.0"
[source]
type = "path"
path = "."
```

Dependencies collected by the `foreach` loop appear under `components[0].dependencies`.

## Next steps

- Implement a full `resolve-dependency` (mirrors/git/http, integrity checks).
- Extend resolver config (`replace`, `allowlist`) and enrich lock metadata.
- Publish the package as `.lcpkg` so it can be consumed out of tree.
