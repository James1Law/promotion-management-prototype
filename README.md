# Promotion Management — Prototype

A clickable prototype for **seafarer promotion management** in OpenOcean Studio (OOS).

It demonstrates the "simple version" of the capability:

1. **Initiate** — a pre-populated promotion form (experience, recent evaluations,
   licences held, remarks + attachment) triggered from a seafarer, from any entry point.
2. **Route & approve** — a configurable multi-step approval workflow, shown with the
   same stepper pattern OOS uses for crew-applicant approval. Each approver can
   approve / reject / pause / skip, with an emailed notification (simulated).
3. **Approved for promotion** — the end state after final approval.
4. **Manual rank change** — a deliberate, separate step so the rank changes only when
   the timing is right (not automatically at sign-on or mid-contract).

Both the happy path and a rejection path are included.

> This is a design prototype: mock data, no backend, simulated email. In-memory
> state resets on refresh. A "Prototype" badge, a role switcher, and "Reset demo"
> buttons are demo aids, not product features.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Try it: open a seafarer from the **Crew Directory**, click **Promote**, submit, then
use the **role switcher** (top-right) — or the "Switch to …" shortcut on the review
screen — to approve as each department in turn.

## Build & deploy

```bash
npm run build    # → dist/
npm run preview  # serve the production build
```

Deploys as a static SPA on **Vercel** (framework auto-detected; `vercel.json`
provides SPA-rewrite fallback). Output directory: `dist/`.

## Docs

- Requirements: [`notes/prototype-prd.md`](notes/prototype-prd.md)
- Architecture & how to extend: [`CLAUDE.md`](CLAUDE.md)
- Long-term vision (out of scope): [`notes/full-solution-proposal.md`](notes/full-solution-proposal.md)
