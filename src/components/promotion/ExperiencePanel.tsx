import type { Seafarer } from '../../data/types';
import { EXPERIENCE_ROWS, RECENT_VESSEL_COUNT } from '../../data/formConfig';
import { formatDate, formatServiceLength, formatYears } from '../../lib/format';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';

/**
 * Experience panel — rendered from EXPERIENCE_ROWS config, plus the seafarer's
 * most recent vessels (last N contracts). The vessel list lets an approver spot
 * vessel-type / size mismatches (e.g. handysize experience vs a cape promotion).
 * Numbers are kept compact so both fit without a tall panel.
 */
export function ExperiencePanel({ seafarer }: { seafarer: Seafarer }) {
  const rows = EXPERIENCE_ROWS.filter((r) => !r.showIf || r.showIf(seafarer));
  const recentVessels = seafarer.contracts.slice(0, RECENT_VESSEL_COUNT);
  return (
    <Card>
      <CardHeader title="Experience" />
      <CardBody className="space-y-4">
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-4 lg:grid-cols-6">
          {rows.map((row) => (
            <div key={row.key}>
              <dt className="text-[11px] font-medium uppercase tracking-wide text-faint">
                {row.label}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {formatYears(seafarer.experience[row.key])}
              </dd>
            </div>
          ))}
        </dl>

        {recentVessels.length > 0 && (
          <div className="border-t border-line pt-3">
            <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-faint">
              Recent vessels
            </div>
            <ul className="space-y-1.5">
              {recentVessels.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-ink">{c.vesselName}</span>
                    <Badge tone="neutral">{c.vesselType}</Badge>
                    <span className="text-muted">· {c.rankOnBoard}</span>
                  </span>
                  <span className="text-xs text-muted">
                    {formatDate(c.signOn)} – {c.onboard ? 'present' : formatDate(c.leaving)}
                    <span className="ml-1 text-faint">
                      ({formatServiceLength(c.signOn, c.leaving)})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
