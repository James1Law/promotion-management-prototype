import { useState } from 'react';
import type { PromotionRequest, Seafarer } from '../../data/types';
import { usePromotionStore, useCurrentPersona } from '../../store/promotionStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ExperiencePanel } from './ExperiencePanel';
import { EvaluationsPanel } from './EvaluationsPanel';
import { LicencesPanel } from './LicencesPanel';
import { PromotionStepper } from './PromotionStepper';
import {
  IconArrowRight,
  IconCheck,
  IconX,
  IconSkip,
  IconPause,
  IconPaperclip,
} from '../layout/icons';

/**
 * Approver review — a modal over the existing UI (not a separate page). This is
 * the point at which the decision-support panels (experience / evaluations /
 * licences) are revealed; before this they are hidden on the profile.
 */
export function PromotionReviewModal({
  seafarer,
  request,
  open,
  onClose,
}: {
  seafarer: Seafarer;
  request: PromotionRequest;
  open: boolean;
  onClose: () => void;
}) {
  const decideStage = usePromotionStore((s) => s.decideStage);
  const setStagePaused = usePromotionStore((s) => s.setStagePaused);
  const setPersona = usePromotionStore((s) => s.setPersona);
  const personas = usePromotionStore((s) => s.personas);
  const persona = useCurrentPersona();
  const [comment, setComment] = useState('');

  const currentStage = request.stages.find((s) => s.status === 'current');
  const isCurrentApprover =
    persona.kind === 'approver' && currentStage?.id === persona.stageId;
  const owedApprover = currentStage
    ? personas.find((p) => p.stageId === currentStage.id)
    : undefined;

  const decide = (decision: 'approved' | 'rejected' | 'skipped') => {
    if (!currentStage) return;
    decideStage(seafarer.id, currentStage.id, decision, comment);
    setComment('');
    onClose();
  };

  const pause = () => {
    if (!currentStage) return;
    setStagePaused(seafarer.id, currentStage.id, true, comment || 'Paused pending information');
    setComment('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      width="xl"
      title={
        <span className="flex items-center gap-2">
          Review promotion — {seafarer.name}
          <Badge tone="neutral">{request.currentRank.code}</Badge>
          <IconArrowRight width={13} height={13} className="text-faint" />
          <Badge tone="teal">{request.targetRank.code}</Badge>
        </span>
      }
      footer={
        request.status === 'pending' && currentStage ? (
          <>
            {isCurrentApprover ? (
              <span className="mr-auto text-xs text-muted">
                Deciding as <strong>{persona.name}</strong> · {currentStage.role}
              </span>
            ) : (
              <span className="mr-auto text-xs text-warn">
                Awaiting {owedApprover?.name} ({currentStage.role})
              </span>
            )}
            <Button variant="secondary" onClick={pause} disabled={!isCurrentApprover}>
              <IconPause width={14} height={14} /> Pause
            </Button>
            <Button variant="secondary" onClick={() => decide('skipped')} disabled={!isCurrentApprover}>
              <IconSkip width={14} height={14} /> Skip
            </Button>
            <Button
              variant="danger"
              onClick={() => decide('rejected')}
              disabled={!isCurrentApprover || !comment.trim()}
            >
              <IconX width={15} height={15} /> Reject
            </Button>
            <Button onClick={() => decide('approved')} disabled={!isCurrentApprover}>
              <IconCheck width={15} height={15} /> Approve
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        )
      }
    >
      <div className="space-y-4">
        {/* Approval progress */}
        <div className="rounded-lg bg-canvas p-4">
          <PromotionStepper stages={request.stages} />
        </div>

        {/* Persona gate */}
        {request.status === 'pending' && currentStage && !isCurrentApprover && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-warn-soft px-4 py-3 text-sm text-ink">
            <span>
              You are viewing as <strong>{persona.name}</strong>. This step is awaiting{' '}
              <strong>{owedApprover?.name}</strong> ({currentStage.role}).
            </span>
            {owedApprover && (
              <Button size="sm" variant="secondary" onClick={() => setPersona(owedApprover.id)}>
                Switch to {owedApprover.name}
              </Button>
            )}
          </div>
        )}

        {/* Submitted context */}
        <div className="grid gap-4 rounded-md border border-line p-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-faint">Remarks</div>
            <div className="mt-1 text-sm text-ink">
              {request.remarks || <span className="text-faint">None provided</span>}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-faint">Attachments</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {request.attachments.length ? (
                request.attachments.map((a) => (
                  <Badge key={a.name} tone="teal">
                    <IconPaperclip width={12} height={12} /> {a.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-faint">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Decision-support (revealed only here) */}
        <ExperiencePanel seafarer={seafarer} />
        <div className="grid gap-4 lg:grid-cols-2">
          <EvaluationsPanel seafarer={seafarer} />
          <LicencesPanel seafarer={seafarer} />
        </div>

        {/* Decision comment */}
        {request.status === 'pending' && currentStage && (
          <div>
            <div className="mb-1.5 text-sm font-medium text-ink">
              Decision comment{' '}
              <span className="font-normal text-faint">(required for rejection)</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              disabled={!isCurrentApprover}
              placeholder="Add a comment…"
              className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-teal focus:outline-none disabled:bg-canvas"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
