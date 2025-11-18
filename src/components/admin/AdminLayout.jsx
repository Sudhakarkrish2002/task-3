import React from 'react'
import AdminSidebar from './AdminSidebar.jsx'

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 w-full lg:w-[calc(100%-16rem)]">
        {children}
      </main>
    </div>
  )
}

