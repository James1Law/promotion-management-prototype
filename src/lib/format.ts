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

/** Format an evaluation score on the 1–10 scale, e.g. "9.2". */
export function formatScore(score: number): string {
  return score.toFixed(1);
}

/** Bucket an evaluation score (1–10) into a status colour token. */
export function scoreTone(score: number): 'ok' | 'warn' | 'danger' {
  if (score >= 8) return 'ok';
  if (score >= 6) return 'warn';
  return 'danger';
}

/** Qualitative label for a 1–10 evaluation score, as used in OOS. */
export function scoreLabel(score: number): string {
  if (score >= 9) return 'Excellent';
  if (score >= 7.5) return 'Good';
  if (score >= 6) return 'Satisfactory';
  if (score >= 4) return 'Poor';
  return 'Very poor';
}
