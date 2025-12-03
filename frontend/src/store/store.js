import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import studentSlice from './studentSlice';
import examSlice from './examSlice';
import adminSlice from './adminSlice';
import notificationSlice from './notificationSlice';
import { setStore } from './storeAccessor';
import { clearAuth, setCredentials } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    student: studentSlice,
    exam: examSlice,
    admin: adminSlice,
    notification: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Initialize store accessor to break circular dependencies
setStore(store, { clearAuth, setCredentials });

// TypeScript types removed - using JavaScript only
// If you need types, convert this file to .ts or use JSDoc comments

