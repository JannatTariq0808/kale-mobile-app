/**
 * Seed `strengthQuestions` into staging or production Firestore.
 *
 * Prerequisites:
 *   npm install firebase-admin --save-dev
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *
 * Usage:
 *   node scripts/seed-strengthQuestions.mjs staging
 *   node scripts/seed-strengthQuestions.mjs production
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
  console.error('Usage: node scripts/seed-strengthQuestions.mjs <staging|production>');
  process.exit(1);
}

const seedPath = join(__dirname, '../firestore/strengthQuestions.seed.json');
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));

if (getApps().length === 0) {
  initializeApp({
    credential: applicationDefault(),
    projectId: PROJECTS[target],
  });
}

const db = getFirestore();
const batch = db.batch();

for (const doc of seed.documents) {
  const { id, ...fields } = doc;
  batch.set(db.collection('strengthQuestions').doc(id), {
    ...fields,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

await batch.commit();
console.log(`Seeded ${seed.documents.length} strengthQuestions docs → ${PROJECTS[target]}`);
