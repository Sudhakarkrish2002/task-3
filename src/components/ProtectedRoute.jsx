import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * ProtectedRoute Component
 * 
 * Protects routes based on user authentication and role.
 * Redirects to auth page if not authenticated or if user doesn't have required role.
 * 
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string} requiredRole - The role required to access this route (admin, student, employer, college, content_writer)
 * @param {React.ComponentType} fallback - Component to render while checking auth (optional)
 */
export default function ProtectedRoute({ children, requiredRole, fallback = null }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Wait for auth context to finish loading
    if (isLoading) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      window.location.hash = '#/auth';
      return;
    }

    // Check if user has the required role
    if (requiredRole && user && user.role !== requiredRole) {
      // User doesn't have required role, redirect to home
      window.location.hash = '#/';
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole]);

  // Show loading state while auth context is validating
  if (isLoading) {
    if (fallback) {
      return fallback;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // If not authenticated or wrong role, don't render children
  if (!isAuthenticated || (requiredRole && user && user.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}

