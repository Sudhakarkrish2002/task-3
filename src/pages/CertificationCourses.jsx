import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { courseAPI } from '../utils/api.js'
import { partnerCompanies } from '../utils/partnerCompanies.js'
import { processRazorpayPayment } from '../utils/razorpay.js'

export default function CertificationCourses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCertificationCourses()
  }, [])

  const loadCertificationCourses = async () => {
    setLoading(true)
    try {
      const response = await courseAPI.getAllCourses({ category: 'certification', limit: 100 })
      if (response.success) {
        setCourses(response.data.courses || [])
      }
    } catch (error) {
      console.error('Error loading certification courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (!price) return 'Free'
    return `₹${price.toLocaleString('en-IN')}`
  }

  const handleViewSyllabus = (course) => {
    // Navigate to syllabus page with course details as query params
    const params = new URLSearchParams({
      title: course.title,
      description: course.description || course.shortDescription || '',
      duration: course.duration || '',
      fee: formatPrice(course.price),
      type: 'certification'
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
        const currentHash = window.location.hash || '#/courses/certifications'
        window.location.href = `/#/auth?redirect=${encodeURIComponent(currentHash)}`
        return
      }

      // Verify user data exists
      const userData = localStorage.getItem('user')
      if (!userData) {
        toast.info('Please sign in to enroll in courses')
        const currentHash = window.location.hash || '#/courses/certifications'
        window.location.href = `/#/auth?redirect=${encodeURIComponent(currentHash)}`
        return
      }

      let user
      try {
        user = JSON.parse(userData)
      } catch (err) {
        console.error('Error parsing user data:', err)
        toast.info('Please sign in to enroll in courses')
        const currentHash = window.location.hash || '#/courses/certifications'
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

  // Extract features from syllabus or use defaults
  const getCourseFeatures = (course) => {
    if (course.syllabus && course.syllabus.learningOutcomes && course.syllabus.learningOutcomes.length > 0) {
      return course.syllabus.learningOutcomes.slice(0, 4)
    }
    // Default features if no syllabus
    return [
      'Live interactive sessions',
      'Industry projects',
      'Career support',
      'Certificate of completion',
    ]
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative pt-16 border-b border-primary-200 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Assets/banner-certifications.jpeg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-primary-900/75 to-primary-700/60"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Industry-Recognised Certification Programs
          </h1>
          <p className="mt-4 text-lg text-white/95 drop-shadow-md">
            Get certified, boost your resume, and stand out in the job market
          </p>
        </div>
      </section>

      {/* What Certification Means */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Get Certified?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Skills</h3>
                <p className="text-sm text-gray-600">
                  Earn credentials that prove your expertise to employers and validate your technical abilities.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Boost</h3>
                <p className="text-sm text-gray-600">
                  Stand out from other candidates with industry-recognized certifications that highlight your commitment to learning.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Growth</h3>
                <p className="text-sm text-gray-600">
                  Open doors to better job opportunities, higher salaries, and faster career advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Certification Courses */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Top Certification Courses</h2>
            <p className="text-gray-600">Choose from our most popular industry-recognized programs</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading certification courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No certification courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => {
                const features = getCourseFeatures(course)
                return (
                  <div key={course._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Course Thumbnail */}
                    {course.thumbnail ? (
                      <div className="w-full bg-gray-100 overflow-hidden flex items-center justify-center" style={{ maxHeight: '300px' }}>
                        <img
                          src={course.thumbnail.startsWith('data:') ? course.thumbnail : `data:image/jpeg;base64,${course.thumbnail}`}
                          alt={course.title}
                          className="w-full h-auto object-contain"
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

                    <div className="p-6">
                      {/* Course Header */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.shortDescription || course.description}</p>
                      </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="text-sm font-semibold text-gray-900">{course.duration}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Learners</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {course.enrolledCount ? `${course.enrolledCount.toLocaleString()}+` : '0+'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Rating</div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-900">
                            {course.rating ? course.rating.toFixed(1) : '4.5'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Features */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Call to Action Buttons */}
                    <div className="flex gap-3">
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
                        className="flex-1 rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-bold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
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

      {/* Companies Hiring Certified Students */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Companies Hiring Certified Students</h2>
            <p className="text-gray-600">Get hired by top companies with industry-recognized certifications</p>
          </div>

          {/* Row 1 - Scroll Left */}
          <div className="partner-scroll-container mb-4">
            <div className="partner-scroll-content scroll-left">
              {partnerCompanies.map((company) => (
                <div
                  key={`left-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
              {partnerCompanies.map((company) => (
                <div
                  key={`left-duplicate-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Scroll Right */}
          <div className="partner-scroll-container">
            <div className="partner-scroll-content scroll-right">
              {[...partnerCompanies].reverse().map((company) => (
                <div
                  key={`right-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
              {[...partnerCompanies].reverse().map((company) => (
                <div
                  key={`right-duplicate-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

