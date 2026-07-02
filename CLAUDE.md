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
    approvalChains.ts   ← approval workflow, resolved PER TRANSITION — CHANGE THE WORKFLOW HERE
    personas.ts         ← prototype role switcher (approvers derived from the chains + Captain)
    formConfig.ts       ← which experience rows / how many evaluations / deep links
  store/
    promotionStore.ts   ← zustand: active persona + promotion requests + actions
  lib/                  ← cn(), formatting helpers
  components/
    ui/                 ← generic primitives (Button, Badge, Card, Modal, Field)
    layout/             ← Shell, Sidebar, TopBar, PersonaSwitcher, icons
    promotion/          ← promotion-specific, reused across screens:
                          PromotionForm, PromotionReviewModal, PromotionStepper,
                          ProfileSummary, ExperiencePanel, EvaluationsPanel,
                          LicencesPanel, EmailPreview, …
  pages/                ← one file per route (CrewDirectory, SeafarerProfile,
                          Assignments, OnboardCrew [the simulated onBOARD vessel
                          view — where a promotion is executed], StubPage)
  App.tsx               ← routes
```

Design tokens (OOS palette, radii) live in `@theme` in `src/index.css`. Components use
token utilities (`bg-navy`, `text-teal`, `border-line`) — never raw hex — so a re-skin is
a one-file change. Note: the token named `teal` holds the OOS **action-blue** (the name is
kept for utility-class compatibility); the navy is the chrome colour (sidebar + top bar).

## How to make common changes

- **Change which approval chain a promotion uses** → edit `data/approvalChains.ts`.
  The chain is resolved **per rank-transition** (`chainForTransition`), keyed off the
  target rank's tier: management-level = full 3-step, operational-level = single
  sign-off, rating/trade = **no workflow** (recorded directly, request goes straight to
  "Approved for promotion"). The stepper UI, the approver personas (`allApprovalStages`)
  and the store all derive from it automatically.
- **Add a piece of decision-support info** (e.g. a new experience metric) → add the
  field to `Experience` in `types.ts`, a value in each seed seafarer, and a row in
  `EXPERIENCE_ROWS` in `formConfig.ts`. Use `showIf` for vessel-type-conditional rows.
- **Change how many recent evaluations show** → `RECENT_EVALUATION_COUNT` in `formConfig.ts`.
- **Change the evaluation scoring scale** → evaluations use a **1–10** scale (10 = excellent),
  shown as `9.2 / 10` with a qualitative label. Bands and formatting live in `lib/format.ts`
  (`formatScore`, `scoreLabel`, `scoreTone`); seed values are on `Evaluation.score`.
- **Add a seafarer** → append to `SEAFARERS` in `seafarers.ts`.
- **Add a rank transition** → extend `RANKS` / `PROGRESSION` in `ranks.ts`.
- **Add an entry point** → render `<PromotionForm seafarer=… />` behind a button;
  every entry point opens the same form by design (see PRD §4.1).
- **Re-skin** → edit the tokens in `src/index.css`.

## Conventions

- The promotion flow is **modal-driven**: initiating (`PromotionForm`) and approving
  (`PromotionReviewModal`) are modals over the existing UI. The decision-support panels
  (experience / evaluations / licences) appear **only** in those modals — the profile
  Summary tab (`ProfileSummary`) shows the workflow card plus normal crew summary, never
  the decision-support panels.
- OOS chrome is navy (`bg-navy`, sidebar + top bar); all primary calls-to-action use the
  action-blue token (`bg-teal`, see `src/index.css`).
- Prototype-only affordances (the persona switcher, "Reset demo", the "Prototype"
  badge) are clearly marked as such in code comments — they are not product features.
- State is in-memory only; a refresh resets the demo. That is intentional.
- Keep new domain concepts in `data/types.ts` first; let types drive the rest.

## Deploy

Static SPA. Repo: <https://github.com/James1Law/promotion-management-prototype> (`main`).
Import into Vercel (framework auto-detected as Vite; `vercel.json` is present as a fallback
with SPA rewrites). Build command `npm run build`, output `dist/`.

## Current state & what's next

The end-to-end flow is built and verified: initiate → **per-transition** approval (full /
single-step / none, approve / reject / pause / skip, persona-gated) → Approved for Promotion
→ shoreside **Plan into crew change** (rank + date) → **onBOARD Captain Promotes** (in-place
rank change), plus a rejection path. See **`notes/prototype-prd.md` §9** for the full as-built
status, the evolutions since the original spec (blue chrome/CTAs, 1–10 eval scores,
modal-driven review, summary-only profile, per-transition workflow tiers, recommendation
thumbs-up), and the **OOS↔onBOARD interaction** (the three-act decide → plan → execute model,
with the approval gate on the onBOARD Promote button). When picking up new work, read §9 first.
