# lcod-resolver

Library/CLI to **resolve** LCP components:
- Substitutions (`[replace]`) and mirrors (`[mirrors]`)
- Local cache + integrity verification
- Lockfile (`lcp.lock`)

## CLI

```bash
# Resolve a canonical ID to a concrete source and fetch the component
lcod resolve lcod://core/http_get@1

# Build a lockfile from a list of IDs
lcod lock --input ids.txt --output lcp.lock
```

See `resolver.toml` for configuration.
