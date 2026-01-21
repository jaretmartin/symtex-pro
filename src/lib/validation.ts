/**
 * Validation utility functions
 */

/**
 * Validates if a string is a valid email address
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;

  // RFC 5322 compliant email regex (simplified but robust)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== 'string') return false;

  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Checks if a value is not empty (handles various types)
 * - Strings: not empty or whitespace-only
 * - Arrays: has at least one element
 * - Objects: has at least one own property
 * - Numbers: always true (including 0)
 * - null/undefined: false
 */
export function isNotEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  // Numbers (including 0), booleans, functions, etc.
  return true;
}
