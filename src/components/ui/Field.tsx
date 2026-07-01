import type { ReactNode } from 'react';

/** A labelled read-only value, matching the OOS detail-row style. */
export function DataField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-faint">{label}</div>
      <div className="mt-1 text-sm text-ink">{children}</div>
    </div>
  );
}

export function FormLabel({ children }: { children: ReactNode }) {
  return <label className="mb-1.5 block text-sm font-medium text-ink">{children}</label>;
}
