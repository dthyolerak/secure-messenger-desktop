// src/components/ChatList.tsx
import React, { useMemo, useEffect, useCallback, useState, useRef, CSSProperties } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'react-window';
import type { RootState, AppDispatch } from '../app/store';
import { fetchChats } from '../app/slices/chatsSlice';
import ChatItem from './ChatItem';
import type { ChatItem as ChatListItem } from '../app/slices/chatsSlice';
import { searchChats } from '../services/chatSearchService';

export interface ChatListProps {
  selectedChatId?: string | null;
  onSelectChat?: (chatId: string) => void;
  onCreateChat?: (userId: string) => Promise<void>;
  currentUserId?: string;
}

const CHAT_ITEM_HEIGHT = 72;

// Row component for react-window v2
interface ChatRowProps {
  chats: ChatListItem[];
  selectedChatId: string | null | undefined;
  onSelectChat: ((chatId: string) => void) | undefined;
}

type ChatRowComponentProps = {
  index: number;
  style: CSSProperties;
  ariaAttributes: { 'aria-posinset': number; 'aria-setsize': number; role: 'listitem' };
} & ChatRowProps;

// Memoized row component to prevent unnecessary re-renders
const ChatRowInner = ({
  index,
  style,
  chats,
  selectedChatId,
  onSelectChat,
}: ChatRowComponentProps): React.ReactElement | null => {
  const chat = chats[index];
  if (!chat) return null;

  return (
    <div style={style}>
      <ChatItem
        chat={chat}
        isSelected={selectedChatId === chat.id}
        onClick={() => onSelectChat?.(chat.id)}
      />
    </div>
  );
};

const ChatRow = React.memo(ChatRowInner) as (props: ChatRowComponentProps) => React.ReactElement | null;

/**
 * Chat list panel with Teams-style layout.
 * Optimized for performance with react-window virtualization.
 */
const ChatList: React.FC<ChatListProps> = ({
  selectedChatId,
  onSelectChat,
  onCreateChat,
  currentUserId,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items,
    loading,
    error,
    pagination,
  } = useSelector((s: RootState) => s.chats);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ChatListItem[]>([]);
  const [searchTotal, setSearchTotal] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch initial chats on mount
  useEffect(() => {
    dispatch(fetchChats({ offset: 0, limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setSearchTotal(0);
      setSearchLoading(false);
      return;
    }

    let isActive = true;
    setSearchLoading(true);

    const timer = window.setTimeout(() => {
      searchChats(trimmed)
        .then(({ chats, total }) => {
          if (!isActive) return;
          setSearchResults(chats);
          setSearchTotal(total);
        })
        .catch((err) => {
          console.error('Chat search failed:', err);
          if (!isActive) return;
          setSearchResults([]);
          setSearchTotal(0);
        })
        .finally(() => {
          if (!isActive) return;
          setSearchLoading(false);
        });
    }, 250);

    return () => {
      isActive = false;
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  // Sort chats by most recent activity
  const sortedChats = useMemo(
    () => [...items].sort((a, b) => b.updatedAt - a.updatedAt),
    [items],
  );

  const displayedChats = searchQuery.trim() ? searchResults : sortedChats;
  const displayTotal = searchQuery.trim() ? searchTotal : pagination.total;

  // Handle infinite scroll via onRowsRendered
  const handleRowsRendered = useCallback((
    visibleRows: { startIndex: number; stopIndex: number },
    allRows: { startIndex: number; stopIndex: number }
  ) => {
    if (searchQuery.trim()) return;
    if (loading || !pagination.hasMore) return;

    // Load more when approaching bottom
    if (allRows.stopIndex >= displayedChats.length - 5) {
      dispatch(fetchChats({
        offset: pagination.offset,
        limit: 50
      }));
    }
  }, [dispatch, loading, pagination.hasMore, pagination.offset, searchQuery, displayedChats.length]);

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <header className="px-4 py-3 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-secondary">Chats</h2>
        </header>
        <div className="flex-1 flex items-center justify-center text-red-500">
          <div className="text-center">
            <p className="text-sm">Failed to load chats</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="px-4 py-3 border-b border-gray-200 bg-white space-y-2">
        <h2 className="text-lg font-semibold text-secondary">
          Chats {displayTotal > 0 && `(${displayTotal})`}
        </h2>
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search chats"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </header>

      {/* Virtualized Chat List */}
      <div ref={containerRef} className="flex-1 overflow-hidden">
        {displayedChats.length === 0 && !loading && !searchLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-sm">
                {searchQuery.trim() ? 'No chats match your search' : 'No chats yet'}
              </p>
              <p className="text-xs mt-1">
                {searchQuery.trim()
                  ? 'Try a different name or keyword'
                  : 'Start a conversation to see it here'}
              </p>
            </div>
          </div>
        ) : (
          <List
            rowComponent={ChatRow}
            rowProps={{
              chats: displayedChats,
              selectedChatId,
              onSelectChat,
            }}
            rowCount={displayedChats.length}
            rowHeight={CHAT_ITEM_HEIGHT}
            onRowsRendered={handleRowsRendered}
            overscanCount={5}
            style={{ height: '100%', width: '100%' }}
          />
        )}
      </div>

      {/* Loading indicator */}
      {(loading || searchLoading) && (
        <div className="px-4 py-2 text-center text-sm text-gray-500 bg-gray-50">
          {searchQuery.trim() ? 'Searching chats...' : 'Loading more chats...'}
        </div>
      )}
    </div>
  );
};

export default ChatList;
