import type { Seafarer } from '../../data/types';
import { EXPERIENCE_ROWS } from '../../data/formConfig';
import { formatYears } from '../../lib/format';
import { Card, CardBody, CardHeader } from '../ui/Card';

/**
 * Experience panel — rendered from EXPERIENCE_ROWS config. Vessel-type
 * conditional rows (tankers / containers / bulk) appear only when relevant.
 */
export function ExperiencePanel({ seafarer }: { seafarer: Seafarer }) {
  const rows = EXPERIENCE_ROWS.filter((r) => !r.showIf || r.showIf(seafarer));
  return (
    <Card>
      <CardHeader title="Experience" />
      <CardBody>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {rows.map((row) => (
            <div key={row.key}>
              <dt className="text-xs font-medium uppercase tracking-wide text-faint">
                {row.label}
              </dt>
              <dd className="mt-1 text-lg font-semibold text-ink">
                {formatYears(seafarer.experience[row.key])}
              </dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}
