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
import { ContractsPanel } from '../components/promotion/ContractsPanel';
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
  const planPromotion = usePromotionStore((s) => s.planPromotion);
  const persona = useCurrentPersona();

  const [formOpen, setFormOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [plannedDate, setPlannedDate] = useState(new Date().toISOString().slice(0, 10));
  const [activeTab, setActiveTab] = useState('Summary');

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

        {/* Tabs — Summary and Contracts are live; the rest are placeholders. */}
        <div className="mb-4 flex flex-wrap gap-1 border-b border-line text-sm">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={
                'border-b-2 px-3 py-2 transition-colors ' +
                (t === activeTab
                  ? 'border-teal font-medium text-ink'
                  : 'border-transparent text-muted hover:text-ink')
              }
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Summary' && (
          <>
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
                  {request.vessel && <span> · {request.vessel}</span>}
                </span>
              }
            />
            <CardBody className="space-y-5">
              {request.stages.length > 0 ? (
                <PromotionStepper stages={request.stages} />
              ) : (
                <div className="rounded-md bg-canvas px-4 py-3 text-sm text-muted">
                  No approval workflow is configured for this transition — recorded directly.
                </div>
              )}

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

              {request.status === 'approved' && !request.plannedPromotionDate && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-teal-soft px-4 py-3">
                  <div className="text-sm text-ink">
                    <strong>Approved for promotion.</strong> Plan it into a crew change to schedule
                    the promotion — the Captain then completes it onBOARD.
                  </div>
                  <Button size="sm" onClick={() => setPlanOpen(true)}>
                    Plan into crew change
                  </Button>
                </div>
              )}

              {request.status === 'approved' && request.plannedPromotionDate && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md bg-info-soft px-4 py-3">
                  <div className="text-sm text-ink">
                    <strong>Planned for promotion</strong> at the crew change on{' '}
                    {formatDate(request.plannedPromotionDate)}. The Captain completes the rank change{' '}
                    <strong>onBOARD</strong>.
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setPlanOpen(true)}>
                      Change date
                    </Button>
                    <Link to="/onboard">
                      <Button size="sm">
                        View onBOARD <IconArrowRight width={14} height={14} />
                      </Button>
                    </Link>
                  </div>
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
          </>
        )}

        {activeTab === 'Contracts' && (
          <ContractsPanel seafarer={seafarer} request={request} />
        )}

        {activeTab !== 'Summary' && activeTab !== 'Contracts' && (
          <Card>
            <CardBody className="text-sm text-muted">
              The <strong>{activeTab}</strong> tab isn't part of this prototype.
            </CardBody>
          </Card>
        )}
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
        open={planOpen}
        onClose={() => setPlanOpen(false)}
        title="Plan into crew change"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPlanOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                planPromotion(seafarer.id, plannedDate);
                setPlanOpen(false);
              }}
            >
              Plan promotion
            </Button>
          </>
        }
      >
        <p className="mb-4 text-sm text-muted">
          Schedules {seafarer.name}'s promotion into a crew-change slot. The rank does not change
          yet — the Promote button appears onBOARD, and the Captain completes it on the day.
        </p>
        <div className="flex items-end gap-4">
          <div>
            <FormLabel>New rank</FormLabel>
            <Badge tone="teal">
              {request?.targetRank.code} · {request?.targetRank.name}
            </Badge>
          </div>
          <div>
            <FormLabel>Promotion date</FormLabel>
            <input
              type="date"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink focus:border-teal focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </Shell>
  );
}
