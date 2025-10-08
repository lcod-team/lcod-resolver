# lcod-resolver

LCOD compose that reads an `lcp.toml` descriptor and emits an `lcp.lock`. The workflow tolerates
missing resolver configuration by falling back to an empty `sources` map and surfacing a warning in
the resulting lockfile. `lcod://tooling/resolver@0.1.0` is defined in `compose.yaml` alongside the
package manifest `lcp.toml`.

## Layout

- `compose.yaml` — resolution pipeline (descriptor load, config fallbacks, dependency graph script).
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
  --resolver \
  --compose ./compose.yaml \
  --project ./examples/tooling/resolver \
  --output ./examples/tooling/resolver/lcp.lock \
  --cache-dir ~/.cache/lcod/resolver
```

- `projectPath` defaults to the current working directory; override with `--project`.
- `configPath` can point to a JSON resolver config (see `resolve.config.example.json`) via
  `--config`. When omitted, the compose attempts to load `<project>/resolve.config.json` and
  records a warning if the file is missing.
- `outputPath` defaults to `<project>/lcp.lock`; override with `--output`.
- `--cache-dir` (or the `LCOD_CACHE_DIR` env var) sets the shared cache root. The compose still
  prefers `<project>/.lcod/cache` when available.

All overrides can also be provided through a state JSON file; explicit CLI flags win over state
values.

## Resolver configuration

The optional `resolve.config.json` (or any file passed via `--config`) can
augment resolution with three constructs:

- `sources` — explicit source specs keyed by component ID. Supported types are
  the same as in the compose (`path`, `git`, `http`).
- `replace` — remap component IDs. The value can be another ID (string) or an
  inline source spec. Replacements take precedence over `sources` and record the
  effective ID under `resolved` in the lockfile.
- `allowlist` — array of ID prefixes/IDs that are allowed to be resolved. Dependencies
  outside of the list fail fast, providing a simple guardrail when composing
  internal packages.

`resolve.config.example.json` illustrates the format with a path override and a
namespace allowlist.

## Run with the Rust kernel

```bash
cargo run --bin run_compose -- --compose ./compose.yaml \
  --project ./examples/tooling/resolver \
  --output ./examples/tooling/resolver/lcp.lock \
  --cache-dir ~/.cache/lcod/resolver
```

The Rust CLI registers the same core/flow/tooling contracts automatically. Any of the overrides can
be mixed with `--state` as in the Node example.

The compose relies on `tooling/script@1` with import aliases to call filesystem/network axioms.
Runtimes only need to provide the generic cache selector axiom
`lcod://tooling/resolver/cache-dir@1` in addition to the standard filesystem/git/http/hash
contracts. The legacy contract
`lcod://contract/tooling/resolve-dependency@1` remains as a stub for compatibility but the
compose no longer depends on it.

## Output

After execution, `lcp.lock` looks like:

```toml
schemaVersion = "1.0"
resolverVersion = "0.1.0"
[[components]]
id = "lcod://example/app@0.1.0"
resolved = "lcod://example/app@0.1.0"
integrity = "sha256-…"

  [components.source]
  type = "path"
  path = "."

  [[components.dependencies]]
  id = "lcod://example/dep@0.1.0"
  integrity = "sha256-…"

    [components.dependencies.source]
    type = "path"
    path = "./components/dep"
```

Warnings collected during resolution (missing sources, config fallbacks, fetch errors) are stored in
`warnings` and mirrored under `components[].dependencies[*].source` when a fallback was required.

## Next steps

- Extend resolver config (`replace`, `allowlist`) and enrich lock metadata.
- Publish the package as `.lcpkg` so it can be consumed out of tree.

Full CLI conventions, cache layout, and kernel interaction rules are defined in
[`lcod-spec/docs/resolver/README.md`](https://github.com/lcod-team/lcod-spec/blob/main/docs/resolver/README.md).
