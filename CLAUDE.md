# CLAUDE.md

Guidance for working in this repository.

## What this is

A **clickable prototype** for OpenOcean Studio (OOS) **seafarer promotion management**.
It illustrates the "simple version" agreed with crewing: a pre-populated promotion
form → a configurable multi-step approval workflow → an **"Approved for promotion"**
state → a deliberate **manual** rank change. It is a design artefact, not production
code: all data is mock/seed, email is simulated, and there is no backend.

The requirements live in [`notes/prototype-prd.md`](notes/prototype-prd.md). The
long-term vision (out of scope here) is in [`notes/full-solution-proposal.md`](notes/full-solution-proposal.md).

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** (config-in-CSS via `@theme` in `src/index.css`)
- **react-router-dom** (HashRouter — static-host friendly, no server rewrites needed)
- **zustand** for the single runtime store

## Commands

```bash
npm install       # install deps
npm run dev       # dev server @ http://localhost:5173
npm run build     # typecheck (tsc -b) + production build to dist/
npm run preview   # serve the production build @ http://localhost:4173
npm run typecheck # types only
```

> When verifying with a browser/Playwright, prefer `npm run preview` — the dev
> server's HMR can reset in-memory state (the store) mid-interaction.

## Architecture — and the one rule that matters

**Everything the prototype needs to grow or shrink is expressed as _data/config_,
not hand-written UI.** Screens render from config; changing behaviour means editing
a config array, and the compiler guides the rest. Keep it this way.

```
src/
  data/                 ← domain model + all configuration (edit here first)
    types.ts            ← single source of truth for data shapes
    seafarers.ts        ← seed seafarers
    ranks.ts            ← rank ladder + progression (drives target-rank options)
    approvalChains.ts   ← the approval workflow (stages) — CHANGE THE WORKFLOW HERE
    personas.ts         ← prototype role switcher (approvers derived from the chain)
    formConfig.ts       ← which experience rows / how many evaluations / deep links
  store/
    promotionStore.ts   ← zustand: active persona + promotion requests + actions
  lib/                  ← cn(), formatting helpers
  components/
    ui/                 ← generic primitives (Button, Badge, Card, Modal, Field)
    layout/             ← Shell, Sidebar, TopBar, PersonaSwitcher, icons
    promotion/          ← promotion-specific, reused across screens:
                          PromotionForm, PromotionStepper, ExperiencePanel,
                          EvaluationsPanel, LicencesPanel, EmailPreview, …
  pages/                ← one file per route (CrewDirectory, SeafarerProfile,
                          PromotionReview, Assignments, StubPage)
  App.tsx               ← routes
```

Design tokens (OOS navy/teal palette, radii) live in `@theme` in `src/index.css`.
Components use token utilities (`bg-navy`, `text-teal`, `border-line`) — never raw
hex — so a re-skin is a one-file change.

## How to make common changes

- **Add/remove/reorder an approval step** → edit `data/approvalChains.ts`. The
  stepper UI and the approver personas both derive from it automatically.
- **Add a piece of decision-support info** (e.g. a new experience metric) → add the
  field to `Experience` in `types.ts`, a value in each seed seafarer, and a row in
  `EXPERIENCE_ROWS` in `formConfig.ts`. Use `showIf` for vessel-type-conditional rows.
- **Change how many recent evaluations show** → `RECENT_EVALUATION_COUNT` in `formConfig.ts`.
- **Add a seafarer** → append to `SEAFARERS` in `seafarers.ts`.
- **Add a rank transition** → extend `RANKS` / `PROGRESSION` in `ranks.ts`.
- **Add an entry point** → render `<PromotionForm seafarer=… />` behind a button;
  every entry point opens the same form by design (see PRD §4.1).
- **Re-skin** → edit the tokens in `src/index.css`.

## Conventions

- Prototype-only affordances (the persona switcher, "Reset demo", the "Prototype"
  badge) are clearly marked as such in code comments — they are not product features.
- State is in-memory only; a refresh resets the demo. That is intentional.
- Keep new domain concepts in `data/types.ts` first; let types drive the rest.

## Deploy

Static SPA. Push to GitHub and import into Vercel (framework auto-detected as Vite;
`vercel.json` is present as a fallback with SPA rewrites). Build command
`npm run build`, output `dist/`.
