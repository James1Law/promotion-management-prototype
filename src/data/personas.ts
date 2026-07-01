import type { Persona } from './types';
import { DEFAULT_APPROVAL_CHAIN } from './approvalChains';

/**
 * Personas for the prototype's role switcher. This is a prototype convenience
 * (so one clicker can walk the whole journey), NOT a product feature.
 *
 * The approver personas are generated from the approval chain so the two never
 * drift apart — add a stage in approvalChains.ts and its approver appears here.
 */
const approverPersonas: Persona[] = DEFAULT_APPROVAL_CHAIN.map((stage) => ({
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
];

export const DEFAULT_PERSONA_ID = PERSONAS[0].id;
