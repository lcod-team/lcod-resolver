# AGENT — lcod-resolver

## Mission
Resolve, fetch, and cache LCP components with mirror/replace rules.

## Constraints
- No magic: any non-standard file must be listed in `index.json`.
- Enforce namespace allowlists.
- Deterministic lockfile.

## Definition of Done
- Minimal CLI (`resolve`, `lock`)
- Unit tests (mirrors/replace/cache scenarios)
- README with examples
