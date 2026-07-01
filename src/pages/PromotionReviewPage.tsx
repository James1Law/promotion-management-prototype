import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { seafarerById } from '../data/seafarers';
import { usePromotionStore, useCurrentPersona } from '../store/promotionStore';
import { Shell } from '../components/layout/Shell';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/promotion/Avatar';
import { ExperiencePanel } from '../components/promotion/ExperiencePanel';
import { EvaluationsPanel } from '../components/promotion/EvaluationsPanel';
import { LicencesPanel } from '../components/promotion/LicencesPanel';
import { PromotionStepper } from '../components/promotion/PromotionStepper';
import { PromotionStatusBadge } from '../components/promotion/PromotionStatusBadge';
import { IconArrowRight, IconCheck, IconX, IconSkip, IconPause, IconPaperclip } from '../components/layout/icons';

export function PromotionReviewPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const seafarer = seafarerById(id);
  const request = usePromotionStore((s) => s.requests[id]);
  const decideStage = usePromotionStore((s) => s.decideStage);
  const setStagePaused = usePromotionStore((s) => s.setStagePaused);
  const persona = useCurrentPersona();
  const setPersona = usePromotionStore((s) => s.setPersona);
  const personas = usePromotionStore((s) => s.personas);
  const [comment, setComment] = useState('');

  if (!seafarer || !request) {
    return (
      <Shell title="Promotion">
        <div className="p-6">
          No active promotion for this seafarer.{' '}
          <Link className="text-teal" to={`/seafarer/${id}`}>
            Back to profile
          </Link>
        </div>
      </Shell>
    );
  }

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
    navigate(`/seafarer/${seafarer.id}`);
  };

  const pause = () => {
    if (!currentStage) return;
    setStagePaused(seafarer.id, currentStage.id, true, comment || 'Paused pending information');
    navigate(`/seafarer/${seafarer.id}`);
  };

  return (
    <Shell title="Promotion approval">
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-3 text-sm text-muted">
          <Link to="/" className="hover:text-teal">
            Crew Directory
          </Link>{' '}
          /{' '}
          <Link to={`/seafarer/${seafarer.id}`} className="hover:text-teal">
            {seafarer.name}
          </Link>{' '}
          / Promotion
        </div>

        <Card className="mb-4">
          <CardBody>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <Avatar name={seafarer.name} size={52} />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-ink">{seafarer.name}</h2>
                    <PromotionStatusBadge status={request.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted">
                    <Badge tone="neutral">{request.currentRank.code}</Badge>
                    <IconArrowRight width={14} height={14} />
                    <Badge tone="teal">{request.targetRank.code}</Badge>
                    <span className="ml-1">
                      {request.currentRank.name} → {request.targetRank.name}
                    </span>
                    <span>· {request.vesselType}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="mb-4">
          <CardHeader title="Approval progress" />
          <CardBody>
            <PromotionStepper stages={request.stages} />
          </CardBody>
        </Card>

        {/* Initiator remarks & attachments */}
        <Card className="mb-4">
          <CardHeader title="Submitted context" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-faint">Remarks</div>
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
          </CardBody>
        </Card>

        {/* Decision-support (same panels the initiator saw) */}
        <div className="mb-4 space-y-4">
          <ExperiencePanel seafarer={seafarer} />
          <div className="grid gap-4 lg:grid-cols-2">
            <EvaluationsPanel seafarer={seafarer} />
            <LicencesPanel seafarer={seafarer} />
          </div>
        </div>

        {/* Decision controls */}
        {request.status === 'pending' && currentStage && (
          <Card>
            <CardHeader title={`Decision — ${currentStage.role}`} />
            <CardBody className="space-y-3">
              {!isCurrentApprover && (
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
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Add a comment (required for rejection)…"
                className="w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-faint focus:border-teal focus:outline-none"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => decide('approved')} disabled={!isCurrentApprover}>
                  <IconCheck width={15} height={15} /> Approve
                </Button>
                <Button
                  variant="danger"
                  onClick={() => decide('rejected')}
                  disabled={!isCurrentApprover || !comment.trim()}
                >
                  <IconX width={15} height={15} /> Reject
                </Button>
                <Button variant="secondary" onClick={pause} disabled={!isCurrentApprover}>
                  <IconPause width={14} height={14} /> Pause
                </Button>
                <Button variant="secondary" onClick={() => decide('skipped')} disabled={!isCurrentApprover}>
                  <IconSkip width={14} height={14} /> Skip step
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {request.status !== 'pending' && (
          <div className="rounded-md border border-line bg-white px-4 py-3 text-sm text-muted">
            This request is <strong>{request.status}</strong>.{' '}
            <Link to={`/seafarer/${seafarer.id}`} className="text-teal">
              Back to profile
            </Link>
          </div>
        )}
      </div>
    </Shell>
  );
}
