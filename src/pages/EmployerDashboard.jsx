import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { internshipAPI } from '../utils/api.js'

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('post-job')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    experience: '',
    salary: '',
    employmentType: 'Full-time',
    description: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePostJob = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // This would call the actual API in production
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Job posted successfully! (Demo mode)')
      setFormData({
        title: '',
        location: '',
        experience: '',
        salary: '',
        employmentType: 'Full-time',
        description: ''
      })
    } catch (error) {
      toast.error('Error posting job: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewResume = (applicantId) => {
    toast.info(`Viewing resume for applicant ID: ${applicantId}`)
  }

  const handleScheduleInterview = (applicantId) => {
    toast.info(`Schedule interview for applicant ID: ${applicantId}`)
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    toast.success('Profile updated successfully!')
  }

  const getUserInitials = () => {
    if (!user || !user.employerDetails?.companyName) return 'E'
    return user.employerDetails.companyName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const applicants = [
    { id: 1, name: 'Priya Sharma', position: 'Frontend Developer', status: 'New', appliedDate: '2024-01-15' },
    { id: 2, name: 'Rajesh Kumar', position: 'Full-Stack Developer', status: 'Reviewing', appliedDate: '2024-01-14' },
    { id: 3, name: 'Anita Patel', position: 'React Developer', status: 'Interviewed', appliedDate: '2024-01-13' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage job postings, applicants, and company profile</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('post-job')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'post-job'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Post Job</span>
                {activeTab === 'post-job' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('applicants')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'applicants'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">View Applicants</span>
                {activeTab === 'applicants' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'profile'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Company Profile</span>
                {activeTab === 'profile' && (
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                )}
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'post-job' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Post a New Internship/Job</h2>
                <form onSubmit={handlePostJob} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., Frontend Developer"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., Bangalore, Remote"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 2-5 years"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., ₹8-12 LPA"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                      <select 
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                    <textarea
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Describe the role, responsibilities, requirements..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10">{loading ? 'Posting...' : 'Post Job'}</span>
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'applicants' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">View Applicants</h2>
                <div className="space-y-4">
                  {applicants.map((applicant) => (
                    <div key={applicant.id} className="p-5 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-700">
                              {applicant.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{applicant.name}</h3>
                            <p className="text-sm text-gray-600">{applicant.position}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Applied on {new Date(applicant.appliedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          applicant.status === 'New'
                            ? 'bg-blue-100 text-blue-800'
                            : applicant.status === 'Reviewing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {applicant.status}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewResume(applicant.id)}
                          className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] relative overflow-hidden"
                        >
                          <span className="relative z-10">View Resume</span>
                          <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                        <button 
                          onClick={() => handleScheduleInterview(applicant.id)}
                          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 text-sm font-semibold transition-all duration-300 ease-in-out shadow-md hover:scale-105 hover:bg-gray-50 hover:shadow-2xl hover:shadow-gray-400/50 relative overflow-hidden"
                        >
                          <span className="relative z-10">Schedule Interview</span>
                          <span className="absolute inset-0 bg-linear-to-br from-gray-50 to-gray-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Company Profile</h2>
                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg bg-primary-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-700">{getUserInitials()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{user?.employerDetails?.companyName || 'Company Name'}</h3>
                        <p className="text-sm text-gray-600">{user?.email || 'company@example.com'}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          defaultValue={user?.employerDetails?.companyName || ''}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <input
                          type="text"
                          defaultValue={user?.employerDetails?.industry || ''}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                      <textarea
                        rows={4}
                        defaultValue={user?.employerDetails?.companyDescription || ''}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>

                    <button type="submit" className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden">
                      <span className="relative z-10">Update Profile</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
