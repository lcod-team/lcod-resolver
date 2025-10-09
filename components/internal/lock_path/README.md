# lock-path

Determines where the resolver should write the resulting `lcp.lock`. If `outputPath` is provided it is returned as-is; otherwise the component falls back to `<projectPath>/lcp.lock`.

## Inputs

- `projectPath` (string, required)
- `outputPath` (string, optional)

## Outputs

- `lockPath` (string): Absolute or relative path where the lockfile should be written.
