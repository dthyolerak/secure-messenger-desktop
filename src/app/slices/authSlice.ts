// src/app/slices/authSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AuthSession } from '../../domains/auth/auth.types';
import { ipcClient } from '../../services/ipcClient';

export type AuthStateStatus = 'unauthenticated' | 'authenticated' | 'loading';

interface AuthState {
  status: AuthStateStatus;
  session: AuthSession | null;
}

const initialState: AuthState = {
  status: 'loading',
  session: null,
};

// Selector to get user from session
export const selectUser = (state: { auth: AuthState }) => state.auth.session?.user || null;

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    const session = await ipcClient.auth.getSession();
    return { session };
  },
);

export const startSession = createAsyncThunk(
  'auth/startSession',
  async (payload: { displayName?: string }) => {
    const session = await ipcClient.auth.startSession(payload);
    return { session };
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        const session = action.payload.session;
        if (session) {
          state.status = 'authenticated';
          state.session = session;
        } else {
          state.status = 'unauthenticated';
          state.session = null;
        }
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'unauthenticated';
        state.session = null;
      })
      .addCase(startSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.session = action.payload.session;
      })
      .addCase(startSession.rejected, (state) => {
        state.status = 'unauthenticated';
        state.session = null;
      });
  },
});

export const authReducer = authSlice.reducer;