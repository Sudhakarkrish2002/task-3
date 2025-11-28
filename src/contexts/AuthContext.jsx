import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { authAPI } from '../utils/api.js'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper functions for role-based storage
const getRoleTokenKey = (role) => `token_${role}`
const getRoleUserKey = (role) => `user_${role}`
const ACTIVE_ROLE_KEY = 'activeRole'

// Get active role from localStorage
const getActiveRole = () => {
  return localStorage.getItem(ACTIVE_ROLE_KEY) || null
}

// Set active role in localStorage
const setActiveRole = (role) => {
  if (role) {
    localStorage.setItem(ACTIVE_ROLE_KEY, role)
  } else {
    localStorage.removeItem(ACTIVE_ROLE_KEY)
  }
}

// Get token for a specific role
const getTokenForRole = (role) => {
  return localStorage.getItem(getRoleTokenKey(role))
}

// Get user for a specific role
const getUserForRole = (role) => {
  const userStr = localStorage.getItem(getRoleUserKey(role))
  return userStr ? JSON.parse(userStr) : null
}

// Get all logged-in roles
const getLoggedInRoles = () => {
  const roles = ['student', 'employer', 'college', 'admin', 'content_writer']
  return roles.filter(role => {
    const token = getTokenForRole(role)
    const user = getUserForRole(role)
    return token && user
  })
}

// Custom event name for same-tab auth updates
const AUTH_UPDATE_EVENT = 'auth:update'

