import { useEffect, useMemo, useState } from 'react';
import type { Attachment, Rank, Seafarer } from '../../data/types';
import { nextRanks } from '../../data/ranks';
import { currentVessel } from '../../data/seafarers';
import { VESSELS } from '../../data/vessels';
import { usePromotionStore } from '../../store/promotionStore';
import { chainForTransition } from '../../data/approvalChains';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FormLabel } from '../ui/Field';
import { ExperiencePanel } from './ExperiencePanel';
import { EvaluationsPanel } from './EvaluationsPanel';
import { LicencesPanel } from './LicencesPanel';
import { IconArrowRight, IconPaperclip } from '../layout/icons';

/**
 * The pre-populated promotion form. Triggered from any entry point; shows the
 * decision-support panels (experience / evaluations / licences), a remarks box
 * and a mock attachment, then submits into the approval workflow.
 */
export function PromotionForm({
  seafarer,
  open,
  onClose,
}: {
  seafarer: Seafarer;
  open: boolean;
  onClose: () => void;
}) {
  const initiate = usePromotionStore((s) => s.initiatePromotion);
  const targets = useMemo(() => nextRanks(seafarer.currentRank.code), [seafarer]);
  const [targetCode, setTargetCode] = useState(targets[0]?.code ?? '');
  const [vessel, setVessel] = useState(currentVessel(seafarer) ?? '');
  const [remarks, setRemarks] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // The same form instance is reused across seafarers (Crew Directory reuses it,
  // and profile→profile navigation doesn't remount it). Reset selections when the
  // seafarer changes so stale state can't break submit or carry the wrong vessel.
  useEffect(() => {
    setTargetCode(targets[0]?.code ?? '');
    setVessel(currentVessel(seafarer) ?? '');
  }, [targets, seafarer]);

  const target: Rank | undefined = targets.find((r) => r.code === targetCode);
  // Onboard → vessel auto-populates and is fixed; at home → a planned vessel must
  // be chosen from the catalogue before the promotion can be raised.
  const canSubmit = Boolean(target) && (seafarer.onboard || Boolean(vessel));
  const chain = target ? chainForTransition(seafarer.currentRank.code, target.code) : [];
  const needsWorkflow = chain.length > 0;

  const addMockAttachment = () => {
    const n = attachments.length + 1;
    setAttachments([...attachments, { name: `supporting-note-${n}.pdf`, sizeLabel: '248 KB' }]);
  };

  const submit = () => {
    if (!target) return;
    initiate({
      seafarerId: seafarer.id,
      targetRank: target,
      vessel: vessel || undefined,
      remarks,
      attachments,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="xl"
      title="Submit for promotion"
      footer={
        <>
          <span className="mr-auto text-xs text-muted">
            {needsWorkflow ? (
              <>
                Routes to {chain.length}-step approval ·{' '}
                {chain.map((s) => s.department).join(' → ')}
              </>
            ) : (
              'No approval workflow for this transition · recorded directly'
            )}
          </span>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!canSubmit}>
            {needsWorkflow ? 'Submit for promotion' : 'Record promotion'}{' '}
            <IconArrowRight width={15} height={15} />
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Rank transition */}
        <div className="flex flex-wrap items-end gap-4 rounded-lg bg-canvas p-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-faint">
              Current rank
            </div>
            <div className="mt-1 flex items-center gap-2">
              <Badge tone="neutral">{seafarer.currentRank.code}</Badge>
              <span className="text-sm font-medium text-ink">{seafarer.currentRank.name}</span>
            </div>
          </div>
          <IconArrowRight className="mb-1 text-faint" width={18} height={18} />
          <div>
            <FormLabel>Target rank</FormLabel>
            {targets.length > 0 ? (
              <select
                value={targetCode}
                onChange={(e) => setTargetCode(e.target.value)}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
              >
                {targets.map((r) => (
                  <option key={r.code} value={r.code}>
                    ({r.code}) {r.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-sm text-muted">No configured progression from this rank.</div>
            )}
          </div>
          <div>
            <FormLabel>Vessel</FormLabel>
            {seafarer.onboard ? (
              <div className="flex items-center gap-1.5 py-2 text-sm font-medium text-ink">
                {vessel || '—'}
                <span className="text-xs font-normal text-muted">(current)</span>
              </div>
            ) : (
              <select
                value={vessel}
                onChange={(e) => setVessel(e.target.value)}
                className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
              >
                <option value="">Select planned vessel…</option>
                {VESSELS.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} · {v.type}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs font-medium uppercase tracking-wide text-faint">Vessel type</div>
            <div className="mt-1 text-sm font-medium text-ink">{seafarer.vesselType}</div>
          </div>
        </div>

        {/* Decision-support panels (shared with the approver view) */}
        <ExperiencePanel seafarer={seafarer} />
        <div className="grid gap-4 lg:grid-cols-2">
          <EvaluationsPanel seafarer={seafarer} />
          <LicencesPanel seafarer={seafarer} />
        </div>

        {/* Remarks + attachments */}
        <div>
          <FormLabel>Remarks / justification</FormLabel>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            placeholder="Add context for the approvers — why this seafarer, why now…"
            className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-teal focus:outline-none"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={addMockAttachment}>
              <IconPaperclip width={14} height={14} /> Attach file
            </Button>
            {attachments.map((a) => (
              <Badge key={a.name} tone="teal">
                {a.name} · {a.sizeLabel}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
