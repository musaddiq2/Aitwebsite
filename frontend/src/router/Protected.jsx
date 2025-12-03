import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Protected = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading only if we're actually loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default Protected;

