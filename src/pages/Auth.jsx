import React, { useState } from 'react'

export default function Auth() {
  const [activeTab, setActiveTab] = useState('student') // student, employer, college
  const [isLogin, setIsLogin] = useState(true)

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
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData({ ...registerData, [name]: value })
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    alert(`Welcome back! ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} login successful.`)
    setLoginData({ email: '', password: '' })
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    alert(`Congratulations! Your ${activeTab} account has been created successfully. Check your email for verification.`)
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

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'student':
        return 'Student'
      case 'employer':
        return 'Employer'
      case 'college':
        return 'College'
      default:
        return ''
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Login or Create Your Account
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Access your account or create a new one to get started
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
          {/* Tab Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 border-b border-gray-200 pb-4">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'student'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Student Login
            </button>
            <button
              onClick={() => setActiveTab('employer')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'employer'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Employer Login
            </button>
            <button
              onClick={() => setActiveTab('college')}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-colors ${
                activeTab === 'college'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              College Login
            </button>
          </div>

          {/* Login/Register Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${
                isLogin
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold transition-colors ${
                !isLogin
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Register as {getTabLabel(activeTab)}
            </button>
          </div>

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
                  className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold hover:bg-primary-700 transition-colors mt-6"
                >
                  Login as {getTabLabel(activeTab)}
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
                    {activeTab === 'student' ? 'Full Name' : activeTab === 'employer' ? 'Contact Person Name' : 'College/Contact Name'} *
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
                  className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold hover:bg-primary-700 transition-colors mt-6"
                >
                  Create {getTabLabel(activeTab)} Account
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

