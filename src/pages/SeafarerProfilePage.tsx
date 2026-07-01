import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { seafarerById } from '../data/seafarers';
import { usePromotionStore, useCurrentPersona, effectiveRank } from '../store/promotionStore';
import { Shell } from '../components/layout/Shell';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormLabel } from '../components/ui/Field';
import { Avatar } from '../components/promotion/Avatar';
import { ProfileSummary } from '../components/promotion/ProfileSummary';
import { PromotionStepper } from '../components/promotion/PromotionStepper';
import { PromotionStatusBadge } from '../components/promotion/PromotionStatusBadge';
import { PromotionForm } from '../components/promotion/PromotionForm';
import { PromotionReviewModal } from '../components/promotion/PromotionReviewModal';
import { EmailPreview } from '../components/promotion/EmailPreview';
import { IconArrowRight, IconMail, IconExternal, IconPaperclip } from '../components/layout/icons';
import { formatDate } from '../lib/format';

const TABS = ['Summary', 'Personal', 'Contracts', 'Documents', 'Training', 'Evaluations', 'Remarks'];

export function SeafarerProfilePage() {
  const { id = '' } = useParams();
  const seafarer = seafarerById(id);
  const request = usePromotionStore((s) => s.requests[id]);
  const resetPromotion = usePromotionStore((s) => s.resetPromotion);
  const applyRankChange = usePromotionStore((s) => s.applyRankChange);
  const persona = useCurrentPersona();

  const [formOpen, setFormOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().slice(0, 10));

  if (!seafarer) {
    return (
      <Shell title="Crew Directory">
        <div className="p-6">Seafarer not found.</div>
      </Shell>
    );
  }

  const rank = effectiveRank(seafarer, request);
  const currentStage = request?.stages.find((s) => s.status === 'current');
  const isCurrentApprover =
    persona.kind === 'approver' && currentStage?.id === persona.stageId;
  const canPromote = !request || request.status === 'promoted' || request.status === 'rejected';

  return (
    <Shell title="Crew Directory">
      <div className="mx-auto max-w-5xl p-6">
        <div className="mb-3 text-sm text-muted">
          <Link to="/" className="hover:text-teal">
            Crew Directory
          </Link>{' '}
          / {seafarer.name}
        </div>

        {/* Header */}
        <Card className="mb-4">
          <CardBody>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-4">
                <Avatar name={seafarer.name} size={56} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-ink">{seafarer.name}</h2>
                    {request && <PromotionStatusBadge status={request.status} />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                    <span>
                      <Badge tone="neutral">{rank.code}</Badge> {rank.name}
                    </span>
                    <span>· {seafarer.vesselType}</span>
                    <span>· {seafarer.nationality}</span>
                    <span>· {seafarer.crewNumber}</span>
                  </div>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-teal hover:text-teal-dark"
                  >
                    View crewman in Zodiac intranet <IconExternal width={12} height={12} />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {request && (
                  <Button variant="ghost" size="sm" onClick={() => resetPromotion(seafarer.id)}>
                    Reset demo
                  </Button>
                )}
                <Button onClick={() => setFormOpen(true)} disabled={!canPromote}>
                  Promote
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Tabs (decorative) */}
        <div className="mb-4 flex flex-wrap gap-1 border-b border-line text-sm">
          {TABS.map((t, i) => (
            <span
              key={t}
              className={
                'cursor-default border-b-2 px-3 py-2 ' +
                (i === 0
                  ? 'border-teal font-medium text-ink'
                  : 'border-transparent text-muted')
              }
            >
              {t}
            </span>
          ))}
        </div>

        {/* Promotion approval panel */}
        {request && (
          <Card className="mb-4">
            <CardHeader
              title="Promotion approval"
              action={
                <span className="text-xs text-muted">
                  {request.currentRank.name}{' '}
                  <IconArrowRight className="inline" width={12} height={12} />{' '}
                  <span className="font-medium text-ink">{request.targetRank.name}</span>
                </span>
              }
            />
            <CardBody className="space-y-5">
              <PromotionStepper stages={request.stages} />

              {/* Contextual action / status banner */}
              {request.status === 'pending' && currentStage && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-info-soft px-4 py-3">
                  <div className="text-sm text-ink">
                    Awaiting <strong>{currentStage.role}</strong> ({currentStage.approverName}).
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setEmailOpen(true)}>
                      <IconMail width={14} height={14} /> View email
                    </Button>
                    <Button size="sm" onClick={() => setReviewOpen(true)}>
                      {isCurrentApprover ? 'Review & decide' : 'Open promotion'}{' '}
                      <IconArrowRight width={14} height={14} />
                    </Button>
                  </div>
                </div>
              )}

              {request.status === 'approved' && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-teal-soft px-4 py-3">
                  <div className="text-sm text-ink">
                    <strong>Approved for promotion.</strong> The rank change is a separate manual
                    step — apply it when the timing is right.
                  </div>
                  <Button size="sm" onClick={() => setApplyOpen(true)}>
                    Apply rank change
                  </Button>
                </div>
              )}

              {request.status === 'promoted' && (
                <div className="rounded-md bg-ok-soft px-4 py-3 text-sm text-ink">
                  <strong>Promoted to {request.targetRank.name}.</strong> Rank change applied{' '}
                  {formatDate(request.promotedAt)} · effective{' '}
                  {formatDate(request.effectiveRankChangeDate)}.
                </div>
              )}

              {request.status === 'rejected' && (
                <div className="rounded-md bg-danger-soft px-4 py-3 text-sm text-ink">
                  <strong>Promotion rejected.</strong>{' '}
                  {request.stages.find((s) => s.status === 'rejected')?.comment ||
                    'Closed with no further action.'}
                </div>
              )}

              {/* Request meta */}
              <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-faint">
                    Remarks
                  </div>
                  <div className="mt-1 text-sm text-ink">
                    {request.remarks || <span className="text-faint">None provided</span>}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-faint">
                    Attachments
                  </div>
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
            </CardBody>
          </Card>
        )}

        {/* Summary tab content (crew details / service summary / documents).
            The promotion decision-support panels are NOT here — they appear
            only in the review modal. */}
        <ProfileSummary seafarer={seafarer} rank={rank} />
      </div>

      {/* Modals */}
      <PromotionForm seafarer={seafarer} open={formOpen} onClose={() => setFormOpen(false)} />
      {request && (
        <EmailPreview
          seafarer={seafarer}
          request={request}
          open={emailOpen}
          onClose={() => setEmailOpen(false)}
          onOpenReview={() => {
            setEmailOpen(false);
            setReviewOpen(true);
          }}
        />
      )}
      {request && (
        <PromotionReviewModal
          seafarer={seafarer}
          request={request}
          open={reviewOpen}
          onClose={() => setReviewOpen(false)}
        />
      )}
      <Modal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        title="Apply rank change"
        footer={
          <>
            <Button variant="secondary" onClick={() => setApplyOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                applyRankChange(seafarer.id, effectiveDate);
                setApplyOpen(false);
              }}
            >
              Confirm promotion
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-muted">
          This records the new rank against {seafarer.name}, closing the current rank period. This is
          the deliberate manual step after approval.
        </p>
        <div className="flex items-end gap-4">
          <div>
            <FormLabel>New rank</FormLabel>
            <Badge tone="teal">
              {request?.targetRank.code} · {request?.targetRank.name}
            </Badge>
          </div>
          <div>
            <FormLabel>Effective date</FormLabel>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </Shell>
  );
}
