import { useSelector } from 'react-redux';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated: isAuthenticated || !!user,
    isLoading,
    error,
  };
};

