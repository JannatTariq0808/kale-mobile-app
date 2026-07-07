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

---

## Collection: `strength`

One document per strength test attempt (mobile app writes on plank completion).

| Field          | Type      | Required | Description                    |
|----------------|-----------|----------|--------------------------------|
| `created_at`   | timestamp | yes      | When the test was saved        |
| `elapsed_time` | number    | yes      | Hold duration in seconds       |
| `is_completed` | boolean   | yes      | `true` when test is finished   |
| `level`        | number    | yes      | Strength level 1–10            |
| `type`         | string    | yes      | e.g. `Plank`                   |
| `user_id`      | reference | yes      | `/users/{uid}`                 |

```
match /strength/{strengthId} {
  allow read: if request.auth != null
    && resource.data.user_id == /databases/$(database)/documents/users/$(request.auth.uid);
  allow create, update: if request.auth != null
    && request.resource.data.user_id == /databases/$(database)/documents/users/$(request.auth.uid);
}
```

---

## Collection: `assessments`

Parent doc for onboarding / quarterly cycles. Created by the **website Admin SDK** when cardio is saved. The mobile app may **link** `strength_id` / `knowledge_id` after each pillar.

| Field           | Type      | Description                              |
|-----------------|-----------|------------------------------------------|
| `user_id`       | reference | `/users/{uid}`                           |
| `cardio_id`     | reference | `/cardios/{uid}`                         |
| `strength_id`   | reference | `/strength/{id}` — set after plank       |
| `knowledge_id`  | reference | `/knowledge/{id}` — set after quiz       |
| `isOnboarding`  | boolean   | `true` for first assessment              |
| `is_completed`  | boolean   | `true` when all pillars + level are done |
| `quarter`       | map       | Onboarding or Q1–Q4 metadata            |

Without an **update** rule, `linkStrengthToOnboardingAssessment` fails with `Missing or insufficient permissions` (strength save still succeeds).

**Important:** `allow read` must include **completed** assessments (`is_completed: true`). If read is restricted to in-progress docs only, the list query `where user_id == …` fails as soon as the user finishes onboarding — you will see `fetchAssessmentsForUser failed` in the app log.

```
match /assessments/{assessmentId} {
  // Owner can read ALL their assessments (in-progress AND completed).
  allow read: if request.auth != null
    && resource.data.user_id == /databases/$(database)/documents/users/$(request.auth.uid);

  // Server / admin creates assessments
  allow create, delete: if isAdmin();

  // Mobile links pillar refs during onboarding (in-progress only)
  allow update: if request.auth != null
    && resource.data.user_id == /databases/$(database)/documents/users/$(request.auth.uid)
    && resource.data.is_completed != true
    && request.resource.data.diff(resource.data).affectedKeys()
        .hasOnly(['cardio_id', 'strength_id', 'knowledge_id', 'level', 'is_completed', 'updated_at']);
}
```

Do **not** add `&& resource.data.is_completed != true` to the **read** rule.

Until that rule is deployed, login resume still works: the app falls back to latest completed `strength` / `knowledge` docs when refs are missing on the assessment.
