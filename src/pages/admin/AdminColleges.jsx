import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../utils/api.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import {
  SchoolIcon,
  SearchIcon,
  EyeIcon,
  CloseIcon,
  FilterIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XIcon,
  SettingsIcon,
  UsersIcon,
} from '../../components/admin/Icons.jsx'

export default function AdminColleges() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [showPartnershipModal, setShowPartnershipModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [rejectionReason, setRejectionReason] = useState('')
  const [partnershipLevel, setPartnershipLevel] = useState('basic')

  useEffect(() => {
    loadColleges()
  }, [pagination.page, searchTerm, statusFilter])

  const loadColleges = async () => {
    setLoading(true)
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      }
      if (searchTerm) params.search = searchTerm
      if (statusFilter !== 'all') params.status = statusFilter

      const response = await adminAPI.getAllColleges(params)
      if (response.success) {
        setColleges(response.data.colleges || [])
        setPagination(response.data.pagination || pagination)
      }
    } catch (error) {
      console.error('Error loading colleges:', error)
      toast.error('Error loading colleges')
    } finally {
      setLoading(false)
    }
  }

  const handleViewCollege = async (collegeId) => {
    try {
      const response = await adminAPI.getCollegeById(collegeId)
      if (response.success) {
        setSelectedCollege(response.data)
        setShowModal(true)
      }
    } catch (error) {
      console.error('Error loading college:', error)
      toast.error('Error loading college details')
    }
  }

  const handleApproveCollege = async (action) => {
    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const data = action === 'approve' ? { partnershipLevel } : { rejectionReason }
      const response = await adminAPI.approveCollege(selectedCollege._id, action, data)
      if (response.success) {
        toast.success(`College ${action}d successfully`)
        setShowApprovalModal(false)
        setShowModal(false)
        setSelectedCollege(null)
        setRejectionReason('')
        loadColleges()
      }
    } catch (error) {
      console.error('Error approving college:', error)
      toast.error(`Error ${action === 'approve' ? 'approving' : 'rejecting'} college`)
    }
  }

  const handleUpdatePartnership = async () => {
    try {
      const response = await adminAPI.updateCollegePartnership(selectedCollege._id, partnershipLevel)
      if (response.success) {
        toast.success('Partnership level updated successfully')
        setShowPartnershipModal(false)
        setShowModal(false)
        setSelectedCollege(null)
        loadColleges()
      }
    } catch (error) {
      console.error('Error updating partnership:', error)
      toast.error('Error updating partnership level')
    }
  }

  const getApprovalStatus = (college) => {
    const status = college.collegeDetails?.adminApprovalStatus || 'pending'
    return status
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <SchoolIcon className="w-8 h-8 text-primary-600" />
            College Management
          </h1>
          <p className="text-gray-600 mt-1">Manage college registrations and partnerships</p>
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
                placeholder="Search by name, email, or college name..."
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
          </div>
        </div>

        {/* Colleges Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading colleges...</p>
            </div>
          ) : colleges.length === 0 ? (
            <div className="p-12 text-center">
              <SchoolIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No colleges found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        College Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Person
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approval Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Partnership
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {colleges.map((college) => {
                      const approvalStatus = getApprovalStatus(college)
                      return (
                        <tr key={college._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {college.collegeDetails?.collegeName || 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{college.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{college.email || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                approvalStatus === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : approvalStatus === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {approvalStatus.charAt(0).toUpperCase() + approvalStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {college.collegeDetails?.partnershipLevel || 'basic'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                college.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {college.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleViewCollege(college._id)}
                                className="flex items-center gap-1 text-primary-600 hover:text-primary-900 font-medium"
                              >
                                <EyeIcon className="w-4 h-4" />
                                View
                              </button>
                              {approvalStatus === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedCollege(college)
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

      {/* College Details Modal */}
      {showModal && selectedCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <SchoolIcon className="w-6 h-6 text-primary-600" />
                  College Details
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setSelectedCollege(null)
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
                  <label className="block text-sm font-medium text-gray-700">College Name</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCollege.collegeDetails?.collegeName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCollege.name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCollege.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedCollege.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Approval Status</label>
                  <p className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        getApprovalStatus(selectedCollege) === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : getApprovalStatus(selectedCollege) === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {getApprovalStatus(selectedCollege).charAt(0).toUpperCase() +
                        getApprovalStatus(selectedCollege).slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Partnership Level</label>
                  <p className="mt-1">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {selectedCollege.collegeDetails?.partnershipLevel || 'basic'}
                    </span>
                  </p>
                </div>
              </div>

              {selectedCollege.collegeDetails?.registeredStudents &&
                selectedCollege.collegeDetails.registeredStudents.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <UsersIcon className="w-5 h-5 text-primary-600" />
                      Registered Students
                    </h3>
                    <div className="space-y-2">
                      {selectedCollege.collegeDetails.registeredStudents.map((student, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg text-sm">
                          {student.studentId?.name || 'Student ' + (index + 1)} -{' '}
                          {student.studentId?.email || 'N/A'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                {getApprovalStatus(selectedCollege) === 'pending' && (
                  <button
                    onClick={() => {
                      setShowModal(false)
                      setShowApprovalModal(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Review Approval
                  </button>
                )}
                <button
                  onClick={() => {
                    setPartnershipLevel(selectedCollege.collegeDetails?.partnershipLevel || 'basic')
                    setShowModal(false)
                    setShowPartnershipModal(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Update Partnership
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-600" />
                Review College Registration
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership Level (if approving)
                </label>
                <select
                  value={partnershipLevel}
                  onChange={(e) => setPartnershipLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
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
                  onClick={() => handleApproveCollege('approve')}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleApproveCollege('reject')}
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

      {/* Partnership Modal */}
      {showPartnershipModal && selectedCollege && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-primary-600" />
                Update Partnership Level
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership Level
                </label>
                <select
                  value={partnershipLevel}
                  onChange={(e) => setPartnershipLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleUpdatePartnership}
                  className="flex items-center gap-2 flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <CheckIcon className="w-4 h-4" />
                  Update
                </button>
                <button
                  onClick={() => {
                    setShowPartnershipModal(false)
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

