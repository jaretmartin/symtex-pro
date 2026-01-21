import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidUrl, isNotEmpty } from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
      expect(isValidEmail('user@sub.example.com')).toBe(true);
      expect(isValidEmail('user123@example.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user example@test.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });

    it('should trim whitespace', () => {
      expect(isValidEmail('  user@example.com  ')).toBe(true);
    });

    it('should handle non-string input', () => {
      expect(isValidEmail(null as unknown as string)).toBe(false);
      expect(isValidEmail(undefined as unknown as string)).toBe(false);
      expect(isValidEmail(123 as unknown as string)).toBe(false);
      expect(isValidEmail({} as unknown as string)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://www.example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('http://example.com/path?query=value')).toBe(true);
      expect(isValidUrl('http://example.com:8080')).toBe(true);
    });

    it('should validate correct HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
      expect(isValidUrl('https://example.com/path?query=value&foo=bar')).toBe(true);
      expect(isValidUrl('https://example.com#section')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('://example.com')).toBe(false);
    });

    it('should reject non-HTTP(S) protocols', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
      expect(isValidUrl('file:///path/to/file')).toBe(false);
      expect(isValidUrl('javascript:alert(1)')).toBe(false);
      expect(isValidUrl('mailto:user@example.com')).toBe(false);
    });

    it('should handle non-string input', () => {
      expect(isValidUrl(null as unknown as string)).toBe(false);
      expect(isValidUrl(undefined as unknown as string)).toBe(false);
      expect(isValidUrl(123 as unknown as string)).toBe(false);
      expect(isValidUrl({} as unknown as string)).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    describe('strings', () => {
      it('should return true for non-empty strings', () => {
        expect(isNotEmpty('hello')).toBe(true);
        expect(isNotEmpty('a')).toBe(true);
        expect(isNotEmpty('   hello   ')).toBe(true);
      });

      it('should return false for empty or whitespace-only strings', () => {
        expect(isNotEmpty('')).toBe(false);
        expect(isNotEmpty('   ')).toBe(false);
        expect(isNotEmpty('\t\n')).toBe(false);
      });
    });

    describe('arrays', () => {
      it('should return true for non-empty arrays', () => {
        expect(isNotEmpty([1, 2, 3])).toBe(true);
        expect(isNotEmpty(['a'])).toBe(true);
        expect(isNotEmpty([null])).toBe(true);
      });

      it('should return false for empty arrays', () => {
        expect(isNotEmpty([])).toBe(false);
      });
    });

    describe('objects', () => {
      it('should return true for non-empty objects', () => {
        expect(isNotEmpty({ a: 1 })).toBe(true);
        expect(isNotEmpty({ key: 'value' })).toBe(true);
        expect(isNotEmpty({ nested: { a: 1 } })).toBe(true);
      });

      it('should return false for empty objects', () => {
        expect(isNotEmpty({})).toBe(false);
      });
    });

    describe('null and undefined', () => {
      it('should return false for null', () => {
        expect(isNotEmpty(null)).toBe(false);
      });

      it('should return false for undefined', () => {
        expect(isNotEmpty(undefined)).toBe(false);
      });
    });

    describe('numbers', () => {
      it('should return true for any number including zero', () => {
        expect(isNotEmpty(0)).toBe(true);
        expect(isNotEmpty(1)).toBe(true);
        expect(isNotEmpty(-1)).toBe(true);
        expect(isNotEmpty(3.14)).toBe(true);
        expect(isNotEmpty(NaN)).toBe(true);
      });
    });

    describe('booleans', () => {
      it('should return true for booleans', () => {
        expect(isNotEmpty(true)).toBe(true);
        expect(isNotEmpty(false)).toBe(true);
      });
    });

    describe('functions', () => {
      it('should return true for functions', () => {
        expect(isNotEmpty(() => {})).toBe(true);
        expect(isNotEmpty(function() {})).toBe(true);
      });
    });
  });
});
