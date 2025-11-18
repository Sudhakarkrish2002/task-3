import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../utils/api.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import {
  BuildingIcon,
  SearchIcon,
  EyeIcon,
  CloseIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  CheckIcon,
  XIcon,
} from '../../components/admin/Icons.jsx'

export default function AdminEmployers() {
  const [employers, setEmployers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEmployer, setSelectedEmployer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    loadEmployers()
  }, [pagination.page, searchTerm, statusFilter, approvalStatusFilter])

  const loadEmployers = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== 'all') params.status = statusFilter
      if (approvalStatusFilter !== 'all') params.adminApprovalStatus = approvalStatusFilter

      const response = await adminAPI.getAllEmployers(params)
      if (response.success) {
        setEmployers(response.data.employers || [])
        setPagination(response.data.pagination || pagination)
      }
    } catch (error) {
      console.error('Error loading employers:', error)
      toast.error('Error loading employers')
    } finally {
      setLoading(false)
    }
  }

  const handleViewEmployer = async (employerId) => {
    try {
      const response = await adminAPI.getEmployerById(employerId)
      if (response.success) {
        setSelectedEmployer(response.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error loading employer:', error)
      toast.error('Error loading employer details')
    }
  }

  const handleApproveEmployer = async (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const response = await adminAPI.approveEmployer(
        selectedEmployer._id,
        action,
        rejectionReason
      )
      if (response.success) {
        toast.success(`Employer ${action}d successfully`)
        setShowApprovalModal(false)
        setShowModal(false)
        setSelectedEmployer(null)
        setRejectionReason('')
        loadEmployers()
      }
    } catch (error) {
      console.error('Error approving employer:', error)
      toast.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} employer`)
    }
  }

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getApprovalStatus = (employer) => {
    return employer.employerDetails?.adminApprovalStatus || employer.adminApprovalStatus || 'pending'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BuildingIcon className="w-8 h-8 text-primary-600" />
            Employer Management
          </h1>
          <p className="text-gray-600 mt-1">Manage all registered employers</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <FilterIcon className="w-5 h-5 text-gray-500" />
            <h3 className="text-sm font-semibold text-gray-700">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <SearchIcon className="w-4 h-4" />
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                placeholder="Search by name, email, or company..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
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
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
              <select
                value={approvalStatusFilter}
                onChange={(e) => {
                  setApprovalStatusFilter(e.target.value)
                  setPagination({ ...pagination, page: 1 })
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading employers...</p>
            </div>
          ) : employers.length === 0 ? (
            <div className="p-12 text-center">
              <BuildingIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No employers found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approval Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employers.map((employer) => {
                      const approvalStatus = getApprovalStatus(employer)
                      return (
                        <tr key={employer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{employer.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{employer.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500">
                              {employer.employerDetails?.companyName || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{employer.phone || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                employer.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {employer.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getApprovalStatusColor(
                                approvalStatus
                              )}`}
                            >
                              {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleViewEmployer(employer._id)}
                                className="flex items-center gap-1 text-primary-600 hover:text-primary-900 font-medium"
                              >
                                <EyeIcon className="w-4 h-4" />
                                View
                              </button>
                              {approvalStatus === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedEmployer(employer)
                                    setShowApprovalModal(true)
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
                      )
                    })}
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

      {/* Employer Details Modal */}
      {showModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BuildingIcon className="w-6 h-6 text-primary-600" />
                  Employer Details
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedEmployer(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-200"
                >
                  <CloseIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployer.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployer.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedEmployer.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedEmployer.employerDetails?.companyName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedEmployer.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedEmployer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verified</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedEmployer.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {selectedEmployer.isVerified ? 'Verified' : 'Not Verified'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approval Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getApprovalStatusColor(
                        getApprovalStatus(selectedEmployer)
                      )}`}
                    >
                      {getApprovalStatus(selectedEmployer)
                        .charAt(0)
                        .toUpperCase() + getApprovalStatus(selectedEmployer).slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {selectedEmployer.employerDetails?.rejectionReason && (
                <div>
                  <label className="block text-sm font-medium text-red-700">Rejection Reason</label>
                  <p className="mt-1 text-sm text-red-600">
                    {selectedEmployer.employerDetails.rejectionReason}
                  </p>
                </div>
              )}

              {getApprovalStatus(selectedEmployer) === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setShowApprovalModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Review Employer
                  </button>
                </div>
              )}

              {selectedEmployer.employerDetails?.postedJobs &&
                selectedEmployer.employerDetails.postedJobs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <BriefcaseIcon className="w-5 h-5 text-primary-600" />
                      Posted Jobs
                    </h3>
                    <div className="space-y-2">
                      {selectedEmployer.employerDetails.postedJobs.map((job, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg text-sm"
                        >
                          {job.jobId?.title || 'Job ' + (index + 1)} -{' '}
                          {job.jobId?.status || 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedEmployer.employerDetails?.postedInternships &&
                selectedEmployer.employerDetails.postedInternships.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <BriefcaseIcon className="w-5 h-5 text-primary-600" />
                      Posted Internships
                    </h3>
                    <div className="space-y-2">
                      {selectedEmployer.employerDetails.postedInternships.map((internship, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-lg text-sm"
                        >
                          {internship.internshipId?.title || 'Internship ' + (index + 1)} -{' '}
                          {internship.internshipId?.status || 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedEmployer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-600" />
                Review Employer Registration
              </h2>
            </div>
            <div className="p-6 space-y-4">
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
                  onClick={() => handleApproveEmployer('approve')}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproveEmployer('reject')}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => {
                    setShowApprovalModal(false)
                    setRejectionReason('')
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  <CloseIcon className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

