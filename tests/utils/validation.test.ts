// tests/utils/validation.test.ts
/**
 * Unit tests for validation utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  sanitizeHtml,
  sanitizeSearchQuery,
  sanitizeFileName,
  sanitizeUrl,
  isAlphanumeric,
  isValidUuid,
  isValidId,
  validateMessageContent,
  validatePagination,
  isRateLimited,
  getRemainingRequests,
  clearRateLimit,
  clearAllRateLimits,
  RateLimits,
  containsDangerousContent,
  validateUserContent,
  MessageContentSchema,
  SearchQuerySchema,
} from '../../src/utils/validation';

describe('Sanitization Functions', () => {
  describe('sanitizeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
      );
    });

    it('should escape ampersand', () => {
      expect(sanitizeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry');
    });

    it('should escape quotes', () => {
      expect(sanitizeHtml('Say "hello"')).toBe('Say &quot;hello&quot;');
    });

    it('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });

    it('should handle plain text', () => {
      expect(sanitizeHtml('Hello World')).toBe('Hello World');
    });

    it('should escape backticks', () => {
      expect(sanitizeHtml('Use `code`')).toBe('Use &#x60;code&#x60;');
    });
  });

  describe('sanitizeSearchQuery', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeSearchQuery("SELECT * FROM users; --")).toBe(
        'SELECT * FROM users --'
      );
    });

    it('should remove quotes', () => {
      expect(sanitizeSearchQuery('test "query"')).toBe('test query');
    });

    it('should trim whitespace', () => {
      expect(sanitizeSearchQuery('  search  ')).toBe('search');
    });

    it('should limit length to 100 characters', () => {
      const longQuery = 'a'.repeat(150);
      expect(sanitizeSearchQuery(longQuery).length).toBe(100);
    });

    it('should handle empty string', () => {
      expect(sanitizeSearchQuery('')).toBe('');
    });
  });

  describe('sanitizeFileName', () => {
    it('should remove path traversal attempts', () => {
      expect(sanitizeFileName('../../../etc/passwd')).toBe('etcpasswd');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeFileName('file<>:"|?*.txt')).toBe('file.txt');
    });

    it('should handle empty string', () => {
      expect(sanitizeFileName('')).toBe('untitled');
    });

    it('should limit length to 255 characters', () => {
      const longName = 'a'.repeat(300) + '.txt';
      expect(sanitizeFileName(longName).length).toBe(255);
    });

    it('should preserve valid file names', () => {
      expect(sanitizeFileName('my-file_v1.2.txt')).toBe('my-file_v1.2.txt');
    });
  });

  describe('sanitizeUrl', () => {
    it('should allow http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    });

    it('should allow https URLs', () => {
      expect(sanitizeUrl('https://example.com/path')).toBe(
        'https://example.com/path'
      );
    });

    it('should allow mailto URLs', () => {
      expect(sanitizeUrl('mailto:test@example.com')).toBe(
        'mailto:test@example.com'
      );
    });

    it('should reject javascript URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBeNull();
    });

    it('should reject data URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
    });

    it('should reject invalid URLs', () => {
      expect(sanitizeUrl('not a url')).toBeNull();
    });
  });
});

describe('Validation Helpers', () => {
  describe('isAlphanumeric', () => {
    it('should return true for alphanumeric strings', () => {
      expect(isAlphanumeric('abc123')).toBe(true);
      expect(isAlphanumeric('ABC')).toBe(true);
      expect(isAlphanumeric('123')).toBe(true);
    });

    it('should return false for non-alphanumeric strings', () => {
      expect(isAlphanumeric('abc-123')).toBe(false);
      expect(isAlphanumeric('abc_123')).toBe(false);
      expect(isAlphanumeric('abc 123')).toBe(false);
      expect(isAlphanumeric('')).toBe(false);
    });
  });

  describe('isValidUuid', () => {
    it('should validate correct UUIDs', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUuid('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
    });

    it('should reject invalid UUIDs', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
      expect(isValidUuid('550e8400-e29b-41d4-a716')).toBe(false);
      expect(isValidUuid('')).toBe(false);
    });
  });

  describe('isValidId', () => {
    it('should validate correct IDs', () => {
      expect(isValidId('chat_123')).toBe(true);
      expect(isValidId('user-456')).toBe(true);
      expect(isValidId('abc123')).toBe(true);
    });

    it('should reject invalid IDs', () => {
      expect(isValidId('id with spaces')).toBe(false);
      expect(isValidId('id@special')).toBe(false);
      expect(isValidId('a'.repeat(101))).toBe(false);
    });
  });

  describe('validateMessageContent', () => {
    it('should validate valid messages', () => {
      const result = validateMessageContent('Hello, World!');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('Hello, World!');
    });

    it('should reject empty messages', () => {
      const result = validateMessageContent('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should reject too long messages', () => {
      const result = validateMessageContent('a'.repeat(10001));
      expect(result.valid).toBe(false);
    });

    it('should sanitize HTML in messages', () => {
      const result = validateMessageContent('<script>alert(1)</script>');
      expect(result.sanitized).not.toContain('<script>');
    });
  });

  describe('validatePagination', () => {
    it('should clamp offset to non-negative', () => {
      const result = validatePagination(-10, 50);
      expect(result.offset).toBe(0);
    });

    it('should clamp limit between 1 and 100', () => {
      expect(validatePagination(0, 0).limit).toBe(1);
      expect(validatePagination(0, 200).limit).toBe(100);
      expect(validatePagination(0, 50).limit).toBe(50);
    });

    it('should floor decimal values', () => {
      const result = validatePagination(5.7, 25.3);
      expect(result.offset).toBe(5);
      expect(result.limit).toBe(25);
    });
  });
});

describe('Rate Limiting', () => {
  beforeEach(() => {
    clearAllRateLimits();
  });

  describe('isRateLimited', () => {
    it('should not rate limit first request', () => {
      expect(isRateLimited('test-key', { windowMs: 1000, maxRequests: 5 })).toBe(
        false
      );
    });

    it('should rate limit after max requests', () => {
      const config = { windowMs: 10000, maxRequests: 3 };
      const key = 'rate-test';

      expect(isRateLimited(key, config)).toBe(false); // 1
      expect(isRateLimited(key, config)).toBe(false); // 2
      expect(isRateLimited(key, config)).toBe(false); // 3
      expect(isRateLimited(key, config)).toBe(true); // Limited
    });

    it('should use default config when not provided', () => {
      expect(isRateLimited('default-test')).toBe(false);
    });
  });

  describe('getRemainingRequests', () => {
    it('should return max requests for new key', () => {
      const config = { windowMs: 1000, maxRequests: 10 };
      expect(getRemainingRequests('new-key', config)).toBe(10);
    });

    it('should decrease as requests are made', () => {
      const config = { windowMs: 10000, maxRequests: 5 };
      const key = 'decrease-test';

      isRateLimited(key, config); // 1
      isRateLimited(key, config); // 2

      expect(getRemainingRequests(key, config)).toBe(3);
    });

    it('should return 0 when limit reached', () => {
      const config = { windowMs: 10000, maxRequests: 2 };
      const key = 'zero-test';

      isRateLimited(key, config);
      isRateLimited(key, config);

      expect(getRemainingRequests(key, config)).toBe(0);
    });
  });

  describe('clearRateLimit', () => {
    it('should clear rate limit for specific key', () => {
      const config = { windowMs: 10000, maxRequests: 1 };
      const key = 'clear-test';

      isRateLimited(key, config);
      expect(isRateLimited(key, config)).toBe(true);

      clearRateLimit(key);
      expect(isRateLimited(key, config)).toBe(false);
    });
  });
});

describe('Content Security', () => {
  describe('containsDangerousContent', () => {
    it('should detect script tags', () => {
      expect(containsDangerousContent('<script>alert(1)</script>')).toBe(true);
      expect(containsDangerousContent('<SCRIPT>alert(1)</SCRIPT>')).toBe(true);
    });

    it('should detect javascript URLs', () => {
      expect(containsDangerousContent('javascript:alert(1)')).toBe(true);
    });

    it('should detect event handlers', () => {
      expect(containsDangerousContent('onload=alert(1)')).toBe(true);
      expect(containsDangerousContent('onclick = doSomething()')).toBe(true);
    });

    it('should detect data URLs', () => {
      expect(containsDangerousContent('data:text/html')).toBe(true);
    });

    it('should allow safe content', () => {
      expect(containsDangerousContent('Hello, World!')).toBe(false);
      expect(containsDangerousContent('Normal <text> here')).toBe(false);
    });
  });

  describe('validateUserContent', () => {
    it('should pass valid content', () => {
      const result = validateUserContent('Hello, World!');
      expect(result.isValid).toBe(true);
      expect(result.warnings).toHaveLength(0);
    });

    it('should warn and clean dangerous content', () => {
      const result = validateUserContent('<script>alert(1)</script>');
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.cleaned).not.toContain('<script>');
    });

    it('should truncate long content', () => {
      const longContent = 'a'.repeat(15000);
      const result = validateUserContent(longContent);
      expect(result.cleaned.length).toBe(10000);
      expect(result.warnings).toContain(
        'Content was truncated to 10,000 characters'
      );
    });

    it('should remove null bytes', () => {
      const result = validateUserContent('Hello\0World');
      expect(result.cleaned).toBe('HelloWorld');
      expect(result.warnings).toContain('Null bytes were removed from content');
    });
  });
});

describe('Zod Schemas', () => {
  describe('MessageContentSchema', () => {
    it('should validate valid message', () => {
      const result = MessageContentSchema.safeParse({
        content: 'Hello',
        chat_id: 'chat-1',
        type: 'text',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const result = MessageContentSchema.safeParse({
        content: '',
        chat_id: 'chat-1',
      });
      expect(result.success).toBe(false);
    });

    it('should reject too long content', () => {
      const result = MessageContentSchema.safeParse({
        content: 'a'.repeat(10001),
        chat_id: 'chat-1',
      });
      expect(result.success).toBe(false);
    });

    it('should default type to text', () => {
      const result = MessageContentSchema.safeParse({
        content: 'Hello',
        chat_id: 'chat-1',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.type).toBe('text');
      }
    });
  });

  describe('SearchQuerySchema', () => {
    it('should validate and sanitize search query', () => {
      const result = SearchQuerySchema.safeParse('test query');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('test query');
      }
    });

    it('should reject too long query', () => {
      const result = SearchQuerySchema.safeParse('a'.repeat(101));
      expect(result.success).toBe(false);
    });

    it('should sanitize dangerous characters', () => {
      const result = SearchQuerySchema.safeParse('test; DROP TABLE');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toContain(';');
      }
    });
  });
});
