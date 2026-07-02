import type { Persona } from './types';
import { allApprovalStages } from './approvalChains';

/**
 * Personas for the prototype's role switcher. This is a prototype convenience
 * (so one clicker can walk the whole journey), NOT a product feature.
 *
 * The approver personas are generated from every stage that can appear across
 * the configured chains, so the two never drift apart — add a stage in
 * approvalChains.ts and its approver appears here.
 */
const approverPersonas: Persona[] = allApprovalStages().map((stage) => ({
  id: `approver-${stage.id}`,
  name: stage.approverName,
  jobTitle: stage.role,
  kind: 'approver',
  stageId: stage.id,
}));

export const PERSONAS: Persona[] = [
  {
    id: 'initiator',
    name: 'James Law',
    jobTitle: 'Crew Operator',
    kind: 'initiator',
  },
  ...approverPersonas,
  // The Captain executes the promotion onBOARD (the final, in-place rank change).
  {
    id: 'captain',
    name: 'Capt. Allan Shanahan',
    jobTitle: 'Master (onBOARD)',
    kind: 'promoter',
  },
];

export const DEFAULT_PERSONA_ID = PERSONAS[0].id;
