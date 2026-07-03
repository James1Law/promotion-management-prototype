# Promotion Management — Prototype PRD

**Status:** Built — prototype delivered (§9 tracks as-built state)
**Author:** James Law
**Date:** 2026-07-01
**Purpose:** Define the scope of a clickable prototype that illustrates the "simple version" of promotion management agreed with Sophie, to be shared ahead of Friday's planning meeting.

> §1–8 record the agreed scope and the decisions behind it (kept as the historical
> spec). **§9 is the source of truth for what has actually been built** and where the
> implementation has since evolved beyond the original spec.

---

## 1. Background & Context

Today, promotion of a seafarer in OpenOcean Studio (OOS) is represented only by a change in rank. The real-world process — checking eligibility, routing an approval, and recording the promotion — lives partly in OOS's joining/approval workflow and partly in Zodiac's separate intranet. This is manual, gets stuck with individuals, and generates weeks of chaser memos.

A [full solution proposal](full-solution-proposal.md) was drafted last year describing the complete capability (configurable eligibility criteria, candidate pools, gap analysis, succession forecasting, audit packs). That remains the long-term vision. **This prototype deliberately scopes down** to the "simple version" Sophie confirmed is the right starting point: a **promotion form triggered at the point of promotion**, feeding a **configurable approval workflow**, ending in an **"Approved for Promotion"** status — with the actual rank change left as a deliberate manual step.

The promotions dashboard (ranked candidates by eval score, licence, vessel experience) and full eligibility-criteria engine are explicitly **out of scope** for this prototype; they are a later workstream fed by the evaluation and experience modules already in build.

## 2. Goals of the Prototype

1. Make the end-to-end flow tangible and clickable: **initiate → route → approve (multi-step) → approved for promotion → manual rank change**.
2. Show how the promotion form **pre-populates** the decision-support data crewing already holds (experience, evaluations, licences) so approvers decide in-context.
3. Demonstrate the **multi-approver workflow** (sequential approvals, with skip / pause / reject / request-info) mirroring the existing joining/applicant approval pattern.
4. Provide a concrete artefact to align the team and drive requirements, designs, and estimates.

**Non-goals:** production data, real integrations, real email, configuration UIs, eligibility scoring, candidate ranking, succession forecasting, audit-pack export.

## 3. Personas

| Persona | Role in flow |
|---|---|
| **Initiator** (Crew Operator / Fleet Manager) | Triggers the promotion form from a seafarer, reviews pre-populated data, adds remarks/attachments, submits. |
| **Approver(s)** (Dept head — Marine/Technical, DPA, Director) | Receives notification, opens the promotion, sees the same data + remarks + attachments, and approves / rejects / requests info. Chain may be several people in sequence. |
| **Promoter** (Crew Operator) | After "Approved for Promotion", performs the actual rank change at the chosen moment. Often the same person as the Initiator. |

## 4. Key Design Decisions (for the prototype)

### 4.1 Entry points
There are currently **multiple places** a promotion can be triggered:
- Crew Directory → seafarer profile → **Promote** button ("Promote seafarer" modal, just a rank dropdown today)
- Crew Directory → **Ready for promotion** / **Cancel ready for promotion** toggle
- Assignments → **Promote crewman** modal

These are inconsistent and confusing. **Decision:** for the prototype we **keep the existing entry points but have every one of them open the same consistent promotion form.** This is the lowest-disruption path and demonstrates a single, consistent experience regardless of where the user starts. (Full consolidation to one entry point remains a later option to discuss.)

### 4.2 The promotion form
Replaces the current bare "New rank" dropdown with a richer, pre-populated form. Sections:

- **Header** — seafarer identity, current rank, target rank (selectable), vessel type.
- **Experience** — years in rank; years as operator/officer; years on tankers *and/or* years on containers, shown conditionally based on vessel type; other relevant sea-time aggregations.
- **Recent evaluations** — the last 3 evaluation scores, with a link that opens the seafarer's Evaluations tab in a new tab.
- **Licences & documents held** — the licences/certificates the seafarer holds (sourced from the existing documents module), with a link that opens the Documents module in a new tab.
- **Remarks** — free-text box for additional context.
- **Attachments** — ability to attach a supporting file.
- **Submit for promotion** — routes to the relevant department and moves the seafarer into the workflow.

