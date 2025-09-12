# Roadmap — lcod-resolver

## M0
- Parse `resolver.toml` (mirrors, replace, allowlist)
- Resolve `lcod://ns/name@range` → concrete URL
- Fetch & read `lcp.toml`; fallback to `index.json` for non-standard files
- Cache + sha256 integrity

## M1
- Generate `lcp.lock`
- Optional signatures (sigstore)
- Export metadata for RAG (title, summary, schemas, tags)

## M2
- Offline mode (cache/lock only)
- Export `.lcpkg`
- Stable Node/TS API + CLI
