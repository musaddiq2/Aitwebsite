// Auth utility functions

export const getStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    return null;
  }
};

export const setStoredToken = (token) => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const removeStoredToken = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

