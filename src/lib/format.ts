/**
 * Date and number formatting utilities
 */

// ============================================================================
// Date Formatting
// ============================================================================

/**
 * Converts input to a Date object
 */
function toDate(date: Date | string | number): Date {
  if (date instanceof Date) return date;
  return new Date(date);
}

/**
 * Formats a date as a localized date string (e.g., "Jan 21, 2026")
 */
export function formatDate(date: Date | string | number): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Formats a date as a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffWeek = Math.round(diffDay / 7);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) {
    return rtf.format(diffSec, 'second');
  } else if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  } else if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, 'hour');
  } else if (Math.abs(diffDay) < 7) {
    return rtf.format(diffDay, 'day');
  } else if (Math.abs(diffWeek) < 4) {
    return rtf.format(diffWeek, 'week');
  } else if (Math.abs(diffMonth) < 12) {
    return rtf.format(diffMonth, 'month');
  } else {
    return rtf.format(diffYear, 'year');
  }
}

/**
 * Formats a date as a full date-time string (e.g., "Jan 21, 2026, 2:30 PM")
 */
export function formatDateTime(date: Date | string | number): string {
  const d = toDate(date);
  if (isNaN(d.getTime())) return 'Invalid Date';

  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ============================================================================
// Number Formatting
// ============================================================================

/**
 * Formats a number as currency (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (!isFinite(amount)) return 'Invalid Amount';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number as a percentage (e.g., "42.5%")
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (!isFinite(value)) return 'Invalid Value';

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a large number in compact notation (e.g., "1.2K", "3.4M")
 */
export function formatCompactNumber(value: number): string {
  if (!isFinite(value)) return 'Invalid Value';

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}

// ============================================================================
// String Formatting
// ============================================================================

/**
 * Truncates a string to a specified length with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (typeof str !== 'string') return '';
  if (length < 0) return '';
  if (str.length <= length) return str;
  if (length <= 3) return str.slice(0, length);

  return str.slice(0, length - 3) + '...';
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
