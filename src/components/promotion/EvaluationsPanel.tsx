import type { Seafarer } from '../../data/types';
import { EXTERNAL_LINKS, RECENT_EVALUATION_COUNT } from '../../data/formConfig';
import { formatDate, formatScore, scoreLabel, scoreTone } from '../../lib/format';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { IconExternal, IconThumbsUp } from '../layout/icons';

const toneToBadge = { ok: 'ok', warn: 'warn', danger: 'danger' } as const;

export function EvaluationsPanel({ seafarer }: { seafarer: Seafarer }) {
  const recent = seafarer.evaluations.slice(0, RECENT_EVALUATION_COUNT);
  return (
    <Card>
      <CardHeader
        title={`Recent evaluations`}
        action={
          <a
            href={EXTERNAL_LINKS.evaluations(seafarer.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-dark"
          >
            All evaluations <IconExternal width={13} height={13} />
          </a>
        }
      />
      <CardBody className="space-y-2.5">
        {recent.map((ev) => (
          <div
            key={ev.id}
            className="flex items-center justify-between rounded-md border border-line px-3 py-2.5"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium text-ink">
                {ev.formType}
                {ev.recommendedForPromotion && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-1.5 py-0.5 text-xs font-medium text-teal"
                    title="Evaluator recommended for promotion"
                  >
                    <IconThumbsUp width={13} height={13} /> Recommended
                  </span>
                )}
                {ev.flagged && <Badge tone="warn">Flagged</Badge>}
              </div>
              <div className="mt-0.5 text-xs text-muted">
                {formatDate(ev.date)} · {ev.rankHeld} · {ev.vesselType} · {ev.evaluator}
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1 pl-3">
              <Badge tone={toneToBadge[scoreTone(ev.score)]}>
                {formatScore(ev.score)}
                <span className="opacity-60"> / 10</span>
              </Badge>
              <span className="text-xs text-muted">{scoreLabel(ev.score)}</span>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