### 4.3 The approval workflow
- Mirrors the existing joining/applicant approval workflow: a **configurable sequence of approvers** with the ability to **approve / reject / pause / skip**.
- **Decision:** the prototype uses a **fixed 3-step sequential chain** (Person X → Person Y → Person Z), each step with approve / reject / pause / skip. This is the clearest illustration of the multi-approver idea; parallel approval and explicit skip-by-senior demos are deferred.
- Each step notifies the next approver **by email with a link** (mocked in the prototype); a **workflow/progress bar is visible in the UI**.
- Each approver sees the **same pre-populated data**, plus the initiator's remarks and attachments, and records a decision with comments.

**Workflow UI pattern.** Reuse the existing **applicant approval stepper** (see `OOS-Screenshots/applicant-workflow.png`) rather than inventing a new visual. In that pattern, a **"Promotion approval"** panel sits at the top of the seafarer's Summary tab as a **horizontal stepper**:
- Each configured stage is a node on a line. **Completed** stages show a green tick with the approver's **role, name and decision date** (e.g. "Marine superintendent / Henk Koopman / 03 Jun 2026"). The **current** stage is a highlighted dot with its pending approver's role. Upcoming stages are muted.
- The number of nodes reflects the **configured chain** for that customer/transition (here, a fixed 3-step chain), exactly as the applicant flow renders a variable number of stages per customer.
- A **status pill** next to the seafarer's name reflects state: *Pending approval → Approved for promotion → (or) Rejected*.

### 4.4 End state & the deliberate manual step
- On final approval, the seafarer reaches **"Approved for Promotion"** status.
- The **actual rank change is NOT automatic.** It remains a manual action performed by the crew team when the timing is right (avoids auto-promoting mid-contract, at sign-on, or pre-sign-on).
- The prototype shows this final manual "apply the promotion" action and the resulting rank-history update.

## 5. Prototype Scope — Screens / States

1. **Entry point(s)** on a seafarer — the trigger(s), per the decision in Q1.
2. **Promotion form** — pre-populated, with remarks + attachment + submit (§4.2).
3. **Submitted confirmation + in-progress status** on the seafarer profile, showing the workflow progress bar.
4. **Email notification** (mocked) to the next approver, with a link into the promotion.
5. **Approver review view** — same data, remarks, attachments; approve / reject / pause / skip / request-info; comment capture.
6. **Multi-step progression** — the clicker can advance through Approver 1 → 2 → 3.
7. **"Approved for Promotion" status** on the seafarer.
8. **Manual rank-change action** and resulting updated rank on the profile.
9. **Rejection path** — an approver rejects with a reason; the request is closed with that reason and remains visible in the promotion history.

Both the **happy path** (through to approved + manual rank change) and the **rejection path** are in scope. Request-more-info loops and an in-flight promotions list are **out of scope** for this prototype.

## 6. Assumptions

- The prototype uses **mock/seed data** for one or a few representative seafarers (at least one tanker officer and one container/engineer example so vessel-type-conditional fields are visible).
- Evaluation and licence/document links are **stubs** that open a placeholder "new tab" view; they need not be the real modules.
- Email is **simulated** in-app (a rendered email preview), not actually sent.
- Approval-chain configuration is **hardcoded** to a representative chain for the demo; the config UI is out of scope.
- Visual style should **echo OpenOcean Studio** (dark navy sidebar, teal/green accents, clean enterprise layout) so it reads as native, without being pixel-perfect.
- A **role/persona switcher** will be provided in the prototype so a single clicker can walk through initiator and each approver in turn (prototype convenience, not a product feature).

## 7. Resolved Decisions

- **Entry points** — Keep existing entry points; unify them behind one shared promotion form. *(§4.1)*
- **Approval chain** — Fixed 3-step sequential chain with approve / reject / pause / skip. *(§4.3)*
- **Flow coverage** — Happy path + rejection path. No request-info loop, no in-flight list. *(§5)*

