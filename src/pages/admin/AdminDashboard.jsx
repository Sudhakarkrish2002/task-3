import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { adminAPI, internshipAPI, workshopAPI } from '../../utils/api.js'
import AdminLayout from '../../components/admin/AdminLayout.jsx'
import {
  UsersIcon,
  BuildingIcon,
  SchoolIcon,
  BookIcon,
  BriefcaseIcon,
  RevenueIcon,
  ChartIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  XIcon,
} from '../../components/admin/Icons.jsx'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [unverifiedUsers, setUnverifiedUsers] = useState([])
  const [loadingUnverified, setLoadingUnverified] = useState(false)
  const [roleFilter, setRoleFilter] = useState('all')
  const [verificationStatusFilter, setVerificationStatusFilter] = useState('unverified')
  const [verifyingUserId, setVerifyingUserId] = useState(null)
  const [internshipApplications, setInternshipApplications] = useState([])
  const [loadingApplications, setLoadingApplications] = useState(false)
  const [applicationSearch, setApplicationSearch] = useState('')
  const [applicationStatusFilter, setApplicationStatusFilter] = useState('all')
  const [applicationPagination, setApplicationPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [workshopRegistrations, setWorkshopRegistrations] = useState([])
  const [loadingWorkshopRegistrations, setLoadingWorkshopRegistrations] = useState(false)
  const [workshopRegistrationSearch, setWorkshopRegistrationSearch] = useState('')
  const [workshopRegistrationStatusFilter, setWorkshopRegistrationStatusFilter] = useState('all')
  const [workshopRegistrationPagination, setWorkshopRegistrationPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [updatingWorkshopStatus, setUpdatingWorkshopStatus] = useState(null)

  useEffect(() => {
    loadDashboardStats()
  }, [])

  useEffect(() => {
    loadUnverifiedUsers()
  }, [roleFilter, verificationStatusFilter])

  useEffect(() => {
    loadInternshipApplications()
  }, [applicationPagination.page, applicationSearch, applicationStatusFilter])

  useEffect(() => {
    loadWorkshopRegistrations()
  }, [workshopRegistrationPagination.page, workshopRegistrationSearch, workshopRegistrationStatusFilter])

  const loadDashboardStats = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getDashboardStats()
      if (response.success && response.data) {
        // Only set stats if we have valid data from API
        setStats(response.data)
      } else {
        // If API doesn't return success or data, set to null to show "No data available"
        setStats(null)
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
      toast.error('Error loading dashboard statistics')
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  const loadUnverifiedUsers = async () => {
    setLoadingUnverified(true)
    try {
      const params = { limit: 15, verificationStatus: verificationStatusFilter }
      if (roleFilter !== 'all') params.role = roleFilter
      const response = await adminAPI.getUnverifiedUsers(params)
      if (response.success) {
        setUnverifiedUsers(response.data.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
      // Don't show error toast if route doesn't exist (404) - backend might not be updated yet
      if (error.status !== 404) {
        toast.error('Error loading users')
      }
      // Set empty array on error so UI doesn't break
      setUnverifiedUsers([])
    } finally {
      setLoadingUnverified(false)
    }
  }

  const handleVerifyUser = async (userId, role, userName, currentStatus) => {
    if (!userId || !role) {
      toast.error('Invalid user data')
      return
    }

    // Check verification status using the same logic as in the table rendering
    const isCurrentlyVerified = currentStatus?.isVerified === true || 
      (role === 'employer' && currentStatus?.employerDetails?.adminApprovalStatus === 'approved') ||
      (role === 'college' && currentStatus?.collegeDetails?.adminApprovalStatus === 'approved')
    const shouldVerify = !isCurrentlyVerified

    setVerifyingUserId(userId)
    try {
      let response
      if (role === 'student' || role === 'content_writer') {
        response = await adminAPI.updateStudent(userId, { isVerified: shouldVerify })
      } else if (role === 'employer') {
        response = await adminAPI.approveEmployer(userId, shouldVerify ? 'approve' : 'reject', shouldVerify ? '' : 'Unverified by admin')
      } else if (role === 'college') {
        response = await adminAPI.approveCollege(userId, shouldVerify ? 'approve' : 'reject', { rejectionReason: shouldVerify ? '' : 'Unverified by admin' })
      } else {
        throw new Error(`Unsupported user role: ${role}`)
      }

      if (response && response.success) {
        const action = shouldVerify ? 'verified' : 'unverified'
        toast.success(`${getRoleDisplayName(role)} "${userName || 'User'}" ${action} successfully`)
        
        // Reload the user list to reflect the current filter state
        // This ensures users are removed/added based on the verification status filter
        await loadUnverifiedUsers()
        
        // Update dashboard stats in the background without blocking UI
        loadDashboardStats().catch(err => console.error('Error updating stats:', err))
      } else {
        throw new Error(response?.message || `${shouldVerify ? 'Verification' : 'Unverification'} failed`)
      }
    } catch (error) {
      console.error(`Error ${shouldVerify ? 'verifying' : 'unverifying'} user:`, error)
      const errorMessage = error.message || error.data?.message || `Failed to ${shouldVerify ? 'verify' : 'unverify'} user. Please try again.`
      toast.error(errorMessage)
      // Reload users on error to ensure consistency
      loadUnverifiedUsers().catch(err => console.error('Error reloading users:', err))
    } finally {
      setVerifyingUserId(null)
    }
  }

  const getRoleDisplayName = (role) => {
    const roleMap = {
      student: 'Student',
      employer: 'Employer',
      college: 'College',
      content_writer: 'Content Writer'
    }
    return roleMap[role] || role
  }

  const getRoleLink = (role) => {
    const linkMap = {
      student: '#/admin/students',
      employer: '#/admin/employers',
      college: '#/admin/colleges',
      content_writer: '#/admin/students'
    }
    return linkMap[role] || '#/admin/students'
  }

  const loadInternshipApplications = async () => {
    setLoadingApplications(true)
    try {
      const params = {
        page: applicationPagination.page,
        limit: applicationPagination.limit
      }
      if (applicationSearch) params.search = applicationSearch
      if (applicationStatusFilter !== 'all') params.status = applicationStatusFilter

      const response = await adminAPI.getAllInternshipApplications(params)
      if (response.success) {
        setInternshipApplications(response.data.applications || [])
        setApplicationPagination(response.data.pagination || applicationPagination)
      }
    } catch (error) {
      console.error('Error loading internship applications:', error)
      if (error.status !== 404) {
        toast.error('Error loading internship applications')
      }
      setInternshipApplications([])
    } finally {
      setLoadingApplications(false)
    }
  }

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'applied':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleUpdateApplicationStatus = async (applicationId, internshipId, newStatus) => {
    setUpdatingStatus(applicationId)
    try {
      const response = await internshipAPI.updateApplicationStatus(
        internshipId,
        applicationId,
        newStatus
      )
      if (response.success) {
        toast.success(`Application ${newStatus} successfully`)
        // Reload applications to get updated data
        await loadInternshipApplications()
      }
    } catch (error) {
      console.error('Error updating application status:', error)
      toast.error(error.message || 'Error updating application status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const loadWorkshopRegistrations = async () => {
    setLoadingWorkshopRegistrations(true)
    try {
      const params = {
        page: workshopRegistrationPagination.page,
        limit: workshopRegistrationPagination.limit
      }
      if (workshopRegistrationSearch) params.search = workshopRegistrationSearch
      if (workshopRegistrationStatusFilter !== 'all') params.status = workshopRegistrationStatusFilter

      const response = await adminAPI.getAllWorkshopRegistrations(params)
      if (response.success) {
        setWorkshopRegistrations(response.data.registrations || [])
        setWorkshopRegistrationPagination(response.data.pagination || workshopRegistrationPagination)
      }
    } catch (error) {
      console.error('Error loading workshop registrations:', error)
      if (error.status !== 404) {
        toast.error('Error loading workshop registrations')
      }
      setWorkshopRegistrations([])
    } finally {
      setLoadingWorkshopRegistrations(false)
    }
  }

  const getWorkshopRegistrationStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleUpdateWorkshopRegistrationStatus = async (registrationId, workshopId, newStatus) => {
    setUpdatingWorkshopStatus(registrationId)
    try {
      const response = await workshopAPI.updateRegistrationStatus(
        workshopId,
        registrationId,
        newStatus
      )
      if (response.success) {
        toast.success(`Registration ${newStatus} successfully`)
        // Reload registrations to get updated data
        await loadWorkshopRegistrations()
      }
    } catch (error) {
      console.error('Error updating workshop registration status:', error)
      toast.error(error.message || 'Error updating workshop registration status')
    } finally {
      setUpdatingWorkshopStatus(null)
    }
  }

  const statCards = stats
    ? [
        {
          title: 'Total Students',
          value: stats.widgets?.totalStudentsRegistered || 0,
          Icon: UsersIcon,
          gradient: 'from-blue-500 to-blue-600',
          iconBg: 'bg-blue-500/20',
          link: '#/admin/students',
        },
        {
          title: 'Total Employers',
          value: stats.widgets?.totalEmployersRegistered || 0,
          Icon: BuildingIcon,
          gradient: 'from-emerald-500 to-emerald-600',
          iconBg: 'bg-emerald-500/20',
          link: '#/admin/employers',
        },
        {
          title: 'Active Colleges',
          value: stats.widgets?.activeColleges || 0,
          Icon: SchoolIcon,
          gradient: 'from-purple-500 to-purple-600',
          iconBg: 'bg-purple-500/20',
          link: '#/admin/colleges',
        },
        {
          title: 'Total Courses',
          value: stats.widgets?.totalCourses || 0,
          Icon: BookIcon,
          gradient: 'from-amber-500 to-amber-600',
          iconBg: 'bg-amber-500/20',
          link: '#/admin/courses',
        },
        {
          title: 'Ongoing Internships',
          value: stats.widgets?.ongoingInternships || 0,
          Icon: BriefcaseIcon,
          gradient: 'from-indigo-500 to-indigo-600',
          iconBg: 'bg-indigo-500/20',
          link: '#/admin/internships',
        },
        {
          title: 'Unverified Users',
          value: stats.unverifiedUsers?.total || 0,
          Icon: CheckIcon,
          gradient: 'from-orange-500 to-orange-600',
          iconBg: 'bg-orange-500/20',
          link: null,
          badge: stats.unverifiedUsers?.total > 0 ? 'Needs Attention' : null,
        },
        {
          title: 'Total Revenue',
          value: `₹${((stats.widgets?.totalRevenue || 0) / 100).toLocaleString('en-IN')}`,
          Icon: RevenueIcon,
          gradient: 'from-teal-500 to-teal-600',
          iconBg: 'bg-teal-500/20',
        },
        {
          title: 'Monthly Revenue',
          value: `₹${((stats.widgets?.monthlyRevenue || 0) / 100).toLocaleString('en-IN')}`,
          Icon: ChartIcon,
          gradient: 'from-cyan-500 to-cyan-600',
          iconBg: 'bg-cyan-500/20',
        },
      ]
    : []

  // Loading Skeleton Component
  const StatCardSkeleton = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <div className="h-9 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-96 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">No data available</p>
        </div>
      </AdminLayout>
    )
  }

  const additionalStats = stats.additionalStats || {}
  const recentPayments = stats.recentPayments || []

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Overview of your platform statistics</p>
          </div>
          <button
            onClick={loadDashboardStats}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, index) => {
            const Icon = card.Icon
            const CardContent = (
              <div
                className={`bg-gradient-to-br ${card.gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  card.link ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white/90 text-sm font-medium">{card.title}</p>
                      {card.badge && (
                        <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-semibold rounded-full">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className={`${card.iconBg} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                {card.link && (
                  <div className="mt-4 flex items-center text-white/80 text-sm font-medium">
                    <span>View details</span>
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </div>
                )}
              </div>
            )

            return card.link ? (
              <a key={index} href={card.link}>
                {CardContent}
              </a>
            ) : (
              <div key={index}>{CardContent}</div>
            )
          })}
        </div>

        {/* Additional Stats and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Course Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookIcon className="w-5 h-5 text-primary-600" />
              Course Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">Published</span>
                <span className="font-semibold text-green-600 text-lg">
                  {additionalStats.publishedCourses || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">Draft</span>
                <span className="font-semibold text-amber-600 text-lg">
                  {additionalStats.draftCourses || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Platform Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ChartIcon className="w-5 h-5 text-primary-600" />
              Platform Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">Total Internships</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {additionalStats.totalInternships || 0}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">Enrolled Students</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {additionalStats.enrolledStudents || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <a
                href="#/admin/students"
                className="flex items-center justify-between w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors group"
              >
                <span>Manage Students</span>
                <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="#/admin/submissions"
                className="flex items-center justify-between w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 font-medium transition-colors group"
              >
                <span>Review Submissions</span>
                <ArrowRightIcon className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick User Verification */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CheckIcon className="w-5 h-5 text-primary-600" />
                Quick User Verification
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={verificationStatusFilter}
                  onChange={(e) => setVerificationStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Users</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="employer">Employers</option>
                  <option value="college">Colleges</option>
                  <option value="content_writer">Content Writers</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
              {loadingUnverified ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600">Loading users...</p>
                </div>
              ) : unverifiedUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No users found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {verificationStatusFilter === 'verified' 
                      ? 'No verified users found' 
                      : verificationStatusFilter === 'unverified'
                      ? 'All users have been verified'
                      : 'No users match the selected filters'}
                  </p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unverifiedUsers.map((user) => {
                      const isVerified = user.isVerified === true || 
                        (user.role === 'employer' && user.employerDetails?.adminApprovalStatus === 'approved') ||
                        (user.role === 'college' && user.collegeDetails?.adminApprovalStatus === 'approved')
                      return (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getRoleDisplayName(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleVerifyUser(user._id, user.role, user.name, user)
                              }}
                              disabled={verifyingUserId === user._id}
                              className={`flex items-center gap-1 font-medium transition-colors ${
                                verifyingUserId === user._id
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : isVerified
                                  ? 'text-red-600 hover:text-red-900'
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {verifyingUserId === user._id ? (
                                <>
                                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                  {isVerified ? 'Unverifying...' : 'Verifying...'}
                                </>
                              ) : (
                                <>
                                  {isVerified ? (
                                    <XIcon className="w-4 h-4" />
                                  ) : (
                                    <CheckIcon className="w-4 h-4" />
                                  )}
                                  {isVerified ? 'Unverify' : 'Verify'}
                                </>
                              )}
                            </button>
                            <a
                              href={getRoleLink(user.role)}
                              className="flex items-center gap-1 text-primary-600 hover:text-primary-900 font-medium"
                            >
                              View Details
                            </a>
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        {/* Registered Students for Internships */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-primary-600" />
                Registered Students for Internships
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={applicationSearch}
                  onChange={(e) => {
                    setApplicationSearch(e.target.value)
                    setApplicationPagination({ ...applicationPagination, page: 1 })
                  }}
                  placeholder="Search students..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <select
                  value={applicationStatusFilter}
                  onChange={(e) => {
                    setApplicationStatusFilter(e.target.value)
                    setApplicationPagination({ ...applicationPagination, page: 1 })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loadingApplications ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading applications...</p>
              </div>
            ) : internshipApplications.length === 0 ? (
              <div className="p-12 text-center">
                <BriefcaseIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No applications found</p>
                <p className="text-gray-400 text-sm mt-1">Students who apply for internships will appear here</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        College
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Course
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Internship
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {internshipApplications.map((application, index) => {
                      const applicationId = application._id || application.id || `${application.internshipId}-${application.studentId}-${index}`
                      const isUpdating = updatingStatus === applicationId
                      return (
                      <tr key={applicationId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {application.studentName || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{application.studentEmail || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{application.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{application.collegeName || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{application.course || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{application.year || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{application.internshipTitle || 'N/A'}</div>
                          <div className="text-xs text-gray-400">{application.companyName || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getApplicationStatusColor(application.status)}`}>
                            {application.status || 'applied'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {application.appliedAt
                            ? new Date(application.appliedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap gap-2">
                            {application.status !== 'shortlisted' && (
                              <button
                                onClick={() => handleUpdateApplicationStatus(
                                  applicationId,
                                  application.internshipId,
                                  'shortlisted'
                                )}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdating ? 'Updating...' : 'Shortlist'}
                              </button>
                            )}
                            {application.status !== 'accepted' && (
                              <button
                                onClick={() => handleUpdateApplicationStatus(
                                  applicationId,
                                  application.internshipId,
                                  'accepted'
                                )}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdating ? 'Updating...' : 'Accept'}
                              </button>
                            )}
                            {application.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateApplicationStatus(
                                  applicationId,
                                  application.internshipId,
                                  'rejected'
                                )}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdating ? 'Updating...' : 'Reject'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* Pagination */}
                {applicationPagination.pages > 1 && (
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Showing {((applicationPagination.page - 1) * applicationPagination.limit) + 1} to{' '}
                      {Math.min(applicationPagination.page * applicationPagination.limit, applicationPagination.total)} of{' '}
                      {applicationPagination.total} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setApplicationPagination({ ...applicationPagination, page: applicationPagination.page - 1 })}
                        disabled={applicationPagination.page === 1}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        onClick={() => setApplicationPagination({ ...applicationPagination, page: applicationPagination.page + 1 })}
                        disabled={applicationPagination.page >= applicationPagination.pages}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
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

        {/* Registered Students for Workshops */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <BookIcon className="w-5 h-5 text-primary-600" />
                Registered Students for Workshops
              </h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={workshopRegistrationSearch}
                  onChange={(e) => {
                    setWorkshopRegistrationSearch(e.target.value)
                    setWorkshopRegistrationPagination({ ...workshopRegistrationPagination, page: 1 })
                  }}
                  placeholder="Search students..."
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
                <select
                  value={workshopRegistrationStatusFilter}
                  onChange={(e) => {
                    setWorkshopRegistrationStatusFilter(e.target.value)
                    setWorkshopRegistrationPagination({ ...workshopRegistrationPagination, page: 1 })
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {loadingWorkshopRegistrations ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading registrations...</p>
              </div>
            ) : workshopRegistrations.length === 0 ? (
              <div className="p-12 text-center">
                <BookIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No registrations found</p>
                <p className="text-gray-400 text-sm mt-1">Students who register for workshops will appear here</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Workshop
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Registered Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workshopRegistrations.map((registration, index) => {
                      const registrationId = registration._id || registration.id || `${registration.workshopId}-${registration.userId}-${index}`
                      const isUpdating = updatingWorkshopStatus === registrationId
                      return (
                      <tr key={registrationId} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {registration.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{registration.email || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{registration.phone || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">{registration.company || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{registration.workshopTitle || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getWorkshopRegistrationStatusColor(registration.status)}`}>
                            {registration.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {registration.registeredAt
                            ? new Date(registration.registeredAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap gap-2">
                            {registration.status !== 'accepted' && (
                              <button
                                onClick={() => handleUpdateWorkshopRegistrationStatus(
                                  registrationId,
                                  registration.workshopId,
                                  'accepted'
                                )}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdating ? 'Updating...' : 'Accept'}
                              </button>
                            )}
                            {registration.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateWorkshopRegistrationStatus(
                                  registrationId,
                                  registration.workshopId,
                                  'rejected'
                                )}
                                disabled={isUpdating}
                                className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdating ? 'Updating...' : 'Reject'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* Pagination */}
                {workshopRegistrationPagination.pages > 1 && (
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-700">
                      Showing {((workshopRegistrationPagination.page - 1) * workshopRegistrationPagination.limit) + 1} to{' '}
                      {Math.min(workshopRegistrationPagination.page * workshopRegistrationPagination.limit, workshopRegistrationPagination.total)} of{' '}
                      {workshopRegistrationPagination.total} results
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setWorkshopRegistrationPagination({ ...workshopRegistrationPagination, page: workshopRegistrationPagination.page - 1 })}
                        disabled={workshopRegistrationPagination.page === 1}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
                      >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Previous
                      </button>
                      <button
                        onClick={() => setWorkshopRegistrationPagination({ ...workshopRegistrationPagination, page: workshopRegistrationPagination.page + 1 })}
                        disabled={workshopRegistrationPagination.page >= workshopRegistrationPagination.pages}
                        className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm"
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

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <RevenueIcon className="w-5 h-5 text-primary-600" />
              Recent Payments
            </h2>
          </div>
          <div className="overflow-x-auto">
            {recentPayments.length === 0 ? (
              <div className="p-12 text-center">
                <RevenueIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No recent payments</p>
                <p className="text-gray-400 text-sm mt-1">Payments will appear here once transactions are made</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentPayments.map((payment) => (
                    <tr key={payment._id || payment.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.orderId || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="font-medium">{payment.userName || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{payment.userEmail || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ₹{((payment.amount || 0) / 100).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
