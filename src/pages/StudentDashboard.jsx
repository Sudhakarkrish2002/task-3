import React, { useState } from 'react'

const myCourses = [
  { id: 1, title: 'Full-Stack Web Development', progress: 65, status: 'In Progress' },
  { id: 2, title: 'React & Next.js Mastery', progress: 100, status: 'Completed' },
  { id: 3, title: 'Data Science Foundations', progress: 30, status: 'In Progress' },
]

const myCertificates = [
  { id: 1, title: 'React & Next.js Mastery', issueDate: '2024-01-15', certificateId: 'CERT-2024-001' },
  { id: 2, title: 'JavaScript Fundamentals', issueDate: '2023-12-20', certificateId: 'CERT-2023-098' },
]

const myInternships = [
  { id: 1, title: 'Frontend Development Intern', company: 'TechStartup', status: 'Active', startDate: '2024-01-01' },
  { id: 2, title: 'Web Development Intern', company: 'DesignStudio', status: 'Completed', startDate: '2023-08-01', endDate: '2023-11-30' },
]

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('courses')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Manage your courses, certificates, and internships</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'courses'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/40 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">My Courses</span>
                {activeTab === 'courses' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'certificates'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/40 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">My Certificates</span>
                {activeTab === 'certificates' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('internships')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'internships'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/40 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">My Internships</span>
                {activeTab === 'internships' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'profile'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/40 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Profile</span>
                {activeTab === 'profile' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Courses</h2>
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div key={course.id} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                      <button className="mt-3 text-sm text-primary-700 hover:text-primary-800 font-medium transition-all duration-300 ease-in-out hover:font-bold hover:shadow-sm inline-block">
                        Continue Learning →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Certificates</h2>
                <div className="space-y-4">
                  {myCertificates.map((cert) => (
                    <div key={cert.id} className="p-6 rounded-lg border-2 border-primary-200 bg-primary-50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{cert.title}</h3>
                          <p className="text-sm text-gray-600">Certificate ID: {cert.certificateId}</p>
                          <p className="text-sm text-gray-600">Issued on: {new Date(cert.issueDate).toLocaleDateString()}</p>
                        </div>
                        <div className="w-16 h-16 rounded-lg bg-primary-600 flex items-center justify-center flex-shrink-0">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                      </div>
                      <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)] relative overflow-hidden">
                        <span className="relative z-10">Download Certificate</span>
                        <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'internships' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Internships</h2>
                <div className="space-y-4">
                  {myInternships.map((internship) => (
                    <div key={internship.id} className="p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{internship.title}</h3>
                          <p className="text-sm text-gray-600">{internship.company}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          internship.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {internship.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        <p>Start Date: {new Date(internship.startDate).toLocaleDateString()}</p>
                        {internship.endDate && (
                          <p>End Date: {new Date(internship.endDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      {internship.status === 'Active' && (
                        <button className="text-sm text-primary-700 hover:text-primary-800 font-medium transition-all duration-300 ease-in-out hover:font-bold hover:shadow-sm inline-block">
                          View Details →
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-700">JD</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">John Doe</h3>
                      <p className="text-sm text-gray-600">john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+91 9876543210"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                      <input
                        type="text"
                        defaultValue="ABC University"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <button className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden">
                    <span className="relative z-10">Update Profile</span>
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

