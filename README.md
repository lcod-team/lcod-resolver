# lcod-resolver

Composition LCOD pour résoudre un projet `lcp.toml` et produire un `lcp.lock`. Le package expose
`lcod://tooling/resolver@0.1.0` (workflow) dont la définition vit dans `compose.yaml` et le
manifeste associé `lcp.toml`.

## Structure

- `compose.yaml` — pipeline de résolution (lecture du descriptor, configuration, boucle deps).
- `schema/resolve.in.json` — schéma d’entrée : `projectPath` obligatoire, `configPath`/`outputPath`
  optionnels.
- `schema/resolve.out.json` — schéma de sortie : `lockPath`, `components`, `warnings`.
- `resolve.config.example.json` — exemple de configuration (sources personnalisées).
- `state.example.json` — état minimal pour exécuter le compose depuis la racine du projet.

## Prérequis

Cloner les runtimes LCOD :

```bash
# Exemple avec les repos voisins
../lcod-kernel-js
../lcod-kernel-rs
```

## Exécuter avec le kernel Node.js

```bash
node ../lcod-kernel-js/bin/run-compose.mjs \
  --core --resolver \
  --compose ./compose.yaml \
  --state ./state.example.json
```

- `projectPath` doit pointer vers le répertoire contenant `lcp.toml` (ici `.`).
- `configPath` peut référencer un fichier JSON (`resolve.config.example.json`).
- `outputPath` laisse le compose générer `./lcp.lock` par défaut si omis.

Le contrat `lcod://contract/tooling/resolve-dependency@1` est actuellement un stub qui renverra les
sources déclarées dans `config.sources` (ou une source « mock »). Les runtimes pourront fournir une
implémentation réelle plus tard.

## Résultat

Après exécution, `lcp.lock` ressemble à :

```toml
schemaVersion = "1.0"
resolverVersion = "0.1.0"
[[components]]
id = "lcod://tooling/resolver@0.1.0"
resolved = "lcod://tooling/resolver@0.1.0"
[source]
type = "path"
path = "."
```

Les dépendances résolues par la boucle `foreach` sont listées dans `components[0].dependencies`.

## Étapes suivantes

- Implémenter un `resolve-dependency` complet (mirrors/git/http, intégrité).
- Étendre la config (`replace`, `allowlist`) et générer un lock enrichi.
- Publier ce package en `.lcpkg` pour une consommation hors dépôt.
