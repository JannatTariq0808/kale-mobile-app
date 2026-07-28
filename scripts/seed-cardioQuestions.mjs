/**
 * Seed `cardioQuestions` — replaces entire collection.
 * Usage: node scripts/seed-cardioQuestions.mjs <staging|production>
 */

import { initFirestoreAdmin, loadSeedFile, replaceFaqCollection } from './firestoreSeedHelper.mjs';

const target = process.argv[2];
const seed = loadSeedFile('cardioQuestions.seed.json');
const db = initFirestoreAdmin(target);

await replaceFaqCollection(db, seed.collection, seed.documents);
console.log(`Seeded ${seed.documents.length} cardioQuestions docs → ${target}`);
