// tests/setup.ts
/**
 * Global test setup for Vitest
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.matchMedia for components that use media queries
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });

// Mock IntersectionObserver
class IntersectionObserverMock {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', { value: IntersectionObserverMock });

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', { value: vi.fn() });

// Mock Electron IPC for renderer tests
const mockSyncApi = {
  getConnectionStatus: vi.fn().mockResolvedValue({ status: 'connected' }),
  getMessages: vi.fn().mockResolvedValue({ success: true, data: [] }),
  getChats: vi.fn().mockResolvedValue({ success: true, data: [] }),
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
  markMessagesRead: vi.fn().mockResolvedValue({ success: true }),
  searchMessages: vi.fn().mockResolvedValue({ success: true, data: [] }),
  searchChats: vi.fn().mockResolvedValue({ success: true, data: { chats: [], total: 0 } }),
  onConnectionStatus: vi.fn(),
  onMessageInserted: vi.fn(),
  onChatUpdated: vi.fn(),
  onChatListUpdated: vi.fn(),
  simulateDisconnect: vi.fn().mockResolvedValue({ success: true }),
  forceReconnect: vi.fn().mockResolvedValue({ success: true }),
};

const mockChatsApi = {
  getChats: vi.fn().mockResolvedValue({ success: true, data: [] }),
  searchChats: vi.fn().mockResolvedValue({ success: true, data: { chats: [], total: 0 } }),
};

Object.defineProperty(window, 'syncApi', { value: mockSyncApi });
Object.defineProperty(window, 'secureMessenger', { 
  value: { 
    chats: mockChatsApi,
    sync: mockSyncApi,
  } 
});

// Global error handler for unhandled rejections in tests
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Suppress console errors during tests (optional)
// vi.spyOn(console, 'error').mockImplementation(() => {});
