import { create } from 'zustand';
import type {
  ApprovalStageState,
  Persona,
  PromotionRequest,
  Rank,
  Seafarer,
  StageStatus,
} from '../data/types';
import { chainForTransition } from '../data/approvalChains';
import { DEFAULT_PERSONA_ID, PERSONAS } from '../data/personas';
import { seafarerById } from '../data/seafarers';

/**
 * Single source of truth for the prototype's runtime state: the active persona
 * and every promotion request (keyed by seafarer). All screens read and mutate
 * through here so behaviour stays consistent no matter which entry point or
 * view is used.
 */

type Decision = 'approved' | 'rejected' | 'skipped';

interface InitiateInput {
  seafarerId: string;
  targetRank: Rank;
  vessel?: string;
  remarks: string;
  attachments: PromotionRequest['attachments'];
}

interface PromotionState {
  personas: Persona[];
  currentPersonaId: string;
  /** Promotion requests keyed by seafarerId (one active request per seafarer). */
  requests: Record<string, PromotionRequest>;

  setPersona: (id: string) => void;
  initiatePromotion: (input: InitiateInput) => void;
  decideStage: (seafarerId: string, stageId: string, decision: Decision, comment: string) => void;
  setStagePaused: (seafarerId: string, stageId: string, paused: boolean, comment?: string) => void;
  /** Shoreside: plan an approved promotion into a crew-change slot (sets the date). */
  planPromotion: (seafarerId: string, plannedDate: string) => void;
  /** onBOARD: the Captain executes the planned promotion — the rank changes. */
  applyRankChange: (seafarerId: string, effectiveDate: string) => void;
  resetPromotion: (seafarerId: string) => void;
}

const nowISO = () => new Date().toISOString();

function buildStages(fromCode: string, toCode: string): ApprovalStageState[] {
  return chainForTransition(fromCode, toCode).map((def, i) => ({
    ...def,
    status: (i === 0 ? 'current' : 'waiting') as StageStatus,
  }));
}

/** Advance the workflow: mark the next waiting stage current, or approve. */
function advance(request: PromotionRequest): PromotionRequest {
  const next = request.stages.find((s) => s.status === 'waiting');
  if (next) {
    next.status = 'current';
    return { ...request };
  }
  // No more waiting stages → fully approved for promotion.
  return { ...request, status: 'approved' };
}

export const usePromotionStore = create<PromotionState>((set) => ({
  personas: PERSONAS,
  currentPersonaId: DEFAULT_PERSONA_ID,
  requests: {},

  setPersona: (id) => set({ currentPersonaId: id }),

  initiatePromotion: ({ seafarerId, targetRank, vessel, remarks, attachments }) =>
    set((state) => {
      const seafarer = seafarerById(seafarerId);
      if (!seafarer) return state;
      const stages = buildStages(seafarer.currentRank.code, targetRank.code);
      const request: PromotionRequest = {
        id: `pr-${seafarerId}-${new Date().getTime()}`,
        seafarerId,
        currentRank: seafarer.currentRank,
        targetRank,
        vesselType: seafarer.vesselType,
        vessel,
        remarks,
        attachments,
        initiatedByPersonaId: state.currentPersonaId,
        initiatedAt: nowISO(),
        // No approval chain for this transition → straight to "approved for
        // promotion" (recorded directly); otherwise it enters the workflow.
        status: stages.length ? 'pending' : 'approved',
        stages,
      };
      return { requests: { ...state.requests, [seafarerId]: request } };
    }),

  decideStage: (seafarerId, stageId, decision, comment) =>
    set((state) => {
      const existing = state.requests[seafarerId];
      if (!existing) return state;
      const request: PromotionRequest = {
        ...existing,
        stages: existing.stages.map((s) => ({ ...s })),
      };
      const stage = request.stages.find((s) => s.id === stageId);
      if (!stage) return state;

      stage.status = decision;
      stage.comment = comment || undefined;
      stage.decidedAt = nowISO();

      let updated: PromotionRequest;
      if (decision === 'rejected') {
        updated = { ...request, status: 'rejected' };
      } else {
        // approved or skipped → move the workflow forward
        updated = advance(request);
      }
      return { requests: { ...state.requests, [seafarerId]: updated } };
    }),

  setStagePaused: (seafarerId, stageId, paused, comment) =>
    set((state) => {
      const existing = state.requests[seafarerId];
      if (!existing) return state;
      const stages = existing.stages.map((s) =>
        s.id === stageId
          ? { ...s, status: (paused ? 'paused' : 'current') as StageStatus, comment: comment ?? s.comment }
          : s,
      );
      return { requests: { ...state.requests, [seafarerId]: { ...existing, stages } } };
    }),

  planPromotion: (seafarerId, plannedDate) =>
    set((state) => {
      const existing = state.requests[seafarerId];
      if (!existing || existing.status !== 'approved') return state;
      return {
        requests: {
          ...state.requests,
          [seafarerId]: { ...existing, plannedPromotionDate: plannedDate },
        },
      };
    }),

  applyRankChange: (seafarerId, effectiveDate) =>
    set((state) => {
      const existing = state.requests[seafarerId];
      if (!existing || existing.status !== 'approved') return state;
      const updated: PromotionRequest = {
        ...existing,
        status: 'promoted',
        promotedAt: nowISO(),
        effectiveRankChangeDate: effectiveDate,
      };
      return { requests: { ...state.requests, [seafarerId]: updated } };
    }),

  resetPromotion: (seafarerId) =>
    set((state) => {
      const requests = { ...state.requests };
      delete requests[seafarerId];
      return { requests };
    }),
}));

// ── Derived selectors / helpers ─────────────────────────────────────────────

export function useCurrentPersona(): Persona {
  const personas = usePromotionStore((s) => s.personas);
  const id = usePromotionStore((s) => s.currentPersonaId);
  return personas.find((p) => p.id === id) ?? personas[0];
}

/** Effective current rank, reflecting an applied ("promoted") rank change. */
export function effectiveRank(seafarer: Seafarer, request?: PromotionRequest): Rank {
  if (request?.status === 'promoted') return request.targetRank;
  return seafarer.currentRank;
}
