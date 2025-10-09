# Roadmap — lcod-resolver

## M0
- [x] Parse `resolver.toml` (mirrors, replace, allowlist)
- [x] Resolve `lcod://ns/name@range` → concrete URL
- [x] Fetch & read `lcp.toml`; fallback to `index.json` for non-standard files
- [x] Cache + sha256 integrity
- [x] Refactor recursion/caching into compose helpers (propose missing axioms; minimize kernel-only logic)

## M1
- [x] Generate `lcp.lock`
- [ ] Optional signatures (sigstore)
- [ ] Export metadata for RAG (title, summary, schemas, tags)

## M2
- [ ] Offline mode (cache/lock only)
- [ ] Export `.lcpkg`
- [ ] Stable Node/TS API + CLI
- [ ] Introduce packaging commands (`assemble` bundle, `ship` runtime wrapper, `build` integration) aligned with spec roadmap.
- [ ] Ajouter un pré-traitement compose sugar → canonique via le composant de normalisation partagé pour rendre les configurations plus lisibles sans toucher au kernel.

## M3
- [ ] Scoped registries & internal helpers (#4)
  - Bundle resolver helper components with `scope = "workspace"`, resolve relative IDs, and auto-load them via the resolver compose.
