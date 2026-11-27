# Kale mobile app — handoff for a new Claude session

Written 12 Nov 2026 from a Claude Code session in `/Users/chakor/kale-mobile-app` (branch `main`).
Paste this file into the new session as its first message, or point the session at it.
Everything below is state and decisions; nothing in it is an instruction to the reader beyond
"continue from here".

## 1. What the project is

- Expo / React Native app for Kale, a longevity-linked insurance product. Firebase (web SDK for
  Auth and Firestore, `@react-native-firebase` for push). React Navigation. Sora font. Lumen design
  system under `src/components/lumen/`.
- Repo: https://github.com/JannatTariq0808/kale-mobile-app (public). Owner commits straight to `main`.
- Firebase projects: production `kale-production-ce86c` (what `.env.local` points at),
  staging `kale-staging-17edd`.
- The app is being extended for a new product, **Income Protection (IP)**, sold on kale.insure
  through Best Insurance. The existing Life flow (cardio, strength, knowledge assessments,
  Kalettes) stays as is; IP customers get a different tab bar and new screens.

## 2. Source documents for the IP work

- Developer brief PDF (27 Oct 2026, by Alex): `~/Downloads/Kale Income Protection developer brief for the mobile app.pdf`
- Fitness Age technical annexe: `~/Downloads/Kale_Fitness_Age_Technical_Annexe (4).pdf`
- Fitness Age table, every age 18–80 by sex and level, no interpolation needed:
  `~/Downloads/fitness_age_to_level_map_full (1).csv`. Columns: `sex, real_age, level, mortality_age,
  morbidity_age_unfloored, morbidity_age_rated, rated_age_minus_real_age, claim_hazard_ratio,
  t5k_slow, t5k_fast, ftp_lo, ftp_hi, plank_s, wallsit_s`. Show `mortality_age` as "Fitness Age";
  never show `morbidity_age_rated` (the rated age Best prices on).
- Design: the client's Claude Design project, shared as viewer:
  https://claude.ai/artifact/WsrJ9V7tQJooDSYoLsVwoc . Its `project/` folder contains
  `Lumen for IP.html`, `screens/LumenIP.jsx`, `app-ip.jsx`, `Lumen for IP - changelog.md` and
  `Lumen for IP - developer brief.md` (27 Oct, settles rules: one assessment per window, no retakes,
  no provisional price, next level needs both cardio and strength targets, "standard price" never
  used, coaching lives in a Goals tab). The same canvas minus the IP files is in the repo at
  `Kale mobile app/`. A zip of it is at `~/Downloads/Kale mobile app uploaded.zip`.
- Scope page I produced (estimate, change list, screenshots of every IP screen):
  https://claude.ai/artifact/BMwpETowHLBYxbVdtBtT3Y . Headline: ~6 weeks for one developer
  (24.5 build days + 4 QA), plus 2–3 weeks backend if the same person. The user confirmed this is
  "a few pages", not a rebuild; the estimate already counts only IP pages.

## 3. What is committed

- `e9a701f` Upgrade Expo SDK 54 → 58 (React Native 0.88, React 19.3, TypeScript 6, RN Firebase 26.4).
  Done so the app runs in current Expo Go. expo-doctor clean; `tsc` has 14 pre-existing errors.
- `47d61d9` Font and icon fix. In Expo Go 58 on iOS, runtime-loaded fonts resolve only by their
  real internal names. `src/theme/fonts.ts` + `src/hooks/useSoraFonts.ts` now use `Sora-Regular`,
  `Sora-SemiBold`, `Sora-Bold`, `Sora-ExtraBold`. `src/components/icons/Ionicons.ts` wraps
  @expo/vector-icons' Ionicons under the family name `Ionicons`, registers it at module load, and
  all 37 former `@expo/vector-icons` imports point at it. `src/utils/applySoraFont.ts` keeps explicit
  families. Verified on the iPhone 17 Pro simulator in Expo Go 58.0.7.
- Both pushed to GitHub.

## 4. What is uncommitted in the working tree (the IP "Policy" slice)

Built and type-checked, not run against real data, not committed:

- `src/types/incomeProtection.ts` — `IncomeProtectionRecord` (prospectId, route, level,
  month1Premium, currentPremium, realAgePremium, coverAmount, deferredDays, status, policyId,
  policyNumber, coverStart, paymentDay, priceHistory…). Rated age deliberately excluded.
- `src/services/ip/incomeProtection.ts` — reads `users/{uid}.incomeProtection` plus
  `prospects/{prospectId}` (paymentAt, policyId) into the record. `src/services/ip/pauseRequests.ts`
  writes to a new `pauseRequests` collection.
- `src/hooks/useIncomeProtection.ts` — cached hook; `isIpCustomer` is true when the map exists.
- `src/config/incomeProtection.ts` — insurer line, document URLs, `BEST_CLAIMS_URL` (placeholder)
  and `IP_DISCLAIMER` (placeholder; must be replaced word for word from the website's
  `lib/ip/pricing.ts`).
