// src/components/ChatSearch.tsx
import React, { useState, useEffect } from 'react';
import { searchChats, highlightText } from '../services/chatSearchService';
import type { ChatSearchResult } from '../services/chatSearchService';

interface ChatSearchProps {
  onChatSelect?: (chatId: string) => void;
  className?: string;
}

/**
 * Chat search component with real-time search functionality
 */
const ChatSearch: React.FC<ChatSearchProps> = ({ onChatSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ChatSearchResult>({ chats: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim()) {
        try {
          setLoading(true);
          setError(null);
          const searchResults = await searchChats(query);
          setResults(searchResults);
        } catch (err) {
          setError('Failed to search chats');
          console.error('Search error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ chats: [], total: 0 });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleChatClick = (chatId: string) => {
    if (onChatSelect) {
      onChatSelect(chatId);
    }
    setQuery('');
    setResults({ chats: [], total: 0 });
  };

  return (
    <div className={`chat-search ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search chats..."
          className="w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}

      {query && results.chats.length > 0 && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200">
            {results.total} result{results.total !== 1 ? 's' : ''}
          </div>
          {results.chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatClick(chat.id)}
              className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightText(chat.name, query)
                      }}
                    />
                  </div>
                  {chat.lastMessage && (
                    <div className="text-xs text-gray-500 truncate mt-1">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightText(chat.lastMessage, query)
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 ml-2">
                  <span className="text-xs text-gray-400">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {query && !loading && results.chats.length === 0 && !error && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <div className="text-sm text-gray-500">No chats found for "{query}"</div>
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
