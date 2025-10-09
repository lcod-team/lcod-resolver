# prepare-cache

Resolves the cache directory used by the resolver. It calls `lcod://tooling/resolver/cache-dir@1` with the current project path, normalises the result, and produces the final `cacheRoot` used by dependency resolution.

## Inputs

- `projectPath` (string): base path of the project being resolved.

## Outputs

- `cacheRoot` (string): absolute path to the cache directory chosen for the run.