export const AuthProvider = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState(() => getActiveRole())
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Update user and auth state based on active role
  const updateActiveRoleState = useCallback((role) => {
    // Prevent unnecessary updates if role hasn't changed
    const currentRole = getActiveRole()
    if (role === currentRole) {
      // Still update user data in case it changed
      if (role) {
        const roleUser = getUserForRole(role)
        const roleToken = getTokenForRole(role)
        if (roleUser && roleToken) {
          setUser(prevUser => {
            // Only update if user data actually changed
            if (JSON.stringify(prevUser) !== JSON.stringify(roleUser)) {
              return roleUser
            }
            return prevUser
          })
          setIsAuthenticated(true)
          return
        }
      }
    }

    if (role) {
      const roleUser = getUserForRole(role)
      const roleToken = getTokenForRole(role)
      if (roleUser && roleToken) {
        setUser(roleUser)
        setIsAuthenticated(true)
        setActiveRoleState(role)
        setActiveRole(role)
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setActiveRoleState(null)
        setActiveRole(null)
      }
    } else {
      setUser(null)
      setIsAuthenticated(false)
      setActiveRoleState(null)
      setActiveRole(null)
    }
  }, [])

  // Validate token for a specific role
  const validateTokenForRole = useCallback(async (role) => {
    const token = getTokenForRole(role)
    const storedUser = getUserForRole(role)

    if (!token || !storedUser) {
      return false
    }

    try {
      // Temporarily set active role to validate this role's token
      const previousActiveRole = getActiveRole()
      setActiveRole(role)
      
      // Validate token with backend
      const response = await authAPI.getMe()
      
      // Restore previous active role
      setActiveRole(previousActiveRole)
      
      if (response.success && response.data) {
        const userData = response.data
        // Verify the user's role matches
        if (userData.role === role || (role === 'content' && userData.role === 'content_writer')) {
          // Update localStorage with fresh user data
          localStorage.setItem(getRoleUserKey(role), JSON.stringify(userData))
          return true
        }
      }
      
      // Try to refresh token
      try {
        setActiveRole(role)
        const refreshResponse = await authAPI.refreshToken()
        setActiveRole(previousActiveRole)
        
        if (refreshResponse.success && refreshResponse.token) {
          localStorage.setItem(getRoleTokenKey(role), refreshResponse.token)
          if (refreshResponse.user) {
            localStorage.setItem(getRoleUserKey(role), JSON.stringify(refreshResponse.user))
            return true
          } else {
            const meResponse = await authAPI.getMe()
            setActiveRole(previousActiveRole)
            if (meResponse.success && meResponse.data) {
              localStorage.setItem(getRoleUserKey(role), JSON.stringify(meResponse.data))
              return true
            }
          }
        }
      } catch (refreshError) {
        setActiveRole(previousActiveRole)
        console.error(`Token refresh failed for ${role}:`, refreshError)
      }
      
      // Keep user logged in with stored data
      return true
    } catch (error) {
      console.error(`Token validation failed for ${role}:`, error)
      // Keep user logged in with stored data
      return true
    }
  }, [])

  // Validate all tokens on mount
  const validateAllTokens = useCallback(async () => {
    const loggedInRoles = getLoggedInRoles()
    
    if (loggedInRoles.length === 0) {
      setUser(null)
      setIsAuthenticated(false)
      setActiveRoleState(null)
      setActiveRole(null)
      setIsLoading(false)
      return
    }

    // Validate all logged-in roles
    await Promise.all(loggedInRoles.map(role => validateTokenForRole(role)))

    // Set active role
    const currentActiveRole = getActiveRole()
    if (currentActiveRole && loggedInRoles.includes(currentActiveRole)) {
      updateActiveRoleState(currentActiveRole)
    } else {
      // Use first logged-in role as active
      updateActiveRoleState(loggedInRoles[0])
    }
    
    setIsLoading(false)
  }, [validateTokenForRole, updateActiveRoleState])

  // Initialize auth state on mount
  useEffect(() => {
    validateAllTokens()
  }, [validateAllTokens])

  // Listen for localStorage changes (cross-tab sync) and custom auth updates (same-tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Check if any role-related storage changed (from other tabs)
      if (e.key && (e.key.startsWith('token_') || e.key.startsWith('user_') || e.key === ACTIVE_ROLE_KEY)) {
        const loggedInRoles = getLoggedInRoles()
        const currentActiveRole = getActiveRole()
        
        if (loggedInRoles.length === 0) {
          updateActiveRoleState(null)
        } else if (currentActiveRole && loggedInRoles.includes(currentActiveRole)) {
          updateActiveRoleState(currentActiveRole)
        } else if (loggedInRoles.length > 0) {
          updateActiveRoleState(loggedInRoles[0])
        }
      }
    }

    const handleAuthUpdate = () => {
      // Handle same-tab auth updates
      const loggedInRoles = getLoggedInRoles()
      const currentActiveRole = getActiveRole()
      
      if (loggedInRoles.length === 0) {
        updateActiveRoleState(null)
      } else if (currentActiveRole && loggedInRoles.includes(currentActiveRole)) {
        updateActiveRoleState(currentActiveRole)
      } else if (loggedInRoles.length > 0) {
        updateActiveRoleState(loggedInRoles[0])
      }
    }

    // Listen for cross-tab storage changes
    window.addEventListener('storage', handleStorageChange)
    // Listen for same-tab auth updates
    window.addEventListener(AUTH_UPDATE_EVENT, handleAuthUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(AUTH_UPDATE_EVENT, handleAuthUpdate)
    }
  }, [updateActiveRoleState])

  // Login function - stores role-specific token and user data
  const login = useCallback((token, userData) => {
    const role = userData.role
    
    // Store role-specific data
    localStorage.setItem(getRoleTokenKey(role), token)
    localStorage.setItem(getRoleUserKey(role), JSON.stringify(userData))
    
    // Set as active role
    setActiveRole(role)
    updateActiveRoleState(role)
    
    // Trigger custom event for same-tab sync and storage event for cross-tab sync
    window.dispatchEvent(new CustomEvent(AUTH_UPDATE_EVENT))
    // Note: storage event only fires from other tabs, so we use custom event for same-tab
  }, [updateActiveRoleState])

  // Logout function - clears specific role's session
  const logout = useCallback((role = null) => {
    const roleToLogout = role || activeRole
    
    if (roleToLogout) {
      localStorage.removeItem(getRoleTokenKey(roleToLogout))
      localStorage.removeItem(getRoleUserKey(roleToLogout))
      
      // If logging out active role, switch to another logged-in role
      if (roleToLogout === activeRole) {
        const remainingRoles = getLoggedInRoles().filter(r => r !== roleToLogout)
        if (remainingRoles.length > 0) {
          updateActiveRoleState(remainingRoles[0])
        } else {
          updateActiveRoleState(null)
        }
      }
      
      // Trigger custom event for same-tab sync
      window.dispatchEvent(new CustomEvent(AUTH_UPDATE_EVENT))
      // Note: storage event only fires from other tabs, so we use custom event for same-tab
    }
  }, [activeRole, updateActiveRoleState])

  // Switch active role
  const switchRole = useCallback((role) => {
    const loggedInRoles = getLoggedInRoles()
    if (loggedInRoles.includes(role)) {
      updateActiveRoleState(role)
    }
  }, [updateActiveRoleState])

  // Get user for specific role
  const getUser = useCallback((role = null) => {
    const targetRole = role || activeRole
    if (!targetRole) return null
    return getUserForRole(targetRole)
  }, [activeRole])

  // Check if specific role is authenticated
  const isAuthenticatedForRole = useCallback((role) => {
    const token = getTokenForRole(role)
    const user = getUserForRole(role)
    return !!(token && user)
  }, [])

  // Refresh user data for active role
  const refreshUser = useCallback(async (role = null) => {
    const targetRole = role || activeRole
    if (!targetRole) return null

    try {
      const previousActiveRole = getActiveRole()
      setActiveRole(targetRole)
      
      const response = await authAPI.getMe()
      
      setActiveRole(previousActiveRole)
      
      if (response.success && response.data) {
        const userData = response.data
        localStorage.setItem(getRoleUserKey(targetRole), JSON.stringify(userData))
        
        // Update active role state if this is the active role
        if (targetRole === activeRole) {
          setUser(userData)
        }
        
        return userData
      }
    } catch (error) {
      console.error(`Error refreshing user data for ${targetRole}:`, error)
      // Try to refresh token
      try {
        const previousActiveRole = getActiveRole()
        setActiveRole(targetRole)
        const refreshResponse = await authAPI.refreshToken()
        setActiveRole(previousActiveRole)
        
        if (refreshResponse.success && refreshResponse.token) {
          localStorage.setItem(getRoleTokenKey(targetRole), refreshResponse.token)
          if (refreshResponse.user) {
            localStorage.setItem(getRoleUserKey(targetRole), JSON.stringify(refreshResponse.user))
            if (targetRole === activeRole) {
              setUser(refreshResponse.user)
            }
            return refreshResponse.user
          }
        }
      } catch (refreshError) {
        console.error(`Token refresh failed for ${targetRole}:`, refreshError)
        // Keep user logged in with stored data
        const storedUser = getUserForRole(targetRole)
        if (storedUser && targetRole === activeRole) {
          setUser(storedUser)
        }
        return storedUser
      }
    }
    return null
  }, [activeRole])

  // Get all logged-in roles
  const getAllLoggedInRoles = useCallback(() => {
    return getLoggedInRoles()
  }, [])

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    // Active role data (backward compatibility)
    user,
    isAuthenticated,
    activeRole,
    
    // Loading state
    isLoading,
    
    // Core functions
    login,
    logout,
    switchRole,
    refreshUser,
    
    // Role-specific functions
    getUser,
    isAuthenticatedForRole,
    getLoggedInRoles: getAllLoggedInRoles,
    
    // Validation
    validateTokenForRole
  }), [user, isAuthenticated, activeRole, isLoading, login, logout, switchRole, refreshUser, getUser, isAuthenticatedForRole, getAllLoggedInRoles, validateTokenForRole])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
