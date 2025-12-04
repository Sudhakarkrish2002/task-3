import React, { useState, useEffect } from 'react'
import {
  DashboardIcon,
  UsersIcon,
  SchoolIcon,
  BookIcon,
  UploadIcon,
  BriefcaseIcon,
  PhoneIcon,
} from './Icons.jsx'

const menuItems = [
  { label: 'Dashboard', hash: '#/admin', Icon: DashboardIcon },
  { label: 'Students', hash: '#/admin/students', Icon: UsersIcon },
  { label: 'Colleges', hash: '#/admin/colleges', Icon: SchoolIcon },
  { label: 'Courses', hash: '#/admin/courses', Icon: BookIcon },
  { label: 'Submissions', hash: '#/admin/submissions', Icon: UploadIcon },
  { label: 'Internships', hash: '#/admin/internships', Icon: BriefcaseIcon },
  { label: 'Consultations', hash: '#/admin/consultations', Icon: PhoneIcon },
]

export default function AdminSidebar() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#/admin')
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/admin')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const isActive = (hash) => {
    if (hash === '#/admin') {
      return currentHash === '#/admin'
    }
    return currentHash.startsWith(hash)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-24 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-20 bg-gray-900 text-white overflow-y-auto transition-transform duration-300 ease-in-out z-50 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ width: '16rem', height: 'calc(100vh - 5rem)' }}
      >
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.Icon
              const active = isActive(item.hash)
              return (
                <a
                  key={item.hash}
                  href={item.hash}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span className="font-medium text-sm">{item.label}</span>
                </a>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}

