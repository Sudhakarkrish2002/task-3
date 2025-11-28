import React, { useEffect, useRef } from 'react';
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
  const { user, isAuthenticated, isLoading, isAuthenticatedForRole, switchRole, activeRole } = useAuth();
  const hasRedirectedRef = useRef(false);
  const lastCheckedRoleRef = useRef(null);

  useEffect(() => {
    // Reset redirect flag when requiredRole changes
    if (lastCheckedRoleRef.current !== requiredRole) {
      hasRedirectedRef.current = false;
      lastCheckedRoleRef.current = requiredRole;
    }

    // Wait for auth context to finish loading
    if (isLoading) {
      return;
    }

    // Prevent multiple redirects
    if (hasRedirectedRef.current) {
      return;
    }

    if (!requiredRole) {
      // No role required, just check if authenticated
      if (!isAuthenticated) {
        hasRedirectedRef.current = true;
        window.location.hash = '#/auth'
      }
      return;
    }

    // Check if user is authenticated for the required role
    const isAuthForRequiredRole = isAuthenticatedForRole(requiredRole)
    
    if (!isAuthForRequiredRole) {
      // User is not logged in as the required role - redirect to login
      hasRedirectedRef.current = true;
      const roleTabMap = {
        admin: 'admin',
        student: 'student',
        employer: 'employer',
        college: 'college',
        content_writer: 'content'
      }
      const tab = roleTabMap[requiredRole] || 'student'
      window.location.hash = `#/auth?tab=${tab}`
      return;
    }

    // User is logged in as required role - auto-switch to it if not already active
    // IMPORTANT: Update localStorage synchronously before state update to ensure API calls use correct token
    if (activeRole !== requiredRole) {
      // Update localStorage immediately so API calls use the correct token
      localStorage.setItem('activeRole', requiredRole)
      switchRole(requiredRole)
    }

    // Check if user is active and verified (except students who can access regardless)
    if (user && user.role !== 'student' && user.role !== 'admin') {
      const isApproved = user.isActive === true && 
        (user.isVerified === true || 
         (user.role === 'employer' && user.employerDetails?.adminApprovalStatus === 'approved') ||
         (user.role === 'college' && user.collegeDetails?.adminApprovalStatus === 'approved'));
      
      if (!isApproved) {
        // User is not approved, redirect to home with message
        hasRedirectedRef.current = true;
        window.location.hash = '#/';
        return;
      }
    }
  }, [isAuthenticated, isLoading, requiredRole, isAuthenticatedForRole, switchRole, activeRole, user]);

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

  // If not authenticated for required role, don't render children (redirect is handled in useEffect)
  if (requiredRole && !isAuthenticatedForRole(requiredRole)) {
    return null;
  }

  // If no role required but not authenticated, don't render children
  if (!requiredRole && !isAuthenticated) {
    return null;
  }

  // CRITICAL: Wait for activeRole to match requiredRole before rendering children
  // This ensures API calls use the correct role's token
  // Only check this if we have a required role
  if (requiredRole && activeRole !== requiredRole) {
    // Check if localStorage has the correct role set (might be set but state not updated yet)
    const storedActiveRole = localStorage.getItem('activeRole');
    // If localStorage matches and user is authenticated for the role, render children
    // This handles the case where login just set the role but state hasn't updated yet
    if (storedActiveRole === requiredRole && isAuthenticatedForRole(requiredRole)) {
      // Role is set in localStorage, just waiting for state to sync - render children
      // The useEffect will update the state, but we don't need to block rendering
      return <>{children}</>;
    }
    
    // Show loading state while role is switching
    if (fallback) {
      return fallback;
    }
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Switching role...</p>
        </div>
      </div>
    );
  }

  // Check if user is active and verified (except students and admins)
  if (user && user.role !== 'student' && user.role !== 'admin') {
    const isApproved = user.isActive === true && 
      (user.isVerified === true || 
       (user.role === 'employer' && user.employerDetails?.adminApprovalStatus === 'approved') ||
       (user.role === 'college' && user.collegeDetails?.adminApprovalStatus === 'approved'));
    
    if (!isApproved) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Pending Approval</h2>
            <p className="text-gray-600 mb-6">
              Your account is currently pending admin approval. You will be able to access your dashboard once an administrator approves your account.
            </p>
            <a
              href="#/"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Go to Home
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}

