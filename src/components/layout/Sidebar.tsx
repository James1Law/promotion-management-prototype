import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/cn';

/**
 * OOS-style dark navy sidebar. Simplified nav — the CREW group is the live
 * area for this prototype; other groups are shown (muted) for authenticity.
 */

const CREW_ITEMS = [
  { label: 'Crew Applicants', to: '/crew-applicants', enabled: false },
  { label: 'Crew Directory', to: '/', enabled: true },
  { label: 'Document Management', to: '/documents', enabled: false },
  { label: 'Training Management', to: '/training', enabled: false },
  { label: 'Assignments', to: '/assignments', enabled: true },
  { label: 'Crew Planning', to: '/planning', enabled: false },
  { label: 'Payroll', to: '/payroll', enabled: false },
];

const TOP_GROUPS = ['Fleet 360', 'OnRadar', 'Performance', 'Chartering', 'Operations'];

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col bg-navy text-white/70">
      <div className="flex items-center gap-2 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">OpenOcean</div>
          <div className="text-[10px] tracking-[0.2em] text-white/50">STUDIO</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 text-sm">
        {TOP_GROUPS.map((g) => (
          <div
            key={g}
            className="flex items-center justify-between px-5 py-2 text-white/45 uppercase text-[11px] tracking-wide"
          >
            {g}
          </div>
        ))}

        <div className="mt-1 px-5 pb-1 pt-3 text-[11px] uppercase tracking-wide text-white/40">
          Crew
        </div>
        <div className="pb-2">
          {CREW_ITEMS.map((item) =>
            item.enabled ? (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'block border-l-2 py-2 pl-6 pr-4 text-[13px] transition-colors',
                    isActive
                      ? 'border-navy-accent bg-navy-deep text-white'
                      : 'border-transparent text-white/70 hover:bg-navy-deep hover:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <div
                key={item.label}
                className="block border-l-2 border-transparent py-2 pl-6 pr-4 text-[13px] text-white/35"
              >
                {item.label}
              </div>
            ),
          )}
        </div>

        <div className="px-5 py-2 text-[11px] uppercase tracking-wide text-white/40">Technical</div>
      </nav>

      {/* Prototype-only cross-link: jump to the vessel's onBOARD instance. Not a
          real Studio nav item — onBOARD is a separate app. */}
      <div className="border-t border-white/10 px-3 py-3">
        <NavLink
          to="/onboard"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-[13px] transition-colors',
              isActive
                ? 'bg-navy-deep text-white'
                : 'text-white/70 hover:bg-navy-deep hover:text-white',
            )
          }
        >
          <span className="text-white/50">⚓</span> Open onBOARD (vessel)
        </NavLink>
      </div>
    </aside>
  );
}
