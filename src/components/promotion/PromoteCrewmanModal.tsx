import { useState } from 'react';
import type { PromoteCandidate } from '../../data/assignments';
import type { Seafarer } from '../../data/types';
import { seafarerById } from '../../data/seafarers';
import { formatYears } from '../../lib/format';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { IconUser } from '../layout/icons';

/**
 * The "Promote crewman" candidate picker — the step that sits between the
 * Assignments Promote button and the promotion form, mirroring the real OOS
 * screen. Lists the row's candidate crew; picking one (Continue) hands the
 * chosen seafarer to the shared PromotionForm. The "Show all crew" toggle is a
 * decorative product affordance (prototype-only — it has no data behind it).
 */
export function PromoteCrewmanModal({
  candidates,
  open,
  onClose,
  onSelect,
}: {
  candidates: PromoteCandidate[];
  open: boolean;
  onClose: () => void;
  onSelect: (seafarer: Seafarer) => void;
}) {
  // Decorative only — matches the real product's checkbox; no extra crew behind it.
  const [showAll, setShowAll] = useState(false);

  const resolved = candidates
    .map((c) => ({ candidate: c, seafarer: seafarerById(c.seafarerId) }))
    .filter((r): r is { candidate: PromoteCandidate; seafarer: Seafarer } => !!r.seafarer);

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="xl"
      title="Promote crewman"
      footer={
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="space-y-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
            className="h-4 w-4 rounded border-line text-teal focus:ring-teal"
          />
          Show all crew
        </label>

        <div className="divide-y divide-line rounded-md border border-line">
          {resolved.map(({ candidate, seafarer }) => (
            <div
              key={seafarer.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3"
            >
              <div className="flex min-w-[13rem] items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-navy">
                  <IconUser width={18} height={18} />
                </span>
                <div>
                  <div className="font-semibold text-teal">{seafarer.name}</div>
                  <div className="text-xs text-muted">
                    {seafarer.crewNumber} ({seafarer.currentRank.code}) · {seafarer.nationality} ·{' '}
                    {seafarer.manningAgent}
                  </div>
                </div>
              </div>
              <PickerField label="Vessel type" value={seafarer.vesselType} />
              <PickerField label="Years in rank" value={formatYears(seafarer.experience.yearsInRank)} />
              <PickerField label="End of contract" value={candidate.endOfContract} />
              <Button size="sm" className="ml-auto" onClick={() => onSelect(seafarer)}>
                Continue
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function PickerField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[7rem]">
      <div className="text-[11px] uppercase tracking-wide text-faint">{label}</div>
      <div className="text-sm text-ink">{value}</div>
    </div>
  );
}
