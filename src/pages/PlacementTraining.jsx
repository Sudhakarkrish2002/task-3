import React, { useState, useEffect, useRef } from 'react'
import { courseAPI } from '../utils/api.js'
import { partnerCompanies } from '../utils/partnerCompanies.js'

const successStories = [
  {
    name: 'Priya Sharma',
    course: 'Full-Stack Web Development',
    company: 'TechCorp',
    salary: '₹10 LPA',
    quote: 'The mentorship and live sessions helped me land my dream job at a top tech company within 2 months of completion.',
    image: 'PS',
  },
  {
    name: 'Rajesh Kumar',
    course: 'Data Science & ML',
    company: 'DataViz',
    salary: '₹12 LPA',
    quote: 'The placement support team worked tirelessly with me. Got placed at a leading data analytics firm with an amazing package.',
    image: 'RK',
  },
  {
    name: 'Anita Patel',
    course: 'DevOps Engineering',
    company: 'CloudNova',
    salary: '₹11 LPA',
    quote: 'From zero knowledge to getting hired - the training program transformed my career completely. Highly recommended!',
    image: 'AP',
  },
]

const successMetrics = [
  { label: 'Placement Rate', value: '90%', description: 'Average placement rate across all programs' },
  { label: 'Average Salary', value: '₹9.2 LPA', description: 'Average starting salary for placed students' },
  { label: 'Hiring Partners', value: '500+', description: 'Companies actively hiring our graduates' },
  { label: 'Students Placed', value: '15,000+', description: 'Total students successfully placed' },
]

const deriveFeatures = (course) => {
  if (Array.isArray(course.features) && course.features.length) return course.features
  if (Array.isArray(course.keyHighlights) && course.keyHighlights.length) return course.keyHighlights
  if (Array.isArray(course.learningOutcomes) && course.learningOutcomes.length) return course.learningOutcomes
  if (course.description) {
    return course.description
      .split('.')
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 4)
  }
  return []
}

