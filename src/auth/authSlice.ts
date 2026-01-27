// src/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, AuthUser, LoginPayload } from './authTypes';
import { validateUsername, createSession, storeSession, loadStoredSession, clearSession } from './authService';

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
};

export const checkSession = createAsyncThunk<AuthUser | null, void>(
  'auth/checkSession',
  async () => {
    return loadStoredSession();
  },
);

export const login = createAsyncThunk<AuthUser, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    const validationError = validateUsername(payload.username);
    if (validationError) {
      return rejectWithValue(validationError);
    }
    const user = createSession(payload);
    storeSession(user);
    return user;
  },
);

export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async () => {
    clearSession();
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkSession
      .addCase(checkSession.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.status = action.payload ? 'authenticated' : 'unauthenticated';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = 'Failed to restore session';
      })
      // login
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = action.payload ?? 'Login failed';
      })
      // logout
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.status = 'unauthenticated';
        state.user = null;
        state.error = 'Logout failed';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
