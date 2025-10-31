import React from 'react'

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
  { label: 'Login / Sign Up', hash: '#/auth' },
]

// Flatten menu for mobile
const flatMenuItems = mainMenuItems.flatMap((item) =>
  item.submenu
    ? [{ label: item.label, hash: item.hash }, ...item.submenu]
    : [item]
)

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#/" className="flex items-center gap-2">
            <img
              src="/Asserts/Kiwistron-logo.jpeg"
              alt="Kiwistron Edutech Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-lg font-semibold text-gray-900">Kiwistron Edutech</span>
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
                    className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a
                      href={item.hash}
                      className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      {item.label}
                    </a>
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.hash}
                        href={subItem.hash}
                        className="rounded px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 pl-6"
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
                  className="text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
                >
                  {item.label}
                </a>
              )
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
            <details className="relative">
              <summary className="list-none p-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer">
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-72 rounded-md border border-gray-200 bg-white shadow-lg p-2 flex flex-col">
                <a
                  href="#/search"
                  className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 font-medium mb-2 border-b border-gray-200"
                >
                  🔍 Search
                </a>
                {flatMenuItems.map((item) => (
                  <a
                    key={item.hash}
                    href={item.hash}
                    className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  )
}


