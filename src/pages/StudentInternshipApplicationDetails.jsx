import React, { useEffect, useState } from 'react'
import { internshipAPI } from '../utils/api.js'
import { toast } from 'react-toastify'

const formatDate = (value) => {
  if (!value) return 'N/A'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return 'N/A'
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getStatusLabelAndClasses = (status) => {
  const normalized = (status || 'applied').toLowerCase()
  if (normalized === 'accepted') {
    return { label: 'Accepted', classes: 'bg-green-100 text-green-800' }
  }
  if (normalized === 'shortlisted') {
    return { label: 'Shortlisted', classes: 'bg-blue-100 text-blue-800' }
  }
  if (normalized === 'rejected') {
    return { label: 'Rejected', classes: 'bg-red-100 text-red-800' }
  }
  return { label: 'Applied', classes: 'bg-gray-100 text-gray-800' }
}

export default function StudentInternshipApplicationDetails() {
  const [internshipId, setInternshipId] = useState(null)
  const [internship, setInternship] = useState(null)
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const hash = window.location.hash || ''
    const query = hash.split('?')[1] || ''
    const params = new URLSearchParams(query)
    const id = params.get('id')

    if (!id) {
      setError('Invalid internship application link.')
      toast.error('Invalid internship application link.')
      setTimeout(() => {
        window.location.hash = '#/dashboard/student'
      }, 2000)
      return
    }

    setInternshipId(id)
  }, [])

  useEffect(() => {
    if (!internshipId) return
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await internshipAPI.getMyApplicationDetails(internshipId)
        if (response && response.success && response.data) {
          setInternship(response.data.internship)
          setApplication(response.data.application)
          return
        }

        const fallbackMsg = response?.message || 'Unable to load application details.'
        setError(fallbackMsg)
        toast.error(fallbackMsg)
      } catch (err) {
        // Map common HTTP errors to user-friendly messages
        let msg = 'Error loading internship application details.'

        if (err && typeof err === 'object') {
          const status = err.status
          const serverMsg = err.data?.message || err.message

          if (status === 400) {
            msg = serverMsg || 'Invalid internship application link. Please open it again from your dashboard.'
          } else if (status === 401 || status === 403) {
            msg = serverMsg || 'You need to be logged in as a student to view this application.'
          } else if (status === 404) {
            msg = serverMsg || 'We could not find your application for this internship.'
          } else {
            msg = serverMsg || msg
          }
        } else if (typeof err === 'string') {
          msg = err
        }

        setError(msg)
        toast.error(msg)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [internshipId])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
            <p className="mt-4 text-gray-600">Loading internship application details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !internship || !application) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-700 mb-4">
              {error || 'Unable to load internship application details.'}
            </p>
            <button
              onClick={() => window.location.hash = '#/dashboard/student'}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  const { label: statusLabel, classes: statusClasses } = getStatusLabelAndClasses(application.status)

  const companyName = typeof internship.company === 'object' && internship.company
    ? (internship.company.employerDetails?.companyName || internship.company.name || internship.companyName)
    : (internship.companyName || 'Company')

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200 pt-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => window.location.hash = '#/dashboard/student'}
            className="mb-4 text-sm text-gray-600 hover:text-primary-700 inline-flex items-center gap-1"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Internship Application Details</h1>
          <p className="mt-2 text-gray-600">
            Review your application and the status for this internship.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Internship Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{internship.title}</h2>
                <p className="mt-1 text-lg font-semibold text-primary-700">{companyName}</p>
                <p className="mt-1 text-sm text-gray-600">
                  Applied on: {formatDate(application.appliedAt)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClasses}`}>
                  {statusLabel}
                </span>
                <p className="text-xs text-gray-500">
                  Application ID: {application._id || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Location</p>
                <p className="text-sm text-gray-900 mt-1">
                  {internship.location || 'N/A'}
                  {internship.isRemote && (
                    <span className="ml-2 inline-flex px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                      Remote
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Internship Type</p>
                <p className="text-sm text-gray-900 mt-1 capitalize">
                  {internship.type || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Duration</p>
                <p className="text-sm text-gray-900 mt-1">
                  {internship.duration || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Application Deadline</p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(internship.applicationDeadline)}
                </p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Application</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.studentName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.studentEmail || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Phone</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.phone || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">College</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.collegeName || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Course</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.course || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Year</p>
                <p className="text-sm text-gray-900 mt-1">
                  {application.year || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Cover Letter</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {application.coverLetter || 'No cover letter available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


