# Kale Mobile App

Kale longevity & fitness app — **Expo**, **React Native**, and **TypeScript**.

## Stack

- Expo SDK 54
- React Native 0.81
- React Navigation (native stack + bottom tabs)
- Sora font (`@expo-google-fonts/sora`)
- React Native Reanimated + SVG

## Getting started

```bash
npm install
npm start
```

Then press `i` for the iOS simulator or `a` for Android.

Clear the Metro cache if needed:

```bash
npx expo start --clear
```

## Project structure

```
src/
  components/lumen/   Shared Lumen UI (buttons, fields, result layout, etc.)
  screens/
    onboarding/       Welcome, sign-in, cardio/strength/knowledge flows
    result/           Pillar result screens (cardio, strength, knowledge)
  navigation/         Root stack + tab navigator
  theme/              Colors, typography, Lumen tokens
  data/               Static content (e.g. quiz questions)
  hooks/              App hooks (fonts, etc.)
  utils/              Helpers (video picker, fonts, etc.)
```

## Onboarding flow (current)

```
Welcome → Sign in → Cardio analysing → Cardio result
  → Strength intro → Strength analysing → Strength result
  → Knowledge intro → Knowledge quiz → Knowledge analysing → Knowledge result
  → Main (tabs)
```

## Design reference

UI specs and screen prototypes live in the companion repo **`kale-mobile-design`** (sibling folder). Key files:

- `DESIGN.md` — screen map, Lumen tokens, conventions
- `screens/*.jsx` — reference implementations per screen
- `kale-tokens.css` — brand color tokens

Preview the design repo locally:

```bash
cd ../kale-mobile-design && python3 -m http.server 5173
```

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm start`    | Start Expo dev server    |
| `npm run ios`  | Open iOS simulator       |
| `npm run android` | Open Android emulator |
| `npm run web`  | Run in web browser       |

## License

See [LICENSE](LICENSE).