- `src/config/incomeProtectionDev.ts` — dev-only override: `EXPO_PUBLIC_FORCE_IP_CUSTOMER=true`
  in `.env.local` (already set there, git-ignored) makes any account an IP customer with the
  design's sample data (Sam, L5, £25, policy KL-IP-204816).
- `src/utils/ipPolicy.ts` — £ formatting, dates, ordinal payment day, 12-month window strip.
- `src/components/ip/` — IPKicker, IPRow, IPPrice, IPGhostButton, IPFlowShell.
- `src/navigation/PolicyStackNavigator.tsx` — Policy (22), Claim (24), Pause (25), nested Settings.
- `src/screens/policy/PolicyScreen.tsx`, `ClaimScreen.tsx`, `PauseRequestScreen.tsx`.
- `src/navigation/TabNavigator.tsx` — IP customers get Home, Fitness, Goals (placeholder), Store
  (marketplace), Policy; Life customers keep Longevity, Fitness, Kalettes, Settings.
  `src/components/lumen/LumTabIcon.tsx` gained target/bag/shield icons;
  `src/navigation/KalettesStackNavigator.tsx` takes an `initialRouteName`.
- `src/services/onboarding/resolvePostAuthRoute.ts` — only a richer dev log (prints uid, the
  `cardios/<uid>` path checked and the assessments found when routing to ConnectTracker).

Needed before this works live: a user with an `incomeProtection` map (the website writes it at
checkout); Firestore rules allowing a signed-in user to read their own `prospects/{id}` and create
in `pauseRequests`; the real disclaimer text and Best's claims URL.

## 5. Agreed next build order (user chose Policy first, then Goals)

1. Goals tab (4 screens + coaching request). Collections to create: a goals collection per user
   (this quarter's goal: "up" or "hold" with optional note) and coach-set long-term goals with
   commentary. Coaching request should be sent server-side to alex@kale.insure (the prototype uses
   mailto). Remove the `GoalsComingSoonScreen` placeholder in TabNavigator when done.
2. Then: onboarding screens 12/13/15, first results (17), home rework (19/20/21/26), quarterly
   results (18), price change notice (23), store rework, reminders, app icon. See the scope page.

## 6. Open bug being worked on when the session ended

Test account `jannat.tariq+110@thechakor.com` (password known to the user; not recorded here).
Auth UID `Bp1QMZ7guNgFCu6te7wAqCj14PN2`. After sign-in the app goes to Connect Tracker instead of
the cardio result. Cause, confirmed from the app's own log and a direct Firestore read: there is no
document at `cardios/Bp1QMZ7guNgFCu6te7wAqCj14PN2` in production, and no `assessments` doc with
`user_id` equal to that UID. The user edited the existing cardio document's `user_ref` field to
point at the user, but that document's ID is still the anonymous UID from the website's Strava
connection; the app only looks documents up by ID (Firestore rules deny collection queries on
`cardios`, as a probe showed). The backend "claim" step that re-homes the document runs only with
a pending OAuth token, which never happened for this account.

Resolution path given to the user: in the Firebase console (production), add a document in
`cardios` with ID `Bp1QMZ7guNgFCu6te7wAqCj14PN2` carrying `assessmentStatus: "level_assigned"`,
`level: 5`, `is_completed: true`, plus `runLevel 5`, `levelSource "Running"`, `platform "strava"`,
`vo2max 46.6`, `time_5k 14.45`, `runCount 14`, `user_ref → users/<uid>`. Then force-quit and reopen.
Longer term this is a website/backend question (does checkout keep the anonymous UID, or does the
claim write `cardios/{realUid}`?) in `lib/ip/account.ts` of the website repo, not in this app.

## 7. How to run

- Expo Go server: `npx expo start --go --port 8082` (port 8081 was held by another instance).
  The plain `npm run start:go` opens in dev-build mode; press `s` or pass `--go`.
- iPhone 17 Pro simulator (UDID `C70C7D80-8CC9-4AEB-A324-87D5884CB6AA`) has Expo Go 58.0.7
  and is signed in to the test account above. After code changes to font or routing logic, quit
  Expo Go fully (`xcrun simctl terminate <udid> host.exp.Exponent`) and reopen
  `exp://127.0.0.1:8082`, or stale font registrations survive a plain reload.
- Phone: same Wi-Fi, scan the QR, or type `exp://192.168.100.38:8082` into Expo Go.
- Type check: `node_modules/.bin/tsc --noEmit -p tsconfig.json` (14 pre-existing errors; do not
  add more).
- `AGENTS.md` asks that the versioned Expo docs (now v58) be read before writing code.

## 8. Things not in this repo that the IP work depends on

- From the website repo: `lib/ip/rating.ts` (to confirm the lookup matches the CSV), the
  `IP_DISCLAIMER` text in `lib/ip/pricing.ts`.
- From Best Insurance: rated-age update endpoint on a live policy (without it no price can change
  after payment 1), prices at other levels, webhooks for payment failed / lapse / claim / pause.
- Decisions still open: birthday re-pricing timing; whether coaching is included or paid; who takes
  payment in the Store; the Fitness Age projection values; possible later recolour to the "Bible"
  palette (only two design screens use it so far).
