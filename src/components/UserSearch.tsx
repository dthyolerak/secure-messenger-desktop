// src/components/UserSearch.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers, clearSearchResults } from '../app/slices/usersSlice';
import { RootState, AppDispatch } from '../app/store';
import { Search, User, X } from 'lucide-react';

interface UserSearchProps {
  currentUserId: string;
  onUserSelect?: (user: any) => void;
  placeholder?: string;
  className?: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  currentUserId,
  onUserSelect,
  placeholder = "Search users...",
  className = "",
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, isSearching, searchError } = useSelector((state: RootState) => state.users);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim().length >= 2) {
        dispatch(searchUsers({ query: searchQuery, currentUserId }));
      } else {
        dispatch(clearSearchResults());
      }
    },
    [dispatch, currentUserId]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const handleUserClick = (user: any) => {
    if (onUserSelect) {
      onUserSelect(user);
    }
    setQuery('');
    dispatch(clearSearchResults());
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearchResults());
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim().length >= 2 || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {isSearching && (
            <div className="p-3 text-center text-gray-500">
              Searching...
            </div>
          )}

          {searchError && (
            <div className="p-3 text-center text-red-500 text-sm">
              {searchError}
            </div>
          )}

          {!isSearching && !searchError && searchResults.length === 0 && query.trim().length >= 2 && (
            <div className="p-3 text-center text-gray-500 text-sm">
              No users found
            </div>
          )}

          {!isSearching && !searchError && searchResults.length > 0 && (
            <div>
              {searchResults.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {user.displayName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
