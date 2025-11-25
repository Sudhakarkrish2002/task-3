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
    if (role === 'admin') return '#/admin'
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
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 xl:px-6 2xl:px-8 3xl:px-12">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo - Left Side */}
          <a href="#/" className="flex items-center gap-1.5 xl:gap-2 shrink-0">
            <img
              src="/Assets/kiwisedutech_logo.jpeg"
              alt="KiwisEdutech Logo"
              className="h-10 sm:h-12 xl:h-12 2xl:h-14 w-auto object-contain shrink-0"
            />
            <span className="text-lg sm:text-xl xl:text-xl 2xl:text-2xl font-semibold text-gray-900 whitespace-nowrap">
              KiwisEdutech
            </span>
          </a>

          {/* Navigation - Right Side */}
          <nav
            className="hidden xl:flex items-center gap-1.5 xl:gap-2 2xl:gap-3 3xl:gap-4 shrink-0"
            ref={desktopNavRef}
          >
            {/* Search Link */}
            <a
              href="#/search"
              className="p-1.5 xl:p-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-gray-100 transition-colors shrink-0"
              title="Search"
            >
              <svg className="w-5 h-5 xl:w-5 2xl:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="text-xs xl:text-sm 2xl:text-base font-medium text-gray-700 hover:text-primary-700 transition-all duration-300 ease-in-out relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-full cursor-pointer inline-flex items-center gap-1 whitespace-nowrap px-1 xl:px-1.5 shrink-0"
                    onClick={() => toggleDesktopDropdown(item.hash)}
                    onMouseEnter={() => setOpenDesktopDropdown(item.hash)}
                    onFocus={() => setOpenDesktopDropdown(item.hash)}
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    <svg className="w-3 h-3 xl:w-3.5 2xl:w-4 text-gray-500 group-hover:text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="text-xs xl:text-sm 2xl:text-base font-medium text-gray-700 hover:text-primary-700 transition-all duration-300 ease-in-out relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-600 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap px-1 xl:px-1.5 shrink-0"
                >
                  {item.label}
                </a>
              )
            )}
            
            {/* Admin Menu (only show when admin is logged in and on dashboard pages) */}
            {isAdmin && shouldShowAuthButtons() && (
              <div className="relative group shrink-0">
                <a
                  href="#/admin"
                  className="inline-flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg whitespace-nowrap"
                >
                  <svg className="w-4 h-4 xl:w-4 2xl:w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="hidden lg:inline">Admin</span>
                </a>
              </div>
            )}
            
            {/* Dashboard link (only show for students on public pages, or any role on their dashboard) */}
            {!isAdmin && shouldShowAuthButtons() && (
              <a
                href={getDashboardLink()}
                className="inline-flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 transition-all duration-300 ease-in-out shadow-md hover:shadow-lg shrink-0 whitespace-nowrap"
              >
                <svg className="w-4 h-4 xl:w-4 2xl:w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden lg:inline">Dashboard</span>
                <span className="lg:hidden">Dash</span>
              </a>
            )}
            
            {/* Logout button (only show for students on public pages, or any role on their dashboard) */}
            {shouldShowAuthButtons() && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 xl:gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 xl:py-2 rounded-lg text-xs xl:text-sm font-semibold text-gray-700 hover:text-red-600 border border-gray-300 hover:border-red-300 transition-all duration-300 ease-in-out shrink-0 whitespace-nowrap"
              >
                <svg className="w-4 h-4 xl:w-4 2xl:w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden lg:inline">Logout</span>
                <span className="lg:hidden">Out</span>
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
            >
              <a
                href="#/search"
                className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium mb-2 border-b border-gray-200 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
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
                    <>
                      <a
                        href="#/admin"
                        className="rounded px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 mb-2 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Admin Dashboard
                      </a>
                      <a
                        href="#/admin/students"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-1 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Students
                      </a>
                      <a
                        href="#/admin/employers"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-1 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Employers
                      </a>
                      <a
                        href="#/admin/colleges"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-1 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        Colleges
                      </a>
                      <a
                        href="#/admin/courses"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-1 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Courses
                      </a>
                      <a
                        href="#/admin/blogs"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-1 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Blogs
                      </a>
                      <a
                        href="#/admin/submissions"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-1 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Submissions
                      </a>
                      <a
                        href="#/admin/internships"
                        className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 mb-2 flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Internships
                      </a>
                    </>
                  )}
                  {!isAdmin && (
                    <a
                      href={getDashboardLink()}
                      className="rounded px-3 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 mb-2 flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Dashboard
                    </a>
                  )}
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="rounded px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-red-50 text-left flex items-center gap-2 w-full"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
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
