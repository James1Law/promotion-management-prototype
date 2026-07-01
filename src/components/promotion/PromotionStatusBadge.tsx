import type { PromotionStatus } from '../../data/types';
import { Badge, type Tone } from '../ui/Badge';

const META: Record<PromotionStatus, { tone: Tone; label: string }> = {
  pending: { tone: 'info', label: 'Pending approval' },
  approved: { tone: 'teal', label: 'Approved for promotion' },
  rejected: { tone: 'danger', label: 'Rejected' },
  promoted: { tone: 'ok', label: 'Promoted' },
};

export function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  const meta = META[status];
  return (
    <Badge tone={meta.tone} dot>
      {meta.label}
    </Badge>
  );
}
