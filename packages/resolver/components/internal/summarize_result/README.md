# summarize-result

Transforms the resolver result into the data required for lock generation. It extracts the dependency graph, the root integrity (if any), and merges warnings from previous stages.

## Inputs

- `resolverResult` (object): output of `resolve-dependencies` containing `root` and `warnings`.
- `warnings` (array of strings, optional): additional warnings to merge.

## Outputs

- `dependencyGraph` (array): resolved dependency records for the root component.
- `rootIntegrity` (string or null): integrity hash of the root descriptor when available.
- `warnings` (array of strings): aggregated warnings.
