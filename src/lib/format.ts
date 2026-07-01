/** Formatting helpers shared across screens. */

export function formatDate(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatYears(value: number): string {
  return `${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)} yrs`;
}

/** Bucket an evaluation score (0–100) into a status colour token. */
export function scoreTone(score: number): 'ok' | 'warn' | 'danger' {
  if (score >= 85) return 'ok';
  if (score >= 70) return 'warn';
  return 'danger';
}
