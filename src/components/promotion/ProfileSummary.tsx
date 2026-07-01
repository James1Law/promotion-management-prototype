import type { ReactNode } from 'react';
import type { DocumentStatus, Seafarer, Rank } from '../../data/types';
import { Card } from '../ui/Card';
import { Badge, type Tone } from '../ui/Badge';
import { formatDate, formatYears } from '../../lib/format';

/**
 * OOS-style Summary-tab content for a seafarer profile: crew details, service
 * summary and documents. This is the "everything in the summary tab" view — the
 * promotion decision-support panels (experience / evaluations / licences) live
 * ONLY in the review modal, not here.
 */

function SummarySection({
  label,
  children,
  last,
}: {
  label: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`grid gap-4 px-5 py-5 md:grid-cols-[12rem_1fr] ${last ? '' : 'border-b border-line'}`}>
      <div className="text-sm font-semibold text-ink">{label}</div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">{children}</div>
    </div>
  );
}

function F({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-faint">{label}</div>
      <div className="mt-0.5 text-sm text-ink">{children ?? '—'}</div>
    </div>
  );
}

const DOC_TONE: Record<DocumentStatus, Tone> = {
  valid: 'ok',
  expiring: 'warn',
  expired: 'danger',
  missing: 'danger',
};

function age(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date('2026-07-01');
  const yrs = now.getFullYear() - d.getFullYear() - (now < new Date(now.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return `Age ${yrs}`;
}

function vesselTypeYears(s: Seafarer): number {
  switch (s.vesselType) {
    case 'TANKER':
      return s.experience.yearsOnTankers;
    case 'CONTAINER':
      return s.experience.yearsOnContainers;
    case 'BULK CARRIER':
      return s.experience.yearsOnBulk;
    default:
      return 0;
  }
}

export function ProfileSummary({ seafarer, rank }: { seafarer: Seafarer; rank: Rank }) {
  const [family, ...given] = seafarer.name.split(' ');
  return (
    <Card>
      <SummarySection label="Crew details">
        <F label="Family name">{family?.toUpperCase()}</F>
        <F label="Given name">{given.join(' ')}</F>
        <F label="Crew number">{seafarer.crewNumber}</F>
        <F label="Date of birth">
          {formatDate(seafarer.dateOfBirth)}
          {seafarer.dateOfBirth && (
            <span className="ml-1 text-xs text-faint">· {age(seafarer.dateOfBirth)}</span>
          )}
        </F>
        <F label="Actual rank">
          {rank.name} <span className="text-faint">({rank.code})</span>
        </F>
        <F label="Crew type">{seafarer.vesselType}</F>
        <F label="Nationality">{seafarer.nationality}</F>
        <F label="Manning agent">{seafarer.manningAgent}</F>
      </SummarySection>

      <SummarySection label="Service summary">
        <F label="Years at sea">{formatYears(seafarer.experience.totalSeaTimeYears)}</F>
        <F label="Years on vessel type">{formatYears(vesselTypeYears(seafarer))}</F>
        <F label="Years as officer">{formatYears(seafarer.experience.yearsAsOfficer)}</F>
        <F label="Years in rank">{formatYears(seafarer.experience.yearsInRank)}</F>
      </SummarySection>

      <SummarySection label="Documents">
        {seafarer.documents.slice(0, 4).map((doc) => (
          <F key={doc.id} label={doc.category}>
            <span className="flex items-center gap-2">
              <Badge tone={DOC_TONE[doc.status]}>{doc.status}</Badge>
            </span>
            <span className="mt-1 block truncate text-xs text-muted" title={doc.name}>
              {doc.name}
            </span>
          </F>
        ))}
      </SummarySection>

      <SummarySection label="Assignments" last>
        <F label="Next assignment">{seafarer.nextAssignment}</F>
        <F label="Joining date">{formatDate(seafarer.joiningDate)}</F>
        <F label="Home airport">{seafarer.homeAirport}</F>
        <F label="Gender">{seafarer.gender}</F>
      </SummarySection>
    </Card>
  );
}
