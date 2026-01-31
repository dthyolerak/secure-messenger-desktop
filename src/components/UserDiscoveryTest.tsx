// src/components/UserDiscoveryTest.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { searchUsers, getAllUsers } from '../app/slices/usersSlice';
import { RootState, AppDispatch } from '../app/store';
import { UserSearch } from './UserSearch';
import { Users, RefreshCw } from 'lucide-react';

export const UserDiscoveryTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, searchResults, isSearching, isLoading } = useSelector((state: RootState) => state.users || { users: [], searchResults: [], isSearching: false, isLoading: false });
  const [currentUserId, setCurrentUserId] = useState('current_user');

  useEffect(() => {
    // Load all users on component mount
    dispatch(getAllUsers(currentUserId));
  }, [dispatch, currentUserId]);

  const handleUserSelect = (user: any) => {
    console.log('Selected user:', user);
    alert(`Selected user: ${user.displayName} (@${user.username})`);
  };

  const handleRefreshUsers = () => {
    dispatch(getAllUsers(currentUserId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Discovery Test</h1>
          <p className="text-gray-600">Test the user search and discovery functionality</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Current User Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">Current User ID</h2>
            <p className="text-blue-700 font-mono">{currentUserId}</p>
          </div>

          {/* User Search */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Search Users
            </h2>
            <UserSearch
              currentUserId={currentUserId}
              onUserSelect={handleUserSelect}
              placeholder="Search for users by name or username..."
            />
          </div>

          {/* All Users List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                All Users ({users.length})
              </h2>
              <button
                onClick={handleRefreshUsers}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No users found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user: any) => (
                  <div
                    key={user.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
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
                    <div className="text-sm text-gray-600">
                      {user.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((user: any) => (
                  <div
                    key={user.id}
                    className="border border-green-200 bg-green-50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-medium">
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
                    <div className="text-sm text-gray-600">
                      {user.email}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
