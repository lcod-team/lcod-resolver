#!/usr/bin/env node
/**
 * export-runtime.mjs
 *
 * Generate a lightweight snapshot describing the resolver workspace
 * components that should be shipped inside the LCOD runtime bundle.
 *
 * The script writes `runtime/lcod-resolver-runtime.json`.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

async function main() {
  const outDir = path.join(repoRoot, 'runtime');
  await fs.mkdir(outDir, { recursive: true });

  const commit = git(['rev-parse', 'HEAD']).trim();
  const ref = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();

  const packageInfo = await readResolverPackage();
  const components = await readWorkspaceComponents();

  const snapshot = {
    schemaVersion: '1.0',
    generatedAt: new Date().toISOString(),
    commit,
    ref,
    package: {
      id: packageInfo.id,
      version: packageInfo.version,
      composePath: 'resolver/packages/resolver/compose.yaml',
      lockfilePath: 'resolver/packages/resolver/lcp.lock',
    },
    workspace: {
      manifest: 'resolver/workspace.lcp.toml',
      components: packageInfo.workspaceComponents.map((component) => ({
        id: component.id,
        path: `resolver/packages/resolver/${component.path.replace(/\\/g, '/')}`,
      })),
    },
    components: components.map((component) => ({
      id: component.id,
      version: component.version,
      composePath: component.composePath,
      manifestPath: component.manifestPath,
    })),
  };

  const outputPath = path.join(outDir, 'lcod-resolver-runtime.json');
  await fs.writeFile(outputPath, JSON.stringify(snapshot, null, 2) + '\n', 'utf-8');
  console.log(`Resolver runtime snapshot written to ${outputPath}`);
}

function git(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf-8',
  });
}

async function readResolverPackage() {
  const manifestPath = path.join(repoRoot, 'packages', 'resolver', 'lcp.toml');
  const text = await fs.readFile(manifestPath, 'utf-8');
  const id = extractString(text, /^id\s*=\s*"([^"]+)"/m);
  const version =
    extractString(text, /^version\s*=\s*"([^"]+)"/m) ?? extractVersionFromId(id);
  const workspaceComponents = parseWorkspaceComponents(text);

  return { id, version, workspaceComponents };
}

async function readWorkspaceComponents() {
  const componentsDir = path.join(repoRoot, 'packages', 'resolver', 'components');
  const componentDirs = await collectComponentDirs(componentsDir);
  const components = [];

  for (const componentDir of componentDirs) {
    const manifestPath = path.join(componentDir, 'lcp.toml');
    const composePath = path.join(componentDir, 'compose.yaml');

    try {
      const manifestText = await fs.readFile(manifestPath, 'utf-8');
      const id = extractString(manifestText, /^id\s*=\s*"([^"]+)"/m);
      const version =
        extractString(manifestText, /^version\s*=\s*"([^"]+)"/m) ??
        extractVersionFromId(id);

      components.push({
        id,
        version,
        composePath: toBundlePath(path.relative(repoRoot, composePath)),
        manifestPath: toBundlePath(path.relative(repoRoot, manifestPath)),
      });
    } catch (err) {
      console.warn(
        `Skipping component at ${path.relative(
          repoRoot,
          componentDir
        )}: unable to read manifest (${err.message})`
      );
    }
  }

  components.sort((a, b) => a.id.localeCompare(b.id));
  return components;
}

async function collectComponentDirs(rootDir) {
  const result = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop();
    let hasManifest = false;
    let entries;
    try {
      entries = await fs.readdir(current, { withFileTypes: true });
    } catch (err) {
      console.warn(
        `Skipping directory ${path.relative(
          rootDir,
          current
        )}: ${err.message}`
      );
      continue;
    }
    for (const entry of entries) {
      if (entry.isFile() && entry.name === 'lcp.toml') {
        hasManifest = true;
        break;
      }
    }
    if (hasManifest) {
      result.push(current);
      continue;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        stack.push(path.join(current, entry.name));
      }
    }
  }

  return result;
}

function parseWorkspaceComponents(text) {
  const components = [];
  const lines = text.split(/\r?\n/);
  let current = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('[[workspace.components]]')) {
      if (current) {
        components.push(current);
      }
      current = {};
      continue;
    }
    if (!current) continue;
    const match = line.match(/^(\w+)\s*=\s*"([^"]*)"/);
    if (match) {
      const [, key, value] = match;
      if (key === 'id' || key === 'path') {
        current[key] = value;
      }
    }
  }
  if (current) {
    components.push(current);
  }
  return components.filter((item) => item.id && item.path);
}

function extractString(text, regex) {
  const match = text.match(regex);
  return match ? match[1] : null;
}

function extractVersionFromId(id) {
  if (!id) return null;
  const parts = id.split('@');
  return parts.length > 1 ? parts[1] : null;
}

function toBundlePath(relativePath) {
  return ['resolver', ...relativePath.split(path.sep)].join('/');
}

main().catch((err) => {
  console.error(err instanceof Error ? err.stack || err.message : err);
  process.exitCode = 1;
});
