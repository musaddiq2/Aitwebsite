import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import PublicRoutes from './router/PublicRoutes';
import AdminRoutes from './router/AdminRoutes';
import StudentRoutes from './router/StudentRoutes';
import Protected from './router/Protected';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

function App() {
  const { user, isLoading } = useAuth();

  // Show loading only for a short time, then show content
  // This prevents infinite loading if API call fails
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/*" element={<PublicRoutes />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <Protected requiredRole="admin">
              <AdminLayout />
            </Protected>
          }
        >
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        {/* Protected Student Routes */}
        <Route
          path="/student/*"
          element={
            <Protected requiredRole="student">
              <StudentLayout />
            </Protected>
          }
        >
          <Route path="*" element={<StudentRoutes />} />
        </Route>

        {/* Default redirect */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/student/dashboard" replace />
              )
            ) : (
              <Navigate to="/home" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;