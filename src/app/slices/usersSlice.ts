// src/app/slices/usersSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  createdAt: number;
}

export interface UsersState {
  users: User[];
  searchResults: User[];
  isSearching: boolean;
  searchError: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  searchResults: [],
  isSearching: false,
  searchError: null,
  isLoading: false,
  error: null,
};

// Async thunks for user operations
export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async ({ query, currentUserId }: { query: string; currentUserId: string }) => {
    const response = await window.secureMessenger.users.searchUsers(query, currentUserId);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to search users');
    }
    
    return response.users;
  }
);

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (currentUserId: string) => {
    const response = await window.secureMessenger.users.getAllUsers(currentUserId);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to get users');
    }
    
    return response.users;
  }
);

export const upsertUser = createAsyncThunk(
  'users/upsertUser',
  async ({ email, displayName, username }: { email: string; displayName: string; username: string }) => {
    const response = await window.secureMessenger.users.upsertUser(email, displayName, username);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to upsert user');
    }
    
    return response.users[0];
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.searchError = null;
    },
  },
  extraReducers: (builder) => {
    // Search users
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isSearching = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isSearching = false;
        state.searchError = action.error.message || 'Failed to search users';
      });

    // Get all users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get users';
      });

    // Upsert user
    builder
      .addCase(upsertUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(upsertUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          // Add missing createdAt field
          const userWithTimestamp = {
            ...action.payload,
            createdAt: Date.now()
          };
          
          // Update or add user in the users array
          const existingIndex = state.users.findIndex(user => user.id === action.payload!.id);
          if (existingIndex >= 0) {
            state.users[existingIndex] = userWithTimestamp;
          } else {
            state.users.push(userWithTimestamp);
          }
        }
      })
      .addCase(upsertUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to upsert user';
      });
  },
});

export const { clearSearchResults, clearError } = usersSlice.actions;
export default usersSlice.reducer;
