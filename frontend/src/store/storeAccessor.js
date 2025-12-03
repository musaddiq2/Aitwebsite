// Store accessor to break circular dependencies
// This file should be imported after store.js is initialized

let storeInstance = null;
let authActions = null;

export const setStore = (store, actions) => {
  storeInstance = store;
  authActions = actions;
};

export const getStore = () => {
  if (!storeInstance) {
    // Return null instead of throwing to allow graceful handling
    console.warn('Store not initialized yet');
    return null;
  }
  return storeInstance;
};

export const getAuthActions = () => {
  if (!authActions) {
    // Return null instead of throwing to allow graceful handling
    console.warn('Auth actions not initialized yet');
    return null;
  }
  return authActions;
};

