#!/usr/bin/env node
/** Remove Android splash icon animation delay added by expo-splash-screen prebuild. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const stylesPath = path.join(root, 'android/app/src/main/res/values/styles.xml');

if (!fs.existsSync(stylesPath)) {
  console.log('patch-android-splash: skipped (no android/styles.xml)');
  process.exit(0);
}

const contents = fs.readFileSync(stylesPath, 'utf8');
const next = contents.replace(
  /\s*<item name="android:windowSplashScreenBehavior">icon_preferred<\/item>\s*/g,
  '\n',
);

if (next === contents) {
  console.log('patch-android-splash: icon_preferred already removed');
} else {
  fs.writeFileSync(stylesPath, next);
  console.log('patch-android-splash: removed delayed splash icon animation');
}
