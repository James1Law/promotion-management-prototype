# Promotion Management — Prototype PRD

**Status:** Draft for review
**Author:** James Law
**Date:** 2026-07-01
**Purpose:** Define the scope of a clickable prototype that illustrates the "simple version" of promotion management agreed with Sophie, to be shared ahead of Friday's planning meeting.

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

*Next step after sign-off: build the clickable prototype (HTML/React), OOS-styled, covering the screens in §5.*
