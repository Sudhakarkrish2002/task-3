import React, { useEffect, useState } from 'react'
import { internshipAPI, authAPI } from '../utils/api.js'
import { toast } from 'react-toastify'

const formatPostedLabel = (isoDate) => {
  if (!isoDate) return 'Recently'
  const created = new Date(isoDate)
  const diffMs = Date.now() - created.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  const diffWeeks = Math.floor(diffDays / 7)
  if (diffWeeks === 1) return '1 week ago'
  return `${diffWeeks} weeks ago`
}

export default function Internships() {
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedInternship, setSelectedInternship] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    loadInternships()
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await authAPI.getMe()
        if (response.success && response.data) {
          setCurrentUser(response.data)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
      }
    }
  }

  const loadInternships = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await internshipAPI.getAllInternships({ limit: 100 })
      
      if (response.success) {
        const list = response.data?.internships || response.data || []
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setInternships(list)
      } else {
        console.error('[Internships] Response indicates failure:', response.message)
        throw new Error(response.message || 'Unable to load internships')
      }
    } catch (err) {
      console.error('[Internships] Error loading internships:', err)
      console.error('[Internships] Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      })
      setError(err.message || 'Unable to load internships right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewMore = (internship) => {
    // Use the existing internship data directly - no need for API call
    // since we already have all the details from the list
    setSelectedInternship(internship)
    setShowDetailsModal(true)
  }

  const handleApplyClick = (internship) => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.info('Please sign in to apply for internships')
      const redirectUrl = `/#/internship-application?id=${internship._id || internship.id}`
      window.location.href = `/#/auth?redirect=${encodeURIComponent(redirectUrl)}`
      return
    }
    
    // Verify user data exists
    const userData = localStorage.getItem('user')
    if (!userData) {
      toast.info('Please sign in to apply for internships')
      const redirectUrl = `/#/internship-application?id=${internship._id || internship.id}`
      window.location.href = `/#/auth?redirect=${encodeURIComponent(redirectUrl)}`
      return
    }

    // Redirect to application page with internship ID
    window.location.href = `/#/internship-application?id=${internship._id || internship.id}`
  }


  const formatStipend = (stipend) => {
    if (!stipend) return 'Stipend info on selection'
    if (typeof stipend === 'object' && stipend.amount) {
      const currency = stipend.currency || 'INR'
      const amount = stipend.amount
      if (stipend.type === 'unpaid') {
        return 'Unpaid'
      } else if (stipend.type === 'performance-based') {
        return `Performance-based (${currency === 'INR' ? '₹' : currency} ${amount})`
      } else {
        return `${currency === 'INR' ? '₹' : currency} ${amount}/month`
      }
    }
    return 'Stipend info on selection'
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Internships to Launch Your Career
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gain real-world experience, build your portfolio, and kickstart your professional journey
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Internships Work on Our Platform</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Our platform connects students with leading companies offering internships across various domains. 
              Whether you're looking for technical roles, design positions, or business internships, we have opportunities 
              that match your skills and interests. Apply directly through our platform, get matched with companies, 
              and start your professional journey.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse Opportunities</h3>
                <p className="text-sm text-gray-600">
                  Explore internships across tech, design, marketing, and more
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply Easily</h3>
                <p className="text-sm text-gray-600">
                  Submit your application with one click - no complex forms
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Matched</h3>
                <p className="text-sm text-gray-600">
                  Companies review your profile and reach out directly
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Internship</h3>
                <p className="text-sm text-gray-600">
                  Begin your journey with mentorship and real projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Openings</h2>
              <p className="text-gray-600">Available internships from top companies</p>
            </div>
            <div className="text-sm text-gray-600">
              {loading ? 'Loading…' : `Showing ${internships.length} internships`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Fetching the latest internship openings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{error}</p>
              <button
                onClick={loadInternships}
                className="mt-4 text-primary-700 hover:text-primary-800 font-semibold"
              >
                Retry loading
              </button>
            </div>
          ) : internships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No internships are live right now. Check back soon or subscribe for updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {internships.map((internship) => {
                const internshipId = internship._id || internship.id
                // Handle skills - use skillsRequired field from backend
                const skills = Array.isArray(internship.skillsRequired)
                  ? internship.skillsRequired
                  : (typeof internship.skillsRequired === 'string' ? internship.skillsRequired.split(',').map(s => s.trim()) : [])
                // Handle stipend - backend sends object with amount, currency, type
                let stipendLabel = 'Stipend info on selection'
                if (internship.stipend) {
                  if (typeof internship.stipend === 'object' && internship.stipend.amount) {
                    const currency = internship.stipend.currency || 'INR'
                    const amount = internship.stipend.amount.toLocaleString('en-IN')
                    if (internship.stipend.type === 'unpaid') {
                      stipendLabel = 'Unpaid'
                    } else if (internship.stipend.type === 'performance-based') {
                      stipendLabel = `Performance-based (${currency === 'INR' ? '₹' : currency} ${amount})`
                    } else {
                      stipendLabel = `${currency === 'INR' ? '₹' : currency} ${amount}/month`
                    }
                  } else if (typeof internship.stipend === 'number') {
                    stipendLabel = `₹${internship.stipend.toLocaleString('en-IN')}/month`
                  }
                }
                // Handle company name - can be string or populated object
                const companyName = typeof internship.company === 'object' && internship.company
                  ? (internship.company.employerDetails?.companyName || internship.company.name || internship.companyName)
                  : (internship.companyName || internship.company || 'Company')
                const typeLabel = internship.type || internship.mode || 'Internship'
                return (
                  <div
                    key={internshipId}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-1">
                      <svg className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="text-xl font-bold text-gray-900">{internship.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary-700 mb-2">
                      <svg className="w-5 h-5 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{companyName}</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    typeLabel.toLowerCase().includes('full')
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {typeLabel}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-medium">{internship.location || 'Flexible'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{internship.duration || 'Duration shared during screening'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{stipendLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Posted {formatPostedLabel(internship.createdAt || internship.updatedAt)}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {internship.description || 'Role description will be shared during the interview process.'}
                </p>

                {/* Skills */}
                {skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={`${internshipId}-skill-${idx}`}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">
                      {internship.applicationsReceived ? `${internship.applicationsReceived} applicants` : 'Be the first to apply'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewMore(internship)}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                    >
                      View More
                    </button>
                    <button
                      onClick={() => handleApplyClick(internship)}
                      className="rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-bold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
                    >
                      <span className="relative z-10">Apply Now</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          )}
        </div>
      </section>

      {/* Internship Details Modal */}
      {showDetailsModal && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50 sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedInternship.title}</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false)
                    setSelectedInternship(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-lg font-semibold text-primary-700 mt-2">
                {typeof selectedInternship.company === 'object' && selectedInternship.company
                  ? (selectedInternship.company.employerDetails?.companyName || selectedInternship.company.name || selectedInternship.companyName)
                  : (selectedInternship.companyName || 'Company')}
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Location</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">{selectedInternship.location || 'N/A'}</p>
                  {selectedInternship.isRemote && (
                    <span className="inline-block mt-1 ml-7 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Remote</span>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>Type</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7 capitalize">{selectedInternship.type || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Duration</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">{selectedInternship.duration || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Stipend</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">{formatStipend(selectedInternship.stipend)}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Application Deadline</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">
                    {selectedInternship.applicationDeadline
                      ? new Date(selectedInternship.applicationDeadline).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Start Date</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">
                    {selectedInternship.startDate
                      ? new Date(selectedInternship.startDate).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'To be discussed'}
                  </p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Positions Available</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">{selectedInternship.positionsAvailable || 'N/A'}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Applications Received</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7">{selectedInternship.applicationsReceived || 0}</p>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span>Category</span>
                  </label>
                  <p className="mt-1 text-sm text-gray-900 ml-7 capitalize">{selectedInternship.category || 'N/A'}</p>
                </div>
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedInternship.description || 'No description provided.'}</p>
              </div>

              {/* Qualifications */}
              {selectedInternship.qualifications && selectedInternship.qualifications.length > 0 && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Qualifications</span>
                  </label>
                  <ul className="list-disc list-inside space-y-1 ml-7">
                    {selectedInternship.qualifications.map((qual, idx) => (
                      <li key={idx} className="text-sm text-gray-900">{qual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {selectedInternship.responsibilities && selectedInternship.responsibilities.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities</label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedInternship.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-sm text-gray-900">{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedInternship.benefits && selectedInternship.benefits.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedInternship.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-gray-900">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills Required */}
              {selectedInternship.skillsRequired && selectedInternship.skillsRequired.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.skillsRequired.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedInternship.tags && selectedInternship.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedInternship.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Button */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApplyClick(selectedInternship)}
                  className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-bold transition-all duration-300 ease-in-out shadow-lg hover:bg-primary-700 hover:shadow-xl"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  )
}

