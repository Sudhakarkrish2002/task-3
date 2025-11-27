import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { courseAPI } from '../utils/api.js'
import { processRazorpayPayment } from '../utils/razorpay.js'
import { getDisplayStudentCount, formatStudentCount } from '../utils/courseUtils.js'

const categories = ['All', 'certification', 'placement_training', 'workshop', 'other']
const categoryLabels = {
  'All': 'All',
  'certification': 'Certification',
  'placement_training': 'Placement Training',
  'workshop': 'Workshop',
  'other': 'Regular Courses'
}

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All')

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const response = await courseAPI.getAllCourses({ limit: 100 })
      if (response.success) {
        setCourses(response.data.courses || [])
      }
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique durations from courses
  const durations = ['All', ...new Set(courses.map(c => c.duration).filter(Boolean))]

  const filteredCourses = courses.filter((course) => {
    const matchCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchDuration = selectedDuration === 'All' || course.duration === selectedDuration
    return matchCategory && matchDuration
  })

  const formatPrice = (price) => {
    if (!price) return 'Free'
    return `₹${price.toLocaleString('en-IN')}`
  }

  const getTag = (course) => {
    if (course.placementGuaranteed) {
      return { text: 'Placement-Guaranteed', color: 'bg-green-100 text-green-800' }
    }
    return null
  }

  const handleViewSyllabus = (course) => {
    // Navigate to syllabus page with course details as query params
    const params = new URLSearchParams({
      title: course.title,
      description: course.description || course.shortDescription || '',
      duration: course.duration || '',
      fee: formatPrice(course.price),
      type: 'course'
    })
    
    // If course has an ID, include it for API fetching
    if (course._id) {
      params.set('id', course._id)
    }
    
    window.location.hash = `#/courses/syllabus?${params.toString()}`
  }

  const handleEnroll = async (course) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast.info('Please sign in to enroll in courses')
        // Preserve current page for redirect after login
        const currentHash = window.location.hash || '#/courses'
        window.location.href = `/#/auth?redirect=${encodeURIComponent(currentHash)}`
        return
      }

      // Verify user data exists
      const userData = localStorage.getItem('user')
      if (!userData) {
        toast.info('Please sign in to enroll in courses')
        const currentHash = window.location.hash || '#/courses'
        window.location.href = `/#/auth?redirect=${encodeURIComponent(currentHash)}`
        return
      }

      let user
      try {
        user = JSON.parse(userData)
      } catch (err) {
        console.error('Error parsing user data:', err)
        toast.info('Please sign in to enroll in courses')
        const currentHash = window.location.hash || '#/courses'
        window.location.href = `/#/auth?redirect=${encodeURIComponent(currentHash)}`
        return
      }
      
      // Check if user is a student
      if (user.role !== 'student') {
        toast.error('Only students can enroll in courses')
        return
      }

      // If course is free, enroll directly
      if (!course.price || course.price === 0) {
        try {
          const response = await courseAPI.enrollInCourse(course._id)
          if (response.success) {
            toast.success(`Successfully enrolled in ${course.title}!`)
            // Redirect to dashboard or course page
            window.location.hash = '#/dashboard/student'
          }
        } catch (error) {
          toast.error(error.message || 'Failed to enroll in course')
        }
        return
      }

      // For paid courses, redirect to Razorpay
      // Send amount in rupees, backend will convert to paise
      const amount = parseFloat(course.price)
      
      if (isNaN(amount) || amount <= 0) {
        toast.error('Invalid course price. Please contact support.')
        return
      }
      
      await processRazorpayPayment({
        amount,
        currency: 'INR',
        items: [{
          itemId: course._id,
          itemName: course.title,
          itemType: 'course',
          quantity: 1,
          price: amount
        }],
        user: {
          name: user.name,
          email: user.email,
          phone: user.phone || ''
        },
        metadata: {
          courseId: course._id,
          courseTitle: course.title
        },
        onSuccess: async (paymentData) => {
          toast.success(`Payment successful! You have been enrolled in ${course.title}`)
          // Redirect to dashboard
          setTimeout(() => {
            window.location.hash = '#/dashboard/student'
          }, 2000)
        },
        onError: (error) => {
          console.error('Payment error:', error)
          const errorMessage = error.data?.message || error.message || 'Payment failed. Please try again.'
          toast.error(errorMessage)
        }
      })
    } catch (error) {
      console.error('Enrollment error:', error)
      toast.error('Failed to process enrollment. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative pt-16 border-b border-primary-200 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Assets/banner-courses.jpeg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-primary-900/75 to-primary-700/60"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
            Our Courses – Upskill, Certify, Get Hired
          </h1>
          <p className="mt-3 text-sm text-white/95 drop-shadow-md">
            Choose from our wide range of industry-relevant courses designed to transform your career
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            {loading ? 'Loading courses...' : `Showing ${filteredCourses.length} of ${courses.length} courses`}
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedDuration('All')
                }}
                className="mt-4 text-primary-700 hover:text-primary-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const tag = getTag(course)
                return (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-gray-400/50 transition-shadow flex flex-col h-full"
                  >
                    {/* Course Thumbnail */}
                    {course.thumbnail ? (
                      <div className="w-full bg-gray-100 flex items-center justify-center py-3" style={{ maxHeight: '300px' }}>
                        <img
                          src={course.thumbnail.startsWith('data:') ? course.thumbnail : `data:image/jpeg;base64,${course.thumbnail}`}
                          alt={course.title}
                          className="h-auto w-auto max-h-72 object-contain"
                          style={{ maxHeight: '300px' }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.className = 'w-full h-48 bg-gray-100 flex items-center justify-center'
                            e.target.parentElement.innerHTML = '<svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>'
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    <div className="p-6 flex flex-col h-full">
                      <div className="flex-1 flex flex-col">
                        {/* Tag */}
                        {tag && (
                          <div className="mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${tag.color}`}>
                              {tag.text}
                            </span>
                          </div>
                        )}

                        {/* Course Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {course.shortDescription || course.description}
                        </p>

                        {/* Course Details */}
                        <div className="space-y-2 mb-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>{formatStudentCount(getDisplayStudentCount(course))} students</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="font-semibold text-gray-900">{formatPrice(course.price)}</span>
                            </div>
                            <div className="flex flex-col items-end">
                              {course.originalPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  {formatPrice(course.originalPrice)}
                                </span>
                              )}
                              {course.price && course.price > 0 ? (
                                <span className="mt-1 px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                                  PAID
                                </span>
                              ) : (
                                <span className="mt-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                  FREE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - pinned to bottom */}
                      <div className="mt-2 flex gap-3">
                        <button
                          onClick={() => handleViewSyllabus(course)}
                          className="flex-1 rounded-lg border-2 border-primary-600 px-4 py-3 text-primary-700 text-sm font-semibold transition-all duration-300 ease-in-out shadow-md hover:scale-105 hover:bg-primary-50 hover:shadow-xl hover:shadow-primary-400/30 relative overflow-hidden"
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            View More
                          </span>
                          <span className="absolute inset-0 bg-linear-to-br from-primary-50 to-primary-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                        <button 
                          onClick={() => handleEnroll(course)}
                          className="flex-1 rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-bold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
                        >
                          <span className="relative z-10">Enroll Now</span>
                          <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

