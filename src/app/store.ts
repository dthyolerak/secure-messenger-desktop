import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../auth/authSlice';
import chatsReducer from './slices/chatsSlice';
import messagesReducer from './slices/messagesSlice';
import connectionReducer from './slices/connectionSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer,
    messages: messagesReducer,
    connection: connectionReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
