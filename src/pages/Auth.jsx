import React, { useState, useEffect } from 'react'
import { authAPI } from '../utils/api.js'

export default function Auth() {
  // Get tab from URL parameter (supports both hash query params and regular query params)
  const getTabFromURL = () => {
    const hash = window.location.hash
    const search = window.location.search
    
    // Try to get from hash query params first (e.g., #/auth?tab=employer)
    let tab = null
    if (hash.includes('?')) {
      const hashParams = new URLSearchParams(hash.split('?')[1])
      tab = hashParams.get('tab')
    }
    
    // Fallback to regular query params
    if (!tab && search) {
      const urlParams = new URLSearchParams(search)
      tab = urlParams.get('tab')
    }
    
    return tab === 'employer' || tab === 'college' || tab === 'admin' ? tab : 'student'
  }

  const [activeTab, setActiveTab] = useState(getTabFromURL()) // student, employer, college, admin
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Update tab when URL changes
  useEffect(() => {
    const handleHashChange = () => {
      const newTab = getTabFromURL()
      if (newTab !== activeTab) {
        setActiveTab(newTab)
        setError('')
      }
    }
    // Check on mount and when URL changes
    const currentTab = getTabFromURL()
    if (currentTab !== activeTab) {
      setActiveTab(currentTab)
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [activeTab])

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: '', // for employer
    college: '', // for college
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
      const response = await authAPI.login({
        email: loginData.email,
        password: loginData.password,
        role: activeTab, // Include the selected role tab
      })

      if (response.success) {
        const role = response.user.role
        
        // Verify that the logged-in user's role matches the selected tab
        if (role !== activeTab) {
          setError(`You logged in as ${role}, but you selected ${activeTab}. Please select the correct role tab.`)
          setIsLoading(false)
          return
        }
        
        // Store token and user data
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        // Show success message
        alert(`Welcome back! ${role.charAt(0).toUpperCase() + role.slice(1)} login successful.`)
        
        // Redirect based on role
        if (role === 'student') {
          window.location.hash = '#/dashboard/student'
        } else if (role === 'employer') {
          window.location.hash = '#/dashboard/employer'
        } else if (role === 'college') {
          window.location.hash = '#/dashboard/college'
        } else if (role === 'admin') {
          window.location.hash = '#/admin/courses'
        } else {
          window.location.hash = '#/'
        }
        
        setLoginData({ email: '', password: '' })
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.message || 'Login failed. Please try again.'
      
      // Check for specific error cases
      if (errorMessage.includes('No') && errorMessage.includes('account found')) {
        // Email exists but with different role
        setError(errorMessage + ' Try logging in with a different role tab.')
      } else if (errorMessage.includes('Invalid credentials')) {
        setError('Invalid email or password. Please check your credentials.')
      } else if (errorMessage.includes('not found')) {
        setError(`No ${activeTab} account found. Please register first to create an account.`)
      } else {
        setError(errorMessage)
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
      setError('Passwords do not match!')
      return
    }

    // Validate password length
    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setIsLoading(true)

    try {
      // Prepare registration data based on role
      const registrationPayload = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        role: activeTab === 'student' ? 'student' : activeTab === 'employer' ? 'employer' : activeTab === 'admin' ? 'admin' : 'college',
      }

      // Add role-specific data
      if (activeTab === 'employer') {
        registrationPayload.companyName = registerData.company
      } else if (activeTab === 'college') {
        registrationPayload.collegeName = registerData.college
      } else if (activeTab === 'student') {
        registrationPayload.collegeName = registerData.college || ''
      }

      const response = await authAPI.register(registrationPayload)

      if (response.success) {
        // Store token and user data
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        
        alert(`Congratulations! Your ${activeTab} account has been created successfully.`)
        
        // Redirect based on role
        const role = response.user.role
        if (role === 'student') {
          window.location.hash = '#/dashboard/student'
        } else if (role === 'employer') {
          window.location.hash = '#/dashboard/employer'
        } else if (role === 'college') {
          window.location.hash = '#/dashboard/college'
        } else if (role === 'admin') {
          window.location.hash = '#/admin/courses'
        } else {
          window.location.hash = '#/'
        }
        
        setRegisterData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          company: '',
          college: '',
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.message || 'Registration failed. Please try again.'
      
      // Check if user already exists with same role
      if (errorMessage.includes('already exists') && errorMessage.includes(activeTab)) {
        setError(`An account with this email already exists as ${activeTab}. Please login instead.`)
      } else if (errorMessage.includes('already exists') || errorMessage.includes('User already')) {
        setError(`An account with this email already exists as ${activeTab}. Please login instead.`)
      } else {
        setError(errorMessage)
      }
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
      default:
        return ''
    }
  }

  // Check if we should show tabs (only show when not on student login)
  const showTabs = activeTab !== 'student'
  // Show Student tab only when not on employer/college/admin login
  const showStudentTab = activeTab === 'student'

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl pt-15 font-bold text-gray-900">
            Login or Create Your Account
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Access your account or create a new one to get started
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
          {/* Tab Buttons - Show only Employer and College when coming from footer, hide Student tab */}
          {showTabs && (
            <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
            {showStudentTab && (
              <button
                onClick={() => {
                  setActiveTab('student')
                  setError('')
                  window.location.hash = '#/auth?tab=student'
                }}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'student'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Student Login</span>
                {activeTab === 'student' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
            )}
            <button
              onClick={() => {
                setActiveTab('employer')
                setError('')
                window.location.hash = '#/auth?tab=employer'
              }}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                activeTab === 'employer'
                  ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
              }`}
            >
              <span className="relative z-10">Employer Login</span>
              {activeTab === 'employer' && (
                <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('college')
                setError('')
                window.location.hash = '#/auth?tab=college'
              }}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                activeTab === 'college'
                  ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
              }`}
            >
              <span className="relative z-10">College Login</span>
              {activeTab === 'college' && (
                <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('admin')
                setError('')
                window.location.hash = '#/auth?tab=admin'
              }}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                activeTab === 'admin'
                  ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
              }`}
            >
              <span className="relative z-10">Admin Login</span>
              {activeTab === 'admin' && (
                <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              )}
            </button>
          </div>
          )}

          {/* Login/Register Toggle */}
          <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setIsLogin(true)
                  setError('')
                }}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                  isLogin
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Login</span>
                {isLogin && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => {
                  setIsLogin(false)
                  setError('')
                }}
                className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                  !isLogin
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Register as {getTabLabel(activeTab)}</span>
                {!isLogin && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
            </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-600 mt-0.5 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm text-red-800 font-medium">{error}</p>
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
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {getTabLabel(activeTab)} Login
              </h2>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="loginEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="loginEmail"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder={`${activeTab}@example.com`}
                  />
                </div>

                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="#/forgot-password" className="text-sm text-primary-700 hover:text-primary-800">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden mt-6 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="relative z-10">
                    {isLoading ? 'Logging in...' : `Login as ${getTabLabel(activeTab)}`}
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </form>
            </div>
          ) : (
            /* Register Form */
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Register as {getTabLabel(activeTab)}
              </h2>
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="registerName" className="block text-sm font-medium text-gray-700 mb-1">
                    {activeTab === 'student' ? 'Full Name' : activeTab === 'employer' ? 'Contact Person Name' : activeTab === 'admin' ? 'Admin Name' : 'College/Contact Name'} *
                  </label>
                  <input
                    type="text"
                    id="registerName"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter your name"
                  />
                </div>

                {activeTab === 'employer' && (
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={registerData.company}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Your company name"
                    />
                  </div>
                )}

                {activeTab === 'college' && (
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                      College Name *
                    </label>
                    <input
                      type="text"
                      id="college"
                      name="college"
                      value={registerData.college}
                      onChange={handleRegisterChange}
                      required
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Your college name"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="registerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="registerEmail"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={registerData.phone}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="registerPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="registerPassword"
                    name="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Re-enter your password"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 mr-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#/terms" className="text-primary-700 hover:text-primary-800">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#/privacy" className="text-primary-700 hover:text-primary-800">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden mt-6 ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="relative z-10">
                    {isLoading ? 'Creating account...' : `Create ${getTabLabel(activeTab)} Account`}
                  </span>
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </form>
            </div>
          )}

          {/* Additional Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary-700 hover:text-primary-800 font-medium"
                  >
                    Register as {getTabLabel(activeTab)}
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary-700 hover:text-primary-800 font-medium"
                  >
                    Login here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

