/**
 * Seed `strengthQuestions` — replaces entire collection.
 * Usage: node scripts/seed-strengthQuestions.mjs <staging|production>
 */

import { initFirestoreAdmin, loadSeedFile, replaceFaqCollection } from './firestoreSeedHelper.mjs';

const target = process.argv[2];
const seed = loadSeedFile('strengthQuestions.seed.json');
const db = initFirestoreAdmin(target);

await replaceFaqCollection(db, seed.collection, seed.documents);
console.log(`Seeded ${seed.documents.length} strengthQuestions docs → ${target}`);
