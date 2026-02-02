// tests/components/ChatItem.test.tsx
/**
 * Unit tests for ChatItem component
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatItem from '../../src/components/ChatItem';

describe('ChatItem Component', () => {
  const mockChat = {
    id: 'chat-1',
    name: 'Alice Johnson',
    lastMessage: 'Hey, how are you?',
    updatedAt: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    unreadCount: 3,
  };

  const defaultProps = {
    chat: mockChat,
    isSelected: false,
    onClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render chat name', () => {
      render(<ChatItem {...defaultProps} />);
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    it('should render last message', () => {
      render(<ChatItem {...defaultProps} />);
      expect(screen.getByText('Hey, how are you?')).toBeInTheDocument();
    });

    it('should render avatar with first letter', () => {
      render(<ChatItem {...defaultProps} />);
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should render unread count badge', () => {
      render(<ChatItem {...defaultProps} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should not render unread badge when count is 0', () => {
      render(
        <ChatItem
          {...defaultProps}
          chat={{ ...mockChat, unreadCount: 0 }}
        />
      );
      // The badge element should not exist (it uses a specific class)
      const badge = document.querySelector('.bg-primary.rounded-full');
      expect(badge).toBeNull();
    });

    it('should show 99+ for unread count over 99', () => {
      render(
        <ChatItem
          {...defaultProps}
          chat={{ ...mockChat, unreadCount: 150 }}
        />
      );
      expect(screen.getByText('99+')).toBeInTheDocument();
    });

    it('should handle missing lastMessage', () => {
      render(
        <ChatItem
          {...defaultProps}
          chat={{ ...mockChat, lastMessage: undefined }}
        />
      );
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });
  });

  describe('Time Formatting', () => {
    it('should display "Yesterday" for yesterday\'s messages', () => {
      const yesterday = Date.now() - 1000 * 60 * 60 * 24;
      render(
        <ChatItem
          {...defaultProps}
          chat={{ ...mockChat, updatedAt: yesterday }}
        />
      );
      expect(screen.getByText('Yesterday')).toBeInTheDocument();
    });

    it('should display weekday for messages within a week', () => {
      const threeDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 3;
      render(
        <ChatItem
          {...defaultProps}
          chat={{ ...mockChat, updatedAt: threeDaysAgo }}
        />
      );
      // Should show a weekday abbreviation
      const timeElement = screen.getByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/);
      expect(timeElement).toBeInTheDocument();
    });
  });

  describe('Selection State', () => {
    it('should have selected styling when isSelected is true', () => {
      render(<ChatItem {...defaultProps} isSelected={true} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-selected', 'true');
    });

    it('should not have selected styling when isSelected is false', () => {
      render(<ChatItem {...defaultProps} isSelected={false} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<ChatItem {...defaultProps} onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible', () => {
      const handleClick = vi.fn();
      render(<ChatItem {...defaultProps} onClick={handleClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.keyDown(button, { key: 'Enter' });
      
      // Button should be focusable
      expect(button).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Accessibility', () => {
    it('should have proper button role', () => {
      render(<ChatItem {...defaultProps} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should have aria-selected attribute', () => {
      render(<ChatItem {...defaultProps} isSelected={true} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-selected');
    });
  });
});
