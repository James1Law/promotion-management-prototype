import { usePromotionStore, useCurrentPersona } from '../../store/promotionStore';
import { IconUser, IconChevron } from './icons';
import { useState } from 'react';

/**
 * Prototype-only role switcher: lets one clicker walk the journey as the
 * initiator and then each approver in turn. Not a product feature.
 */
export function PersonaSwitcher() {
  const personas = usePromotionStore((s) => s.personas);
  const setPersona = usePromotionStore((s) => s.setPersona);
  const current = useCurrentPersona();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-2.5 py-1.5 text-sm hover:bg-white/15"
        title="Switch role (prototype only)"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white">
          <IconUser width={14} height={14} />
        </span>
        <span className="hidden text-left leading-tight sm:block">
          <span className="block text-[13px] font-medium text-white">{current.name}</span>
          <span className="block text-[11px] text-white/70">{current.jobTitle}</span>
        </span>
        <IconChevron width={14} height={14} className="text-white/70" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-1 w-64 rounded-md border border-line bg-white py-1 shadow-lg">
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wide text-faint">
              View as (prototype)
            </div>
            {personas.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPersona(p.id);
                  setOpen(false);
                }}
                className={
                  'flex w-full items-start gap-2 px-3 py-2 text-left text-sm hover:bg-canvas ' +
                  (p.id === current.id ? 'bg-teal-soft/50' : '')
                }
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-canvas text-faint">
                  <IconUser width={12} height={12} />
                </span>
                <span className="leading-tight">
                  <span className="block font-medium text-ink">{p.name}</span>
                  <span className="block text-[12px] text-muted">
                    {p.jobTitle}
                    <span className="ml-1 text-faint">· {p.kind}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
