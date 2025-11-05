import React, { useState, useEffect } from 'react'

const mainMenuItems = [
  { label: 'Home', hash: '#/' },
  {
    label: 'Courses / Program',
    hash: '#/courses',
    submenu: [
      { label: 'Certification Courses', hash: '#/courses/certifications' },
      { label: 'Placement-Guaranteed Courses', hash: '#/courses/placement' },
      { label: 'Workshops', hash: '#/courses/workshops' },
    ],
  },
  { label: 'Internships', hash: '#/internships' },
  { label: 'Direct Hiring / Employers', hash: '#/employers' },
  { label: 'Student Login', hash: '#/auth?tab=student' },
]

// Flatten menu for mobile
const flatMenuItems = mainMenuItems.flatMap((item) =>
  item.submenu
    ? [{ label: item.label, hash: item.hash }, ...item.submenu]
    : [item]
)

export default function Navbar({ bannerVisible = false }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      if (token && userData) {
        setIsLoggedIn(true)
        setUser(JSON.parse(userData))
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkAuth()
    // Check auth on hash change (when user logs in/out)
    const handleHashChange = () => {
      checkAuth()
      setIsMobileMenuOpen(false) // Close menu on navigation
    }
    window.addEventListener('hashchange', handleHashChange)
    
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const getDashboardLink = () => {
    if (!user) return '#/auth'
    const role = user.role
    if (role === 'student') return '#/dashboard/student'
    if (role === 'employer') return '#/dashboard/employer'
    if (role === 'college') return '#/dashboard/college'
    if (role === 'admin') return '#/admin/courses'
    return '#/auth'
  }

  const isAdmin = user && user.role === 'admin'

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    window.location.hash = '#/'
  }

  return (
    <header 
      className="fixed left-0 right-0 z-100 bg-white border-b border-primary-200 shadow-sm shadow-primary-100/20"
      style={{ top: bannerVisible ? '48px' : '0' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#/" className="flex items-center gap-2">
            <img
              src="/Assets/kiwisedutech_logo.jpeg"
              alt="KiwisEdutech Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-lg font-semibold text-gray-900">KiwisEdutech</span>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {/* Search Link */}
            <a
              href="#/search"
              className="p-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-gray-100 transition-colors"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            {mainMenuItems.map((item) =>
              item.submenu ? (
                <div key={item.hash} className="relative group">
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-all duration-300 ease-in-out relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
                  >
                    {item.label}
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a
                      href={item.hash}
                      className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium relative overflow-hidden after:absolute after:bottom-1 after:left-3 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
                    >
                      {item.label}
                    </a>
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.hash}
                        href={subItem.hash}
                        className="rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 pl-6 relative overflow-hidden after:absolute after:bottom-1 after:left-6 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a
                  key={item.hash}
                  href={item.hash}
                  className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-all duration-300 ease-in-out relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </a>
              )
            )}
            
            {/* Admin Menu (only show when admin is logged in) */}
            {isAdmin && (
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-2xl hover:shadow-primary-600/60"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </button>
                <div className="absolute top-full right-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a
                    href="#/admin/courses"
                    className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium relative overflow-hidden after:absolute after:bottom-1 after:left-3 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Manage Course Syllabuses
                    </div>
                  </a>
                </div>
              </div>
            )}
            
            {/* Dashboard link (only show when logged in and not admin) */}
            {isLoggedIn && !isAdmin && (
              <a
                href={getDashboardLink()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-2xl hover:shadow-primary-600/60"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dashboard
              </a>
            )}
            
            {/* Logout button (only show when logged in) */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:text-red-600 border border-gray-300 hover:border-red-300 transition-all duration-300 ease-in-out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            {/* Mobile Search Link */}
            <a
              href="#/search"
              className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Menu
            </button>

            {/* Overlay Backdrop - closes menu when clicked */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 bg-transparent z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div
                className={`fixed right-4 w-72 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col z-50`}
                style={{ top: bannerVisible ? '112px' : '64px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href="#/search"
                  className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium mb-2 border-b border-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  🔍 Search
                </a>
                {flatMenuItems.map((item) => (
                  <a
                    key={item.hash}
                    href={item.hash}
                    className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                {isLoggedIn && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    {isAdmin && (
                      <a
                        href="#/admin/courses"
                        className="rounded px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 mb-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        ⚙️ Manage Course Syllabuses
                      </a>
                    )}
                    {!isAdmin && (
                      <a
                        href={getDashboardLink()}
                        className="rounded px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 mb-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        📊 Dashboard
                      </a>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="rounded px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-red-50 text-left"
                    >
                      🚪 Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
