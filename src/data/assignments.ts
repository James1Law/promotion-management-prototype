/**
 * Vanity data for the Assignments screen.
 *
 * This screen exists to look and feel like the real OOS "Assignments" board:
 * vessels with an outgoing crewman on the left, an incoming (or unassigned)
 * successor on the right, and a Gap/Overlap indicator between them. It is
 * presentational only — the **one** live affordance is the Promote button in an
 * expanded row, which opens the shared PromotionForm for a real seed seafarer
 * (rows carrying a `seafarerId`). Everything else is illustrative.
 *
 * To wire a row's Promote to a promotion, set `seafarerId` to a SEAFARERS id.
 */

/** A styled fragment of a vessel's position line, e.g. the red target rank. */
export interface PositionSegment {
  text: string;
  tone?: 'ink' | 'red' | 'muted';
}

/** The outgoing crewman shown on the left of an assignment row. */
export interface OutgoingCrew {
  name: string;
  crewNumber: string;
  rankCode: string;
  nationality: string;
  endOfContract: string; // display date, e.g. "28 Jun 2026"
  leaving: string;
  port: string;
  travel?: boolean; // plane icon
  warning?: boolean; // red triangle
  flag?: boolean;
  pin?: boolean;
  /** Expanded-panel detail — missing/expiring documents. */
  missingDocuments?: string[];
}

/** The incoming crewman shown on the right (absent ⇒ "not assigned"). */
export interface IncomingCrew {
  name: string;
  crewNumber: string;
  rankCode: string;
  nationality: string;
  availability: string; // e.g. "Confirmed Availability"
  joining: string;
  joiningPort: string;
  checks?: ('ok' | 'clipboard' | 'travel' | 'warning' | 'flag')[];
}

export interface AssignmentRow {
  id: string;
  /** When set, the expanded row's Promote button opens this seafarer's form. */
  seafarerId?: string;
  outgoing: OutgoingCrew;
  gap: 'Gap' | 'Overlap';
  overlapNote?: string; // e.g. "Overlap in progress"
  incoming?: IncomingCrew; // undefined ⇒ Crewman not assigned
}

export interface AssignmentGroup {
  id: string;
  /** Month separator rendered above this group (omit to continue the month). */
  monthLabel?: string;
  vessel: string;
  position: PositionSegment[];
  rows: AssignmentRow[];
}

