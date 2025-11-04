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

export default function Navbar() {
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
    return '#/auth'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    window.location.hash = '#/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-white border-b border-primary-200 shadow-sm shadow-primary-100/20">
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
            
            {/* Dashboard link (only show when logged in) */}
            {isLoggedIn && (
              <a
                href={getDashboardLink()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg"
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
                className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div
                className="fixed top-16 right-4 w-72 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col z-50"
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
                    <a
                      href={getDashboardLink()}
                      className="rounded px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      📊 Dashboard
                    </a>
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
