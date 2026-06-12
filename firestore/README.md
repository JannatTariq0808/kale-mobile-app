# Firestore — `strengthQuestions`

The app uses **Firebase Firestore** (not SQL). FAQ content lives in a top-level collection:

## Collection: `strengthQuestions`

| Field       | Type    | Required | Description                          |
|------------|---------|----------|--------------------------------------|
| `question` | string  | yes      | FAQ title shown in accordion         |
| `answer`   | string  | yes      | Body copy when expanded              |
| `sortOrder`| number  | yes      | Display order (ascending)            |
| `active`   | boolean | no       | Hide when `false` (default: visible) |
| `updatedAt`| timestamp | no     | Set by seed script                   |

Document IDs are stable slugs (e.g. `relative-performance`).

## Security rules (add to Firebase Console)

```
match /strengthQuestions/{id} {
  allow read: if true;
  allow write: if false;
}
```

Writes are admin-only (Console or seed script).

## Seed staging + production

1. Download a Firebase **service account** JSON for each project (or one with access to both).
2. Install admin SDK: `npm install firebase-admin --save-dev`
3. Run:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/staging-service-account.json
node scripts/seed-strengthQuestions.mjs staging

export GOOGLE_APPLICATION_CREDENTIALS=/path/to/production-service-account.json
node scripts/seed-strengthQuestions.mjs production
```

Or import `firestore/strengthQuestions.seed.json` manually in Firebase Console → Firestore → Start collection → `strengthQuestions`.

## Projects

| Environment | Firebase project ID      |
|-------------|--------------------------|
| Staging     | `kale-staging-17edd`     |
| Production  | `kale-production-ce86c`  |

The mobile app reads from whichever project matches `EXPO_PUBLIC_FIREBASE_*` in `.env.local` / EAS secrets.

## Fallback

If Firestore is empty or unreachable, the app uses bundled copy in `src/data/strengthQuestionsFallback.ts`.

---

## Collection: `knowledgeQuestions`

Same schema as `strengthQuestions`. FAQ copy from **nu-8 · Fitness · Knowledge** (Normal use).

| Field       | Type    | Required | Description                          |
|------------|---------|----------|--------------------------------------|
| `question` | string  | yes      | FAQ title shown in accordion         |
| `answer`   | string  | yes      | Body copy when expanded              |
| `sortOrder`| number  | yes      | Display order (ascending)            |
| `active`   | boolean | no       | Hide when `false` (default: visible) |
| `updatedAt`| timestamp | no     | Set by seed script                   |

## Security rules (add to Firebase Console)

```
match /knowledgeQuestions/{id} {
  allow read: if true;
  allow write: if false;
}
```

## Seed knowledge FAQs

```bash
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/staging-service-account.json
node scripts/seed-knowledgeQuestions.mjs staging

export GOOGLE_APPLICATION_CREDENTIALS=/path/to/production-service-account.json
node scripts/seed-knowledgeQuestions.mjs production
```

Or: `npm run seed:knowledge-questions -- staging`

Fallback: `src/data/knowledgeQuestionsFallback.ts`

---

## Collection: `kalettesQuestions`

Same schema. FAQ copy from **lum-16 / nu-5 · Rewards · Balance**.

```
match /kalettesQuestions/{id} {
  allow read: if true;
  allow write: if false;
}
```

```bash
npm run seed:kalettes-questions -- staging
npm run seed:kalettes-questions -- production
```

Fallback: `src/data/kalettesQuestionsFallback.ts`

---

## Collection: `rewardsProducts`

Marketplace product cards on **lum-17 · Rewards · Marketplace**.

| Field        | Type    | Required | Description                              |
|-------------|---------|----------|------------------------------------------|
| `title`     | string  | yes      | Product name                             |
| `brand`     | string  | yes      | Brand label                              |
| `pts`       | number  | yes      | Kalettes price                           |
| `topup`     | number \| null | no  | GBP top-up if partial points redemption |
| `category`  | string  | yes      | `Gear`, `Partner offers`, etc.           |
| `tag`       | string  | yes      | `GEAR`, `OFFER`, `ASSESSMENT`, `COACHING` |
| `discount`  | string  | no       | e.g. `25%` for offer cards               |
| `productUrl`| string  | yes      | Deep link opened when card is tapped      |
| `sortOrder` | number  | yes      | Display order (ascending)                |
| `active`    | boolean | no       | Hide when `false`                        |
| `updatedAt` | timestamp | no     | Set by seed script                       |

```
match /rewardsProducts/{id} {
  allow read: if true;
  allow write: if false;
}
```

```bash
npm run seed:rewards-products -- staging
npm run seed:rewards-products -- production
```

Fallback: `src/data/rewardsProductsFallback.ts`
