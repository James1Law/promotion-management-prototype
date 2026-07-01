import { useNavigate } from 'react-router-dom';
import type { PromotionRequest, Seafarer } from '../../data/types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { IconArrowRight } from '../layout/icons';

/**
 * Mocked notification email sent to the current-stage approver. In production
 * this is a real email with a deep link; here the "Open promotion" button
 * navigates into the review view.
 */
export function EmailPreview({
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
  const navigate = useNavigate();
  const current = request.stages.find((s) => s.status === 'current');
  if (!current) return null;

  return (
    <Modal open={open} onClose={onClose} title="Notification email (preview)" width="lg">
      <div className="rounded-lg border border-line">
        <div className="space-y-1 border-b border-line bg-canvas px-5 py-3 text-sm">
          <div>
            <span className="text-faint">To:</span> {current.approverName} ({current.role})
          </div>
          <div>
            <span className="text-faint">From:</span> OpenOcean Studio · Crewing
          </div>
          <div>
            <span className="text-faint">Subject:</span>{' '}
            <span className="font-medium text-ink">
              Promotion approval required — {seafarer.name} → {request.targetRank.name}
            </span>
          </div>
        </div>
        <div className="space-y-3 px-5 py-4 text-sm text-ink">
          <p>Dear {current.approverName.split(' ')[0]},</p>
          <p>
            A promotion request has been submitted for <strong>{seafarer.name}</strong> (
            {seafarer.crewNumber}) from <strong>{request.currentRank.name}</strong> to{' '}
            <strong>{request.targetRank.name}</strong> on {request.vesselType.toLowerCase()} vessels.
            It is awaiting your approval as <strong>{current.role}</strong>.
          </p>
          {request.remarks && (
            <p className="rounded bg-canvas px-3 py-2 text-muted">
              Initiator’s remarks: “{request.remarks}”
            </p>
          )}
          <p>Open the request in OpenOcean Studio to review the details and record your decision.</p>
          <div className="pt-1">
            <Button
              onClick={() => {
                onClose();
                navigate(`/seafarer/${seafarer.id}/promotion`);
              }}
            >
              Open promotion <IconArrowRight width={15} height={15} />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
