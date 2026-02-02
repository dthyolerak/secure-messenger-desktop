// src/utils/validation.ts
/**
 * Input validation utilities
 * 
 * Provides comprehensive validation for user inputs to prevent
 * XSS, injection attacks, and ensure data integrity.
 */

import { z } from 'zod';

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

/**
 * Message content validation
 */
export const MessageContentSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(10000, 'Message is too long (max 10,000 characters)')
    .transform((val) => sanitizeHtml(val)),
  chat_id: z.string().min(1).max(100),
  type: z.enum(['text', 'image', 'file', 'audio', 'video']).default('text'),
});

/**
 * Chat name validation
 */
export const ChatNameSchema = z
  .string()
  .min(1, 'Chat name is required')
  .max(100, 'Chat name is too long')
  .transform((val) => sanitizeHtml(val.trim()));

/**
 * User input validation
 */
export const UserInputSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name is too long')
    .regex(/^[a-zA-Z0-9\s\-_.]+$/, 'Display name contains invalid characters')
    .transform((val) => val.trim()),
  email: z.string().email('Invalid email address').max(254),
});

/**
 * Search query validation
 */
export const SearchQuerySchema = z
  .string()
  .max(100, 'Search query is too long')
  .transform((val) => sanitizeSearchQuery(val));

/**
 * File attachment validation
 */
export const FileAttachmentSchema = z.object({
  name: z.string().max(255),
  size: z.number().max(100 * 1024 * 1024, 'File size exceeds 100MB limit'),
  type: z.string().max(100),
  path: z.string().max(1000),
});

// ============================================================
// SANITIZATION FUNCTIONS
// ============================================================

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Escape HTML special characters
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  
  return input.replace(/[&<>"'`=/]/g, (char) => escapeMap[char] || char);
}

/**
 * Sanitize search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  // Remove potentially dangerous characters for SQL/FTS
  return query
    .replace(/['"\\%;]/g, '')
    .trim()
    .substring(0, 100);
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(name: string): string {
  if (!name) return 'untitled';
  
  // Remove path traversal attempts and dangerous characters
  return name
    .replace(/\.\./g, '')
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .trim()
    .substring(0, 255);
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    // Only allow safe protocols
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Check if string contains only allowed characters
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str);
}

/**
 * Check if string is a valid UUID
 */
export function isValidUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Check if string is a valid ID (alphanumeric with underscores)
 */
export function isValidId(str: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(str) && str.length <= 100;
}

/**
 * Validate message content
 */
export function validateMessageContent(content: string): {
  valid: boolean;
  error?: string;
  sanitized: string;
} {
  const trimmed = content.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Message cannot be empty', sanitized: '' };
  }
  
  if (trimmed.length > 10000) {
    return { valid: false, error: 'Message is too long', sanitized: '' };
  }
  
  const sanitized = sanitizeHtml(trimmed);
  return { valid: true, sanitized };
}

/**
 * Validate chat ID
 */
export function validateChatId(chatId: string): boolean {
  return isValidId(chatId);
}

/**
 * Validate pagination parameters
 */
export function validatePagination(
  offset: number,
  limit: number
): { offset: number; limit: number } {
  return {
    offset: Math.max(0, Math.floor(offset)),
    limit: Math.min(100, Math.max(1, Math.floor(limit))),
  };
}

// ============================================================
// RATE LIMITING
// ============================================================

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiter configuration
 */
export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

/**
 * Default rate limit configurations
 */
export const RateLimits = {
  MESSAGE_SEND: { windowMs: 1000, maxRequests: 5 },  // 5 messages per second
  SEARCH: { windowMs: 1000, maxRequests: 10 },  // 10 searches per second
  FILE_UPLOAD: { windowMs: 60000, maxRequests: 10 },  // 10 uploads per minute
  API_CALL: { windowMs: 1000, maxRequests: 20 },  // 20 API calls per second
} as const satisfies Record<string, RateLimitConfig>;

// Default config for rate limiting
const DEFAULT_RATE_LIMIT: RateLimitConfig = RateLimits.API_CALL;

/**
 * Check if action is rate limited
 */
export function isRateLimited(
  key: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    rateLimitStore.set(key, { count: 1, firstRequest: now });
    return false;
  }
  
  // Reset if window has passed
  if (now - entry.firstRequest > config.windowMs) {
    rateLimitStore.set(key, { count: 1, firstRequest: now });
    return false;
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return true;
  }
  
  // Increment count
  entry.count++;
  return false;
}

/**
 * Get remaining requests in current window
 */
export function getRemainingRequests(
  key: string,
  config: RateLimitConfig = DEFAULT_RATE_LIMIT
): number {
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    return config.maxRequests;
  }
  
  const now = Date.now();
  if (now - entry.firstRequest > config.windowMs) {
    return config.maxRequests;
  }
  
  return Math.max(0, config.maxRequests - entry.count);
}

/**
 * Clear rate limit for a key
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Clear all rate limits (use with caution)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}

// ============================================================
// CONTENT SECURITY
// ============================================================

/**
 * Check if content contains potentially dangerous patterns
 */
export function containsDangerousContent(content: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,  // Event handlers
    /data:/i,
    /vbscript:/i,
  ];
  
  return dangerousPatterns.some((pattern) => pattern.test(content));
}

/**
 * Validate and clean user-generated content
 */
export function validateUserContent(content: string): {
  isValid: boolean;
  cleaned: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  let cleaned = content;
  
  // Check for dangerous content
  if (containsDangerousContent(content)) {
    warnings.push('Content contained potentially unsafe elements that were removed');
    cleaned = sanitizeHtml(content);
  }
  
  // Check length
  if (content.length > 10000) {
    warnings.push('Content was truncated to 10,000 characters');
    cleaned = cleaned.substring(0, 10000);
  }
  
  // Remove null bytes
  if (content.includes('\0')) {
    warnings.push('Null bytes were removed from content');
    cleaned = cleaned.replace(/\0/g, '');
  }
  
  return {
    isValid: warnings.length === 0,
    cleaned,
    warnings,
  };
}
