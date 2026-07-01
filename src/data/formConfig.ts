import type { Experience, Seafarer } from './types';

/**
 * Data-driven promotion-form configuration.
 *
 * The form is rendered FROM this config, not hand-coded. To add/remove a piece
 * of decision-support information, edit the arrays here — no component changes.
 */

/** One experience metric shown in the Experience panel. */
export interface ExperienceRow {
  key: keyof Experience;
  label: string;
  unit: string;
  /** If present, the row only shows when this returns true for the seafarer. */
  showIf?: (s: Seafarer) => boolean;
}

export const EXPERIENCE_ROWS: ExperienceRow[] = [
  { key: 'yearsInRank', label: 'Years in current rank', unit: 'yrs' },
  { key: 'yearsAsOfficer', label: 'Years as officer', unit: 'yrs' },
  { key: 'totalSeaTimeYears', label: 'Total sea time', unit: 'yrs' },
  {
    key: 'yearsOnTankers',
    label: 'Years on tankers',
    unit: 'yrs',
    showIf: (s) => s.vesselType === 'TANKER' || s.experience.yearsOnTankers > 0,
  },
  {
    key: 'yearsOnContainers',
    label: 'Years on containers',
    unit: 'yrs',
    showIf: (s) => s.vesselType === 'CONTAINER' || s.experience.yearsOnContainers > 0,
  },
  {
    key: 'yearsOnBulk',
    label: 'Years on bulk carriers',
    unit: 'yrs',
    showIf: (s) => s.vesselType === 'BULK CARRIER' || s.experience.yearsOnBulk > 0,
  },
];

/** How many recent evaluations to surface on the form. */
export const RECENT_EVALUATION_COUNT = 3;

/** Deep-link stubs — open the relevant OOS module in a new tab (mocked). */
export const EXTERNAL_LINKS = {
  evaluations: (seafarerId: string) => `#/seafarer/${seafarerId}/evaluations`,
  documents: (seafarerId: string) => `#/seafarer/${seafarerId}/documents`,
};
