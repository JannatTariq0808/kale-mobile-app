import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const __dirname = dirname(fileURLToPath(import.meta.url));

export const FIRESTORE_PROJECTS = {
  staging: 'kale-staging-17edd',
  production: 'kale-production-ce86c',
};

export function initFirestoreAdmin(target) {
  if (!target || !FIRESTORE_PROJECTS[target]) {
    console.error('Usage: node scripts/seed-<collection>.mjs <staging|production>');
    process.exit(1);
  }

  if (getApps().length === 0) {
    initializeApp({
      credential: applicationDefault(),
      projectId: FIRESTORE_PROJECTS[target],
    });
  }

  return getFirestore();
}

export function loadSeedFile(filename) {
  const seedPath = join(__dirname, '../firestore', filename);
  return JSON.parse(readFileSync(seedPath, 'utf8'));
}

/** Replace an entire FAQ collection so removed questions don't linger. */
export async function replaceFaqCollection(db, collectionName, documents) {
  const existing = await db.collection(collectionName).get();
  const batch = db.batch();

  for (const doc of existing.docs) {
    batch.delete(doc.ref);
  }

  for (const doc of documents) {
    const { id, ...fields } = doc;
    batch.set(db.collection(collectionName).doc(id), {
      ...fields,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();
}
