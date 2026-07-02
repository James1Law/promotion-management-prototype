import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEAFARERS } from '../data/seafarers';
import type { Seafarer } from '../data/types';
import { usePromotionStore, useCurrentPersona, effectiveRank } from '../store/promotionStore';
import { PersonaSwitcher } from '../components/layout/PersonaSwitcher';
import { Avatar } from '../components/promotion/Avatar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FormLabel } from '../components/ui/Field';
import { formatDate } from '../lib/format';
import { IconCheck } from '../components/layout/icons';

/**
 * Simulated OpenOcean **onBOARD** vessel instance (a separate app from OOS).
 *
 * This is where a promotion is *executed*. The rule from crewing: the Captain
 * only sees a **Promote** button once the promotion is (a) fully approved and
 * (b) planned into a crew-change slot ashore (`plannedPromotionDate`). Promote
 * is distinct from Sign-on because the seafarer is already aboard — the rank
 * changes in place. Prototype-only: all crew shown as one demo vessel.
 */
const VESSEL = 'MV Pacific Bridge';

const STAT = [
  { n: '23', label: 'Total on board' },
  { n: '24', label: 'Max. SOLAS capacity' },
  { n: '24', label: 'Beds on board' },
  { n: '1', label: 'Joiners' },
];

export function OnboardCrewPage() {
  const requests = usePromotionStore((s) => s.requests);
  const applyRankChange = usePromotionStore((s) => s.applyRankChange);
  const setPersona = usePromotionStore((s) => s.setPersona);
  const persona = useCurrentPersona();
  const [promoteFor, setPromoteFor] = useState<Seafarer | null>(null);

  const isCaptain = persona.id === 'captain';
  const promoteReq = promoteFor ? requests[promoteFor.id] : undefined;

  return (
    <div className="flex h-full flex-col bg-canvas">
      {/* onBOARD chrome — deliberately distinct from OOS Studio */}
      <header className="flex items-center justify-between bg-navy px-5 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">
              OpenOcean <span className="text-white/60">onBOARD</span>
            </div>
            <div className="text-[11px] text-white/60">{VESSEL} · vessel instance</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-warn px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy">
            Prototype
          </span>
          <Link to="/" className="text-[13px] text-white/70 hover:text-white">
            ← Back to Studio
          </Link>
          <PersonaSwitcher />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-ink">Crew</h1>
            <span className="cursor-default rounded-md bg-teal px-3 py-1.5 text-sm font-medium text-white opacity-90">
              Crew change
            </span>
          </div>

          {/* decorative stats strip (echoes onBOARD) */}
          <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {STAT.map((s) => (
              <div key={s.label} className="bg-surface px-4 py-3">
                <div className="text-xl font-semibold text-ink">{s.n}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {SEAFARERS.map((s) => {
              const req = requests[s.id];
              const rank = effectiveRank(s, req);
              const planned =
                req?.status === 'approved' && Boolean(req.plannedPromotionDate);
              const promoted = req?.status === 'promoted';
              return (
                <div key={s.id}>
                  {/* rank/position header (as onBOARD groups crew) */}
                  <div className="px-1 pb-1 pt-2 text-xs text-muted">
                    {rank.name}
                    {promoted && req && (
                      <span className="text-faint"> · promoted from {req.currentRank.name}</span>
                    )}
                  </div>

                  {planned && req?.plannedPromotionDate && (
                    <div className="rounded-t-md border border-b-0 border-warn/40 bg-warn-soft px-4 py-1.5 text-xs font-medium text-warn">
                      Planned Promotion date {formatDate(req.plannedPromotionDate)} ·{' '}
                      {req.currentRank.name} → {req.targetRank.name}
                    </div>
                  )}

                  <div
                    className={
                      'flex flex-wrap items-center justify-between gap-3 border border-line bg-surface px-4 py-3 ' +
                      (planned ? 'rounded-b-md' : 'rounded-md')
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} />
                      <div>
                        <div className="text-sm font-medium uppercase text-ink">
                          {toOnboardName(s.name)}
                        </div>
                        <div className="text-xs text-muted">
                          {s.crewNumber} ({rank.code}) · {s.nationality}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden text-xs text-muted sm:block">
                        <div className="text-faint">Joined</div>
                        {s.joiningDate ? formatDate(s.joiningDate) : '—'}
                      </div>

                      {/* Action — the crux: Promote only once approved + planned */}
                      {promoted ? (
                        <Badge tone="ok" dot>
                          Promoted {formatDate(req?.promotedAt)}
                        </Badge>
                      ) : planned ? (
                        isCaptain ? (
                          <Button size="sm" onClick={() => setPromoteFor(s)}>
                            Promote
                          </Button>
                        ) : (
                          <button
                            onClick={() => setPersona('captain')}
                            className="text-xs font-medium text-teal hover:text-teal-dark"
                            title="Only the Captain promotes onBOARD"
                          >
                            View as Captain to promote
                          </button>
                        )
                      ) : (
                        <span className="cursor-default text-sm text-faint">Sign off</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-xs text-faint">
            Prototype note: a real onBOARD instance shows only one vessel's crew. The{' '}
            <strong>Promote</strong> button appears here only for a seafarer whose promotion has
            been approved ashore and planned into a crew change.
          </p>
        </div>
      </main>

      {/* onBOARD Promote confirm — the in-place rank change */}
      <Modal
        open={Boolean(promoteFor)}
        onClose={() => setPromoteFor(null)}
        title="Promote crewman"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPromoteFor(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (promoteFor && promoteReq) {
                  applyRankChange(
                    promoteFor.id,
                    promoteReq.plannedPromotionDate ?? new Date().toISOString().slice(0, 10),
                  );
                }
                setPromoteFor(null);
              }}
            >
              <IconCheck width={15} height={15} /> Promote
            </Button>
          </>
        }
      >
        {promoteFor && promoteReq && (
          <>
            <p className="mb-4 text-sm text-muted">
              This completes {promoteFor.name}'s promotion <strong>in place</strong> — the rank
              changes now; they are not signed off. Approved and planned ashore.
            </p>
            <div className="flex flex-wrap items-end gap-6">
              <div>
                <FormLabel>Crewman</FormLabel>
                <div className="text-sm font-medium text-ink">{toOnboardName(promoteFor.name)}</div>
              </div>
              <div>
                <FormLabel>New rank</FormLabel>
                <Badge tone="teal">
                  {promoteReq.targetRank.code} · {promoteReq.targetRank.name}
                </Badge>
              </div>
              <div>
                <FormLabel>Promotion date</FormLabel>
                <div className="text-sm text-ink">
                  {formatDate(promoteReq.plannedPromotionDate)}
                </div>
              </div>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/** OOS onBOARD renders crew as "SURNAME, GIVEN". */
function toOnboardName(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length < 2) return name.toUpperCase();
  const surname = parts[parts.length - 1];
  const given = parts.slice(0, -1).join(' ');
  return `${surname}, ${given}`.toUpperCase();
}
