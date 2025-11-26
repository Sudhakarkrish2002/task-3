import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../utils/api.js'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Validate token with backend
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (!token || !storedUser) {
      setIsAuthenticated(false)
      setUser(null)
      setIsLoading(false)
      return
    }

    try {
      // Validate token with backend
      const response = await authAPI.getMe()
      
      if (response.success && response.data) {
        const userData = response.data
        // Update localStorage with fresh user data
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        setIsAuthenticated(true)
      } else {
        // Token invalid, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      // Token invalid or expired, clear storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    validateToken()
  }, [validateToken])

  // Listen for localStorage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        validateToken()
      }
    }

    // Listen for custom auth logout event (from api.js on 401)
    const handleAuthLogout = () => {
      setUser(null)
      setIsAuthenticated(false)
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth:logout', handleAuthLogout)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth:logout', handleAuthLogout)
    }
  }, [validateToken])

  // Login function
  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'))
  }, [])

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    // Trigger storage event for cross-tab sync
    window.dispatchEvent(new Event('storage'))
  }, [])

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const response = await authAPI.getMe()
      if (response.success && response.data) {
        const userData = response.data
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
        return userData
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      // If refresh fails, logout user
      logout()
    }
    return null
  }, [logout])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    validateToken
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

