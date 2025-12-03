// Initialize auth state on app load
import { store } from '../store/store';
import { getMe } from '../store/authSlice';

let authInitialized = false;
let initPromise = null;

export const initializeAuth = async () => {
  // Return existing promise if already initializing
  if (initPromise) {
    return initPromise;
  }
  
  // Return immediately if already initialized
  if (authInitialized) {
    return Promise.resolve();
  }
  
  // Create and store the promise
  initPromise = (async () => {
    try {
      // Try to get user from backend (token might be in cookies)
      await store.dispatch(getMe()).unwrap();
    } catch (error) {
      // Silently fail - user is not authenticated
      // This is expected for first-time visitors
    } finally {
      authInitialized = true;
    }
  })();
  
  return initPromise;
};

