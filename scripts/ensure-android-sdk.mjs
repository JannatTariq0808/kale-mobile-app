#!/usr/bin/env node
/** Write android/local.properties if missing (wiped by `prebuild --clean`). */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const androidDir = path.join(root, 'android');
const propsFile = path.join(androidDir, 'local.properties');

if (!fs.existsSync(androidDir)) {
  process.exit(0);
}

if (fs.existsSync(propsFile)) {
  process.exit(0);
}

const candidates = [
  process.env.ANDROID_HOME,
  process.env.ANDROID_SDK_ROOT,
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk'),
  process.env.HOME && path.join(process.env.HOME, 'AppData', 'Local', 'Android', 'Sdk'),
  process.env.USERPROFILE && path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk'),
].filter(Boolean);

const sdkDir = candidates.find((dir) => fs.existsSync(dir));
if (!sdkDir) {
  console.warn(
    'ensure-android-sdk: Android SDK not found. Set ANDROID_HOME or install Android Studio.',
  );
  process.exit(0);
}

const escaped = sdkDir.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
fs.writeFileSync(propsFile, `sdk.dir=${escaped}\n`);
console.log(`ensure-android-sdk: wrote ${path.relative(root, propsFile)} → ${sdkDir}`);
