import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext.jsx'
import { authAPI } from '../utils/api.js'

export default function Auth() {
  const { login, logout, user, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Get tab from URL parameter (supports both hash query params and regular query params)
  const getTabFromURL = () => {
    try {
      const hash = window.location.hash || ''
      const search = window.location.search || ''
      
      // Try to get from hash query params first (e.g., #/auth?tab=employer)
      let tab = null
      if (hash && hash.includes('?')) {
        try {
          const hashParts = hash.split('?')
          if (hashParts.length > 1) {
            const hashParams = new URLSearchParams(hashParts[1])
            tab = hashParams.get('tab')
          }
        } catch (e) {
          console.error('Error parsing hash params:', e)
        }
      }
      
      // Fallback to regular query params
      if (!tab && search) {
        try {
          const urlParams = new URLSearchParams(search)
          tab = urlParams.get('tab')
        } catch (e) {
          console.error('Error parsing search params:', e)
        }
      }
      
      // Check for reset token
      if (hash && hash.includes('token=')) {
        return 'reset'
      }
      
      // Validate tab value
      const validTabs = ['employer', 'college', 'admin', 'content', 'student', 'forgot', 'reset']
      return validTabs.includes(tab) ? tab : 'student'
    } catch (error) {
      console.error('Error in getTabFromURL:', error)
      // Return default tab if anything goes wrong
      return 'student'
    }
  }

  const [activeTab, setActiveTab] = useState(() => getTabFromURL()) // student, employer, college, admin, content, forgot, reset
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetToken, setResetToken] = useState('')
  
  // Get reset token from URL
  useEffect(() => {
    const hash = window.location.hash || ''
    const search = window.location.search || ''
    
    let token = null
    if (hash && hash.includes('token=')) {
      const tokenMatch = hash.match(/token=([^&]+)/)
      if (tokenMatch) token = tokenMatch[1]
    } else if (search && search.includes('token=')) {
      const urlParams = new URLSearchParams(search)
      token = urlParams.get('token')
    }
    
    if (token) {
      setResetToken(token)
      setActiveTab('reset')
      setIsLogin(false)
    }
  }, [])
  
  // CAPTCHA execution function
  const executeCaptcha = async (action = 'submit') => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || !window.grecaptcha.ready) {
        // If CAPTCHA is not loaded, resolve with null (for development)
        if (!import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY) {
          resolve(null)
          return
        }
        reject(new Error('CAPTCHA not loaded'))
        return
      }
      
      window.grecaptcha.ready(() => {
        const siteKey = import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY
        if (!siteKey) {
          resolve(null)
          return
        }
        
        window.grecaptcha.execute(siteKey, { action })
          .then((token) => {
            resolve(token)
          })
          .catch((error) => {
            console.error('CAPTCHA execution error:', error)
            reject(error)
          })
      })
    })
  }

  // Check authentication status and handle role mismatches
  useEffect(() => {
    if (authLoading) return

    if (isAuthenticated && user) {
      const currentRole = user.role
      const expectedRole = activeTab === 'content' ? 'content_writer' : activeTab
      
      // If user is logged in with the same role as the tab, redirect to their dashboard
      if (currentRole === expectedRole) {
        const redirectMap = {
          student: '#/dashboard/student',
          employer: '#/dashboard/employer',
          college: '#/dashboard/college',
          admin: '#/admin',
          content_writer: '#/dashboard/content'
        }
        const redirectPath = redirectMap[currentRole] || '#/'
        window.location.hash = redirectPath
        return
      }
      
      // Allow users to login with different role without showing warning
      // The login handler will automatically logout and login with new credentials
    }
  }, [isAuthenticated, user, activeTab, authLoading])

  // Update tab when URL changes
  useEffect(() => {
    const updateTab = () => {
      try {
        const newTab = getTabFromURL()
        console.log('Updating tab from URL:', newTab, 'Hash:', window.location.hash)
        setActiveTab(prevTab => {
          if (newTab !== prevTab) {
            setError('')
            return newTab
          }
          return prevTab
        })
      } catch (error) {
        console.error('Error updating tab:', error)
        // Ensure we have a valid tab even if there's an error
        setActiveTab('student')
      }
    }
    
    // Check on mount - use setTimeout to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateTab()
    }, 0)
    
    // Listen for hash changes
    window.addEventListener('hashchange', updateTab)
    
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('hashchange', updateTab)
    }
  }, [])

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '+91',
    password: '',
    confirmPassword: '',
    company: '', // for employer
    college: '', // for college
    bio: '', // for content writer
  })

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData({ ...loginData, [name]: value })
    setError('') // Clear error when user types
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData({ ...registerData, [name]: value })
    setError('') // Clear error when user types
  }


  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Execute CAPTCHA
      let captchaToken = null
      try {
        captchaToken = await executeCaptcha('login')
      } catch (captchaError) {
        console.warn('CAPTCHA error:', captchaError)
        // Continue without CAPTCHA if it fails (for development)
      }
      
      // Map 'content' to 'content_writer' for backend
      const backendRole = activeTab === 'content' ? 'content_writer' : activeTab
      
      // Note: We no longer clear all sessions - each role maintains its own session
      
      const response = await authAPI.login({
        email: loginData.email,
        password: loginData.password,
        role: backendRole, // Include the selected role tab
        captchaToken, // Include CAPTCHA token
      })

      if (response.success) {
        const role = response.user.role
        
        // Verify that the logged-in user's role matches the selected tab
        // Map 'content' to 'content_writer' for comparison
        const expectedRole = activeTab === 'content' ? 'content_writer' : activeTab
        if (role !== expectedRole) {
          const mismatchMessage = `You logged in as ${role}, but you selected ${activeTab}. Please select the correct role tab.`
          setError(mismatchMessage)
          toast.warning(mismatchMessage)
          setIsLoading(false)
          return
        }
        
        // Use AuthContext login function to store token and user data
        login(response.token, response.user)
        
        // Show success message
        toast.success(`Welcome back! ${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`)

        const redirectAfterLogin = () => {
          // Check for redirect parameter in URL
          const hash = window.location.hash || ''
          const search = window.location.search || ''
          let redirectUrl = null
          
          // Try to get redirect from hash query params first
          if (hash && hash.includes('?')) {
            try {
              const hashParts = hash.split('?')
              if (hashParts.length > 1) {
                const hashParams = new URLSearchParams(hashParts[1])
                redirectUrl = hashParams.get('redirect')
              }
            } catch (e) {
              console.error('Error parsing redirect from hash:', e)
            }
          }
          
          // Fallback to regular query params
          if (!redirectUrl && search) {
            try {
              const urlParams = new URLSearchParams(search)
              redirectUrl = urlParams.get('redirect')
            } catch (e) {
              console.error('Error parsing redirect from search:', e)
            }
          }
          
          // If redirect URL exists and is valid, use it
          if (redirectUrl) {
            try {
              const decodedUrl = decodeURIComponent(redirectUrl)
              // Validate it's a relative URL (security check)
              if (decodedUrl.startsWith('#/') || decodedUrl.startsWith('/')) {
                window.location.href = decodedUrl
                return
              }
            } catch (e) {
              console.error('Error decoding redirect URL:', e)
            }
          }
          
          // Default redirect based on role
          if (role === 'student') {
            window.location.hash = '#/dashboard/student'
          } else if (role === 'employer') {
            window.location.hash = '#/dashboard/employer'
          } else if (role === 'college') {
            window.location.hash = '#/dashboard/college'
          } else if (role === 'admin') {
            window.location.hash = '#/admin/courses'
          } else if (role === 'content_writer') {
            window.location.hash = '#/dashboard/content'
          } else {
            window.location.hash = '#/'
          }
        }

        // Give toast a moment to display before navigating
        setTimeout(redirectAfterLogin, 600)
        
        setLoginData({ email: '', password: '' })
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.message || 'Login failed. Please try again.'
      
      // Check for specific error cases
      if (errorMessage.includes('No') && errorMessage.includes('account found')) {
        // Email exists but with different role
        const detailedMessage = errorMessage + ' Try logging in with a different role tab.'
        setError(detailedMessage)
        toast.error(detailedMessage)
      } else if (errorMessage.includes('Invalid credentials')) {
        const invalidMessage = 'Invalid email or password. Please check your credentials.'
        setError(invalidMessage)
        toast.error(invalidMessage)
      } else if (errorMessage.includes('not found')) {
        const notFoundMessage = `No ${activeTab} account found. Please register first to create an account.`
        setError(notFoundMessage)
        toast.error(notFoundMessage)
      } else {
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      const mismatch = 'Passwords do not match!'
      setError(mismatch)
      toast.error(mismatch)
      return
    }

    // Validate password length
    if (registerData.password.length < 8) {
      const shortPassword = 'Password must be at least 8 characters long'
      setError(shortPassword)
      toast.error(shortPassword)
      return
    }

    setIsLoading(true)

    try {
      // Execute CAPTCHA
      let captchaToken = null
      try {
        captchaToken = await executeCaptcha('register')
      } catch (captchaError) {
        console.warn('CAPTCHA error:', captchaError)
        // Continue without CAPTCHA if it fails (for development)
      }
      
      // Prepare registration data based on role
      // Note: We no longer clear all sessions - each role maintains its own session
      // Map 'content' to 'content_writer' for backend
      let backendRole = activeTab
      if (activeTab === 'content') {
        backendRole = 'content_writer'
      } else if (activeTab === 'student') {
        backendRole = 'student'
      } else if (activeTab === 'employer') {
        backendRole = 'employer'
      } else if (activeTab === 'admin') {
        backendRole = 'admin'
      } else {
        backendRole = 'college'
      }
      
      const registrationPayload = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        role: backendRole,
        captchaToken, // Include CAPTCHA token
      }

      // Add role-specific data
      if (activeTab === 'employer') {
        registrationPayload.companyName = registerData.company
      } else if (activeTab === 'college') {
        registrationPayload.collegeName = registerData.college
      } else if (activeTab === 'student') {
        registrationPayload.collegeName = registerData.college || ''
      } else if (activeTab === 'content') {
        registrationPayload.bio = registerData.bio || ''
      }

      const response = await authAPI.register(registrationPayload)

      if (response.success) {
        // Use AuthContext login function to store token and user data
        login(response.token, response.user)
        
        const role = response.user.role
        const isApproved = role === 'student' || role === 'admin' || 
          (response.user.isActive === true && 
           (response.user.isVerified === true || 
            (role === 'employer' && response.user.employerDetails?.adminApprovalStatus === 'approved') ||
            (role === 'college' && response.user.collegeDetails?.adminApprovalStatus === 'approved')))
        
        if (isApproved) {
          toast.success(`Congratulations! Your ${activeTab} account has been created successfully.`)
        } else {
          toast.success(`Your ${activeTab} account has been created successfully.`)
          toast.info('Your account is pending admin approval. You will be notified once approved.')
        }

        const redirectAfterRegister = () => {
          // Check for redirect parameter in URL
          const hash = window.location.hash || ''
          const search = window.location.search || ''
          let redirectUrl = null
          
          // Try to get redirect from hash query params first
          if (hash && hash.includes('?')) {
            try {
              const hashParts = hash.split('?')
              if (hashParts.length > 1) {
                const hashParams = new URLSearchParams(hashParts[1])
                redirectUrl = hashParams.get('redirect')
              }
            } catch (e) {
              console.error('Error parsing redirect from hash:', e)
            }
          }
          
          // Fallback to regular query params
          if (!redirectUrl && search) {
            try {
              const urlParams = new URLSearchParams(search)
              redirectUrl = urlParams.get('redirect')
            } catch (e) {
              console.error('Error parsing redirect from search:', e)
            }
          }
          
          // If redirect URL exists and is valid, use it
          if (redirectUrl) {
            try {
              const decodedUrl = decodeURIComponent(redirectUrl)
              // Validate it's a relative URL (security check)
              if (decodedUrl.startsWith('#/') || decodedUrl.startsWith('/')) {
                window.location.href = decodedUrl
                return
              }
            } catch (e) {
              console.error('Error decoding redirect URL:', e)
            }
          }
          
          // Default redirect based on role and approval status
          // If not approved, redirect to home page
          if (!isApproved) {
            window.location.hash = '#/'
          } else if (role === 'student') {
            window.location.hash = '#/dashboard/student'
          } else if (role === 'employer') {
            window.location.hash = '#/dashboard/employer'
          } else if (role === 'college') {
            window.location.hash = '#/dashboard/college'
          } else if (role === 'admin') {
            window.location.hash = '#/admin/courses'
          } else if (role === 'content_writer') {
            window.location.hash = '#/dashboard/content'
          } else {
            window.location.hash = '#/'
          }
        }

        setTimeout(redirectAfterRegister, 600)
        
        setRegisterData({
          name: '',
          email: '',
          phone: '+91',
          password: '',
          confirmPassword: '',
          company: '',
          college: '',
          bio: '',
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.message || 'Registration failed. Please try again.'
      
      // Check if user already exists with same role
      if (errorMessage.includes('already exists') && errorMessage.includes(activeTab)) {
        const existsMessage = `An account with this email already exists as ${activeTab}. Please login instead.`
        setError(existsMessage)
        toast.error(existsMessage)
      } else if (errorMessage.includes('already exists') || errorMessage.includes('User already')) {
        const existsMessage = `An account with this email already exists as ${activeTab}. Please login instead.`
        setError(existsMessage)
        toast.error(existsMessage)
      } else {
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot password handler
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate email
      if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
        setError('Please enter a valid email address')
        toast.error('Please enter a valid email address')
        setIsLoading(false)
        return
      }

      const response = await authAPI.forgotPassword(forgotPasswordEmail)
      
      if (response.success) {
        toast.success(response.message || 'If an account with that email exists, a password reset link has been sent.')
        setForgotPasswordEmail('')
        setShowForgotPassword(false)
        setIsLogin(true)
        setError('')
      } else {
        const errorMessage = response.message || 'Failed to send password reset email. Please try again.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      let errorMessage = 'Failed to send password reset email. Please try again.'
      
      // Handle specific error cases
      if (error.status === 404 || (error.message && error.message.includes('Route not found'))) {
        errorMessage = 'Password reset service is not available. Please ensure the server is running and try again.'
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (error.status === 0 || (error.message && error.message.includes('Failed to fetch'))) {
        errorMessage = 'Unable to connect to server. Please check your internet connection and ensure the server is running on port 5000.'
      } else if (error.message && !error.message.includes('Route not found')) {
        errorMessage = error.message
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password handler
  const [resetPasswordData, setResetPasswordData] = useState({
    password: '',
    confirmPassword: ''
  })
  
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      setError('Passwords do not match!')
      toast.error('Passwords do not match!')
      return
    }

    if (resetPasswordData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      toast.error('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await authAPI.resetPassword(resetToken, resetPasswordData.password)
      
      if (response.success) {
        toast.success('Password reset successful! Logging you in...')
        
        // Login the user with the new token
        if (response.token && response.user) {
          login(response.token, response.user)
          
          // Redirect to appropriate dashboard
          setTimeout(() => {
            const role = response.user.role
            const redirectMap = {
              student: '#/dashboard/student',
              employer: '#/dashboard/employer',
              college: '#/dashboard/college',
              admin: '#/admin',
              content_writer: '#/dashboard/content'
            }
            window.location.hash = redirectMap[role] || '#/'
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error.message || 'Failed to reset password. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'student':
        return 'Student'
      case 'employer':
        return 'Employer'
      case 'college':
        return 'College'
      case 'admin':
        return 'Admin'
      case 'content':
        return 'Content'
      default:
        return ''
    }
  }

  // Check if we should show tabs (only show when not on student/login/admin/content login)
  // Hide tabs for content and admin login (hidden logins)
  const showTabs = activeTab !== 'student' && activeTab !== 'content' && activeTab !== 'admin'
  // Show Student tab only when not on employer/college/admin/content login
  const showStudentTab = activeTab === 'student'

  // Ensure activeTab is always valid
  const validActiveTab = ['employer', 'college', 'admin', 'content', 'student'].includes(activeTab) 
    ? activeTab 
    : 'student'

  return (
    <main className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-br from-primary-50 to-primary-100 transform skew-x-12 origin-top-right"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-300 rounded-full blur-2xl opacity-10"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Left Side - Branding */}
            <div className="hidden lg:flex flex-col justify-center bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h1 className="text-4xl font-bold mb-3 leading-tight">
                    {isLogin ? 'Welcome Back!' : 'Join KiwisEdutech'}
                  </h1>
                  <p className="text-primary-100 text-lg">
                    {isLogin ? 'Continue your learning journey' : 'Start your path to success today'}
                  </p>
                </div>

                <div className="space-y-4 mt-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-primary-50">Expert-led courses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-primary-50">Industry certifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-primary-50">Career opportunities</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8 sm:p-12">
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                {validActiveTab === 'content' && (
                  <div className="mb-4 px-4 py-2 bg-primary-100 border border-primary-300 rounded-lg">
                    <p className="text-sm font-semibold text-primary-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Content Writer Login
                    </p>
                  </div>
                )}
                {validActiveTab === 'admin' && (
                  <div className="mb-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Login
                    </p>
                  </div>
                )}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-xl mb-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {isLogin ? 'Welcome back!' : 'Get started today'}
                </p>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                {validActiveTab === 'content' && (
                  <div className="mb-4 px-4 py-2 bg-primary-100 border border-primary-300 rounded-lg">
                    <p className="text-sm font-semibold text-primary-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Content Writer Login
                    </p>
                  </div>
                )}
                {validActiveTab === 'admin' && (
                  <div className="mb-4 px-4 py-2 bg-red-100 border border-red-300 rounded-lg">
                    <p className="text-sm font-semibold text-red-800 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Admin Login
                    </p>
                  </div>
                )}
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {isLogin ? 'Enter your credentials to continue' : 'Fill in your details to get started'}
                </p>
              </div>
              {/* Tab Buttons */}
              {showTabs && (
                <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                  {showStudentTab && (
                  <button
                    onClick={() => {
                      setActiveTab('student')
                      setError('')
                      window.location.hash = '#/auth?tab=student'
                    }}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                        activeTab === 'student'
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'text-gray-600 hover:bg-white'
                      }`}
                    >
                      Student
                    </button>
                  )}
                  {activeTab === 'employer' ? (
                    <button
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 text-white shadow-md"
                      disabled
                    >
                      Employer
                    </button>
                  ) : activeTab === 'college' ? (
                    <button
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-primary-600 text-white shadow-md"
                      disabled
                    >
                      College
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setActiveTab('employer')
                          setError('')
                          window.location.hash = '#/auth?tab=employer'
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === 'employer'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                      >
                        Employer
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('college')
                          setError('')
                          window.location.hash = '#/auth?tab=college'
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === 'college'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                      >
                        College
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('admin')
                          setError('')
                          window.location.hash = '#/auth?tab=admin'
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          activeTab === 'admin'
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-white'
                        }`}
                      >
                        Admin
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Login/Register Toggle - Hide for forgot/reset password */}
              {!showForgotPassword && activeTab !== 'reset' && (
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                  }}
                  className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isLogin
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                  }}
                  className={`flex-1 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    !isLogin
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  Register
                </button>
              </div>
              )}


              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border-l-4 border-red-500">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                      {!showForgotPassword && activeTab !== 'reset' && (
                        <>
                          {error.includes('not found') || error.includes('register') ? (
                            <button
                              onClick={() => setIsLogin(false)}
                              className="mt-2 text-sm text-red-700 hover:text-red-800 underline font-medium"
                            >
                              Click here to register
                            </button>
                          ) : error.includes('already exists') || error.includes('login') ? (
                            <button
                              onClick={() => setIsLogin(true)}
                              className="mt-2 text-sm text-red-700 hover:text-red-800 underline font-medium"
                            >
                              Click here to login
                            </button>
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reset Password Form */}
              {activeTab === 'reset' ? (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Enter your new password below. Make sure it's at least 8 characters long and contains uppercase, lowercase, and a number.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="resetPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="resetPassword"
                      name="password"
                      value={resetPasswordData.password}
                      onChange={(e) => setResetPasswordData({ ...resetPasswordData, password: e.target.value })}
                      required
                      minLength={8}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="Enter new password"
                    />
                  </div>

                  <div>
                    <label htmlFor="resetConfirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="resetConfirmPassword"
                      name="confirmPassword"
                      value={resetPasswordData.confirmPassword}
                      onChange={(e) => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-xl bg-primary-600 px-6 py-3.5 text-white text-base font-semibold transition-all shadow-lg hover:bg-primary-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-2 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting password...
                      </span>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('student')
                        setIsLogin(true)
                        setResetToken('')
                        window.location.hash = '#/auth?tab=student'
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : showForgotPassword ? (
                /* Forgot Password Form */
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="forgotEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="forgotEmail"
                      name="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-xl bg-primary-600 px-6 py-3.5 text-white text-base font-semibold transition-all shadow-lg hover:bg-primary-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-2 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending reset link...
                      </span>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                  
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setIsLogin(true)
                        setForgotPasswordEmail('')
                        setError('')
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : isLogin ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="loginEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="loginEmail"
                      name="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder={`${activeTab}@example.com`}
                    />
                  </div>

                  <div>
                    <label htmlFor="loginPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="loginPassword"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="mr-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                      <span className="text-sm text-gray-600">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true)
                        setIsLogin(false)
                        setError('')
                      }}
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-xl bg-primary-600 px-6 py-3.5 text-white text-base font-semibold transition-all shadow-lg hover:bg-primary-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-2 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </span>
                    ) : (
                      `Sign in as ${getTabLabel(activeTab)}`
                    )}
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="registerName" className="block text-sm font-semibold text-gray-700 mb-2">
                      {activeTab === 'student' ? 'Full Name' : activeTab === 'employer' ? 'Contact Person Name' : activeTab === 'admin' ? 'Admin Name' : activeTab === 'content' ? 'Content Writer Name' : 'College/Contact Name'}
                    </label>
                    <input
                      type="text"
                      id="registerName"
                      name="name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  {activeTab === 'employer' && (
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={registerData.company}
                        onChange={handleRegisterChange}
                        required
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        placeholder="Your company name"
                      />
                    </div>
                  )}

                  {activeTab === 'college' && (
                    <div>
                      <label htmlFor="college" className="block text-sm font-semibold text-gray-700 mb-2">
                        College Name
                      </label>
                      <input
                        type="text"
                        id="college"
                        name="college"
                        value={registerData.college}
                        onChange={handleRegisterChange}
                        required
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        placeholder="Your college name"
                      />
                    </div>
                  )}

                  {activeTab === 'content' && (
                    <div>
                      <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio (Optional)
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={registerData.bio || ''}
                        onChange={handleRegisterChange}
                        rows="3"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="registerEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="registerEmail"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div>
                    <label htmlFor="registerPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="registerPassword"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      minLength={8}
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="Minimum 8 characters"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                      placeholder="Re-enter your password"
                    />
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 mr-3 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <a href="#/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                        Terms & Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full rounded-xl bg-primary-600 px-6 py-3.5 text-white text-base font-semibold transition-all shadow-lg hover:bg-primary-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] mt-2 ${
                      isLoading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      `Create ${getTabLabel(activeTab)} Account`
                    )}
                  </button>
                </form>
              )}

              {/* Additional Links */}
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-primary-600 hover:text-primary-700 font-semibold"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

