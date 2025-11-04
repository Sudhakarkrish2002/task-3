import React, { useEffect, useState } from 'react';

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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          // Not authenticated, redirect to login
          setIsAuthorized(false);
          setIsLoading(false);
          window.location.hash = '#/auth';
          return;
        }

        const user = JSON.parse(userData);

        // Check if user has the required role
        if (requiredRole && user.role !== requiredRole) {
          // User doesn't have required role, redirect to home
          setIsAuthorized(false);
          setIsLoading(false);
          window.location.hash = '#/';
          return;
        }

        // Authorized
        setIsAuthorized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthorized(false);
        setIsLoading(false);
        window.location.hash = '#/auth';
      }
    };

    checkAuth();
  }, [requiredRole]);

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

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

