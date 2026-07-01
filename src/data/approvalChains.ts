import type { ApprovalStageDef } from './types';

/**
 * Approval-chain configuration.
 *
 * The prototype uses a single fixed 3-step sequential chain, mirroring the
 * existing crew-applicant approval stepper (variable stages per customer).
 *
 * To change the workflow: add/remove/reorder entries here. The stepper UI and
 * the approver personas both derive from this array, so nothing else needs to
 * change. In production this would be resolved per company / manning-agent /
 * rank-transition; here it is static.
 */
export const DEFAULT_APPROVAL_CHAIN: ApprovalStageDef[] = [
  {
    id: 'marine-superintendent',
    role: 'Marine Superintendent',
    department: 'Marine',
    approverName: 'Henk Koopman',
  },
  {
    id: 'dpa',
    role: 'DPA',
    department: 'Marine / Safety',
    approverName: 'Aisha Rahman',
  },
  {
    id: 'crewing-director',
    role: 'Crewing Director',
    department: 'Crewing',
    approverName: 'Marie Delacroix',
  },
];
