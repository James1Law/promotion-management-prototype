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

/**
 * Service length between two dates as OOS shows it, e.g. "10m 19d" or "1y 3m".
 * `to` defaults to today (an open, current contract).
 */
export function formatServiceLength(from: string, to?: string): string {
  const start = new Date(from);
  const end = to ? new Date(to) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return '—';
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  let days = end.getDate() - start.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += prevMonth;
  }
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  if (years > 0) return `${years}y ${remMonths}m`;
  return `${remMonths}m ${days}d`;
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
