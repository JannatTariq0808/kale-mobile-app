/**
 * Seed `rewardsProducts` into staging or production Firestore.
 *
 * Usage:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
 *   node scripts/seed-rewardsProducts.mjs staging
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
  console.error('Usage: node scripts/seed-rewardsProducts.mjs <staging|production>');
  process.exit(1);
}

const seedPath = join(__dirname, '../firestore/rewardsProducts.seed.json');
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
  batch.set(db.collection('rewardsProducts').doc(id), {
    ...fields,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

await batch.commit();
console.log(`Seeded ${seed.documents.length} rewardsProducts docs → ${PROJECTS[target]}`);
