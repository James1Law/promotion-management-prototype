import { useNavigate } from 'react-router-dom';
import { SEAFARERS } from '../data/seafarers';
import { usePromotionStore, effectiveRank } from '../store/promotionStore';
import { Shell } from '../components/layout/Shell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/promotion/Avatar';
import { PromotionStatusBadge } from '../components/promotion/PromotionStatusBadge';
import { useState } from 'react';
import { PromotionForm } from '../components/promotion/PromotionForm';
import type { Seafarer } from '../data/types';

export function CrewDirectoryPage() {
  const navigate = useNavigate();
  const requests = usePromotionStore((s) => s.requests);
  const [formFor, setFormFor] = useState<Seafarer | null>(null);

  return (
    <Shell title="Crew Directory">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted">
            {SEAFARERS.length} seafarers · demo dataset
          </p>
        </div>

        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-faint">
                <th className="px-5 py-3 font-medium">Seafarer</th>
                <th className="px-5 py-3 font-medium">Rank</th>
                <th className="px-5 py-3 font-medium">Vessel type</th>
                <th className="px-5 py-3 font-medium">Nationality</th>
                <th className="px-5 py-3 font-medium">Promotion</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {SEAFARERS.map((s) => {
                const req = requests[s.id];
                const rank = effectiveRank(s, req);
                return (
                  <tr
                    key={s.id}
                    className="cursor-pointer border-b border-line last:border-0 hover:bg-canvas"
                    onClick={() => navigate(`/seafarer/${s.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.name} />
                        <div>
                          <div className="font-medium text-ink">{s.name}</div>
                          <div className="text-xs text-muted">{s.crewNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone="neutral">{rank.code}</Badge>{' '}
                      <span className="text-ink">{rank.name}</span>
                    </td>
                    <td className="px-5 py-3 text-muted">{s.vesselType}</td>
                    <td className="px-5 py-3 text-muted">{s.nationality}</td>
                    <td className="px-5 py-3">
                      {req ? <PromotionStatusBadge status={req.status} /> : <span className="text-faint">—</span>}
                    </td>
                    <td className="px-5 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={Boolean(req && req.status !== 'promoted' && req.status !== 'rejected')}
                        onClick={() => setFormFor(s)}
                      >
                        Promote
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      {formFor && (
        <PromotionForm seafarer={formFor} open onClose={() => setFormFor(null)} />
      )}
    </Shell>
  );
}
