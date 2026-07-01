import type { ReactNode } from 'react';
import { PersonaSwitcher } from './PersonaSwitcher';
import { IconBell, IconMenu } from './icons';

export function TopBar({ title }: { title: ReactNode }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-white px-5">
      <div className="flex items-center gap-3">
        <IconMenu width={18} height={18} className="text-muted" />
        <h1 className="text-[15px] font-semibold text-ink">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded bg-warn px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Prototype
        </span>
        <span className="hidden text-sm text-muted md:inline">Help &amp; Support</span>
        <IconBell width={18} height={18} className="text-muted" />
        <PersonaSwitcher />
      </div>
    </header>
  );
}
