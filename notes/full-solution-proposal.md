Product Requirements Document
Seafarer Promotion Management
Discovery output prepared as input for user-story writing


1. Executive Summary
Today Promotion of seafarers in OOS is basically represented only by a change in rank.
In reality, the process requires checking which Seafarers are eligible for promotion and then driving the promotion through an approval workflow.

The intent is to consolidate eligibility checks, the approval workflow and the promotion record into a single capability inside OOS.

The capability must be configurable per company, Manning Agent/Client , per rank-to-rank transition, and per vessel type — because the rules that govern promotion may vary.
Goals
 
2.3 3. Stakeholders and Personas



6. Functional Capability Map

6.1 Promotion criteria configuration
A Customer can define the conditions to be met for a Seafarer to be promoted from the current rank to the next rank

Define which rank transitions require the formal workflow and which do not.
Needed for Second Officer → Chief Officer
Not needed for A/B → Bosun
Configure rules per rank-to-rank transition (e.g., Second Officer → Chief Officer).
Applicability
Manning Agent
Client
Vessel Type

Rules
Documentation requirements
Experience requirements
Evaluation requirements (scores, timeframe, recommendations, …)
Others?
Mark each requirement as mandatory, recommended or optional.

6.1 Promotion Workflow configuration
90PoE can define the Approval sequence to promote a Seafarer from the current rank to the next rank
Configure rules per rank-to-rank transition (e.g., Second Officer → Chief Officer).
Applicability
Manning Agent
Client
Vessel Type
Workflow
Sequence of Approvals and permissions

6.2 Eligibility evaluation
who is eligible for this rank?
is this seafarer eligible?
Evaluate any seafarer against any candidate target rank, returning a structured result of which criteria are met, partially met, or missing.
List candidates eligible for a target rank, ordered by “eligibility ranking”
Show, for a single seafarer, the gap analysis for the next higher rank (“what is he/she missing to move from 2nd Officer to Chief Officer”).
Re-evaluate eligibility automatically when the underlying data changes.6.3 Promotion request lifecycle
A promotion is an explicit object with a lifecycle.
Initiate a promotion request from a candidate
Link to the criteria and supporting evidence.
Route the request through the configured approval chain.
Capture each approver’s decision, comments and timestamp.
Allow a more senior approver to skip a more junior step.
On final approval, record the new rank against the seafarer with an effective date.
Maintain an immutable audit trail per request (sequence of Approvals and status of Criteria)
6.6 Integration with assignment / sign-on
The assignment process must be aware of in-flight promotions.
When a seafarer is being signed on, surface any open promotion request.
Warn explicitly if the rank being signed on does not match the rank the workflow is targeting.
Allow the user to proceed at the current rank with an acknowledgement, or to wait for the workflow to complete.
6.7 Reporting and audit
Per-promotion audit pack — criteria, evidence, approvers, decisions — exportable to satisfy client / managing-agent assurance requests.
Operational dashboard — in-flight promotions, ageing, bottlenecks by department or approver.
Throughput KPIs — average cycle time, approval rate, percentage of “eligible by criteria” candidates promoted.
7. Promotion Criteria
7.1 Detailed Rules
This section captures the criteria that the configuration engine must be able to express.


