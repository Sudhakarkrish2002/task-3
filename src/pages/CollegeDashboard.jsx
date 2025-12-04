import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { authAPI } from '../utils/api.js'

export default function CollegeDashboard() {
  const [activeTab, setActiveTab] = useState('students')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const response = await authAPI.getMe()
      if (response.success && response.user) {
        setUser(response.user)
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.user))
      } else {
        throw new Error(response.message || 'Invalid response from server')
      }
    } catch (error) {
      console.error('Error fetching user from API:', error)
      toast.error('Unable to load college profile. Please refresh.')
      // Fallback to localStorage if API fails
      try {
        const userData = localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData))
        }
      } catch (e) {
        console.error('Error loading from localStorage:', e)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleExportList = () => {
    toast.info('Exporting student list...')
    // In production: Generate and download CSV/Excel file
  }

  const handleViewStudentDetails = (studentId) => {
    toast.info(`Viewing details for student ID: ${studentId}`)
  }

  const handleViewCourseDetails = (courseId) => {
    toast.info(`Viewing course details for course ID: ${courseId}`)
  }

  const handleDownloadReport = (reportType) => {
    toast.info(`Downloading ${reportType} report...`)
    // In production: Generate and download PDF report
  }

  const handleViewPlacementStats = () => {
    toast.info('Viewing placement statistics...')
  }

  const getUserInitials = () => {
    if (!user || !user.collegeDetails?.collegeName) return 'C'
    return user.collegeDetails.collegeName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // ONLY admin approval allows access - not isVerified
  const isApproved = user && user.isActive === true && 
    user.collegeDetails?.adminApprovalStatus === 'approved'

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </main>
    )
  }


  return (
    <main className="min-h-screen bg-gray-50">
      {/* Approval Status Banner */}
      {!isApproved && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Your account is pending admin approval. Some features may be limited until your account is approved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">College Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage registered students, partner courses, and view reports</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('students')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'students'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Registered Students</span>
                {activeTab === 'students' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'courses'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Partner Courses</span>
                {activeTab === 'courses' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'reports'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Reports</span>
                {activeTab === 'reports' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'students' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Registered Students</h2>
                  <button 
                    onClick={handleExportList}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] relative overflow-hidden"
                  >
                    <span className="relative z-10">Export List</span>
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
                <div className="text-center py-8 text-gray-600">
                  <p>No registered students available at the moment.</p>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Partner Courses</h2>
                <div className="text-center py-8 text-gray-600">
                  <p>No courses available at the moment.</p>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 rounded-lg border border-gray-200 bg-primary-50">
                    <div className="text-3xl font-bold text-primary-700 mb-2">105</div>
                    <div className="text-sm font-medium text-gray-700">Total Students</div>
                  </div>
                  <div className="p-6 rounded-lg border border-gray-200 bg-primary-50">
                    <div className="text-3xl font-bold text-primary-700 mb-2">78%</div>
                    <div className="text-sm font-medium text-gray-700">Average Completion Rate</div>
                  </div>
                  <div className="p-6 rounded-lg border border-gray-200 bg-primary-50">
                    <div className="text-3xl font-bold text-primary-700 mb-2">45</div>
                    <div className="text-sm font-medium text-gray-700">Certificates Issued</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Monthly Enrollment Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download detailed enrollment and progress reports for your college.
                    </p>
                    <button 
                      onClick={() => handleDownloadReport('Monthly Enrollment')}
                      className="rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] relative overflow-hidden"
                    >
                      <span className="relative z-10">Download Report</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>

                  <div className="p-5 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Placement Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      View placement statistics and success rates of your students.
                    </p>
                    <button 
                      onClick={handleViewPlacementStats}
                      className="rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] relative overflow-hidden"
                    >
                      <span className="relative z-10">View Placement Stats</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>

                  <div className="p-5 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Course Performance Report</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Analyze course completion rates and student performance metrics.
                    </p>
                    <button 
                      onClick={() => handleDownloadReport('Course Performance')}
                      className="rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] relative overflow-hidden"
                    >
                      <span className="relative z-10">Generate Report</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
