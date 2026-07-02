import type { ReactNode } from 'react';
import type { Contract, PromotionRequest, Seafarer } from '../../data/types';
import { formatDate, formatServiceLength } from '../../lib/format';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

/**
 * OOS-style "Contracts and Leave periods" tab: service periods grouped into
 * Present (the open contract) and Past, with **Promotion** markers interleaved
 * in the timeline — including the live promotion once it has been applied
 * onBOARD, so the profile reflects the completed rank change like OOS does.
 */
export function ContractsPanel({
  seafarer,
  request,
}: {
  seafarer: Seafarer;
  request?: PromotionRequest;
}) {
  const isOpen = (c: Contract) => Boolean(c.onboard) || !c.leaving;
  const present = seafarer.contracts.filter(isOpen);
  const past = seafarer.contracts.filter((c) => !isOpen(c));

  const livePromotionDate =
    request?.status === 'promoted'
      ? request.effectiveRankChangeDate ?? request.promotedAt
      : undefined;

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <h3 className="text-sm font-semibold text-ink">Contracts and Leave periods</h3>
        <span className="cursor-default text-xs text-teal">+ Leave period</span>
      </div>

      <div className="space-y-2 p-4">
        <SectionLabel>Present</SectionLabel>
        {livePromotionDate && request && (
          <PromotionMarker
            date={livePromotionDate}
            label={`Promotion to ${request.targetRank.name}`}
          />
        )}
        {present.length ? (
          present.map((c) => <ContractRow key={c.id} c={c} />)
        ) : (
          <div className="rounded-md bg-canvas px-4 py-3 text-sm text-muted">
            On leave — no active contract.
          </div>
        )}

        {past.length > 0 && <SectionLabel>Past</SectionLabel>}
        {past.map((c) => (
          <div key={c.id} className="space-y-2">
            <ContractRow c={c} />
            {c.reasonForLeaving === 'Rank change' && (
              <PromotionMarker date={c.leaving} label="Promotion" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="pt-1 text-center text-[11px] uppercase tracking-wide text-faint">
      {children}
    </div>
  );
}

function PromotionMarker({ date, label }: { date?: string; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-info-soft px-4 py-2 text-sm text-ink">
      <span className="h-2 w-2 rounded-full bg-info" />
      <span className="font-medium">{label}</span>
      <span className="text-muted">· {formatDate(date)}</span>
    </div>
  );
}

function ContractRow({ c }: { c: Contract }) {
  const open = Boolean(c.onboard) || !c.leaving;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md border border-line bg-surface px-4 py-3 text-sm">
      <div className="min-w-[9rem]">
        <div className="font-medium text-ink">{c.vesselName}</div>
        <div className="text-xs text-muted">{c.vesselType}</div>
      </div>
      <Field label="Rank on board">{c.rankOnBoard}</Field>
      <Field label="Sign on">{formatDate(c.signOn)}</Field>
      <Field label={open ? 'Leaving' : 'Last day'}>{open ? '—' : formatDate(c.leaving)}</Field>
      <Field label="Service length">{formatServiceLength(c.signOn, c.leaving)}</Field>
      <div className="ml-auto">
        {open ? (
          <Badge tone="ok" dot>
            On board
          </Badge>
        ) : (
          <span className="text-xs text-muted">{c.reasonForLeaving ?? '—'}</span>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-0.5 text-ink">{children}</div>
    </div>
  );
}
