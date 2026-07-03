import { useNavigate } from 'react-router-dom';
import { SEAFARERS } from '../data/seafarers';
import { FILLER_CREW, seafarerToRow, type DirectoryRow } from '../data/directoryFiller';
import { usePromotionStore, effectiveRank } from '../store/promotionStore';
import { Shell } from '../components/layout/Shell';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { PromotionStatusBadge } from '../components/promotion/PromotionStatusBadge';
import { IconSearch, IconChevron, IconSort, IconHome, IconShip } from '../components/layout/icons';
import { ageFromDob, formatDate } from '../lib/format';
import { cn } from '../lib/cn';

/** Decorative column-filter chips — visual only, mirror the real directory. */
const FILTER_CHIPS = [
  'Rank',
  'Vessel type',
  'Nationality',
  'MA',
  'Status',
  'Date of birth',
  'Age',
  'Experience',
  'Promotion',
];

/** Deterministic avatar colour from a name, so rows read like the live product. */
const AVATAR_COLORS = [
  'bg-[#e2725b]',
  'bg-[#4a7ba6]',
  'bg-[#5b9279]',
  'bg-[#b5834a]',
  'bg-[#7a6ca6]',
  'bg-[#c25b8e]',
  'bg-[#3f8ea0]',
];
function avatarColor(seed: string): string {
  let n = 0;
  for (const ch of seed) n = (n + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[n];
}
function initials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function CrewDirectoryPage() {
  const navigate = useNavigate();
  const requests = usePromotionStore((s) => s.requests);

  const rows: DirectoryRow[] = [
    ...SEAFARERS.map((s) => seafarerToRow(s, effectiveRank(s, requests[s.id]))),
    ...FILLER_CREW,
  ];

  return (
    <Shell title="Crew Directory">
      <div className="p-6">
        {/* Toolbar — search + result count (visual, non-functional). */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <IconSearch
              width={15}
              height={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint"
            />
            <input
              type="text"
              placeholder="Search crew by name, number or vessel"
              className="w-full rounded-md border border-line bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder:text-faint focus:border-teal focus:outline-none"
            />
          </div>
          <p className="text-xs text-muted">
            Showing <span className="font-medium text-ink">1–{rows.length}</span> of{' '}
            <span className="font-medium text-ink">1,967</span>
          </p>
        </div>

        {/* Decorative filter-chip row + clear/save. */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {FILTER_CHIPS.map((c) => (
            <span
              key={c}
              className="inline-flex cursor-default items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1 text-xs text-muted"
            >
              {c}
              <IconChevron width={12} height={12} className="text-faint" />
            </span>
          ))}
          <span className="ml-auto flex items-center gap-3 text-xs">
            <span className="cursor-default text-teal">Clear all</span>
            <span className="cursor-default text-teal">Save</span>
          </span>
        </div>

        {/* Sort line. */}
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted">
          <IconSort width={13} height={13} className="text-faint" />
          Sort by <span className="font-medium text-ink">Expected Availability</span>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[11px] uppercase tracking-wide text-faint">
                  <th className="px-5 py-3 font-medium">Seafarer</th>
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Vessel type</th>
                  <th className="px-4 py-3 font-medium">Nationality</th>
                  <th className="px-4 py-3 font-medium">MA</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date of birth</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Promotion</th>
                  <th className="px-5 py-3 font-medium text-right">Availability</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const req = r.clickable ? requests[r.id] : undefined;
                  return (
                    <tr
                      key={r.id}
                      onClick={r.clickable ? () => navigate(`/seafarer/${r.id}`) : undefined}
                      className={cn(
                        'border-b border-line last:border-0',
                        r.clickable ? 'cursor-pointer hover:bg-canvas' : 'cursor-default',
                      )}
                    >
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="relative">
                            <span
                              className={cn(
                                'inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white',
                                avatarColor(r.name),
                              )}
                            >
                              {initials(r.name)}
                            </span>
                            <span
                              className={cn(
                                'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface',
                                r.availability === 'At home' ? 'bg-ok' : 'bg-info',
                              )}
                            />
                          </span>
                          <div className="min-w-0">
                            <div
                              className={cn(
                                'truncate font-medium',
                                r.clickable ? 'text-teal' : 'text-ink',
                              )}
                            >
                              {r.name}
                            </div>
                            <div className="text-xs text-muted">
                              {r.crewNumber} · {r.manningAgent}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-ink">{r.rankCode}</div>
                        <div className="text-xs text-muted">{r.rankName}</div>
                      </td>
                      <td className="px-4 py-2.5 text-muted">{r.vesselType}</td>
                      <td className="px-4 py-2.5 text-muted">{r.nationality}</td>
                      <td className="px-4 py-2.5 text-muted">{r.manningAgent}</td>
                      <td className="px-4 py-2.5 text-muted">{r.status}</td>
                      <td className="px-4 py-2.5 text-muted">{formatDate(r.dateOfBirth)}</td>
                      <td className="px-4 py-2.5 text-muted">{ageFromDob(r.dateOfBirth)}</td>
                      <td className="px-4 py-2.5">
                        {req ? (
                          <PromotionStatusBadge status={req.status} />
                        ) : (
                          <span className="text-faint">—</span>
                        )}
                      </td>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center justify-end gap-2">
                          {r.isNew && <Badge tone="teal">New</Badge>}
                          <Badge tone={r.availability === 'At home' ? 'ok' : 'info'} dot>
                            {r.availability}
                          </Badge>
                          <span className="text-faint">
                            {r.availability === 'At home' ? (
                              <IconHome width={15} height={15} />
                            ) : (
                              <IconShip width={15} height={15} />
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-3 text-xs text-faint">
          Prototype · the first {SEAFARERS.length} seafarers are clickable demo profiles; the
          remaining rows are illustrative only.
        </p>
      </div>
    </Shell>
  );
}
