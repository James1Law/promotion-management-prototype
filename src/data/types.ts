/**
 * Domain model for the promotion-management prototype.
 *
 * This is the single source of truth for the shape of data. Screens and the
 * store read these types; seed data (seafarers.ts) and config (formConfig.ts,
 * approvalChains.ts) produce them. Add a field here first, then thread it
 * through config/seed — the compiler will point you at every place to touch.
 */

export type VesselType = 'TANKER' | 'CONTAINER' | 'BULK CARRIER' | 'GENERAL';

/** A rank in the progression, e.g. { code: 'C/O', name: 'Chief Officer' }. */
export interface Rank {
  code: string;
  name: string;
}

export type DocumentStatus = 'valid' | 'expiring' | 'expired' | 'missing';

export interface LicenceDocument {
  id: string;
  name: string;
  category: 'Licence' | 'Certificate' | 'Training' | 'Personal';
  reference?: string;
  issueDate?: string; // ISO
  expiryDate?: string; // ISO
  status: DocumentStatus;
}

export interface Evaluation {
  id: string;
  date: string; // ISO
  formType: string; // e.g. "Onboard appraisal"
  /** Overall score on a 1–10 scale (10 = excellent). */
  score: number;
  evaluator: string;
  rankHeld: string;
  vesselType: VesselType;
  flagged?: boolean;
  /** Evaluator ticked "Recommended for promotion" on the appraisal form. */
  recommendedForPromotion?: boolean;
}

export interface RankHistoryEntry {
  rank: Rank;
  vesselType: VesselType;
  from: string; // ISO
  to?: string; // ISO — open if current
  reason?: string;
}

/**
 * A contract / service period on a specific vessel (the OOS "Contracts" tab).
 * Distinct from rankHistory: it carries the vessel NAME, so approvers can spot
 * vessel-type / size mismatches (e.g. handysize experience vs a cape promotion).
 */
export interface Contract {
  id: string;
  vesselName: string;
  vesselType: VesselType;
  rankOnBoard: string; // rank held during this contract
  signOn: string; // ISO
  leaving?: string; // ISO — omitted if this is the current (open) contract
  reasonForLeaving?: string;
  /** True for the current, open contract (the seafarer is aboard this vessel). */
  onboard?: boolean;
}

/**
 * Raw experience metrics held against a seafarer. formConfig decides which of
 * these to surface and how to label them (and whether a row is vessel-type
 * conditional), so adding a metric here + a row in config is all it takes.
 */
export interface Experience {
  yearsInRank: number;
  yearsAsOfficer: number;
  totalSeaTimeYears: number;
  yearsOnTankers: number;
  yearsOnContainers: number;
  yearsOnBulk: number;
}

export interface Seafarer {
  id: string;
  name: string;
  crewNumber: string;
  currentRank: Rank;
  vesselType: VesselType;
  nationality: string;
  manningAgent: string;
  dateOfBirth?: string; // ISO
  gender?: string;
  homeAirport?: string;
  nextAssignment?: string;
  joiningDate?: string; // ISO
  seniorityDate?: string; // ISO
  /** Whether the seafarer is currently aboard a vessel (vs on leave at home). */
  onboard: boolean;
  experience: Experience;
  evaluations: Evaluation[]; // newest first
  documents: LicenceDocument[];
  contracts: Contract[]; // newest first
  rankHistory: RankHistoryEntry[];
}

// ── Promotion request & workflow ────────────────────────────────────────────

export type StageStatus =
  | 'waiting' // not yet reached
  | 'current' // awaiting this approver's decision
  | 'approved'
  | 'rejected'
  | 'skipped'
  | 'paused';

/** Definition of one approval step, from an approval-chain config. */
export interface ApprovalStageDef {
  id: string;
  role: string; // e.g. "Marine Superintendent"
  department: string; // e.g. "Marine"
  // NB: a stage routes to a ROLE/GROUP (all users of this type), not a named
  // person — there can be many Marine Superintendents / DPAs, so no individual
  // is stored or shown.
}

/** Live state of an approval step within a request. */
export interface ApprovalStageState extends ApprovalStageDef {
  status: StageStatus;
  comment?: string;
  decidedAt?: string; // ISO
}

export type PromotionStatus =
  | 'pending' // in the approval workflow
  | 'approved' // approved for promotion (rank change not yet applied)
  | 'rejected'
  | 'promoted'; // rank change applied manually

export interface Attachment {
  name: string;
  sizeLabel: string;
}

export interface PromotionRequest {
  id: string;
  seafarerId: string;
  currentRank: Rank;
  targetRank: Rank;
  vesselType: VesselType;
  /** Vessel the promotion is against — current vessel if aboard, else planned. */
  vessel?: string;
  remarks: string;
  attachments: Attachment[];
  initiatedByPersonaId: string;
  initiatedAt: string; // ISO
  status: PromotionStatus;
  stages: ApprovalStageState[];
  /**
   * Set when the office plans an approved promotion into a crew-change slot
   * (the shoreside "Plan into crew change" step). Its presence is what makes the
   * Promote button appear onBOARD — the promotion is scheduled but not yet done.
   */
  plannedPromotionDate?: string;
  /** Set when status becomes 'promoted' (the Captain executes it onBOARD). */
  promotedAt?: string;
  effectiveRankChangeDate?: string;
}

// ── Personas (prototype-only convenience) ───────────────────────────────────

export type PersonaKind = 'initiator' | 'approver' | 'promoter';

export interface Persona {
  id: string;
  name: string;
  jobTitle: string;
  kind: PersonaKind;
  /** For approvers: which stage id in the chain they own. */
  stageId?: string;
}
