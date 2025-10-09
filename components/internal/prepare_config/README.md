# prepare-config

Normalises the resolver configuration before dependency resolution. It merges the raw configuration, extracts helper maps (`sources`, `replaceAlias`, `replaceSpec`) and cleans up the allowlist while carrying over any warnings emitted during config loading.

## Inputs

- `resolverConfig` (object, optional): canonical configuration returned by `load-config`.
- `config` (object, optional): fallback configuration when `resolverConfig` is absent.
- `warnings` (array of strings, optional): warnings accumulated so far.

## Outputs

- `normalizedConfig` (object):
  - `sources` (object) — source map keyed by component ID.
  - `replaceAlias` (object) — alias map (`id -> replacement id`).
  - `replaceSpec` (object) — inline replacement specifications.
  - `allowlist` (array of strings or null) — trimmed allowlist entries.
- `warnings` (array of strings) — propagated warning list.
