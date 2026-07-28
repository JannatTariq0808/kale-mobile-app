#!/usr/bin/env node
/** Tonedown Gradle memory + archs so local Windows builds don't OOM the daemon. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const propsFile = path.join(root, 'android', 'gradle.properties');

if (!fs.existsSync(propsFile)) {
  process.exit(0);
}

let text = fs.readFileSync(propsFile, 'utf8');

const replacements = [
  [
    /^org\.gradle\.jvmargs=.+$/m,
    'org.gradle.jvmargs=-Xmx1536m -XX:MaxMetaspaceSize=384m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8',
  ],
  [/^org\.gradle\.parallel=.+$/m, 'org.gradle.parallel=false'],
  [
    /^reactNativeArchitectures=.+$/m,
    'reactNativeArchitectures=arm64-v8a',
  ],
];

for (const [pattern, value] of replacements) {
  if (pattern.test(text)) {
    text = text.replace(pattern, value);
  } else {
    text += `\n${value}\n`;
  }
}

if (!/^org\.gradle\.workers\.max=/m.test(text)) {
  text += '\norg.gradle.workers.max=2\n';
}

fs.writeFileSync(propsFile, text);
console.log('patch-android-gradle-memory: limited heap/workers + arm64-v8a only');
