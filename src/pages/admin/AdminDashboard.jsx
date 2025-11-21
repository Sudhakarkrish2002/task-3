import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { adminAPI } from '../../utils/api.js'
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
  CalendarIcon,
  CheckIcon,
} from '../../components/admin/Icons.jsx'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [unverifiedUsers, setUnverifiedUsers] = useState([])
  const [loadingUnverified, setLoadingUnverified] = useState(false)
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    loadDashboardStats()
  }, [])

  useEffect(() => {
    loadUnverifiedUsers()
  }, [roleFilter])

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
      const params = { limit: 15 }
      if (roleFilter !== 'all') params.role = roleFilter
      const response = await adminAPI.getUnverifiedUsers(params)
      if (response.success) {
        setUnverifiedUsers(response.data.users || [])
      }
    } catch (error) {
      console.error('Error loading unverified users:', error)
      // Don't show error toast if route doesn't exist (404) - backend might not be updated yet
      if (error.status !== 404) {
        toast.error('Error loading unverified users')
      }
      // Set empty array on error so UI doesn't break
      setUnverifiedUsers([])
    } finally {
      setLoadingUnverified(false)
    }
  }

  const handleVerifyUser = async (userId, role) => {
    try {
      let response
      if (role === 'student') {
        response = await adminAPI.updateStudent(userId, { isVerified: true })
      } else if (role === 'employer') {
        response = await adminAPI.approveEmployer(userId, 'approve')
      } else if (role === 'college') {
        response = await adminAPI.approveCollege(userId, 'approve')
      } else if (role === 'content_writer') {
        // Content writers use the same updateStudent endpoint (now supports content_writer role)
        response = await adminAPI.updateStudent(userId, { isVerified: true })
      }

      if (response && response.success) {
        toast.success('User verified successfully')
        loadUnverifiedUsers()
        loadDashboardStats()
      }
    } catch (error) {
      console.error('Error verifying user:', error)
      toast.error('Error verifying user')
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
                <span className="text-gray-600">Active Blogs</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {additionalStats.activeBlogs || 0}
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
                href="#/admin/blogs"
                className="flex items-center justify-between w-full text-left px-4 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 font-medium transition-colors group"
              >
                <span>Review Blogs</span>
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
        {stats?.unverifiedUsers?.total > 0 && unverifiedUsers.length >= 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-primary-600" />
                  Quick User Verification
                </h2>
                <div className="flex items-center gap-2">
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
                  <p className="mt-4 text-gray-600">Loading unverified users...</p>
                </div>
              ) : unverifiedUsers.length === 0 ? (
                <div className="p-12 text-center">
                  <CheckIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No unverified users found</p>
                  <p className="text-gray-400 text-sm mt-1">All users have been verified</p>
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
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unverifiedUsers.map((user) => (
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
                              onClick={() => handleVerifyUser(user._id, user.role)}
                              className="flex items-center gap-1 text-green-600 hover:text-green-900 font-medium"
                            >
                              <CheckIcon className="w-4 h-4" />
                              Verify
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
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

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
