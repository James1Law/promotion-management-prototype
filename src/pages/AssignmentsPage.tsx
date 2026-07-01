import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEAFARERS } from '../data/seafarers';
import type { Seafarer } from '../data/types';
import { usePromotionStore, effectiveRank } from '../store/promotionStore';
import { Shell } from '../components/layout/Shell';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/promotion/Avatar';
import { PromotionForm } from '../components/promotion/PromotionForm';
import { PromotionStatusBadge } from '../components/promotion/PromotionStatusBadge';

/**
 * A second entry point (Assignments). Per the PRD decision, every entry point
 * opens the SAME promotion form — this page proves that consistency.
 */
export function AssignmentsPage() {
  const navigate = useNavigate();
  const requests = usePromotionStore((s) => s.requests);
  const [formFor, setFormFor] = useState<Seafarer | null>(null);

  return (
    <Shell title="Assignments">
      <div className="mx-auto max-w-5xl p-6">
        <p className="mb-4 text-sm text-muted">
          Same promotion form, launched from a different place in OOS.
        </p>
        <div className="space-y-3">
          {SEAFARERS.map((s) => {
            const req = requests[s.id];
            const rank = effectiveRank(s, req);
            return (
              <Card key={s.id}>
                <CardBody className="flex flex-wrap items-center justify-between gap-3">
                  <div
                    className="flex cursor-pointer items-center gap-3"
                    onClick={() => navigate(`/seafarer/${s.id}`)}
                  >
                    <Avatar name={s.name} />
                    <div>
                      <div className="font-medium text-ink">{s.name}</div>
                      <div className="text-xs text-muted">
                        <Badge tone="neutral">{rank.code}</Badge> {rank.name} · {s.vesselType}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {req && <PromotionStatusBadge status={req.status} />}
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={Boolean(req && req.status !== 'promoted' && req.status !== 'rejected')}
                      onClick={() => setFormFor(s)}
                    >
                      Promote
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
      {formFor && <PromotionForm seafarer={formFor} open onClose={() => setFormFor(null)} />}
    </Shell>
  );
}
