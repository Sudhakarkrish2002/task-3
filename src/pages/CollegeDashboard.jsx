import React, { useState, useEffect } from 'react'

export default function CollegeDashboard() {
  const [activeTab, setActiveTab] = useState('students')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleExportList = () => {
    alert('Exporting student list...')
    // In production: Generate and download CSV/Excel file
  }

  const handleViewStudentDetails = (studentId) => {
    alert(`Viewing details for student ID: ${studentId}`)
  }

  const handleViewCourseDetails = (courseId) => {
    alert(`Viewing course details for course ID: ${courseId}`)
  }

  const handleDownloadReport = (reportType) => {
    alert(`Downloading ${reportType} report...`)
    // In production: Generate and download PDF report
  }

  const handleViewPlacementStats = () => {
    alert('Viewing placement statistics...')
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

  const registeredStudents = [
    { id: 1, name: 'Ananya Sharma', course: 'Full-Stack Development', status: 'Active', enrollDate: '2024-01-10' },
    { id: 2, name: 'Rahul Verma', course: 'Data Science', status: 'Active', enrollDate: '2024-01-08' },
    { id: 3, name: 'Priya Patel', course: 'React Development', status: 'Completed', enrollDate: '2023-11-15' },
  ]

  const partnerCourses = [
    { id: 1, title: 'Full-Stack Web Development', students: 45, completionRate: 78 },
    { id: 2, title: 'Data Science Foundations', students: 32, completionRate: 82 },
    { id: 3, title: 'Cloud Computing', students: 28, completionRate: 71 },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
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
                <div className="space-y-4">
                  {registeredStudents.map((student) => (
                    <div key={student.id} className="p-5 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-700">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">{student.course}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Enrolled on {new Date(student.enrollDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {student.status}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleViewStudentDetails(student.id)}
                        className="text-sm text-primary-700 hover:text-primary-800 font-medium transition-all duration-300 ease-in-out hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-block"
                      >
                        View Details →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Partner Courses</h2>
                <div className="space-y-4">
                  {partnerCourses.map((course) => (
                    <div key={course.id} className="p-5 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-2">{course.title}</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Students Enrolled: </span>
                              <span className="font-semibold text-gray-900">{course.students}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Completion Rate: </span>
                              <span className="font-semibold text-gray-900">{course.completionRate}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Completion Progress</span>
                          <span className="font-semibold text-gray-900">{course.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => handleViewCourseDetails(course.id)}
                        className="text-sm text-primary-700 hover:text-primary-800 font-medium"
                      >
                        View Course Details →
                      </button>
                    </div>
                  ))}
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
