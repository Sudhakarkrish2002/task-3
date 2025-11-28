import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react'
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
  const [isValidating, setIsValidating] = useState(false) // Prevent multiple simultaneous validations

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

  // Track which roles are currently being validated to prevent duplicate requests
  const validatingRolesRef = useRef(new Set())
  
  // Validate token for a specific role
  const validateTokenForRole = useCallback(async (role) => {
    const token = getTokenForRole(role)
    const storedUser = getUserForRole(role)

    if (!token || !storedUser) {
      return false
    }

    // Prevent duplicate validation for the same role
    if (validatingRolesRef.current.has(role)) {
      return true // Assume valid if already validating
    }

    validatingRolesRef.current.add(role)

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
      
      // Keep user logged in with stored data
      return true
    } catch (error) {
      // Handle rate limit errors gracefully - don't try to refresh on rate limit
      if (error.message?.includes('Too many requests') || error.status === 429) {
        // Keep user logged in with stored data during rate limit
        return true
      }
      
      // Try to refresh token only if we got a 401 or token expired error
      if (error.status === 401 || error.message?.includes('token') || error.message?.includes('authorized')) {
        try {
          const previousActiveRole = getActiveRole()
          setActiveRole(role)
          const refreshResponse = await authAPI.refreshToken()
          setActiveRole(previousActiveRole)
          
          if (refreshResponse.success && refreshResponse.token) {
            localStorage.setItem(getRoleTokenKey(role), refreshResponse.token)
            if (refreshResponse.user) {
              localStorage.setItem(getRoleUserKey(role), JSON.stringify(refreshResponse.user))
              return true
            } else {
              setActiveRole(role)
              const meResponse = await authAPI.getMe()
              setActiveRole(previousActiveRole)
              if (meResponse.success && meResponse.data) {
                localStorage.setItem(getRoleUserKey(role), JSON.stringify(meResponse.data))
                return true
              }
            }
          }
        } catch {
          const previousActiveRole = getActiveRole()
          setActiveRole(previousActiveRole)
          // Silently handle refresh errors - keep user logged in with stored data
        }
      }
      
      // Keep user logged in with stored data (even during rate limits)
      return true
    } finally {
      // Remove from validating set when done
      validatingRolesRef.current.delete(role)
    }
  }, [])

  // Validate all tokens on mount
  const validateAllTokens = useCallback(async () => {
    // Prevent multiple simultaneous validations
    if (isValidating) {
      return
    }
    
    setIsValidating(true)
    
    try {
      const loggedInRoles = getLoggedInRoles()
      
      if (loggedInRoles.length === 0) {
        setUser(null)
        setIsAuthenticated(false)
        setActiveRoleState(null)
        setActiveRole(null)
        setIsLoading(false)
        return
      }

      // Validate all logged-in roles sequentially to avoid rate limiting
      // Only validate the active role immediately, others can be validated in background
      const currentActiveRole = getActiveRole()
      
      if (currentActiveRole && loggedInRoles.includes(currentActiveRole)) {
        // Validate active role first
        await validateTokenForRole(currentActiveRole)
        updateActiveRoleState(currentActiveRole)
        setIsLoading(false)
        
        // Validate other roles in background (don't wait) - but limit to prevent resource exhaustion
        const otherRoles = loggedInRoles.filter(role => role !== currentActiveRole)
        // Only validate up to 3 other roles to prevent too many requests
        otherRoles.slice(0, 3).forEach(role => {
          validateTokenForRole(role).catch(() => {
            // Silently handle errors for background validation
          })
        })
      } else {
        // No active role, validate first role and set as active
        const firstRole = loggedInRoles[0]
        await validateTokenForRole(firstRole)
        updateActiveRoleState(firstRole)
        setIsLoading(false)
        
        // Validate other roles in background - limit to prevent resource exhaustion
        loggedInRoles
          .slice(1, 4) // Only validate up to 3 other roles
          .forEach(role => {
            validateTokenForRole(role).catch(() => {
              // Silently handle errors for background validation
            })
          })
      }
    } finally {
      setIsValidating(false)
    }
  }, [validateTokenForRole, updateActiveRoleState, isValidating])

  // Initialize auth state on mount - only run once
  useEffect(() => {
    validateAllTokens()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run on mount, not when validateAllTokens changes

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
      // Don't trigger validation on every update to prevent resource exhaustion
      // Just update the state based on what's in localStorage
      const loggedInRoles = getLoggedInRoles()
      const currentActiveRole = getActiveRole()
      
      if (loggedInRoles.length === 0) {
        updateActiveRoleState(null)
      } else if (currentActiveRole && loggedInRoles.includes(currentActiveRole)) {
        updateActiveRoleState(currentActiveRole)
      } else if (loggedInRoles.length > 0) {
        updateActiveRoleState(loggedInRoles[0])
      }
      // Don't call validateAllTokens here to prevent infinite loops
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
  // Returns: { remainingRoles: string[], wasActiveRole: boolean }
  const logout = useCallback((role = null) => {
    const roleToLogout = role || activeRole
    
    if (!roleToLogout) {
      return { remainingRoles: [], wasActiveRole: false }
    }
    
    // Check remaining roles BEFORE removing the current role (fix timing issue)
    const currentLoggedInRoles = getLoggedInRoles()
    const wasActiveRole = roleToLogout === activeRole
    
    // Remove the role's data from localStorage
    localStorage.removeItem(getRoleTokenKey(roleToLogout))
    localStorage.removeItem(getRoleUserKey(roleToLogout))
    
    // Calculate remaining roles (excluding the one we just logged out)
    const remainingRoles = currentLoggedInRoles.filter(r => r !== roleToLogout)
    
    // If logging out the active role, clear active role state
    // Let the caller decide whether to switch to another role
    if (wasActiveRole) {
      if (remainingRoles.length === 0) {
        // No remaining roles, clear everything
        updateActiveRoleState(null)
      } else {
        // There are remaining roles, but don't auto-switch
        // Clear active role and let caller handle switching
        setUser(null)
        setIsAuthenticated(false)
        setActiveRoleState(null)
        setActiveRole(null)
      }
    }
    
    // Trigger custom event for same-tab sync
    window.dispatchEvent(new CustomEvent(AUTH_UPDATE_EVENT))
    // Note: storage event only fires from other tabs, so we use custom event for same-tab
    
    return { remainingRoles, wasActiveRole }
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
    } catch {
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
      } catch {
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
