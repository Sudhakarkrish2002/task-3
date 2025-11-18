import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../utils/api.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import {
  UploadIcon,
  SearchIcon,
  EyeIcon,
  CloseIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  ClockIcon,
  FileIcon,
} from '../../components/admin/Icons.jsx'

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [reviewNotes, setReviewNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    loadSubmissions()
  }, [pagination.page, typeFilter, statusFilter])

  const loadSubmissions = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (typeFilter !== 'all') params.type = typeFilter
      if (statusFilter !== 'all') params.status = statusFilter

      const response = await adminAPI.getAllSubmissions(params)
      if (response.success) {
        setSubmissions(response.data.submissions || [])
        setPagination(response.data.pagination || pagination)
      }
    } catch (error) {
      console.error('Error loading submissions:', error)
      toast.error('Error loading submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission)
    setShowModal(true)
  }

  const handleReviewSubmission = async (action) => {
    if ((action === 'reject' || action === 'needs_revision') && !reviewNotes.trim() && !rejectionReason.trim()) {
      toast.error('Please provide review notes or rejection reason')
      return
    }

    try {
      const reviewData = {
        reviewNotes: reviewNotes || rejectionReason,
        rejectionReason: action === 'reject' ? (rejectionReason || reviewNotes) : undefined,
      }
      const response = await adminAPI.reviewSubmission(selectedSubmission._id, action, reviewData)
      if (response.success) {
        toast.success(`Submission ${action}d successfully`)
        setShowReviewModal(false)
        setShowModal(false)
        setSelectedSubmission(null)
        setReviewNotes('')
        setRejectionReason('')
        loadSubmissions()
      }
    } catch (error) {
      console.error('Error reviewing submission:', error)
      toast.error(`Error ${action}ing submission`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'needs_revision':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UploadIcon className="w-8 h-8 text-primary-600" />
            Submission Management
          </h1>
          <p className="text-gray-600 mt-1">Review and manage submissions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FileIcon className="w-4 h-4" />
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
                <option value="quiz">Quiz</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <UploadIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No submissions found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {submissions.map((submission) => (
                      <tr key={submission._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.title || 'Untitled'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {submission.submittedBy?.name || submission.submittedBy?.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{submission.type || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              submission.status
                            )}`}
                          >
                            {submission.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {submission.createdAt
                              ? new Date(submission.createdAt).toLocaleDateString('en-IN')
                              : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleViewSubmission(submission)}
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-900 font-medium"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View
                            </button>
                            {submission.status === 'pending' && (
                              <button
                                onClick={() => {
                                  setSelectedSubmission(submission)
                                  setShowReviewModal(true)
                                }}
                                className="flex items-center gap-1 text-green-600 hover:text-green-900 font-medium"
                              >
                                <CheckIcon className="w-4 h-4" />
                                Review
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                    {pagination.total} results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page >= pagination.pages}
                      className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                    >
                      Next
                      <ArrowRightIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Submission Details Modal */}
      {showModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <UploadIcon className="w-6 h-6 text-primary-600" />
                  {selectedSubmission.title || 'Submission'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedSubmission(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted By</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubmission.submittedBy?.name || selectedSubmission.submittedBy?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.type || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        selectedSubmission.status
                      )}`}
                    >
                      {selectedSubmission.status || 'N/A'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted At</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedSubmission.createdAt
                      ? new Date(selectedSubmission.createdAt).toLocaleString('en-IN')
                      : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedSubmission.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedSubmission.description}
                  </p>
                </div>
              )}
              {selectedSubmission.content && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Content</label>
                  <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                    {selectedSubmission.content}
                  </div>
                </div>
              )}
              {selectedSubmission.fileUrl && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                    <FileIcon className="w-4 h-4" />
                    File
                  </label>
                  <a
                    href={selectedSubmission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-primary-600 hover:text-primary-900 font-medium"
                  >
                    <FileIcon className="w-4 h-4" />
                    View File
                  </a>
                </div>
              )}
              {selectedSubmission.reviewNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Review Notes</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedSubmission.reviewNotes}</p>
                </div>
              )}
              {selectedSubmission.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-red-700">Rejection Reason</label>
                  <p className="mt-1 text-sm text-red-600">{selectedSubmission.rejectionReason}</p>
                </div>
              )}
              {selectedSubmission.status === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setShowReviewModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Review Submission
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-600" />
                Review Submission
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Notes
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter review notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (if rejecting)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-4">
                <button
                  onClick={() => handleReviewSubmission('approve')}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReviewSubmission('needs_revision')}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  <ClockIcon className="w-4 h-4" />
                  Needs Revision
                </button>
                <button
                  onClick={() => handleReviewSubmission('reject')}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                  Reject
                </button>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(false)
                  setReviewNotes('')
                  setRejectionReason('')
                }}
                className="flex items-center gap-2 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                <CloseIcon className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

