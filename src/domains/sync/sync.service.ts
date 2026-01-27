// src/domains/sync/sync.service.ts
import type { TypingEvent, PresenceEvent } from './sync.types';

// Placeholder: In a real app, these would emit WebSocket events
export function emitTypingEvent(event: TypingEvent): void {
  // TODO: WebSocket emit
  console.log('Typing event:', event);
}

export function emitPresenceEvent(event: PresenceEvent): void {
  // TODO: WebSocket emit
  console.log('Presence event:', event);
}

// Ephemeral in-memory typing state (per chat)
const typingState = new Map<string, Set<string>>();

export function addTypingUser(chatId: string, username: string): void {
  if (!typingState.has(chatId)) {
    typingState.set(chatId, new Set());
  }
  typingState.get(chatId)!.add(username);
}

export function removeTypingUser(chatId: string, username: string): void {
  typingState.get(chatId)?.delete(username);
  if (typingState.get(chatId)?.size === 0) {
    typingState.delete(chatId);
  }
}

export function getTypingUsers(chatId: string): Set<string> {
  return typingState.get(chatId) || new Set();
}
