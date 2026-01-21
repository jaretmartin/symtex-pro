import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  formatDateTime,
  formatCurrency,
  formatPercentage,
  formatCompactNumber,
  truncate,
  capitalize,
} from '../format';

describe('Date Formatting', () => {
  describe('formatDate', () => {
    it('should format a Date object', () => {
      const date = new Date('2026-01-21T12:00:00Z');
      const result = formatDate(date);
      expect(result).toMatch(/Jan 21, 2026/);
    });

    it('should format a date string', () => {
      // Use a full ISO string to avoid timezone issues
      const result = formatDate('2026-06-15T12:00:00');
      expect(result).toMatch(/Jun 15, 2026/);
    });

    it('should format a timestamp number', () => {
      const timestamp = new Date('2026-03-10T12:00:00Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toMatch(/Mar 10, 2026/);
    });

    it('should return "Invalid Date" for invalid input', () => {
      expect(formatDate('not-a-date')).toBe('Invalid Date');
      expect(formatDate(NaN)).toBe('Invalid Date');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-21T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should format seconds ago', () => {
      const date = new Date('2026-01-21T11:59:30Z');
      const result = formatRelativeTime(date);
      expect(result).toMatch(/30 seconds ago|seconds ago/i);
    });

    it('should format minutes ago', () => {
      const date = new Date('2026-01-21T11:45:00Z');
      const result = formatRelativeTime(date);
      expect(result).toMatch(/15 minutes ago|minutes ago/i);
    });

    it('should format hours ago', () => {
      const date = new Date('2026-01-21T09:00:00Z');
      const result = formatRelativeTime(date);
      expect(result).toMatch(/3 hours ago|hours ago/i);
    });

    it('should format days ago', () => {
      const date = new Date('2026-01-19T12:00:00Z');
      const result = formatRelativeTime(date);
      expect(result).toMatch(/2 days ago|days ago/i);
    });

    it('should format future dates', () => {
      const date = new Date('2026-01-22T12:00:00Z');
      const result = formatRelativeTime(date);
      expect(result).toMatch(/in 1 day|tomorrow/i);
    });

    it('should return "Invalid Date" for invalid input', () => {
      expect(formatRelativeTime('not-a-date')).toBe('Invalid Date');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time together', () => {
      const date = new Date('2026-01-21T14:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/Jan 21, 2026/);
      expect(result).toMatch(/2:30/);
      expect(result).toMatch(/PM/);
    });

    it('should handle morning times', () => {
      const date = new Date('2026-01-21T09:15:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/9:15/);
      expect(result).toMatch(/AM/);
    });

    it('should return "Invalid Date" for invalid input', () => {
      expect(formatDateTime('invalid')).toBe('Invalid Date');
    });
  });
});

describe('Number Formatting', () => {
  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    it('should format with thousands separator', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('should handle negative numbers', () => {
      expect(formatCurrency(-100)).toBe('-$100.00');
    });

    it('should format other currencies', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toMatch(/1,234\.56/);
      expect(result).toMatch(/€/);
    });

    it('should return "Invalid Amount" for non-finite numbers', () => {
      expect(formatCurrency(Infinity)).toBe('Invalid Amount');
      expect(formatCurrency(NaN)).toBe('Invalid Amount');
    });
  });

  describe('formatPercentage', () => {
    it('should format decimal as percentage', () => {
      expect(formatPercentage(0.425)).toBe('42.5%');
    });

    it('should handle custom decimal places', () => {
      expect(formatPercentage(0.4256, 2)).toBe('42.56%');
      expect(formatPercentage(0.4256, 0)).toBe('43%');
    });

    it('should handle 100%', () => {
      expect(formatPercentage(1)).toBe('100.0%');
    });

    it('should handle zero', () => {
      expect(formatPercentage(0)).toBe('0.0%');
    });

    it('should handle values over 100%', () => {
      expect(formatPercentage(1.5)).toBe('150.0%');
    });

    it('should return "Invalid Value" for non-finite numbers', () => {
      expect(formatPercentage(Infinity)).toBe('Invalid Value');
      expect(formatPercentage(NaN)).toBe('Invalid Value');
    });
  });

  describe('formatCompactNumber', () => {
    it('should format thousands with K', () => {
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(12000)).toBe('12K');
    });

    it('should format millions with M', () => {
      expect(formatCompactNumber(1500000)).toBe('1.5M');
      expect(formatCompactNumber(5000000)).toBe('5M');
    });

    it('should format billions with B', () => {
      expect(formatCompactNumber(2500000000)).toBe('2.5B');
    });

    it('should handle small numbers without suffix', () => {
      expect(formatCompactNumber(500)).toBe('500');
      expect(formatCompactNumber(999)).toBe('999');
    });

    it('should handle zero', () => {
      expect(formatCompactNumber(0)).toBe('0');
    });

    it('should return "Invalid Value" for non-finite numbers', () => {
      expect(formatCompactNumber(Infinity)).toBe('Invalid Value');
      expect(formatCompactNumber(NaN)).toBe('Invalid Value');
    });
  });
});

describe('String Formatting', () => {
  describe('truncate', () => {
    it('should truncate long strings with ellipsis', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('should not truncate strings shorter than length', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should not truncate strings equal to length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    it('should handle very short max lengths', () => {
      expect(truncate('Hello', 3)).toBe('Hel');
      expect(truncate('Hello', 2)).toBe('He');
      expect(truncate('Hello', 1)).toBe('H');
    });

    it('should handle zero length', () => {
      expect(truncate('Hello', 0)).toBe('');
    });

    it('should handle negative length', () => {
      expect(truncate('Hello', -1)).toBe('');
    });

    it('should handle empty string', () => {
      expect(truncate('', 5)).toBe('');
    });

    it('should handle non-string input', () => {
      expect(truncate(null as unknown as string, 5)).toBe('');
      expect(truncate(undefined as unknown as string, 5)).toBe('');
      expect(truncate(123 as unknown as string, 5)).toBe('');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should preserve rest of string', () => {
      expect(capitalize('hello WORLD')).toBe('Hello WORLD');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle non-string input', () => {
      expect(capitalize(null as unknown as string)).toBe('');
      expect(capitalize(undefined as unknown as string)).toBe('');
    });

    it('should handle strings starting with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
    });
  });
});
