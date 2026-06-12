#!/usr/bin/env node
/** Ensure android/build/generated/autolinking/autolinking.json exists before Gradle runs. */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const androidDir = path.join(root, 'android');
const outDir = path.join(androidDir, 'build/generated/autolinking');
const outFile = path.join(outDir, 'autolinking.json');

if (!fs.existsSync(androidDir)) {
  console.log('generate-android-autolinking: skipped (no android/ folder — run prebuild first)');
  process.exit(0);
}

fs.mkdirSync(outDir, { recursive: true });

const json = execSync(
  'npx expo-modules-autolinking react-native-config --platform android --json',
  { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] },
);

fs.writeFileSync(outFile, `${json.trim()}\n`);
console.log(`generate-android-autolinking: wrote ${path.relative(root, outFile)}`);
