import { useState } from 'react';
import { Fragment } from 'react';
import {
  ASSIGNMENT_GROUPS,
  ASSIGNMENT_FILTERS,
  type AssignmentGroup,
  type AssignmentRow,
  type IncomingCrew,
  type PromoteCandidate,
} from '../data/assignments';
import type { PromotionRequest, Seafarer } from '../data/types';
import { usePromotionStore } from '../store/promotionStore';
import { Shell } from '../components/layout/Shell';
import { Button } from '../components/ui/Button';
import { PromotionForm } from '../components/promotion/PromotionForm';
import { PromoteCrewmanModal } from '../components/promotion/PromoteCrewmanModal';
import { PromotionStatusBadge } from '../components/promotion/PromotionStatusBadge';
import {
  IconChevron,
  IconArrowLeft,
  IconSort,
  IconPlane,
  IconWarning,
  IconFlag,
  IconPin,
  IconCheckCircle,
  IconClipboard,
  IconCalendar,
  IconDoc,
  IconUser,
} from '../components/layout/icons';
import { cn } from '../lib/cn';

/**
 * Assignments board — a second entry point into the promotion flow, styled to
 * mirror the real OOS screen (vessels, outgoing/incoming crew, gap/overlap).
 * Presentational except the Promote button in an expanded row, which opens the
 * shared PromotionForm (see data/assignments.ts).
 */