export const ASSIGNMENT_GROUPS: AssignmentGroup[] = [
  {
    id: 'g-red-sun',
    monthLabel: 'June 2026',
    vessel: 'RED SUN',
    position: [
      { text: 'Chief engineer' },
      { text: 'Captain', tone: 'red' },
    ],
    rows: [
      {
        id: 'r-red-sun-1',
        outgoing: {
          name: 'SAMUEL, TESTING WO…',
          crewNumber: '85134',
          rankCode: 'CPT',
          nationality: 'TUR',
          endOfContract: '23 Jun 2026',
          leaving: '11 Sep 2026',
          port: 'Port',
          warning: true,
          flag: true,
          pin: true,
        },
        gap: 'Gap',
        incoming: {
          name: 'BAKER, SAM',
          crewNumber: '85180',
          rankCode: 'C/E',
          nationality: 'GBR',
          availability: 'Confirmed Availability',
          joining: '13 Jul 2026',
          joiningPort: 'Port',
          checks: ['ok', 'clipboard', 'warning', 'flag'],
        },
      },
    ],
  },
  {
    id: 'g-nordic-star',
    vessel: 'MT NORDIC STAR',
    position: [
      { text: 'Second officer' },
      { text: 'Chief officer', tone: 'red' },
    ],
    rows: [
      {
        id: 'r-nordic-star-1',
        seafarerId: 'sf-halvorsen',
        outgoing: {
          name: 'HALVORSEN, MARCUS',
          crewNumber: '104882',
          rankCode: '2/O',
          nationality: 'NOR',
          endOfContract: '28 Jun 2026',
          leaving: '15 Aug 2026',
          port: 'AL HIDD (AZRY)',
          travel: true,
          warning: true,
          flag: true,
          missingDocuments: [
            'Certificate, Advanced Ship Handling',
            'GMDSS General Operator Certificate (expiring)',
          ],
        },
        gap: 'Gap',
      },
    ],
  },
  {
    id: 'g-ipanema',
    vessel: 'IPANEMA STREET',
    position: [{ text: 'Captain' }],
    rows: [
      {
        id: 'r-ipanema-1',
        outgoing: {
          name: 'DALLORSO, CPT TEST 2',
          crewNumber: '87220',
          rankCode: 'CPT',
          nationality: 'ITA',
          endOfContract: '01 Jul 2026',
          leaving: '23 Sep 2026',
          port: 'Not at port',
          travel: true,
          warning: true,
          flag: true,
        },
        gap: 'Gap',
      },
    ],
  },
  {
    id: 'g-pacific-bridge',
    monthLabel: 'July 2026',
    vessel: 'MV PACIFIC BRIDGE',
    position: [
      { text: 'Second engineer' },
      { text: 'or Third officer', tone: 'muted' },
    ],
    rows: [
      {
        id: 'r-pacific-1',
        seafarerId: 'sf-menon',
        outgoing: {
          name: 'MENON, RAJESH',
          crewNumber: '103551',
          rankCode: '2/E',
          nationality: 'IND',
          endOfContract: '12 Jul 2026',
          leaving: '30 Aug 2026',
          port: 'Not at port',
          travel: true,
          warning: true,
          missingDocuments: ['Certificate, High Voltage Refresher (expiring)'],
        },
        gap: 'Gap',
      },
      {
        id: 'r-pacific-2',
        seafarerId: 'sf-okafor',
        outgoing: {
          name: 'OKAFOR, CHIDI',
          crewNumber: '105774',
          rankCode: '3/O',
          nationality: 'NGA',
          endOfContract: '20 Jul 2026',
          leaving: '05 Sep 2026',
          port: 'TULEAR',
          travel: true,
          warning: true,
        },
        gap: 'Overlap',
        overlapNote: 'Overlap in progress',
      },
    ],
  },
  {
    id: 'g-iron-crest',
    monthLabel: 'August 2026',
    vessel: 'MV IRON CREST',
    position: [
      { text: 'Fitter (Grade B)' },
      { text: 'Fitter (Grade A)', tone: 'red' },
    ],
    rows: [
      {
        id: 'r-iron-crest-1',
        seafarerId: 'sf-santos',
        outgoing: {
          name: 'SANTOS, EMMANUEL',
          crewNumber: '106310',
          rankCode: 'FTR-B',
          nationality: 'PHL',
          endOfContract: '05 Aug 2026',
          leaving: '18 Sep 2026',
          port: 'Not at port',
          warning: true,
        },
        gap: 'Gap',
      },
    ],
  },
  {
    id: 'g-osaka-tower',
    vessel: 'OSAKA TOWER',
    position: [
      { text: 'Chief engineer' },
      { text: 'Captain', tone: 'red' },
    ],
    rows: [
      {
        id: 'r-osaka-1',
        outgoing: {
          name: 'SAMUEL, TESTING AP…',
          crewNumber: '85144',
          rankCode: 'CPT',
          nationality: 'ISL',
          endOfContract: '03 Aug 2026',
          leaving: '27 Sep 2026',
          port: 'Not at port',
          travel: true,
          warning: true,
          flag: true,
        },
        gap: 'Gap',
        incoming: {
          name: 'FURMAN, DANIEL',
          crewNumber: '89584',
          rankCode: 'CPT',
          nationality: 'POL',
          availability: 'Confirmed Availability',
          joining: '23 Sep 2026',
          joiningPort: 'Not at port',
          checks: ['ok', 'clipboard', 'travel', 'warning', 'flag'],
        },
      },
    ],
  },
];

/** Decorative column-filter chips across the top of the board. */
export const ASSIGNMENT_FILTERS = [
  'Fleet',
  'Port',
  'Rank',
  'Nationality',
  'MA',
  'Status',
  'Ready for promotion',
];
