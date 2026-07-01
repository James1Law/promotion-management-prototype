import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type Tone = 'neutral' | 'info' | 'ok' | 'warn' | 'danger' | 'teal';

const tones: Record<Tone, string> = {
  neutral: 'bg-canvas text-muted border-line',
  info: 'bg-info-soft text-info border-info-soft',
  ok: 'bg-ok-soft text-ok border-ok-soft',
  warn: 'bg-warn-soft text-warn border-warn-soft',
  danger: 'bg-danger-soft text-danger border-danger-soft',
  teal: 'bg-teal-soft text-teal-dark border-teal-soft',
};

export function Badge({
  tone = 'neutral',
  children,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
