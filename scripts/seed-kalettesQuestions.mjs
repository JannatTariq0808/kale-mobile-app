/**
 * Seed `kalettesQuestions` — replaces entire collection.
 * Usage: node scripts/seed-kalettesQuestions.mjs <staging|production>
 */

import { initFirestoreAdmin, loadSeedFile, replaceFaqCollection } from './firestoreSeedHelper.mjs';

const target = process.argv[2];
const seed = loadSeedFile('kalettesQuestions.seed.json');
const db = initFirestoreAdmin(target);

await replaceFaqCollection(db, seed.collection, seed.documents);
console.log(`Seeded ${seed.documents.length} kalettesQuestions docs → ${target}`);
