# build-lock

Creates the canonical lock document returned by the resolver. It wraps the project descriptor together with the resolved dependency graph and produces both the structured object and the TOML string ready to be written to disk.

## Inputs

- `descriptor` (object)
- `dependencyGraph` (array)
- `warnings` (array of strings)
- `rootIntegrity` (string, optional)

## Outputs

- `lockDocument` (object): Structured lock payload.
- `lockText` (string): TOML serialization of the lock payload.
