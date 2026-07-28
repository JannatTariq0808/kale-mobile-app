/**
 * Seed Running Years FAQ + goal presets into staging or production Firestore.
 *
 * Prerequisites:
 *   npm install firebase-admin --save-dev
 *   Save service account JSON locally (never commit — see .gitignore)
 *
 * PowerShell:
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="D:\path\to\staging-service-account.json"
 *   node scripts/seed-runningYears.mjs staging
 *
 * Bash:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/staging-service-account.json
 *   node scripts/seed-runningYears.mjs staging
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2];

const PROJECTS = {
  staging: 'kale-staging-17edd',
  production: 'kale-production-ce86c',
};

if (!target || !PROJECTS[target]) {
  console.error('Usage: node scripts/seed-runningYears.mjs <staging|production>');
  process.exit(1);
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    'Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path before running.',
  );
  process.exit(1);
}

const seeds = [
  { file: 'runningYearsQuestions.seed.json', collection: 'runningYearsQuestions' },
  { file: 'runningYearsGoals.seed.json', collection: 'runningYearsGoals' },
];

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECTS[target],
  });
}

const db = getFirestore();
const batch = db.batch();
let total = 0;

for (const { file, collection } of seeds) {
  const seedPath = join(__dirname, '../firestore', file);
  const seed = JSON.parse(readFileSync(seedPath, 'utf8'));

  for (const doc of seed.documents) {
    const { id, ...fields } = doc;
    batch.set(db.collection(collection).doc(id), {
      ...fields,
      updatedAt: FieldValue.serverTimestamp(),
    });
    total += 1;
  }
}

await batch.commit();
console.log(`Seeded ${total} Running Years docs → ${PROJECTS[target]}`);
console.log('  - runningYearsQuestions (FAQ)');
console.log('  - runningYearsGoals (goal chips)');
