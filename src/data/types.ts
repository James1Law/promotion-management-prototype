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
  /** Overall score as a percentage 0–100 (prototype normalises to this). */
  score: number;
  evaluator: string;
  rankHeld: string;
  vesselType: VesselType;
  flagged?: boolean;
}

export interface RankHistoryEntry {
  rank: Rank;
  vesselType: VesselType;
  from: string; // ISO
  to?: string; // ISO — open if current
  reason?: string;
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
  experience: Experience;
  evaluations: Evaluation[]; // newest first
  documents: LicenceDocument[];
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
  approverName: string; // demo approver
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
  remarks: string;
  attachments: Attachment[];
  initiatedByPersonaId: string;
  initiatedAt: string; // ISO
  status: PromotionStatus;
  stages: ApprovalStageState[];
  /** Set when status becomes 'promoted'. */
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
