#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const specRoot = process.env.SPEC_REPO_PATH
  ? path.resolve(process.env.SPEC_REPO_PATH)
  : path.resolve(repoRoot, '../lcod-spec');

const runner = process.env.LCOD_SPEC_TEST_RUNNER
  ? path.resolve(process.env.LCOD_SPEC_TEST_RUNNER)
  : path.resolve(repoRoot, '../lcod-kernel-js/scripts/run-spec-tests.mjs');

const child = spawn('node', [runner, '--json'], {
  env: { ...process.env, SPEC_REPO_PATH: specRoot },
  stdio: ['ignore', 'pipe', 'inherit']
});

let output = '';
child.stdout.on('data', (chunk) => { output += chunk; });

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`Spec runner failed (exit code ${code})`);
    process.exit(code);
    return;
  }
  let results;
  try {
    results = JSON.parse(output);
  } catch (err) {
    console.error(`Unable to parse JSON output: ${err.message}`);
    process.exit(1);
    return;
  }
  const resolverTest = results.find((entry) => entry && entry.name === 'resolver_sources');
  if (!resolverTest) {
    console.error('resolver_sources fixture not found in test results');
    process.exit(1);
    return;
  }
  if (!resolverTest.success) {
    const details = resolverTest.error?.message || resolverTest.report || resolverTest.result;
    console.error('resolver_sources fixture failed:', details);
    process.exit(1);
    return;
  }
  console.log('resolver_sources fixture succeeded.');
});
