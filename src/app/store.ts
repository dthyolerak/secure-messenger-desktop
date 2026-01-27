import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import chatsReducer from './slices/chatsSlice';
import messagesReducer from './slices/messagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