## 8. Resolved Decisions (cont.)

- **Rank transitions requiring workflow** — For simplicity, **every promotion routes through the workflow** in the prototype. The "recorded directly, no workflow" path for lateral rating moves is not modelled.
- **Workflow engine / UI** — Keep the workflow visuals **generic** (not tied to Peter's future engine). Concretely, **reuse the existing applicant approval stepper pattern** (§4.3) so promotions read as a natural sibling of the crew-applicant approval flow already in OOS.

---

## 9. Implementation Status (as built)

The prototype is built and deployed. Stack: **Vite + React 18 + TypeScript + Tailwind
CSS v4 + react-router (HashRouter) + zustand**. It is config-driven (see `CLAUDE.md`).
Repo: <https://github.com/James1Law/promotion-management-prototype> (static SPA, Vercel-ready).

### Delivered

| Area | State | Where |
|---|---|---|
| Crew Directory styled like the live product (search/sort/filter chrome, coloured avatars, MA/status/DOB/age columns, availability chips) — 5 clickable seed profiles + an illustrative non-clickable filler roster | ✅ | `pages/CrewDirectoryPage`, `data/seafarers.ts`, `data/directoryFiller.ts` |
| Live **Evaluations tab** (Onboard/Others/Personal-objectives sub-tabs, flagged filter, appraisal rows joined to service periods) — **hosts the Promote entry point** | ✅ | `components/promotion/EvaluationsTab`, `SeafarerProfilePage` |
| Promotion **form** (pre-populated: experience, evaluations, licences, remarks, attachment) | ✅ | `components/promotion/PromotionForm` |
| **Assignments board** styled like the live product (vessel groups, outgoing/incoming crew, Gap/Overlap, month separators, expandable rows) — the **Promote** button in an expanded row is the second entry point | ✅ | `pages/AssignmentsPage`, `data/assignments.ts` |
| Unified entry points (Evaluations-tab **Promote** + Assignments-board **Promote** both open the same form) | ✅ | `components/promotion/EvaluationsTab`, `pages/AssignmentsPage` |
| Vessel-type-conditional experience rows (tankers/containers/bulk) | ✅ | `data/formConfig.ts` (`EXPERIENCE_ROWS`, `showIf`) |
| Per-transition approval workflow (full / single-step / none), approve / reject / pause / skip | ✅ | `data/approvalChains.ts`, `store/promotionStore.ts` |
| Applicant-style **stepper** on the profile (line centred on nodes) | ✅ | `components/promotion/PromotionStepper` |
| Simulated **email** notification with deep link into the review | ✅ | `components/promotion/EmailPreview` |
| **Approver review** (decision-support + decision controls) | ✅ | `components/promotion/PromotionReviewModal` |
| Persona-gated decisions + "Switch to …" shortcut | ✅ | review modal + `PersonaSwitcher` |
| **Approved for promotion** → shoreside **Plan into crew change** (rank + date) | ✅ | `SeafarerProfilePage` (plan-into-crew-change modal) |
| Simulated **onBOARD** vessel view + **Captain** persona; gated **Promote** executes the in-place rank change | ✅ | `pages/OnboardCrewPage`, `data/personas.ts` |
| Decision-support shows **last 3 vessels/contracts** (spot vessel-type/size mismatches); Experience compacted | ✅ | `components/promotion/ExperiencePanel`, `data/formConfig.ts` |
| **Vessel** on the promotion record — auto (current vessel) if aboard, **planned-vessel dropdown** if at home | ✅ | `PromotionForm`, `data/vessels.ts` |
| Live **Contracts tab** (Present/Past + inline **Promotion** markers, incl. the applied promotion) | ✅ | `components/promotion/ContractsPanel`, `SeafarerProfilePage` |
| **Rejection path** (reason captured, workflow halted, shown on profile) | ✅ | store + `PromotionStepper` |
| OOS-styled shell (navy sidebar + navy top bar), role switcher, "Reset demo" | ✅ | `components/layout/*` |

### Evolutions since the original spec (§1–8)

These were agreed in review sessions after the initial spec and are the current design:

1. **Chrome & CTAs are blue, not teal/green.** The top bar is dark navy (matching the
   sidebar) and all primary calls-to-action use an OOS **action-blue**. (The design token
   is still named `teal` in `src/index.css` for utility-class compatibility, but holds a
   blue value — noted there.) *(supersedes the "teal/green accents" note in §6)*
2. **Evaluations are scored on a 1–10 scale, not percentages.** Scores render as e.g.
   `9.2 / 10` with a qualitative label (Excellent / Good / Satisfactory / …). *(refines §4.2)*
   See `lib/format.ts` (`formatScore`, `scoreLabel`, `scoreTone`).
3. **The whole flow is modal-driven.** Initiating (`PromotionForm`) and approving
   (`PromotionReviewModal`) are **modals over the existing UI**, not separate pages. The
   old `/seafarer/:id/promotion` page was removed. *(refines §5.5)*
4. **The profile Summary tab shows normal crew summary, not the decision-support panels.**
   The Summary shows the promotion workflow card at the top plus OOS-style crew details /
   service summary / documents (`ProfileSummary`). Experience / evaluations / licences are
   revealed **only** in the review modal, when the approver clicks "Review & decide".
   *(refines §4.2 / §5)*
5. **The approval workflow is now resolved per rank-transition, not one fixed chain.**
   Feedback (Jul 2026) confirmed real transitions need different treatment. The chain is
   keyed off the target rank's STCW responsibility tier (`data/approvalChains.ts`):
   - **Management-level** promotions (→ Chief Officer, Master, 2nd Engineer, Chief Engineer)
     run the **full** chain: Superintendent → DPA → Crewing Director.
   - **Operational-level** promotions (→ 2nd/3rd Officer, 3rd/4th Engineer) need a
     **single** Superintendent sign-off.
   - **Rating / trade** lateral moves (→ AB, Bosun, Fitter Grade A) need **no workflow** —
     the operator records the change directly (form submits straight to "Approved for
     promotion"). Seed crew now include an operational example (Chidi Okafor, 3/O→2/O) and
     a trade example (Emmanuel Santos, Fitter B→A) so all three tiers are clickable.
     *(supersedes the fixed 3-step decision in §4.3 / §8)*
6. **Evaluations surface a "Recommended for promotion" thumbs-up.** Where recent evaluation
   scores are listed, an evaluation whose appraisal ticked *Recommended for promotion* shows
   a thumbs-up chip (`Evaluation.recommendedForPromotion`, `EvaluationsPanel`). This is the
   first of the "usual requirements" Sophie asked us to capture; the fuller criteria set
   (recommendations count, specific certificates, HSQE/medical flags, sea-time by vessel
   type) is documented below and deferred to a later pass.
7. **The Promote entry point moved into the Evaluations tab, to match the real product.**
   Previously a `Promote` button sat on every Crew Directory row and on the profile header —
   convenient for the demo but unlike OOS. It now lives only in the footer of the profile's
   **Evaluations tab** (`EvaluationsTab`), alongside a decorative **Ready for promotion**
   button (non-functional in the prototype, mirroring the product). The Crew Directory itself
   was rebuilt to look like the live product (see the delivered table): the first 5 rows are
   the rich, clickable seed profiles; the rest are an illustrative filler roster
   (`data/directoryFiller.ts`) with no profile behind them. The Summary tab still carries the
   promotion-approval card once a request exists; the Evaluations tab just *initiates* it.
   *(supersedes the "keep existing entry points" framing in §4.1 for where Promote lives)*
8. **The Assignments screen was rebuilt to mirror the real OOS board.** It now shows crew
   grouped by vessel/position, with the outgoing crewman on the left, the incoming (or
   "Crewman not assigned") successor on the right, a Gap/Overlap indicator between them, month
   separators, and expandable rows. It is presentational (`data/assignments.ts` is vanity
   data) except the **Promote** button revealed when an unassigned row is expanded, which
   opens the shared `PromotionForm` for the row's linked seed seafarer — proving the second
   entry point. A decorative **Assign** / **Sign off** button sit alongside it. *(refines the
   §4.1 Assignments entry point)*

### The OOS ↔ onBOARD interaction (built)

Feedback surfaced how a promotion actually *executes* in the wider product, which reconciles
neatly with our "deliberate manual step". It is **three acts, three actors, gated in order**:

1. **Decide (office, ashore/OOS):** initiate + approval workflow → **Approved for promotion**.
   (The new part — today this is informal, no formal approval.)
2. **Plan (office, ashore/OOS Crew Assignments):** only once approved, the office plans the
   promotion into a crew-change slot — confirmed new rank + **promotion date**. This
   *schedules* it (sets `plannedPromotionDate`); the rank does **not** change yet. It is what
   makes a **Promote** button appear onBOARD.
3. **Execute (Captain, onBOARD, on the day):** because it is approved **and** planned, the
   Captain sees a **Promote** button against that seafarer (distinct from Sign-on — they are
   already aboard, so the rank changes *in place*). This is the actual rank change; it flows
   back to OOS / payroll.

So there are two "Promote" buttons and they are **not** duplicates: the shoreside one
*plans/schedules*, the onBOARD one *executes*. Sophie's key rule — **no Promote button
onBOARD until fully approved** — is the gate we model.

**As built (item B):**

| Piece | Where |
|---|---|
| `plannedPromotionDate` on the request | `data/types.ts` |
| Shoreside **Plan into crew change** step (approved-only; sets rank + date) | `SeafarerProfilePage` (replaces the old ashore "Apply rank change") |
| Simulated **onBOARD** vessel screen (own chrome, crew grouped by rank, Sign-on/off) | `pages/OnboardCrewPage` (`/onboard`) |
| **Captain** persona (`kind: 'promoter'`) — gates the onBOARD Promote | `data/personas.ts` |
| Promote appears onBOARD **only** when approved **and** planned; Promote → confirm modal → in-place rank change (`applyRankChange`) | `OnboardCrewPage` |

Prototype simplification: the onBOARD screen shows all seed crew as one demo vessel; the
office↔ship data sync is instantaneous (shared in-memory store).

Open question we could not verify (crewing can't currently replicate the live behaviour):
whether the rank change technically fires from the shoreside schedule (effective-dated) or
strictly requires the onBOARD click. It does not affect the prototype — the point being
demonstrated is the **approval gate**, which holds either way.

**At-home promotions (edge case, documented not built).** Promoting someone who is *at home*
uses the **same decide → approve** front half — approval is location-independent. Execution
differs: there is no onBOARD in-place Promote; the rank change is recorded ashore and the
seafarer is simply **assigned at the new rank** for their next contract (signing on at the
new rank). Confirmed as an edge case, so the distinct at-home execution path is **not built**;
the prototype instead shows the *inputs* for it — a seed seafarer on leave (Sofia Marchetti)
and the promotion form's **planned-vessel dropdown** for a not-onboard seafarer.

**Fuller promotion criteria to capture later (Sophie's ask).** Beyond years-in-rank,
licences and evaluation scores (already shown): captain **recommendations** (count / from
distinct captains), **specific certificates/training** per transition (e.g. COW for tankers),
**sea-time by vessel type** in the target rank, valid **medical / fit-to-work**, and no open
**HSQE / disciplinary** flags — each markable mandatory / recommended / optional per
transition. To be confirmed with crewing, then wired into the decision-support panels.

### Not built (deferred, as per §2 non-goals and §5/§7/§8)

- Promotions dashboard / candidate ranking, eligibility-criteria engine, gap analysis,
  succession forecasting, audit-pack export.
- Configuration UIs (approval chain, criteria) — the chain is hardcoded.
- Request-more-info loop; parallel approval; explicit skip-by-senior demo; in-flight list.
- Real integrations, real email, persistence (state is in-memory and resets on refresh).
