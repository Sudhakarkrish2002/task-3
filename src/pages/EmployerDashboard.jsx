import React, { useState } from 'react'

const applicants = [
  { id: 1, name: 'Priya Sharma', position: 'Frontend Developer', status: 'New', appliedDate: '2024-01-15' },
  { id: 2, name: 'Rajesh Kumar', position: 'Full-Stack Developer', status: 'Reviewing', appliedDate: '2024-01-14' },
  { id: 3, name: 'Anita Patel', position: 'React Developer', status: 'Interviewed', appliedDate: '2024-01-13' },
]

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState('post-job')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage job postings, applicants, and company profile</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('post-job')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'post-job'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Post Job
              </button>
              <button
                onClick={() => setActiveTab('applicants')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'applicants'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                View Applicants
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Company Profile
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'post-job' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Post a New Job</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., Frontend Developer"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., Bangalore, Remote"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience *</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 2-5 years"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., ₹8-12 LPA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                      <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200">
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
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Describe the role, responsibilities, requirements..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold hover:bg-primary-700"
                  >
                    Post Job
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
                        <button className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-white text-sm font-semibold hover:bg-primary-700">
                          View Resume
                        </button>
                        <button className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 text-sm font-semibold hover:bg-gray-50">
                          Schedule Interview
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
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary-700">TC</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">TechCorp Solutions</h3>
                      <p className="text-sm text-gray-600">techcorp@example.com</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        defaultValue="TechCorp Solutions"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <input
                        type="text"
                        defaultValue="Technology"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                      <input
                        type="text"
                        defaultValue="201-500 employees"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <input
                        type="url"
                        defaultValue="https://techcorp.example.com"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                    <textarea
                      rows={4}
                      defaultValue="A leading technology company specializing in software development and cloud solutions."
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                    />
                  </div>

                  <button className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold hover:bg-primary-700">
                    Update Profile
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

