import type { ApprovalStageState, StageStatus } from '../../data/types';
import { cn } from '../../lib/cn';
import { formatDate } from '../../lib/format';
import { IconCheck, IconX, IconPause, IconSkip } from '../layout/icons';

/**
 * Promotion approval stepper — mirrors the OOS crew-applicant approval stepper.
 * Renders one node per configured stage; completed nodes show role, approver
 * and decision date. Handles a variable number of stages.
 */

const NODE: Record<
  StageStatus,
  { ring: string; fill: string; text: string; icon: React.ReactNode | null }
> = {
  approved: {
    ring: 'border-ok bg-ok',
    fill: 'text-white',
    text: 'text-ink',
    icon: <IconCheck width={16} height={16} />,
  },
  current: {
    ring: 'border-navy-accent bg-white',
    fill: 'text-navy-accent',
    text: 'text-ink',
    icon: <span className="h-2.5 w-2.5 rounded-full bg-navy-accent" />,
  },
  waiting: {
    ring: 'border-line bg-white',
    fill: 'text-faint',
    text: 'text-faint',
    icon: <span className="h-2 w-2 rounded-full bg-line" />,
  },
  rejected: {
    ring: 'border-danger bg-danger',
    fill: 'text-white',
    text: 'text-ink',
    icon: <IconX width={16} height={16} />,
  },
  skipped: {
    ring: 'border-line bg-canvas',
    fill: 'text-muted',
    text: 'text-muted',
    icon: <IconSkip width={14} height={14} />,
  },
  paused: {
    ring: 'border-warn bg-warn',
    fill: 'text-white',
    text: 'text-ink',
    icon: <IconPause width={13} height={13} />,
  },
};

const STATUS_LABEL: Record<StageStatus, string> = {
  approved: 'Approved',
  current: 'Pending approval',
  waiting: 'Awaiting',
  rejected: 'Rejected',
  skipped: 'Skipped',
  paused: 'Paused',
};

export function PromotionStepper({ stages }: { stages: ApprovalStageState[] }) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-0">
      {stages.map((stage, i) => {
        const meta = NODE[stage.status];
        const isLast = i === stages.length - 1;
        return (
          <div key={stage.id} className="relative flex flex-1 gap-3 md:flex-col md:gap-0">
            {/* connector line (desktop) — centred on the 32px node */}
            {!isLast && (
              <div className="absolute left-4 top-4 hidden h-0.5 w-full -translate-y-1/2 bg-line md:block" />
            )}
            <div className="flex items-center md:flex-col md:items-start">
              <span
                className={cn(
                  'z-[1] flex h-8 w-8 items-center justify-center rounded-full border-2',
                  meta.ring,
                  meta.fill,
                )}
              >
                {meta.icon}
              </span>
            </div>
            <div className="md:mt-3 md:pr-6">
              <div className="text-[11px] font-medium uppercase tracking-wide text-faint">
                {STATUS_LABEL[stage.status]}
              </div>
              <div className={cn('text-sm font-semibold', meta.text)}>{stage.role}</div>
              <div className="text-xs text-muted">{stage.approverName}</div>
              {stage.decidedAt && (
                <div className="mt-0.5 text-xs text-faint">{formatDate(stage.decidedAt)}</div>
              )}
              {stage.comment && (
                <div className="mt-1 max-w-[16rem] rounded bg-canvas px-2 py-1 text-xs text-muted">
                  “{stage.comment}”
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
