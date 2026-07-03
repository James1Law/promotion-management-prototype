import type { Seafarer } from './types';
import type { Rank } from './types';

/**
 * Directory rows.
 *
 * The Crew Directory in the real product lists thousands of seafarers. This
 * prototype only builds out a handful of *rich* profiles (SEAFARERS) — the ones
 * that are clickable and drive the promotion flow. To make the directory feel
 * like the live product, we render those rich profiles first, then a roster of
 * lightweight FILLER rows below: real-looking but non-clickable, no profile
 * behind them. This keeps the rich Seafarer type free of half-populated records.
 */
export interface DirectoryRow {
  id: string;
  name: string;
  crewNumber: string;
  /** Short manning-agent code shown in the MA column, e.g. "ZM". */
  manningAgent: string;
  rankCode: string;
  rankName: string;
  /** Display vessel type as OOS shows it, e.g. "OIL CRUDE", "CONTAINER". */
  vesselType: string;
  nationality: string;
  /** Right-hand status text, e.g. "Previous assignment, Sign-off". */
  status: string;
  dateOfBirth?: string;
  availability: 'At home' | 'On board';
  /** Renders the little "New" tag seen against recent joiners. */
  isNew?: boolean;
  /** Rich profiles are clickable → open the profile; filler rows are not. */
  clickable: boolean;
}

const MA_CODES: Record<string, string> = {
  'Zodiac Maritime': 'ZM',
};

/** Map OOS internal vessel-type codes to the labels the directory shows. */
const VESSEL_TYPE_LABEL: Record<string, string> = {
  TANKER: 'OIL CRUDE',
  CONTAINER: 'CONTAINER',
  'BULK CARRIER': 'BULK',
  GENERAL: 'GENERAL',
};

/** Normalise a rich seafarer into the common row shape used by the directory. */
export function seafarerToRow(s: Seafarer, effective: Rank): DirectoryRow {
  return {
    id: s.id,
    name: s.name,
    crewNumber: s.crewNumber,
    manningAgent: MA_CODES[s.manningAgent] ?? s.manningAgent.slice(0, 2).toUpperCase(),
    rankCode: effective.code,
    rankName: effective.name,
    vesselType: VESSEL_TYPE_LABEL[s.vesselType] ?? s.vesselType,
    nationality: s.nationality,
    status: s.onboard ? 'Current assignment, Sign-on' : 'Previous assignment, Sign-off',
    dateOfBirth: s.dateOfBirth,
    availability: s.onboard ? 'On board' : 'At home',
    clickable: true,
  };
}

/**
 * Lightweight, non-clickable roster to bulk out the directory. Deliberately
 * varied (rank, vessel type, nationality, availability) so the list reads as a
 * real crew pool. Add/remove freely — nothing else depends on these.
 */
export const FILLER_CREW: DirectoryRow[] = [
  ['Andrei Volkov', '108245', 'ZM', 'MASTER', 'Master', 'OIL CRUDE', 'Russian', '1978-03-11', 'At home'],
  ['Miguel Fernandez', '108190', 'MM', 'C/O', 'Chief Officer', 'CONTAINER', 'Spanish', '1983-07-22', 'On board'],
  ['Wei Chen', '108051', 'ZM', 'C/E', 'Chief Engineer', 'BULK', 'Chinese', '1980-11-05', 'At home'],
  ['Dmytro Kovalenko', '107998', 'FML', '2/O', 'Second Officer', 'OIL CRUDE', 'Ukrainian', '1990-01-19', 'On board'],
  ['Arjun Nair', '107943', 'ZM', '3/E', 'Third Engineer', 'CONTAINER', 'Indian', '1993-06-30', 'At home', 'new'],
  ['Tomasz Nowak', '107880', 'MM', 'BSN', 'Bosun', 'BULK', 'Polish', '1985-09-14', 'On board'],
  ['Ismael Reyes', '107812', 'FML', 'AB', 'Able Seaman', 'CONTAINER', 'Filipino', '1992-02-27', 'At home'],
  ['Lars Pedersen', '107756', 'ZM', 'MASTER', 'Master', 'OIL CRUDE', 'Danish', '1976-12-02', 'On board'],
  ['Carlos Mendoza', '107701', 'FML', 'OS', 'Ordinary Seaman', 'BULK', 'Filipino', '1996-08-08', 'At home', 'new'],
  ['Yusuf Demir', '107655', 'MM', '2/E', 'Second Engineer', 'CONTAINER', 'Turkish', '1988-04-16', 'On board'],
  ['Rohan Kapoor', '107610', 'ZM', 'C/O', 'Chief Officer', 'OIL CRUDE', 'Indian', '1984-10-25', 'At home'],
  ['Nikolai Sørensen', '107588', 'ZM', 'ETO', 'Electro-Technical Officer', 'CONTAINER', 'Norwegian', '1991-05-03', 'On board'],
  ['Paolo Greco', '107540', 'MM', '3/O', 'Third Officer', 'BULK', 'Italian', '1994-11-29', 'At home'],
  ['Adebayo Balogun', '107495', 'FML', 'FTR-A', 'Fitter (Grade A)', 'OIL CRUDE', 'Nigerian', '1987-07-07', 'On board'],
  ['Ravi Pillai', '107430', 'ZM', 'C/E', 'Chief Engineer', 'CONTAINER', 'Indian', '1979-02-18', 'At home'],
  ['Jakub Zieliński', '107388', 'MM', 'AB', 'Able Seaman', 'BULK', 'Polish', '1995-09-21', 'On board', 'new'],
  ['Hassan Malik', '107344', 'FML', '2/O', 'Second Officer', 'OIL CRUDE', 'Pakistani', '1990-12-12', 'At home'],
  ['Diego Alvarez', '107299', 'MM', 'PMN', 'Pumpman', 'OIL CRUDE', 'Spanish', '1986-03-30', 'On board'],
  ['Chukwuemeka Obi', '107251', 'FML', 'OS', 'Ordinary Seaman', 'BULK', 'Nigerian', '1997-06-14', 'At home'],
  ['Sunil Rao', '107205', 'ZM', '3/E', 'Third Engineer', 'CONTAINER', 'Indian', '1992-01-08', 'On board'],
  ['Piotr Kaczmarek', '107160', 'MM', 'BSN', 'Bosun', 'BULK', 'Polish', '1983-08-19', 'At home'],
  ['Ahmed El-Sayed', '107118', 'FML', 'C/CK', 'Chief Cook', 'OIL CRUDE', 'Egyptian', '1981-04-02', 'On board'],
  ['Joselito Cruz', '107073', 'FML', 'AB', 'Able Seaman', 'CONTAINER', 'Filipino', '1994-10-11', 'At home', 'new'],
  ['Viktor Melnyk', '107029', 'ZM', 'C/O', 'Chief Officer', 'BULK', 'Ukrainian', '1985-05-27', 'On board'],
].map(
  ([name, crewNumber, manningAgent, rankCode, rankName, vesselType, nationality, dateOfBirth, availability, tag]) => ({
    id: `filler-${crewNumber}`,
    name: name!,
    crewNumber: crewNumber!,
    manningAgent: manningAgent!,
    rankCode: rankCode!,
    rankName: rankName!,
    vesselType: vesselType!,
    nationality: nationality!,
    status: availability === 'On board' ? 'Current assignment, Sign-on' : 'Previous assignment, Sign-off',
    dateOfBirth,
    availability: availability as DirectoryRow['availability'],
    isNew: tag === 'new',
    clickable: false,
  }),
);
