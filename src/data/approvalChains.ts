import type { ApprovalStageDef } from './types';

/**
 * Approval-chain configuration — resolved PER RANK-TRANSITION.
 *
 * In the real product the workflow is configurable per company / manning-agent /
 * rank-to-rank transition / vessel type. The prototype models the part that
 * matters for the demo: **not every promotion needs the same approval**. We use
 * the STCW responsibility tiers as a realistic, principled dividing line:
 *
 *   • Management-level promotions (→ Chief Officer, Master, 2nd Engineer, Chief
 *     Engineer) run the FULL chain: Superintendent → DPA → Crewing Director.
 *   • Operational-level promotions (→ 2nd/3rd Officer, 3rd/4th Engineer) need a
 *     single Superintendent sign-off (STANDARD).
 *   • Rating & trade lateral moves (→ AB, Bosun, Fitter Grade A) need NO
 *     workflow — the operator records the change directly.
 *
 * The stepper UI, the approver personas and the store all derive from whatever
 * `chainForTransition` returns, so changing the policy is a data edit here.
 */

// ── The approvers (demo names) ───────────────────────────────────────────────
const SUPERINTENDENT: ApprovalStageDef = {
  id: 'marine-superintendent',
  role: 'Marine Superintendent',
  department: 'Marine',
  approverName: 'Henk Koopman',
};
const DPA: ApprovalStageDef = {
  id: 'dpa',
  role: 'DPA',
  department: 'Marine / Safety',
  approverName: 'Aisha Rahman',
};
const CREWING_DIRECTOR: ApprovalStageDef = {
  id: 'crewing-director',
  role: 'Crewing Director',
  department: 'Crewing',
  approverName: 'Marie Delacroix',
};

// ── Named chains (tiers) ─────────────────────────────────────────────────────
/** Management-level: full three-step chain. */
const FULL_CHAIN: ApprovalStageDef[] = [SUPERINTENDENT, DPA, CREWING_DIRECTOR];
/** Operational-level: a single superintendent sign-off. */
const STANDARD_CHAIN: ApprovalStageDef[] = [SUPERINTENDENT];
/** Rating / trade lateral move: no approval workflow. */
const NO_WORKFLOW: ApprovalStageDef[] = [];

/**
 * Which chain applies, keyed by the rank being promoted INTO. Approval weight
 * tracks the responsibility of the target rank, not where the seafarer starts.
 */
const CHAIN_BY_TARGET_RANK: Record<string, ApprovalStageDef[]> = {
  // Management level — full approval
  'C/O': FULL_CHAIN,
  CPT: FULL_CHAIN,
  '2/E': FULL_CHAIN,
  'C/E': FULL_CHAIN,
  // Operational level — single superintendent sign-off
  '2/O': STANDARD_CHAIN,
  '3/O': STANDARD_CHAIN,
  '3/E': STANDARD_CHAIN,
  '4/E': STANDARD_CHAIN,
  // Ratings & trade — recorded directly, no workflow
  AB: NO_WORKFLOW,
  BSN: NO_WORKFLOW,
  'FTR-A': NO_WORKFLOW,
};

/**
 * The approval chain for a given rank-to-rank transition. Defaults to the full
 * chain for any transition we haven't classified (safer to over-approve).
 */
export function chainForTransition(_fromCode: string, toCode: string): ApprovalStageDef[] {
  return CHAIN_BY_TARGET_RANK[toCode] ?? FULL_CHAIN;
}

/** Does this transition route through an approval workflow at all? */
export function requiresWorkflow(fromCode: string, toCode: string): boolean {
  return chainForTransition(fromCode, toCode).length > 0;
}

/**
 * Every distinct approver across all chains (deduped by stage id). Personas are
 * generated from this so the role switcher always covers whoever can appear.
 */
export function allApprovalStages(): ApprovalStageDef[] {
  const seen = new Set<string>();
  const out: ApprovalStageDef[] = [];
  for (const stage of [...FULL_CHAIN, ...STANDARD_CHAIN]) {
    if (seen.has(stage.id)) continue;
    seen.add(stage.id);
    out.push(stage);
  }
  return out;
}
