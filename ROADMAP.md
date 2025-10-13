# Roadmap — lcod-resolver

## M0 — Resolver core
- [x] Parser `resolve.config.json` / `resolver.toml` (mirrors, replace, allowlist).
- [x] Résoudre `lcod://namespace/name@range` vers des sources concrètes (git/http/file).
- [x] Lire `lcp.toml` (fallback `index.json`) et calculer l’intégrité SHA-256.
- [x] Refactorer la récursion/caching dans des helpers compose (proposer les axioms manquants).

## M1 — Lockfile & métadonnées
- [x] Générer `lcp.lock` complet.
- [ ] Signatures optionnelles (sigstore ou équivalent).
- [ ] Export de métadonnées pour le RAG (titre, résumé, schémas, tags).

## M2 — Distribution
- [ ] Mode hors-ligne (cache/lock uniquement).
- [ ] Export `.lcpkg`.
- [ ] API/CLI Node stable (packages + documentation).
- [ ] Packaging CLI (`assemble`, `ship`, `build`) aligné sur la spec distribution.
- [x] Normalisation compose via le composant partagé (`tooling/compose/normalize@1`).
- [x] Publish a snapshot `lcod-resolver-runtime.json` listing the composes/versions embedded in the shared runtime bundle (consumed by kernels).

## M3 — Workspace & registry scopes

Delivered:
- [x] Passage au layout workspace (`workspace.lcp.toml`, `packages/resolver`) avec helpers `scope="workspace"`.
- [x] IDs relatifs et auto-chargement dans les kernels via manifeste workspace.

Next:
- [ ] M3-01 Exposer `tooling/registry/scope@1` dans le compose resolver lorsque les kernels le supportent (isoler les helpers internes).
- [ ] M3-02 Documenter l’ordre de résolution (compose → scope → plateforme) et fournir des tests d’intégration partagés avec les kernels.

## M4 — Observabilité
- [ ] Publier des événements de trace (résolution de dépendances, misses cache) alignés avec le contrat `lcod://tooling/log@1`.

## M5 — Registry client

Goal: consume the Git-first registry defined in `docs/registry.md` and expose user-facing workflows.

- [ ] M5-01 Support chained `registry.json` files and local overrides when bootstrapping the resolver config.
- [ ] M5-02 Fetch `versions.json` / `manifest.json`, download artefacts or individual files, verify hashes, and populate the cache.
- [ ] M5-03 Implement semantic version resolution with `lcod-resolver update` to refresh locked dependencies.
- [ ] M5-04 Add helper commands: `lcod-resolver mirror` (clone + rewrite URLs) and `lcod-resolver publish` (generate manifest, validate, open PR).
