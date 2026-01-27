// src/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { selectChat } from '../app/slices/chatsSlice';

type ShortcutHandler = () => void;

interface Shortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  handler: ShortcutHandler;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const {
          key,
          ctrlKey = false,
          metaKey = false,
          shiftKey = false,
          handler,
        } = shortcut;

        const matchesKey = event.key === key;
        const matchesCtrl = (event.ctrlKey || event.metaKey) === ctrlKey;
        const matchesMeta = event.metaKey === metaKey;
        const matchesShift = event.shiftKey === shiftKey;

        if (matchesKey && matchesCtrl && matchesMeta && matchesShift) {
          event.preventDefault();
          event.stopPropagation();
          handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, dispatch]);
}

// Predefined shortcuts
export const createAppShortcuts = (dispatch: AppDispatch, extra: Shortcut[] = []): Shortcut[] => [
  {
    key: 'Escape',
    handler: () => dispatch(selectChat(null)),
    description: 'Deselect chat',
  },
  {
    key: 'k',
    ctrlKey: true,
    metaKey: true,
    handler: () => {
      const searchInput = document.querySelector<HTMLInputElement>('.chat-search-input');
      searchInput?.focus();
    },
    description: 'Focus chat search',
  },
  ...extra,
];
