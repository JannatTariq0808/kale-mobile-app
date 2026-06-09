# kale-mobile-app

Kale mobile app — **Expo + React Native + TypeScript**.

## Design reference (link both repos)

**Open both folders in one Cursor window** so the AI can read the design:

1. **File → Open Workspace from File…**
2. Choose `~/Downloads/kale.code-workspace`

Or: **File → Add Folder to Workspace…** → add `kale-mobile-design`.

All UI specs:

```
../kale-mobile-design/
  DESIGN.md          ← canonical style (Lumen), screen map, Garmin rules
  screens/*.jsx      ← read BEFORE building each RN screen
  capture-*.html     ← layout reference
  kale-tokens.css    ← brand tokens
```

Before building a screen, the AI must read **DESIGN.md** + the matching JSX file.
Do not let the app invent its own UI — match the design repo.

Preview design locally:

```bash
cd ../kale-mobile-design && python3 -m http.server 5173
```

## Stack

- Expo SDK 56
- React Native
- TypeScript
- Firebase (to be added)

## Run

```bash
npm install
npm start
# then i for iOS simulator, a for Android
```

## Project structure

```
src/
  theme/       ← colors & type from design repo (copy values, not CSS)
  screens/     ← one file per screen; comment design ref at top
  components/  ← shared UI
```

## Screen checklist

See `../kale-mobile-design/DESIGN.md` for full map. Build order suggestion:

1. Theme + tab shell
2. Settings (`lum-20`) — capture-settings.html
3. Welcome + sign in (`lum-01`, `lum-01b`)
4. Home (`lum-12`)
5. Activity log (`lum-13`) — port Garmin row from capture-activity-log.html
6. Firebase auth + Firestore
