/**
 * Seed all FAQ collections (strength, knowledge, kalettes, cardio, vo2).
 * Usage: node scripts/seed-all-faqs.mjs <staging|production>
 */

import { initFirestoreAdmin, loadSeedFile, replaceFaqCollection } from './firestoreSeedHelper.mjs';

const target = process.argv[2];
const db = initFirestoreAdmin(target);

const seeds = [
  'strengthQuestions.seed.json',
  'knowledgeQuestions.seed.json',
  'kalettesQuestions.seed.json',
  'cardioQuestions.seed.json',
  'vo2Questions.seed.json',
];

for (const filename of seeds) {
  const seed = loadSeedFile(filename);
  await replaceFaqCollection(db, seed.collection, seed.documents);
  console.log(`  ✓ ${seed.collection} (${seed.documents.length} docs)`);
}

console.log(`Seeded all FAQ collections → ${target}`);
