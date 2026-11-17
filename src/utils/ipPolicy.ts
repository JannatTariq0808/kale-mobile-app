const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const;
/** Assessment windows: the whole of January, April, July and October. */
const WINDOW_MONTHS = [0, 3, 6, 9] as const;

export function formatPounds(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount)) return '—';
  const whole = Number.isInteger(amount);
  return `£${amount.toLocaleString('en-GB', {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** "£1,800" without the pound sign, for the big price component. */
export function formatPoundsBare(amount: number | null | undefined): string {
  const text = formatPounds(amount);
  return text.startsWith('£') ? text.slice(1) : text;
}

export function formatLongDate(date: Date | null | undefined): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDayMonth(date: Date | null | undefined): string {
  if (!date) return '—';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
}

export function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

export function formatPaymentDay(day: number | null | undefined): string {
  if (!day) return '—';
  return `${ordinal(day)} of the month`;
}

export function formatDeferredDays(days: number): string {
  return `${days} days`;
}

export type PolicyQuarter = {
  /** Window month, e.g. "October" */
  window: string;
  /** The three payments it sets, e.g. "Nov · Dec · Jan" */
  months: string;
  state: 'set' | 'next' | 'later';
  /** Price for the 'set' quarter, when known */
  price: number | null;
};

/**
 * The four windows that cover the next twelve months, starting from the most recent
 * window (open or closed). The first is priced, the second is next.
 */
export function buildPolicyYear(now: Date, currentPrice: number | null): PolicyQuarter[] {
  const month = now.getMonth();
  const recentIndex = WINDOW_MONTHS.filter((m) => m <= month).length - 1;
  const start = new Date(now.getFullYear(), WINDOW_MONTHS[Math.max(0, recentIndex)], 1);

  return [0, 1, 2, 3].map((i) => {
    const windowDate = new Date(start.getFullYear(), start.getMonth() + 3 * i, 1);
    const months = [1, 2, 3].map((k) => MONTH_SHORT[(windowDate.getMonth() + k) % 12]).join(' · ');
    return {
      window: MONTH_LONG[windowDate.getMonth()],
      months,
      state: i === 0 ? 'set' : i === 1 ? 'next' : 'later',
      price: i === 0 ? currentPrice : null,
    };
  });
}

/** Window month name for the window that contains or most recently preceded a date. */
export function windowNameFor(date: Date): string {
  const month = date.getMonth();
  const recentIndex = WINDOW_MONTHS.filter((m) => m <= month).length - 1;
  return MONTH_LONG[WINDOW_MONTHS[Math.max(0, recentIndex)]];
}
