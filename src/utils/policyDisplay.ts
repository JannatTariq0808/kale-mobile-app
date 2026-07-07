export function formatCoverAmount(sum: unknown): string {
  const parsed =
    typeof sum === 'number'
      ? sum
      : typeof sum === 'string' && sum.trim()
        ? Number(sum)
        : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return '—';

  if (parsed >= 1_000_000) {
    const millions = parsed / 1_000_000;
    const rounded = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `£${rounded}m`;
  }

  if (parsed >= 1_000) {
    return `£${Math.round(parsed / 1_000)}k`;
  }

  return `£${parsed.toLocaleString('en-GB')}`;
}

export function formatPolicyTerm(coverType: unknown, years: unknown): string {
  const termYears =
    typeof years === 'number' && Number.isFinite(years)
      ? String(Math.round(years))
      : typeof years === 'string'
        ? years.trim()
        : '';
  const type =
    typeof coverType === 'string' && coverType.trim() ? coverType.trim() : 'Level';

  if (!termYears) return `${type} term`;
  return `${type} term · ${termYears} years`;
}

export function formatMonthlyPremium(amount: unknown): string {
  const parsed =
    typeof amount === 'number'
      ? amount
      : typeof amount === 'string' && amount.trim()
        ? Number(amount)
        : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return '—';
  return `£${parsed.toFixed(2)}`;
}

export function formatMemberSince(value: unknown): string | null {
  if (!value) return null;

  const date =
    value instanceof Date
      ? value
      : typeof value === 'object' && value !== null && 'toDate' in value
        ? (value as { toDate: () => Date }).toDate()
        : typeof value === 'string' || typeof value === 'number'
          ? new Date(value)
          : null;

  if (!date || Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}
