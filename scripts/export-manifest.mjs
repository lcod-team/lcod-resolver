#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(ROOT, '..');
const RUNTIME_JSON = path.join(REPO_ROOT, 'runtime', 'lcod-resolver-runtime.json');
const OUTPUT_DIR = path.join(REPO_ROOT, 'registry');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'components.std.jsonl');

const stripRuntimePrefix = (target) => {
  if (typeof target !== 'string' || target.length === 0) {
    return null;
  }
  const normalized = target.replace(/^\.\//, '');
  return normalized.replace(/^resolver[\\/]/, '');
};

const relPath = (target) =>
  path.relative(REPO_ROOT, path.resolve(REPO_ROOT, target)).split(path.sep).join('/');

async function main() {
  const runtimeRaw = await fs.readFile(RUNTIME_JSON, 'utf8');
  const runtime = JSON.parse(runtimeRaw);

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const lines = [];
  const now = new Date().toISOString();
  const packageInfo = runtime.package ?? {};
  const commit = runtime.commit ?? 'local';
  const manifestPath = path.relative(REPO_ROOT, OUTPUT_FILE) || OUTPUT_FILE;

  lines.push(
    JSON.stringify({
      type: 'manifest',
      schema: 'lcod-manifest/list@1',
      label: 'resolver-local',
      generatedAt: now,
      spec: {
        version: packageInfo.version ?? '0.1.0',
        source: 'lcod-resolver@local',
      },
    }),
  );

  const baseEntry = (entry) => {
    const composePath = stripRuntimePrefix(entry.composePath ?? entry.compose);
    const manifestPath = stripRuntimePrefix(entry.manifestPath ?? entry.lcp);
    if (!composePath) {
      throw new Error(`Component ${entry.id} is missing composePath`);
    }
    return {
      type: 'component',
      id: entry.id,
      compose: relPath(composePath),
      lcp: manifestPath ? relPath(manifestPath) : undefined,
      version: entry.version ?? packageInfo.version ?? '0.1.0',
      source: 'resolver',
      origin: {
        source_repo: 'https://github.com/lcod-team/lcod-resolver',
        commit,
        manifestPath,
      },
    };
  };

  if (packageInfo.id && packageInfo.composePath) {
    const packageEntry = {
      id: packageInfo.id,
      composePath: stripRuntimePrefix(packageInfo.composePath),
      manifestPath:
        stripRuntimePrefix(packageInfo.lcpPath) || 'packages/resolver/lcp.toml',
      version: packageInfo.version,
    };
    lines.push(
      JSON.stringify(baseEntry(packageEntry)),
    );
  }

  for (const entry of runtime.components ?? []) {
    lines.push(JSON.stringify(baseEntry(entry)));
  }

  await fs.writeFile(OUTPUT_FILE, lines.join('\n') + '\n', 'utf8');
  process.stdout.write(`Resolver manifest written to ${OUTPUT_FILE}\n`);
}

main().catch((error) => {
  console.error('[export-manifest] failed:', error);
  process.exit(1);
});
