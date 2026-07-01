import type { DocumentStatus, Seafarer } from '../../data/types';
import { EXTERNAL_LINKS } from '../../data/formConfig';
import { formatDate } from '../../lib/format';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge, type Tone } from '../ui/Badge';
import { IconExternal } from '../layout/icons';

const STATUS_META: Record<DocumentStatus, { tone: Tone; label: string }> = {
  valid: { tone: 'ok', label: 'Valid' },
  expiring: { tone: 'warn', label: 'Expiring' },
  expired: { tone: 'danger', label: 'Expired' },
  missing: { tone: 'danger', label: 'Missing' },
};

export function LicencesPanel({ seafarer }: { seafarer: Seafarer }) {
  return (
    <Card>
      <CardHeader
        title="Licences &amp; documents held"
        action={
          <a
            href={EXTERNAL_LINKS.documents(seafarer.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark"
          >
            Document management <IconExternal width={13} height={13} />
          </a>
        }
      />
      <CardBody className="space-y-2">
        {seafarer.documents.map((doc) => {
          const meta = STATUS_META[doc.status];
          return (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink">{doc.name}</div>
                <div className="mt-0.5 text-xs text-muted">
                  {doc.category}
                  {doc.reference && <> · {doc.reference}</>}
                  {doc.expiryDate && <> · expires {formatDate(doc.expiryDate)}</>}
                </div>
              </div>
              <Badge tone={meta.tone}>{meta.label}</Badge>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
