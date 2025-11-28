import React, { useEffect, useState } from 'react'
import { internshipAPI, authAPI } from '../utils/api.js'
import { toast } from 'react-toastify'

export default function InternshipApplication() {
  const [internshipId, setInternshipId] = useState(null)
  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [applicationForm, setApplicationForm] = useState({
    name: '',
    email: '',
    phone: '',
    collegeName: '',
    course: '',
    year: '',
    coverLetter: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Parse internship ID from URL hash
    const hash = window.location.hash
    const urlParams = new URLSearchParams(hash.split('?')[1] || '')
    const id = urlParams.get('id')
    
    if (id) {
      setInternshipId(id)
    } else {
      toast.error('Invalid internship application link')
      setTimeout(() => {
        window.location.href = '/#/internships'
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if (internshipId) {
      loadInternship()
      checkAuth()
    }
  }, [internshipId])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.info('Please login to apply for internships')
      setTimeout(() => {
        window.location.href = `/#/auth?redirect=/#/internship-application?id=${internshipId}`
      }, 2000)
      return
    }

    // Try to fetch user data, but don't block if it fails
    try {
      const response = await authAPI.getMe()
      const userData = response?.data || response?.user

      if (response && response.success && userData) {
        setCurrentUser(userData)
        // Pre-fill form with user data
        setApplicationForm(prev => ({
          ...prev,
          name: userData.name || prev.name,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
          collegeName: userData.studentDetails?.collegeName || prev.collegeName,
          course: userData.studentDetails?.course || prev.course,
          year: userData.studentDetails?.year || prev.year
        }))
      }
    } catch (err) {
      // Don't block - user can still submit, backend will validate from token
    }
  }

  // Retry fetching user data if not available
  const fetchUserData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
      const response = await authAPI.getMe()
      const userData = response?.data || response?.user
      if (response && response.success && userData) {
        return userData
      }
    } catch (err) {
      console.error('[InternshipApplication] Error fetching user data:', err)
    }
    return null
  }

  const loadInternship = async () => {
    if (!internshipId) return
    
    setLoading(true)
    try {
      const response = await internshipAPI.getInternshipById(internshipId)
      
      if (response.success && response.data) {
        setInternship(response.data)
      } else {
        toast.error(response.message || 'Internship not found')
        setTimeout(() => {
          window.location.href = '/#/internships'
        }, 2000)
      }
    } catch (err) {
      console.error('Error loading internship:', err)
      toast.error(err.message || 'Error loading internship details')
      setTimeout(() => {
        window.location.href = '/#/internships'
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const handleApplicationSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Validate internship exists
    if (!internship || !internship._id) {
      console.error('[InternshipApplication] Internship not loaded')
      toast.error('Internship information not loaded. Please try again.')
      return
    }

    // Validate user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to apply for internships')
      window.location.href = `/#/auth?redirect=/#/internship-application?id=${internshipId}`
      return
    }

    // Try to get user data if not available (retry)
    let userData = currentUser
    if (!userData) {
      userData = await fetchUserData()
      if (userData) {
        setCurrentUser(userData)
      }
    }

    // If we have user data, validate role (backend will also validate)
    if (userData && userData.role !== 'student') {
      toast.error('Only students can apply for internships')
      return
    }

    // Validate form fields - trim whitespace and check for empty strings
    const trimmedForm = {
      name: applicationForm.name?.trim() || '',
      email: applicationForm.email?.trim() || '',
      phone: applicationForm.phone?.trim() || '',
      collegeName: applicationForm.collegeName?.trim() || '',
      course: applicationForm.course?.trim() || '',
      year: applicationForm.year?.trim() || '',
      coverLetter: applicationForm.coverLetter?.trim() || ''
    }

    if (!trimmedForm.name || !trimmedForm.email || !trimmedForm.phone || 
        !trimmedForm.collegeName || !trimmedForm.course || !trimmedForm.year || 
        !trimmedForm.coverLetter) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedForm.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      const response = await internshipAPI.applyToInternship(
        internship._id,
        trimmedForm
      )

      if (response && response.success) {
        toast.success('Application submitted successfully! Your application has been received.')
        // Wait a bit longer to ensure toast is visible
        setTimeout(() => {
          window.location.href = '/#/internships'
        }, 3000)
      } else {
        const errorMsg = response?.message || 'Failed to submit application. Please try again.'
        console.error('[InternshipApplication] Application failed:', errorMsg)
        toast.error(errorMsg)
      }
    } catch (err) {
      console.error('[InternshipApplication] Error submitting application:', {
        error: err,
        message: err.message,
        status: err.status,
        data: err.data
      })
      
      // Extract error message from various possible formats
      let errorMessage = 'Error submitting application. Please try again.'
      if (err.status === 404) {
        // More user-friendly message for missing route / backend mismatch
        errorMessage =
          'Internship application service is temporarily unavailable or this internship is not accepting applications right now. Please try again later or contact support.'
      } else if (err.message) {
        errorMessage = err.message
      } else if (err.data?.message) {
        errorMessage = err.data.message
      } else if (err.data?.error) {
        errorMessage = err.data.error
      }
      
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading internship details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!internship && !loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Unable to load internship details.</p>
            <button
              onClick={() => window.location.href = '/#/internships'}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Go Back to Internships
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Apply for Internship
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {internship.title}
          </p>
          <p className="mt-1 text-md font-semibold text-primary-700">
            {typeof internship.company === 'object' && internship.company
              ? (internship.company.employerDetails?.companyName || internship.company.name || internship.companyName)
              : (internship.companyName || 'Company')}
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationForm.name}
                    onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationForm.collegeName}
                    onChange={(e) => setApplicationForm({ ...applicationForm, collegeName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course/Program <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicationForm.course}
                    onChange={(e) => setApplicationForm({ ...applicationForm, course: e.target.value })}
                    placeholder="e.g., B.Tech Computer Science, BCA, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={applicationForm.year}
                    onChange={(e) => setApplicationForm({ ...applicationForm, year: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={8}
                  value={applicationForm.coverLetter}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })}
                  placeholder="Tell us why you're interested in this internship and what makes you a good fit..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="pt-4 border-t border-gray-200 flex gap-4">
                <button
                  type="button"
                  onClick={() => window.location.href = '/#/internships'}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || loading}
                  onClick={(e) => {
                    // Submit handler
                  }}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

