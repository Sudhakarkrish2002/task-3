import React, { useState, useEffect, useRef } from 'react'

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

export default function Navbar({ bannerVisible = false, bannerHeight = 0, navHeight = 80 }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDesktopDropdown, setOpenDesktopDropdown] = useState(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuButtonRef = useRef(null)
  const desktopNavRef = useRef(null)

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

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    if (!openDesktopDropdown) return

    const handleClickOutside = (event) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target)) {
        setOpenDesktopDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [openDesktopDropdown])

  const toggleDesktopDropdown = (hash) => {
    setOpenDesktopDropdown((prev) => (prev === hash ? null : hash))
  }

  const getDashboardLink = () => {
    if (!user) return '#/auth'
    const role = user.role
    if (role === 'student') return '#/dashboard/student'
    if (role === 'employer') return '#/dashboard/employer'
    if (role === 'college') return '#/dashboard/college'
    if (role === 'admin') return '#/admin/courses'
    if (role === 'content_writer') return '#/dashboard/content'
    return '#/auth'
  }

  const isAdmin = user && user.role === 'admin'
  
  // Check if we should show Dashboard/Logout buttons
  // Only show on public pages for students, or on dashboard pages for any role
  const shouldShowAuthButtons = () => {
    if (!isLoggedIn || !user) return false
    
    const currentHash = window.location.hash || '#/'
    const isOnDashboardPage = currentHash.includes('/dashboard/') || currentHash.includes('/admin/')
    
    // If on dashboard page, show buttons for that role
    if (isOnDashboardPage) {
      return true
    }
    
    // On public pages, only show for students
    return user.role === 'student'
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    window.location.hash = '#/'
  }

  return (
    <header
      className="fixed left-0 right-0 z-50 bg-white border-b border-primary-200 shadow-sm shadow-primary-100/20"
      style={{ top: bannerVisible ? `${bannerHeight}px` : '0' }}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          <a href="#/" className="flex items-center gap-2">
            <img
              src="/Assets/kiwisedutech_logo.jpeg"
              alt="KiwisEdutech Logo"
              className="h-10 sm:h-12 xl:h-14 w-auto object-contain"
            />
            <span className="text-xl sm:text-2xl font-semibold text-gray-900">
              KiwisEdutech
            </span>
          </a>

          <nav
            className="hidden xl:flex items-center gap-4 2xl:gap-6"
            ref={desktopNavRef}
          >
            {/* Search Link */}
            <a
              href="#/search"
              className="p-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-gray-100 transition-colors"
              title="Search"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            {mainMenuItems
              .filter(item => {
                // Hide "Student Login" link only when Dashboard/Logout buttons are showing
                if (shouldShowAuthButtons() && item.label === 'Student Login') {
                  return false
                }
                return true
              })
              .map((item) =>
              item.submenu ? (
                <div key={item.hash} className="relative group">
                  <button
                    type="button"
                    className="text-sm 2xl:text-base font-medium text-gray-700 hover:text-primary-700 transition-all duration-300 ease-in-out relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-full cursor-pointer inline-flex items-center gap-2"
                    onClick={() => toggleDesktopDropdown(item.hash)}
                    onMouseEnter={() => setOpenDesktopDropdown(item.hash)}
                    onFocus={() => setOpenDesktopDropdown(item.hash)}
                  >
                    {item.label}
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    className={`pointer-events-none lg:pointer-events-auto lg:absolute lg:top-full lg:left-0 lg:mt-2 lg:w-64 lg:rounded-md lg:border lg:border-gray-200 lg:bg-white lg:shadow-lg lg:p-2 lg:flex lg:flex-col transition-all duration-200 z-60 ${
                      openDesktopDropdown === item.hash
                        ? 'opacity-100 visible pointer-events-auto'
                        : 'opacity-0 invisible'
                    }`}
                    onMouseLeave={() => setOpenDesktopDropdown(null)}
                  >
                    <a
                    href={item.hash}
                    className="hidden lg:block rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium relative overflow-hidden after:absolute after:bottom-1 after:left-3 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
                      onClick={() => setOpenDesktopDropdown(null)}
                    >
                      {item.label}
                    </a>
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.hash}
                        href={subItem.hash}
                        className="hidden lg:block rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 pl-6 relative overflow-hidden after:absolute after:bottom-1 after:left-6 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-[calc(100%-1.5rem)]"
                        onClick={() => setOpenDesktopDropdown(null)}
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
                  className="text-sm 2xl:text-base font-medium text-gray-700 hover:text-primary-700 transition-all duration-300 ease-in-out relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </a>
              )
            )}
            
            {/* Admin Menu (only show when admin is logged in and on dashboard pages) */}
            {isAdmin && shouldShowAuthButtons() && (
              <div className="relative group">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-2xl hover:shadow-primary-600/60"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin
                </button>
                <div className="absolute top-full right-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-60">
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
            
            {/* Dashboard link (only show for students on public pages, or any role on their dashboard) */}
            {!isAdmin && shouldShowAuthButtons() && (
              <a
                href={getDashboardLink()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm 2xl:text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-2xl hover:shadow-primary-600/60"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Dashboard
              </a>
            )}
            
            {/* Logout button (only show for students on public pages, or any role on their dashboard) */}
            {shouldShowAuthButtons() && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm 2xl:text-base font-semibold text-gray-700 hover:text-red-600 border border-gray-300 hover:border-red-300 transition-all duration-300 ease-in-out"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            )}
          </nav>

          <div className="xl:hidden flex items-center gap-2">
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
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              ref={mobileMenuButtonRef}
              className="ml-1 p-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-50 hover:border-gray-500 text-base font-semibold cursor-pointer"
            >
              Menu
            </button>

            {/* Overlay Backdrop - closes menu when clicked */}
            {isMobileMenuOpen && (
              <div
                className="fixed left-0 right-0 bottom-0 bg-transparent z-40"
                style={{ top: `${bannerHeight + navHeight}px` }}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Mobile Menu */}
            <div
              ref={mobileMenuRef}
              className={`fixed right-4 w-64 sm:w-72 md:w-80 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col z-60 transform transition-all duration-300 ease-out ${
                isMobileMenuOpen
                  ? 'translate-x-0 opacity-100 visible pointer-events-auto'
                  : 'translate-x-full opacity-0 invisible pointer-events-none'
              }`}
              style={{ top: `${bannerHeight + navHeight}px` }}
              onClick={(e) => e.stopPropagation()}
              aria-hidden={!isMobileMenuOpen}
            >
              <a
                href="#/search"
                className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium mb-2 border-b border-gray-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                🔍 Search
              </a>
              {flatMenuItems
                .filter(item => {
                  // Hide "Student Login" link only when Dashboard/Logout buttons are showing
                  if (shouldShowAuthButtons() && item.label === 'Student Login') {
                    return false
                  }
                  return true
                })
                .map((item) => (
                  <a
                    key={item.hash}
                    href={item.hash}
                    className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
              {shouldShowAuthButtons() && (
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
          </div>
        </div>
      </div>
    </header>
  )
}
