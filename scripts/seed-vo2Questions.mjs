/**
 * Seed `vo2Questions` — replaces entire collection.
 * Usage: node scripts/seed-vo2Questions.mjs <staging|production>
 */

import { initFirestoreAdmin, loadSeedFile, replaceFaqCollection } from './firestoreSeedHelper.mjs';

const target = process.argv[2];
const seed = loadSeedFile('vo2Questions.seed.json');
const db = initFirestoreAdmin(target);

await replaceFaqCollection(db, seed.collection, seed.documents);
console.log(`Seeded ${seed.documents.length} vo2Questions docs → ${target}`);