export default function PlacementTraining() {
  const [placementCourses, setPlacementCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [coursesError, setCoursesError] = useState(null)
  const [animatedValues, setAnimatedValues] = useState({
    'Placement Rate': 0,
    'Average Salary': 0,
    'Hiring Partners': 0,
    'Students Placed': 0,
  })
  const [hasAnimated, setHasAnimated] = useState(false)
  const metricsRef = useRef(null)

  useEffect(() => {
    loadPlacementCourses()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateMetrics()
          }
        })
      },
      { threshold: 0.3 }
    )

    if (metricsRef.current) {
      observer.observe(metricsRef.current)
    }

    return () => {
      if (metricsRef.current) {
        observer.unobserve(metricsRef.current)
      }
    }
  }, [hasAnimated])

  const parseValue = (value) => {
    if (value.includes('%')) {
      return { numericValue: parseFloat(value.replace('%', '')), format: 'percentage' }
    } else if (value.includes('₹')) {
      return { numericValue: parseFloat(value.replace(/[₹,LPA]/g, '')), format: 'currency' }
    } else if (value.includes('+')) {
      const numStr = value.replace(/[+,]/g, '')
      return { numericValue: parseFloat(numStr), format: 'numberWithPlus' }
    }
    return { numericValue: parseFloat(value), format: 'number' }
  }

  const formatValue = (numericValue, format, originalValue) => {
    if (format === 'percentage') {
      return `${Math.round(numericValue)}%`
    } else if (format === 'currency') {
      return `₹${numericValue.toFixed(1)} LPA`
    } else if (format === 'numberWithPlus') {
      if (numericValue >= 1000) {
        return `${Math.round(numericValue).toLocaleString('en-IN')}+`
      }
      return `${Math.round(numericValue)}+`
    }
    return Math.round(numericValue).toString()
  }

  const animateMetrics = () => {
    successMetrics.forEach((metric) => {
      const { numericValue, format } = parseValue(metric.value)
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = numericValue / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          current = numericValue
          clearInterval(timer)
        }

        setAnimatedValues((prev) => ({
          ...prev,
          [metric.label]: current,
        }))
      }, duration / steps)
    })
  }

  const loadPlacementCourses = async () => {
    setLoadingCourses(true)
    setCoursesError(null)
    try {
      const response = await courseAPI.getAllCourses({ limit: 100 })
      if (response.success) {
        const list = (response.data?.courses || []).filter(
          (course) => course.placementGuaranteed || course.category === 'placement_training'
        )
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setPlacementCourses(list)
      } else {
        throw new Error(response.message || 'Unable to load placement programs')
      }
    } catch (err) {
      console.error('Error loading placement courses:', err)
      setCoursesError(err.message || 'Unable to load placement programs right now.')
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleViewSyllabus = (course) => {
    // Navigate to syllabus page with course details as query params
    const params = new URLSearchParams({
      title: course.title,
      description: course.description || '',
      duration: course.duration || '',
      type: 'placement'
    })
    
    // If course has an ID, include it for API fetching
    if (course._id || course.id) {
      params.set('id', course._id || course.id)
    }
    
    window.location.hash = `#/courses/syllabus?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative pt-16 border-b border-primary-200 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Assets/banner-placement-training.jpeg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-r from-primary-900/75 to-primary-700/60"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Placement-Guaranteed Training Programs
          </h1>
          <p className="mt-4 text-lg text-white/95 drop-shadow-md">
            Get job-ready with our comprehensive training and dedicated placement support
          </p>
        </div>
      </section>

      {/* Guarantee Description */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Placement Guarantee</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We guarantee your placement success through our comprehensive training approach. Our programs are designed 
              to make you industry-ready with hands-on experience, expert mentorship, and dedicated job support.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Sessions</h3>
                <p className="text-sm text-gray-600">
                  Interactive live coding sessions with industry experts. Ask questions, get real-time feedback, and learn from the best.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Mentoring</h3>
                <p className="text-sm text-gray-600">
                  1-on-1 mentorship sessions with industry professionals. Get personalized guidance on your career path and skill development.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Support</h3>
                <p className="text-sm text-gray-600">
                  Dedicated placement support team helps with resume building, interview preparation, and connects you with hiring partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section ref={metricsRef} className="py-12 bg-linear-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Success Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {successMetrics.map((metric, idx) => {
              const { format } = parseValue(metric.value)
              const animatedValue = animatedValues[metric.label]
              const displayValue = formatValue(animatedValue, format, metric.value)
              return (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{displayValue}</div>
                  <div className="text-primary-100 font-medium mb-1">{metric.label}</div>
                  <div className="text-sm text-primary-200">{metric.description}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Placement Courses */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Placement-Guaranteed Programs</h2>
            <p className="text-gray-600">Choose a program that aligns with your career goals</p>
          </div>

          {loadingCourses ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading placement-guaranteed programs...</p>
            </div>
          ) : coursesError ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{coursesError}</p>
              <button
                onClick={loadPlacementCourses}
                className="mt-4 text-primary-700 hover:text-primary-800 font-semibold"
              >
                Retry loading
              </button>
            </div>
          ) : placementCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No placement-guaranteed programs are published yet. Please check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {placementCourses.map((course) => {
                const courseId = course._id || course.id
                const tagline = course.tagline || course.shortDescription || 'Placement-focused program'
                const placementRate = course.placementRate || course.successRate || 'Guaranteed support'
                const avgSalary = course.avgSalary || course.averageSalary || 'Top industry packages'
                const features = deriveFeatures(course)
                return (
                  <div
                    key={courseId}
                    className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
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
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Placement Guaranteed
                          </span>
                        </div>
                      <div className="mt-2 p-3 rounded-lg bg-primary-50 border border-primary-200">
                        <div className="text-sm font-semibold text-primary-900">{tagline}</div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3">{course.description || 'Program details coming soon.'}</p>
                    </div>

                    {/* Course Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Duration</div>
                        <div className="text-sm font-semibold text-gray-900">{course.duration || 'Flexible'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Placement Rate</div>
                        <div className="text-sm font-semibold text-green-700">{placementRate}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Average Salary</div>
                        <div className="text-sm font-semibold text-gray-900">{avgSalary}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Program Type</div>
                        <div className="text-sm font-semibold text-gray-900">Guaranteed</div>
                      </div>
                    </div>

                    {/* Course Features */}
                    {features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Program Features:</h4>
                        <ul className="space-y-2">
                          {features.map((feature, idx) => (
                            <li key={`${courseId}-feature-${idx}`} className="flex items-start gap-2 text-sm text-gray-600">
                              <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Buttons */}
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
                      <button className="flex-1 rounded-lg bg-primary-600 px-6 py-4 text-white text-base font-bold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden">
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

      {/* Success Stories */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Stories</h2>
            <p className="text-gray-600">Real stories from students who got placed through our programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {story.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-600">{story.course}</div>
                  </div>
                </div>
                <blockquote className="text-sm text-gray-700 italic mb-4">"{story.quote}"</blockquote>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">Placed at</div>
                    <div className="text-sm font-semibold text-gray-900">{story.company}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">Package</div>
                    <div className="text-sm font-semibold text-primary-700">{story.salary}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Placement Partners */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Placement Partners</h2>
            <p className="text-gray-600">Top companies that hire from our placement-guaranteed programs</p>
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

