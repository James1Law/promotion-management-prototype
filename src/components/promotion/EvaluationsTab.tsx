import { useState } from 'react';
import type { Contract, Evaluation, Seafarer } from '../../data/types';
import {
  formatDate,
  formatScore,
  formatServiceLength,
  scoreLabel,
  scoreTone,
} from '../../lib/format';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { IconChevron, IconPlus, IconThumbsUp } from '../layout/icons';

const toneToBadge = { ok: 'ok', warn: 'warn', danger: 'danger' } as const;

/**
 * Profile "Evaluations" tab — mirrors the real OOS layout: Onboard / Others /
 * Personal objectives sub-tabs, a flagged-only filter, an Add-evaluation
 * action, and appraisal rows shown against their service period. The footer
 * hosts the promotion entry points: **Promote** (live — opens the promotion
 * form) and **Ready for promotion** (decorative in this prototype).
 *
 * NB: distinct from EvaluationsPanel, which is the compact decision-support
 * list shown inside the approval review modal.
 */
export function EvaluationsTab({
  seafarer,
  onPromote,
  canPromote,
}: {
  seafarer: Seafarer;
  onPromote: () => void;
  canPromote: boolean;
}) {
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const evaluations = flaggedOnly
    ? seafarer.evaluations.filter((e) => e.flagged)
    : seafarer.evaluations;

  const onboardCount = seafarer.evaluations.length;

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <SubTab active label="Onboard" count={onboardCount} />
        <SubTab label="Others" count={0} />
        <SubTab label="Personal objectives" count={0} />
        <label className="ml-auto flex cursor-default items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={flaggedOnly}
            onChange={(e) => setFlaggedOnly(e.target.checked)}
            className="h-3.5 w-3.5 accent-teal"
          />
          Show only flagged evaluations
        </label>
      </div>

      <Card>
        <div className="flex items-center justify-end border-b border-line px-5 py-3">
          <Button size="sm" disabled title="Not part of this prototype">
            <IconPlus width={14} height={14} /> Add evaluation
          </Button>
        </div>

        <div className="space-y-2.5 p-4">
          <div className="text-center text-[11px] uppercase tracking-wide text-faint">Present</div>
          {evaluations.length ? (
            evaluations.map((ev) => (
              <EvaluationRow
                key={ev.id}
                ev={ev}
                contract={contractForEvaluation(seafarer, ev)}
                open={expanded === ev.id}
                onToggle={() => setExpanded(expanded === ev.id ? null : ev.id)}
              />
            ))
          ) : (
            <div className="rounded-md bg-canvas px-4 py-3 text-center text-sm text-muted">
              No flagged evaluations.
            </div>
          )}
        </div>
      </Card>

      {/* Footer actions — the promotion entry point lives here. */}
      <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
        <Button variant="secondary" disabled title="Not part of this prototype">
          Ready for promotion
        </Button>
        <Button onClick={onPromote} disabled={!canPromote}>
          Promote
        </Button>
      </div>
    </div>
  );
}

function SubTab({ label, count, active }: { label: string; count: number; active?: boolean }) {
  return (
    <span
      className={
        'inline-flex cursor-default items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ' +
        (active
          ? 'border-teal bg-teal-soft text-teal-dark'
          : 'border-line bg-white text-muted')
      }
    >
      {label}
      <span className={active ? 'text-teal-dark/70' : 'text-faint'}>{count}</span>
    </span>
  );
}

/** Match an evaluation to the service period it was recorded during. */
function contractForEvaluation(seafarer: Seafarer, ev: Evaluation): Contract | undefined {
  const at = new Date(ev.date).getTime();
  const within = seafarer.contracts.find((c) => {
    const start = new Date(c.signOn).getTime();
    const end = c.leaving ? new Date(c.leaving).getTime() : Date.now();
    return at >= start && at <= end;
  });
  // For dates that fall in a leave gap, attribute the appraisal to the most
  // recent contract that had already started by then (contracts are newest
  // first, so the first match is the latest such contract).
  return within ?? seafarer.contracts.find((c) => new Date(c.signOn).getTime() <= at);
}

function EvaluationRow({
  ev,
  contract,
  open,
  onToggle,
}: {
  ev: Evaluation;
  contract?: Contract;
  open: boolean;
  onToggle: () => void;
}) {
  const isOnboard = contract ? Boolean(contract.onboard) || !contract.leaving : false;
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-x-6 gap-y-2 bg-surface px-4 py-3 text-left text-sm hover:bg-canvas"
      >
        {/* Coloured leading bar */}
        <span
          className={
            'h-9 w-1 shrink-0 rounded-full ' +
            (scoreTone(ev.score) === 'ok'
              ? 'bg-ok'
              : scoreTone(ev.score) === 'warn'
                ? 'bg-warn'
                : 'bg-danger')
          }
        />
        <div className="min-w-[10rem]">
          <div className="font-medium text-ink">{contract?.vesselName ?? '—'}</div>
          <div className="text-xs text-muted">
            {ev.vesselType}
            {contract && ` · ${contract.rankOnBoard}`}
          </div>
        </div>
        <Field label="Actual rank">{ev.rankHeld}</Field>
        <Field label="Sign on">{formatDate(contract?.signOn)}</Field>
        <Field label="End of contract">
          {isOnboard ? '—' : formatDate(contract?.leaving)}
        </Field>
        <Field label="Service length">
          {contract ? formatServiceLength(contract.signOn, contract.leaving) : '—'}
        </Field>
        <div className="ml-auto flex shrink-0 items-center gap-3 pl-3">
          <div className="flex flex-col items-end gap-1">
            <Badge tone={toneToBadge[scoreTone(ev.score)]}>
              {formatScore(ev.score)}
              <span className="opacity-60"> / 10</span>
            </Badge>
            {isOnboard ? (
              <Badge tone="info" dot>
                On board
              </Badge>
            ) : (
              <span className="text-xs text-muted">{formatDate(ev.date)}</span>
            )}
          </div>
          <IconChevron
            width={16}
            height={16}
            className={'text-faint transition-transform ' + (open ? 'rotate-180' : '')}
          />
        </div>
      </button>

      {open && (
        <div className="grid gap-4 border-t border-line bg-canvas px-5 py-3 text-sm sm:grid-cols-2">
          <DetailField label="Evaluation type">{ev.formType}</DetailField>
          <DetailField label="Evaluator">{ev.evaluator}</DetailField>
          <DetailField label="Date">{formatDate(ev.date)}</DetailField>
          <DetailField label="Overall score">
            {formatScore(ev.score)} / 10 · {scoreLabel(ev.score)}
          </DetailField>
          <DetailField label="Recommendation">
            {ev.recommendedForPromotion ? (
              <span className="inline-flex items-center gap-1 text-teal">
                <IconThumbsUp width={14} height={14} /> Recommended for promotion
              </span>
            ) : (
              <span className="text-muted">No recommendation recorded</span>
            )}
          </DetailField>
          {ev.flagged && (
            <DetailField label="Flag">
              <Badge tone="warn">Flagged for review</Badge>
            </DetailField>
          )}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-0.5 text-ink">{children}</div>
    </div>
  );
}

function DetailField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-0.5 text-ink">{children}</div>
    </div>
  );
}