export function AssignmentsPage() {
  // Two-step flow: Promote opens the crew picker; picking a candidate opens the form.
  const [pickerCandidates, setPickerCandidates] = useState<PromoteCandidate[] | null>(null);
  const [formFor, setFormFor] = useState<Seafarer | null>(null);

  const totalRows = ASSIGNMENT_GROUPS.reduce((n, g) => n + g.rows.length, 0);

  return (
    <Shell title="Assignments">
      <div className="p-6">
        {/* Toolbar */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex w-56 cursor-default items-center justify-between rounded-md border border-line bg-white px-3 py-2 text-sm text-faint">
            Select vessel
            <IconChevron width={14} height={14} className="text-faint" />
          </span>
          {ASSIGNMENT_FILTERS.map((f) => (
            <span
              key={f}
              className="inline-flex cursor-default items-center rounded-md border border-line bg-white px-3 py-2 text-sm text-muted"
            >
              {f}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-3 text-sm">
            <span className="cursor-default text-teal">Clear all</span>
            <span className="inline-flex cursor-default items-center gap-1 text-teal">
              Save <IconChevron width={13} height={13} />
            </span>
          </span>
        </div>

        {/* Sort + count */}
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex cursor-default items-center gap-1 text-sm text-muted">
            <IconSort width={14} height={14} className="text-faint" />
            Sort by <span className="font-medium text-ink">End of contract</span>
            <IconChevron width={13} height={13} className="text-faint" />
          </span>
          <span className="text-sm text-muted">
            Showing <span className="text-ink">1–{totalRows}</span> of{' '}
            <span className="text-ink">107</span>
          </span>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
          {ASSIGNMENT_GROUPS.map((group) => (
            <GroupBlock key={group.id} group={group} onPromote={setPickerCandidates} />
          ))}
        </div>
      </div>

      {pickerCandidates && (
        <PromoteCrewmanModal
          candidates={pickerCandidates}
          open
          onClose={() => setPickerCandidates(null)}
          onSelect={(s) => {
            setPickerCandidates(null);
            setFormFor(s);
          }}
        />
      )}
      {formFor && <PromotionForm seafarer={formFor} open onClose={() => setFormFor(null)} />}
    </Shell>
  );
}

function GroupBlock({
  group,
  onPromote,
}: {
  group: AssignmentGroup;
  onPromote: (candidates: PromoteCandidate[]) => void;
}) {
  return (
    <>
      {group.monthLabel && (
        <div className="bg-canvas px-5 py-2 text-center text-xs font-medium text-muted">
          {group.monthLabel}
        </div>
      )}
      <div className="border-b border-line px-5 pb-1 pt-3 text-sm">
        <span className="font-semibold text-teal">{group.vessel}</span>
        {group.position.map((seg, i) => (
          <Fragment key={i}>
            <span className="text-faint"> · </span>
            <span
              className={cn(
                seg.tone === 'red'
                  ? 'font-medium text-danger'
                  : seg.tone === 'muted'
                    ? 'italic text-muted'
                    : 'text-ink',
              )}
            >
              {seg.text}
            </span>
          </Fragment>
        ))}
      </div>
      {group.rows.map((row) => (
        <Row key={row.id} row={row} onPromote={onPromote} />
      ))}
    </>
  );
}

function Row({
  row,
  onPromote,
}: {
  row: AssignmentRow;
  onPromote: (candidates: PromoteCandidate[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const request = usePromotionStore((s) => (row.seafarerId ? s.requests[row.seafarerId] : undefined));
  const overlap = row.gap === 'Overlap';

  return (
    <div className="border-b border-line last:border-0">
      {/* Collapsed row */}
      <div
        className={cn('flex items-stretch text-sm', overlap && 'bg-canvas')}
      >
        {/* Outgoing (left) */}
        <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3">
          <div className="min-w-[10rem]">
            <div className="font-semibold text-ink">{row.outgoing.name}</div>
            <div className="text-xs text-muted">
              {row.outgoing.crewNumber} ({row.outgoing.rankCode}) · {row.outgoing.nationality}
            </div>
          </div>
          <MiniField label="EOC" value={row.outgoing.endOfContract} danger />
          <MiniField label="Leaving" value={row.outgoing.leaving} />
          <MiniField label="Port" value={row.outgoing.port} />
          <CrewIcons
            className="ml-auto"
            icons={[
              row.outgoing.travel && 'travel',
              row.outgoing.warning && 'warning',
              row.outgoing.flag && 'flag',
              row.outgoing.pin && 'pin',
            ]}
          />
        </div>

        {/* Gap / Overlap indicator */}
        <div
          className={cn(
            'flex w-24 shrink-0 flex-col items-center justify-center border-x border-line text-[11px]',
            overlap ? 'bg-line/40 text-muted' : 'bg-canvas text-muted',
          )}
        >
          <IconArrowLeft width={16} height={16} className="text-faint" />
          {row.gap}
        </div>

        {/* Incoming (right) */}
        <div className="flex flex-[1.4] items-center gap-x-6 px-5 py-3">
          {overlap ? (
            <span className="text-muted">{row.overlapNote}</span>
          ) : row.incoming ? (
            <>
              <div className="min-w-[10rem]">
                <div className="font-semibold text-ink">{row.incoming.name}</div>
                <div className="text-xs text-muted">
                  {row.incoming.crewNumber} ({row.incoming.rankCode}) · {row.incoming.nationality}
                </div>
              </div>
              <MiniField label="" value={row.incoming.availability} />
              <MiniField label="Joining" value={row.incoming.joining} />
              <MiniField label="Port" value={row.incoming.joiningPort} />
              <CheckIcons className="ml-auto" checks={row.incoming.checks} />
            </>
          ) : (
            <span className="text-muted">Crewman not assigned</span>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            className="ml-2 shrink-0 rounded p-1 text-faint hover:bg-canvas hover:text-ink"
            aria-label={open ? 'Collapse' : 'Expand'}
          >
            <IconChevron
              width={16}
              height={16}
              className={cn('transition-transform', open ? 'rotate-90' : '-rotate-90')}
            />
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      {open && (
        <ExpandedDetail row={row} request={request} onPromote={onPromote} />
      )}
    </div>
  );
}

function ExpandedDetail({
  row,
  request,
  onPromote,
}: {
  row: AssignmentRow;
  request: PromotionRequest | undefined;
  onPromote: (candidates: PromoteCandidate[]) => void;
}) {
  // Candidates offered in the picker — explicit list, or the single primary seafarer.
  const candidates: PromoteCandidate[] =
    row.candidates ??
    (row.seafarerId
      ? [{ seafarerId: row.seafarerId, endOfContract: row.outgoing.endOfContract }]
      : []);
  const canPromote =
    candidates.length > 0 &&
    (!request || request.status === 'promoted' || request.status === 'rejected');

  return (
    <div className="flex items-stretch border-t border-line bg-white">
      {/* Left: outgoing detail */}
      <div className="flex-1 space-y-4 px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10 text-navy">
              <IconUser width={20} height={20} />
            </span>
            <div>
              <div className="font-semibold text-teal">{row.outgoing.name}</div>
              <div className="text-xs text-muted">
                {row.outgoing.crewNumber} ({row.outgoing.rankCode}) · {row.outgoing.nationality}
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" disabled title="Not part of this prototype">
            Sign off
          </Button>
        </div>

        <DetailSection icon={<IconCalendar width={15} height={15} />} title="Leaving" action="Update">
          <DetailLine label="End of contract" value={row.outgoing.endOfContract} danger />
          <DetailLine label="Planned leaving date" value="—" />
          <DetailLine label="Planned leaving port" value="—" />
        </DetailSection>

        <DetailSection icon={<IconDoc width={15} height={15} />} title="Documents" action="View">
          {row.outgoing.missingDocuments?.length ? (
            <>
              <div className="text-xs font-medium uppercase tracking-wide text-danger">Missing</div>
              {row.outgoing.missingDocuments.map((d) => (
                <div key={d} className="text-sm text-ink">
                  {d}
                </div>
              ))}
            </>
          ) : (
            <div className="text-sm text-muted">No outstanding documents.</div>
          )}
        </DetailSection>
      </div>

      {/* Gap spacer to align with collapsed row */}
      <div className="flex w-24 shrink-0 items-start justify-center border-x border-line bg-canvas pt-5 text-[11px] text-muted">
        {row.gap}
      </div>

      {/* Right: incoming / promote */}
      <div className="flex flex-[1.4] flex-col px-6 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-faint">
              <IconUser width={20} height={20} />
            </span>
            <div className="text-muted">
              {row.incoming ? (
                <>
                  <div className="font-semibold text-teal">{row.incoming.name}</div>
                  <div className="text-xs">
                    {row.incoming.crewNumber} ({row.incoming.rankCode}) · {row.incoming.nationality}
                  </div>
                </>
              ) : (
                'Crewman not assigned'
              )}
            </div>
          </div>
          {!row.incoming && (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => candidates.length > 0 && onPromote(candidates)}
                disabled={!canPromote}
                title={candidates.length > 0 ? undefined : 'No promotion candidate in this prototype'}
              >
                Promote
              </Button>
              <Button size="sm" disabled title="Not part of this prototype">
                Assign
              </Button>
            </div>
          )}
        </div>

        {request && (
          <div className="mt-4">
            <PromotionStatusBadge status={request.status} />
          </div>
        )}
        {row.incoming && (
          <div className="mt-4 grid gap-1 text-sm">
            <DetailLine label="Availability" value={row.incoming.availability} />
            <DetailLine label="Joining" value={row.incoming.joining} />
            <DetailLine label="Port" value={row.incoming.joiningPort} />
          </div>
        )}
      </div>
    </div>
  );
}

function MiniField({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="min-w-[5rem]">
      {label && <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>}
      <div className={cn('text-sm', danger ? 'font-medium text-danger' : 'text-ink')}>{value}</div>
    </div>
  );
}

function CrewIcons({
  icons,
  className,
}: {
  icons: (string | false | undefined)[];
  className?: string;
}) {
  const map: Record<string, JSX.Element> = {
    travel: <IconPlane width={15} height={15} className="text-muted" />,
    warning: <IconWarning width={15} height={15} className="text-danger" />,
    flag: <IconFlag width={15} height={15} className="text-muted" />,
    pin: <IconPin width={15} height={15} className="text-muted" />,
  };
  const present = icons.filter(Boolean) as string[];
  if (!present.length) return null;
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {present.map((k, i) => (
        <span key={i}>{map[k]}</span>
      ))}
    </div>
  );
}

function CheckIcons({
  checks,
  className,
}: {
  checks?: IncomingCrew['checks'];
  className?: string;
}) {
  if (!checks?.length) return null;
  const map: Record<string, JSX.Element> = {
    ok: <IconCheckCircle width={15} height={15} className="text-ok" />,
    clipboard: <IconClipboard width={15} height={15} className="text-danger" />,
    travel: <IconPlane width={15} height={15} className="text-muted" />,
    warning: <IconWarning width={15} height={15} className="text-danger" />,
    flag: <IconFlag width={15} height={15} className="text-muted" />,
  };
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {checks.map((k, i) => (
        <span key={i}>{map[k]}</span>
      ))}
    </div>
  );
}

function DetailSection({
  icon,
  title,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <span className="text-danger">{icon}</span>
          {title}
        </div>
        {action && <span className="cursor-default text-xs text-teal">{action}</span>}
      </div>
      <div className="space-y-0.5 pl-6">{children}</div>
    </div>
  );
}

function DetailLine({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-40 shrink-0 text-muted">{label}</span>
      <span className={danger ? 'font-medium text-danger' : 'text-ink'}>{value}</span>
    </div>
  );
}