Two design rules emerged repeatedly in discovery and should constrain the implementation:
Same seafarer, different answers. Eligibility is not a single boolean. The same seafarer may be eligible against Agent A’s rules but not Agent B’s, eligible on tankers but not on containers, eligible to a Chief Officer rank but missing one certificate for Master.
Rules cannot capture every case. There will always be promotions driven by retention, urgency, or business judgement. The system must support an informed override path that still produces a clean audit trail; it must not pretend to be a decision engine.
8. Promotion Workflow — From Candidate Pool
Phase 1 — Identification
Operator opens the candidate-pool view for a target rank, or opens an individual seafarer’s profile.
System returns the list of candidates ranked by criteria met, or the gap analysis for the individual.
Operator selects a candidate to advance.
Phase 2 — Initiation
Operator clicks “Initiate promotion” for the selected candidate / target rank.
System creates a promotion request with: seafarer, current rank, target rank, criteria checklist, supporting evidence references, optional operator commentary, initiation timestamp.
System determines, from configuration, whether this transition requires the workflow.
Phase 3 — Approval routing (if workflow required)
System routes the request to the configured department(s) — Marine for officers, Technical for engineering and specialist sub-grades — in parallel where the policy permits it.
Each approver sees the criteria, the evidence and the seafarer history in-context, and approves, rejects or requests more information.
Stalled steps are flagged against an SLA and can be escalated, delegated, or skipped by a more senior approver per policy.
Phase 4 — Decision
On final approval, the system records the new rank against the seafarer with an effective date.
On rejection, the request is closed with a reason and remains visible in the audit history.
If a required criterion has expired between initiation and decision (e.g., a certificate lapsed), the system re-checks before the rank is recorded.
Phase 5 — Recording and downstream
Rank history is updated; previous rank period is closed.
Linked systems are notified — payroll for the new wage, certification system for confirmation, the assignment / manning module for awareness.
Audit pack is finalised and exportable.
Non-workflow path
For rank transitions configured as not requiring the workflow (e.g., rating-level lateral moves), the operator records the change directly. The criteria checklist and gap analysis are still available, even if approval is not required.
9. Data Needs
9.1 Seafarer profile
Identity, contact, nationality.
Current rank, rank history with dates, rank periods by vessel type.
Sea time aggregations (total, in current rank, by vessel type, by client).
Licences with type, jurisdiction, issue and expiry dates, status.
Certificates and training records with type, issue and expiry dates.
Evaluations with form type, scoring, evaluator, date, rank held at the time, vessel type.
Recommendations with author, date, target rank, comments.
9.2 Promotion request
Request ID, initiator, initiation date.
Seafarer reference, current rank, target rank, vessel type, client overlay used.
Criteria checklist snapshot — every criterion with its required, captured and verdict values.
Evidence references — pointers to the licences, certificates, evaluations and recommendations relied upon.
Approval chain — ordered list of steps with approver, status, decision, comments, timestamps.
Final outcome — approved / rejected / withdrawn, effective date, comments.
9.3 Configuration
Rank model and rank-to-rank transition graph.
Vessel-type catalogue.
Client / managing-agent catalogue.
Rule-set version history (rules change; old promotions must remain auditable against the rules in force when they were decided).
Workflow definition per rank transition (departments, ordering, parallelism, SLAs, escalation policy).
10. Notifications and Triggers
Promotion request raised → first approver(s) notified.
Approval granted → next approver in chain or initiator notified, depending on chain state.
Rejection or request for information → initiator notified with reason.
Approval step ageing past SLA → escalation notification.
Supporting document expiring while a request is in flight → initiator and current approver notified.
Sign-on attempted with an open promotion request for the same seafarer → inline warning at the point of assignment.
Forecast threshold crossed (e.g., projected coverage for a rank drops below configured floor) → fleet-manager alert.
11. Reporting and Analytics
Candidate pool. For a target rank: who is eligible now, who is close, what each is missing.
Gap analysis. For an individual: what they need in order to move to a chosen target rank, on a chosen vessel type, for a chosen client.
In-flight promotions. Operational view of every open request, its stage, its age and its current approver.
Succession forecast. Projected rank coverage over a configurable horizon, accounting for retirements, contract ends and the in-flight pipeline.
Promotion history per seafarer. Chronological view of every promotion event with the criteria and approvals that supported it.
Audit pack. Per promotion: criteria, evidence, approvers, decisions, timestamps — exportable for clients.
Throughput KPIs. Cycle time, bottleneck approvers, approval rate, percentage of promotions backed by full criteria verification.
12. Integrations
OOS crew records — read for context, write back the new rank.
Existing intranet workflow — migrated to the new workflow; legacy data preserved for audit.
Certificate and training-record system — source of truth for licences and training.
Evaluations / appraisals — source of evaluation and recommendation data.
Assignment / manning module — consumer of in-flight promotion state at sign-on.
Payroll / HR — consumer of the new rank for wage updates.
Client / managing-agent endpoints — export of audit packs where required.
13. Edge Cases and Exceptions
Urgent promotions. Operational need to promote immediately (e.g., a Chief Officer falls ill mid-voyage). The workflow must support an expedited path that still produces an audit trail.
Demotions and lateral moves. Same data model, different rule set; explicitly in scope of the rank-change capability even if not the focus of the first delivery.
Multi-client seafarers. A seafarer can be on more than one managing agent’s book. Eligibility and approval may differ per client and the system must hold both answers cleanly.
Override / business-judgement promotions. Some promotions are driven by retention, conflict, or strategic decisions and will not match the rule set. The system must accept these with explicit acknowledgement and capture the reason.
Pending workflow during sign-on. Sign-on must be possible at the current rank with a warning, or deferrable until the workflow completes.
Data quality issues. Missing or stale data may cause false negatives in eligibility. The operator must be able to inspect why the system thinks a candidate fails a criterion, and to attach evidence that resolves it.
Conflicting evaluations. A seafarer may be excellent on one vessel type and weak on another. The evaluation policy must let configuration decide which evaluations count.
Criterion expires mid-flight. If a certificate lapses while the workflow is open, the request must be re-validated before the rank change is recorded.
14. Out of Scope (for the first release)
Automatic decision-making — the system advises and routes; humans approve.
Self-service for seafarers — seafarers do not initiate or view their own promotion workflow in the first release.
Recruitment / external hiring pipelines — the focus is internal promotion of existing seafarers.
Training delivery — the system identifies certification gaps but does not deliver or schedule training.
15. Open Questions
What is the agreed SLA per workflow step, and what is the agreed escalation tree when an SLA is breached?
How are client-overlay rules authored and approved — by the client, by the senior crewing manager, or jointly?
How long is rule-set history retained, and how do we render an old promotion against the rules in force at its decision date?
Which integrations are first-class APIs versus file-based exports for the first release?
What is the migration strategy for in-flight promotions currently sitting in the intranet workflow?
Who owns the override path — which roles can approve a promotion that does not satisfy the codified criteria?
Is there a need to support promotions that span multiple clients (i.e., promote on Agent A’s book first, then propagate)?
16. Scenarios for Story Validation
These scenarios came directly from discovery. They are useful as acceptance hooks: every story should be testable against at least one of them.
Scenario A — Second Officer to Chief Officer on a tanker
A Second Officer in the tanker pool is being considered for promotion to Chief Officer. The transition requires the higher licence (national and IMO equivalent), three years in rank on tankers, the Crude Oil Washing certificate, recent positive evaluations in the Chief Officer rank on tankers, two recommendations from two distinct captains, and Marine Department / DPA approval. The client overlay may add further requirements.
Scenario B — AB to Bosun
This transition does not require workflow approval, but the operator still wants the gap analysis: which licences, training and sea time the AB needs to be a Bosun, and where the gaps are.
Scenario C — Forecasting a Captain shortage
A Fleet Manager is planning twelve months out. Two Captains will retire or end contract within that horizon. There is one Chief Officer ready now, one likely to be ready within six months, and a strong Second Officer who could be on the Captain track in eighteen months. The system must surface this picture and let the manager drill into each candidate.
Scenario D — Stalled approval
A promotion is initiated for a Second Officer to Chief Officer. It routes to the Marine Department, but the DPA is on leave. Today the request sits for three weeks with no signal. The seafarer is then assigned to a vessel and someone notices. The system must, instead, surface the stalled step against an SLA, allow escalation or delegation, and warn the assignment process that a workflow is open.
Scenario E — Differing client criteria
A seafarer is on the books of two managing agents. Agent A requires five years in rank as Chief Officer; Agent B requires three. The seafarer has four years. The system must report “eligible for Agent B, not eligible for Agent A” cleanly, and let the operator initiate the promotion only against Agent B.
Scenario F — Audit request from a managing agent
An agent asks for evidence that a recently promoted Captain went through a formal process. The system must produce, on demand, the audit pack: criteria evaluated, evidence relied upon, approvers, decisions, timestamps.
17. Appendix — Seeds for Story Decomposition
A first-cut grouping of the work into epics. Each epic should be sized into stories using the 90POE product-writing convention.



End of document.