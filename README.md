# Lavansh Choubey — Signal / Noise portfoli

A fully static, frontend-only portfolio built with Next.js, Three.js (React Three Fiber), GSAP + ScrollTrigger, Motion (Framer Motion), Lenis and Tailwind CSS.

## Start (one command)

```bash
npm run launch
```

This installs everything and starts the dev server at http://localhost:3000. Needs Node.js 20.9 or newer.

## Other commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (after the first install) |
| `npm run build` | Build the production Next.js app |
| `npm start` | Start the production Next.js server locally |
| `npm run typecheck` | Run TypeScript checks |

## Deploy

- **Vercel:** import the repo with the Next.js framework preset, use `npm run build`, and leave Output Directory empty/default.
- **Other hosts:** use a Next.js-compatible deployment rather than uploading an `out/` directory.

## Edit your content

All text lives in one file: `src/content/profile.ts`.

Search it for `TODO(verify)` — those lines need your confirmation:

- Repo / live links for PRAPTI-AI, SAHAYAK-AI, Incident Triage Agent, Sephela, Velocity AI, TANFI-NET and Pravah.ai (set to `null` = button hidden, shows "Code on request")
- SAHAYAK-AI and PRAPTI-AI look like C-DAC work — confirm they can be shown publicly (the client name is left out)
- The positioning line and the project "problem" lines (drafts)
- C-DAC bullets are past tense while the internship is ongoing
- Which LinkedIn URL is correct
- Dates for each PLACFV's step (Volunteer → Associate Head → Lead) and named events

## How it's built

The site is one story in 8 chapters (`story` in `src/content/profile.ts`). Each chapter is a **scene** (a pinned stretch where the 3D world is on stage, with a title card and first-person subtitles) followed by its **content panel**.

| Chapter | Scene (the signal becomes…) | Content panel |
| --- | --- | --- |
| 00 Noise | storm → cube | Hero |
| 01 The Person | a lattice tunnel you fly through | About + dot portrait |
| 02 Roots | a map, zoomed into Delhi NCR at Gurugram, then out to Chennai | (map stops with photos) |
| 03 The Toolkit | a star field | Technical universe |
| 04 The Builds | a track running into the distance | Projects |
| 05 The Road | the map again: Noida → Gurugram → Delhi → Hyderabad → Guwahati | Experience |
| 06 The Arena | a medal | Achievements + 3D podium |
| 07 Beyond the Screen | a horizon at dawn | How I work |
| 08 Signal | the sun in the final photo | Contact |

The journey (cities, stops, captions, photos) lives in `cities` and `journey` in `src/content/profile.ts`.

| Area | Where | Tech |
| --- | --- | --- |
| The 3D world (one canvas, 4,096 points, 9 shapes) | `src/components/three/World.tsx`, `shapes.ts` | R3F + custom GLSL; shapes blend on the GPU |
| Scenes, title cards, subtitles, night → dawn sky | `src/components/story/Scene.tsx` | GSAP ScrollTrigger |
| Map chapters (Roots, The Road), stop cards, photos | `src/components/story/JourneyScene.tsx` | GPU zoom into NCR; city labels projected from 3D every frame |
| Ending (sun → photo, contact) | `src/components/story/Epilogue.tsx` | world aligns to a DOM anchor in the photo |
| Chapter HUD, menu, quick view | `src/components/story/HUD.tsx`, `QuickView.tsx` | Motion |
| Shared state DOM ↔ WebGL | `src/lib/storyStore.ts` | plain mutable store, no re-renders |
| 3D podium | `src/components/three/Podium3D.tsx` | R3F + drei |
| Smooth scroll | `AppProvider` | Lenis driven by GSAP's ticker |
| Photos | `public/photos/*.webp` | pre-compressed, lazy-loaded |

### Performance and accessibility

- The world renders only while a scene is on screen; content panels are opaque, so it pauses behind them
- 3D is lazy-loaded and disposes GPU resources on unmount
- No WebGL → the story still reads (title cards, subtitles, stop cards); the podium has a flat fallback
- `prefers-reduced-motion` → no smooth scroll, no scramble, static particle frame, short loader
- Phones get a resized map, a vertical project list instead of horizontal scroll, and chip lists instead of the constellation
- "Quick view" in the top bar shows everything as a one-page resume
- Keyboard: skip link, visible focus, focusable constellation nodes, Escape closes the mobile menu
- Fonts are self-hosted (no external requests)
# New_portfolio
