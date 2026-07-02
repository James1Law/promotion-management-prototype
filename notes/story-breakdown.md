# Promotion Management — Story Breakdown (rough estimation)

A first-pass list of user stories needed to build the promotion-management
feature set illustrated by the prototype. Grouped by area for estimating with
the team. Titles only — deliberately lightweight; each will need fleshing out
(acceptance criteria, design) before it's build-ready.

> Scope note: this mirrors the "simple version" in [`prototype-prd.md`](prototype-prd.md)
> — initiate → approve → approved-for-promotion → manual rank change. The
> promotions dashboard, eligibility-scoring engine, candidate ranking and
> succession forecasting are **out of scope** (later workstream).

---

## 1. Promotion form & entry points

- Trigger a promotion from a seafarer's profile
- Trigger a promotion from the Assignments screen
- Trigger a promotion from the "Ready for promotion" toggle
- Ensure every entry point opens the same shared promotion form
- Select the target rank on the promotion form
- Pre-populate the form with the seafarer's identity, current rank and vessel type
- Add free-text remarks to a promotion
- Attach a supporting file to a promotion
- Choose the vessel for the promotion (auto if aboard, planned-vessel dropdown if at home)
- Submit the promotion into the workflow

## 2. Decision-support data (shown to approvers)

- Show years-in-rank and sea-time experience aggregations
- Show vessel-type-conditional experience rows (tankers / containers / bulk)
- Show the seafarer's last 3 evaluation scores
- Surface a "Recommended for promotion" indicator from evaluations
- Deep-link to the seafarer's full Evaluations tab
- Show licences & certificates held
- Deep-link to the Documents module
- Show the seafarer's recent vessels / contracts (spot vessel mismatches)

## 3. Approval workflow

- Configure an approval chain per rank transition (full / single-step / none)
- Route management-level promotions through the full 3-step chain
- Route operational-level promotions through a single sign-off
- Record rating/trade lateral moves directly with no workflow
- Display the approval progress as a stepper on the profile
- Show a status pill reflecting current promotion state
- Notify the next approver by (simulated) email with a deep link
- Open the approver review view with the same decision-support data
- Approve a step
- Reject a promotion with a reason
- Pause a step
- Skip a step
- Capture approver comments with each decision
- Advance automatically to the next approver on approval
- Gate decisions to the correct approver persona

## 4. Approved → plan → execute (OOS ↔ onBOARD)

- Reach "Approved for promotion" status on final approval
- Plan an approved promotion into a crew change (confirm rank + promotion date)
- Prevent the onBOARD Promote action until approved **and** planned
- Show the simulated onBOARD vessel crew view
- Execute the in-place rank change onBOARD (Captain)
- Reflect the applied promotion in the seafarer's rank history / contracts timeline

## 5. Rejection & history

- Close a rejected promotion with its reason
- Keep rejected promotions visible in the promotion history
- Show promotion markers inline on the Contracts timeline

## 6. Personas, chrome & prototype scaffolding

- Switch between initiator / approver / promoter personas (prototype convenience)
- Apply OOS-styled chrome (navy sidebar + top bar, action-blue CTAs)
- Reset the demo to a clean state
- Seed representative crew across all three workflow tiers

---

## Explicitly deferred (not stories for this phase)

- Promotions dashboard & candidate ranking
- Eligibility-criteria scoring engine & gap analysis
- Succession forecasting
- Audit-pack export
- Configuration UIs (approval chain, criteria)
- Request-more-info loop, parallel approval, in-flight promotions list
- Real email, real integrations, persistence
- Fuller criteria capture (captain recommendations count, per-transition
  certificates, sea-time by vessel type, medical/HSQE flags)
