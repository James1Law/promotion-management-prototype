import type { Rank } from './types';

/**
 * Rank ladder. `nextRanks` for a given rank code drives the target-rank options
 * on the promotion form. Extend the ladder here to support more transitions.
 */
export const RANKS: Rank[] = [
  // Deck ratings
  { code: 'OS', name: 'Ordinary Seaman' },
  { code: 'AB', name: 'Able Seaman' },
  { code: 'BSN', name: 'Bosun' },
  // Deck officers
  { code: '3/O', name: 'Third Officer' },
  { code: '2/O', name: 'Second Officer' },
  { code: 'C/O', name: 'Chief Officer' },
  { code: 'CPT', name: 'Captain' },
  // Engine ratings / trade
  { code: 'FTR-B', name: 'Fitter (Grade B)' },
  { code: 'FTR-A', name: 'Fitter (Grade A)' },
  // Engine officers
  { code: '4/E', name: 'Fourth Engineer' },
  { code: '3/E', name: 'Third Engineer' },
  { code: '2/E', name: 'Second Engineer' },
  { code: 'C/E', name: 'Chief Engineer' },
];

/**
 * Ordered progression paths, by rank code. Kept to single realistic next steps
 * (rating→rating, officer→officer); crossing from ratings to officer requires a
 * certificate of competency and is not modelled as a one-click promotion.
 */
const PROGRESSION: Record<string, string[]> = {
  // Ratings / trade — lateral, no approval workflow (see approvalChains.ts)
  OS: ['AB'],
  AB: ['BSN'],
  'FTR-B': ['FTR-A'],
  // Deck officers
  '3/O': ['2/O'],
  '2/O': ['C/O'],
  'C/O': ['CPT'],
  // Engine officers
  '4/E': ['3/E'],
  '3/E': ['2/E'],
  '2/E': ['C/E'],
};

export function rankByCode(code: string): Rank | undefined {
  return RANKS.find((r) => r.code === code);
}

/** Candidate target ranks for a seafarer's current rank. */
export function nextRanks(currentCode: string): Rank[] {
  return (PROGRESSION[currentCode] ?? [])
    .map(rankByCode)
    .filter((r): r is Rank => Boolean(r));
}
