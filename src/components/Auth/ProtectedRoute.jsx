import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Component to protect routes that require authentication
const ProtectedRoute = ({ requireAdmin = false, children }) => {
  const { currentUser, loading } = useAuth();
  
  // If still loading auth state, show nothing (or could show a spinner)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-black)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-teal)]"></div>
      </div>
    );
  }
  
  // If no user is logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin route but user is not admin, redirect to home
  if (requireAdmin && currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated (and admin if required), render children or nested routes
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
