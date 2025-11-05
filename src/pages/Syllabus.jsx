import React, { useEffect, useState } from 'react'
import { courseSyllabus, certificationCourseSyllabus, placementCourseSyllabus } from '../utils/courseSyllabus.js'
import { courseAPI } from '../utils/api.js'

export default function Syllabus() {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState({})
  const [activeTab, setActiveTab] = useState('Syllabus')
  const [enrollmentData, setEnrollmentData] = useState({
    mobile: '',
    batch: '',
    objective: ''
  })

  // Store course view in localStorage
  const storeCourseView = (courseData) => {
    try {
      const viewHistory = JSON.parse(localStorage.getItem('courseViewHistory') || '[]')
      const viewEntry = {
        courseId: courseData.id || courseData.title,
        courseTitle: courseData.title,
        viewedAt: new Date().toISOString(),
        courseType: courseData.type || 'course',
        duration: courseData.duration,
        fee: courseData.fee || courseData.discountPrice
      }
      
      // Remove duplicate if exists
      const filteredHistory = viewHistory.filter(v => v.courseId !== viewEntry.courseId)
      // Add new entry at the beginning
      const updatedHistory = [viewEntry, ...filteredHistory].slice(0, 10) // Keep last 10 views
      
      localStorage.setItem('courseViewHistory', JSON.stringify(updatedHistory))
      
      // Also store current course details for quick access
      localStorage.setItem('currentCourseView', JSON.stringify(courseData))
    } catch (error) {
      console.error('Error storing course view:', error)
    }
  }

  useEffect(() => {
    const loadCourse = async () => {
      try {
        // Get course info from URL hash/query params
        const hash = window.location.hash
        const params = new URLSearchParams(hash.split('?')[1] || '')
        const courseId = params.get('id')
        const courseTitle = params.get('title')
        const courseType = params.get('type') || 'course' // 'course' or 'certification'

        if (courseId) {
          // Try to fetch from API
          try {
            const response = await courseAPI.getCourseSyllabus(courseId)
            if (response.success && response.data) {
              const courseData = {
                ...response.data,
                syllabus: response.data.syllabus,
                id: courseId,
                type: courseType
              }
              setCourse(courseData)
              storeCourseView(courseData)
              setLoading(false)
              return
            }
          } catch (error) {
            console.log('API fetch failed, trying fallback:', error)
          }
        }

        // Fallback to static data
        if (courseTitle) {
          let syllabusData
          if (courseType === 'certification') {
            syllabusData = certificationCourseSyllabus[courseTitle]
          } else if (courseType === 'placement') {
            syllabusData = placementCourseSyllabus?.[courseTitle] || courseSyllabus[courseTitle]
          } else {
            syllabusData = courseSyllabus[courseTitle]
          }

          // Try to get course details from localStorage or construct from title
          const courseData = {
            title: courseTitle,
            id: courseTitle,
            description: params.get('description') || '',
            duration: params.get('duration') || '6 weeks',
            fee: params.get('fee') || '',
            originalPrice: params.get('originalPrice') || '',
            discountPrice: params.get('discountPrice') || params.get('fee') || '',
            syllabus: syllabusData,
            type: courseType
          }

          setCourse(courseData)
          storeCourseView(courseData)
        } else {
          // If no course data found, show error
          setCourse(null)
        }
      } catch (error) {
        console.error('Error loading course:', error)
        setCourse(null)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [])

  const handleBack = () => {
    window.history.back()
  }

  const toggleModule = (index) => {
    setExpandedModules(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  // Store enrollment interest
  const handleEnrollmentInterest = (data) => {
    try {
      const enrollmentHistory = JSON.parse(localStorage.getItem('enrollmentInterests') || '[]')
      const interestEntry = {
        courseId: course?.id || course?.title,
        courseTitle: course?.title,
        mobile: data.mobile,
        batch: data.batch,
        objective: data.objective,
        timestamp: new Date().toISOString()
      }
      
      enrollmentHistory.push(interestEntry)
      localStorage.setItem('enrollmentInterests', JSON.stringify(enrollmentHistory))
      
      // Show success message or redirect
      alert('Your interest has been recorded! We will contact you soon.')
      setEnrollmentData({ mobile: '', batch: '', objective: '' })
    } catch (error) {
      console.error('Error storing enrollment interest:', error)
    }
  }

  const handleEnroll = (e) => {
    e.preventDefault()
    if (enrollmentData.mobile && enrollmentData.batch && enrollmentData.objective) {
      handleEnrollmentInterest(enrollmentData)
    } else {
      alert('Please fill in all fields')
    }
  }

  // Calculate statistics
  const getCourseStats = () => {
    if (!course?.syllabus) return null
    
    const modules = course.syllabus.modules || []
    const totalTopics = modules.reduce((sum, module) => {
      return sum + (module.topics?.length || 0)
    }, 0)
    const totalProjects = course.syllabus.projects?.length || 0
    const totalAssignments = 4 // Default value, can be customized
    const totalVideos = totalTopics + modules.length // Approximate video count
    const aiTools = course.syllabus.aiTools || []
    
    return {
      modules: modules.length,
      topics: totalTopics,
      projects: totalProjects,
      assignments: totalAssignments,
      videos: totalVideos,
      aiTools: aiTools.length,
      hasVideos: true
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course syllabus...</p>
        </div>
      </main>
    )
  }

  if (!course) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
            <p className="text-gray-600 mb-6">The course syllabus you're looking for could not be found.</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    )
  }

  const stats = getCourseStats()
  const navTabs = ['Certificate', 'Placement', 'Syllabus', 'Projects', 'Teachers']

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return ''
    if (typeof price === 'string' && price.includes('₹')) return price
    return `₹${price}`
  }

  const originalPrice = course.originalPrice || (course.fee ? `₹${parseInt(course.fee.replace(/[₹,]/g, '')) * 3}` : '₹4499')
  const discountedPrice = course.discountPrice || course.fee || '₹1349'

  // Generate upcoming batches
  const upcomingBatches = [
    { date: '5th Nov, 2025', status: 'Filling fast' },
    { date: '12th Nov, 2025', status: 'Available' },
    { date: '19th Nov, 2025', status: 'Available' }
  ]

  // Learning objectives
  const objectives = [
    'Get a job in AI/ML field',
    'Start my own startup',
    'Enhance my current skills',
    'Switch to AI/ML career',
    'Learn for personal interest'
  ]

  return (
    <main className="min-h-screen bg-white w-full overflow-x-hidden" style={{ transform: 'translateZ(0)', willChange: 'scroll-position' }}>
      {/* Navigation Tabs & Pricing Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10 w-full" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4 gap-4 w-full">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
              {navTabs.map((tab) => (
          <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 px-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
          </button>
              ))}
            </div>

            {/* Pricing & Enroll Button */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right min-w-0">
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                  <span className="text-lg sm:text-2xl font-bold text-orange-600 whitespace-nowrap">{formatPrice(discountedPrice)}</span>
                  {originalPrice && (
                    <span className="text-xs sm:text-lg text-gray-500 line-through whitespace-nowrap">{formatPrice(originalPrice)}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">Valid till 5th Nov</p>
              </div>
              <button className="px-3 sm:px-6 py-2 bg-primary-600 text-white text-xs sm:text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap shrink-0">
                Enroll Now
              </button>
              </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-700 min-h-[500px] sm:min-h-[600px]" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
        {/* Animated Background Patterns */}
        <div className="absolute inset-0">
          {/* Gradient Mesh */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)`
          }}></div>
          
          {/* Floating Orbs */}
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse delay-2000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            {/* Left Content - Course Info */}
            <div className="flex-1 text-white">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-xs font-bold shadow-lg shadow-yellow-500/50 animate-pulse">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Govt-certified
                </span>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                  <span className="text-base font-bold">4.7</span>
                  <span className="text-xs text-white/70 ml-1">(2.5K+ reviews)</span>
                </div>
              </div>

              {/* Course Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight drop-shadow-2xl">
                <span className="bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {course.title}
                </span>
              </h1>

              {/* Course Benefits */}
              <ul className="space-y-4 mb-8">
                {course.syllabus?.overview && (
                  <li className="flex items-start gap-4 group">
                    <div className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/50">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                      {course.syllabus.overview.split('.')[0]}.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-4 group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/50">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-lg sm:text-xl text-white font-medium leading-relaxed">
                    Includes placement assistance with guaranteed job support
                  </span>
                </li>
              </ul>

              {/* Course Duration & Info */}
              <div className="mb-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-base sm:text-lg text-white font-medium">
                    {course.duration || '6 weeks'} online course
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-base sm:text-lg text-white font-medium">1 hour/day</span>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-8">
                <p className="text-sm text-white/80 mb-3 font-medium">Certifications from</p>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">SI</span>
                      </div>
                      <span className="text-base font-bold text-white">Skill India</span>
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-all shadow-lg hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-700">KE</span>
                      </div>
                      <span className="text-base font-bold text-white">KiwisEdutech</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Offer */}
              <div className="inline-flex items-center gap-4 bg-linear-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-md px-6 py-4 rounded-xl border-2 border-purple-400/50 shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 group">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-base shadow-lg group-hover:rotate-12 transition-transform">
                  1+1
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-1">Special Offer!</p>
                  <p className="text-xs text-white/90">
                    Get an Internship & Job Preparation Training FREE on this purchase!
                  </p>
                </div>
                <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Right Content - Stats/Quick Info */}
            <div className="w-full lg:w-80 xl:w-96 shrink-0">
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl border-2 border-white/30 p-6 sm:p-8 text-white shadow-2xl hover:bg-white/20 transition-all" style={{ transform: 'translateZ(0)', willChange: 'filter' }}>
                <h3 className="text-xl font-bold mb-6 text-center">Course Highlights</h3>
                {stats && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-white/90 font-medium">Video Tutorials</span>
                      </div>
                      <span className="font-bold text-2xl text-white">{stats.videos}+</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-white/90 font-medium">Assignments</span>
                      </div>
                      <span className="font-bold text-2xl text-white">{stats.assignments}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="text-white/90 font-medium">Projects</span>
                      </div>
                      <span className="font-bold text-2xl text-white">{stats.projects}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <svg className="w-5 h-5 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <span className="text-white/90 font-medium">AI Tools</span>
                      </div>
                      <span className="font-bold text-2xl text-white">{stats.aiTools || 0}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 w-full overflow-x-hidden" style={{ transform: 'translateZ(0)' }}>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Content Area */}
          <div className="flex-1 min-w-0">
        {/* Why Learn Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            Why learn {course.title}?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Learn what the world is hiring for</h3>
                <p className="text-gray-700 text-base sm:text-lg">
                  {course.title} is shaping every industry. This course helps you learn the tech that's creating tomorrow's jobs.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Work with cutting-edge tools</h3>
                <p className="text-gray-700 text-base sm:text-lg">
                  Master the tools top companies use and build real-world applications that showcase your skills.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Create a future-ready portfolio</h3>
                <p className="text-gray-700 text-base sm:text-lg">
                  Work on real-world projects in every module that showcase your skills in action.
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-linear-to-br from-primary-100 to-primary-200 rounded-2xl p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-primary-800 font-semibold text-lg">Future-Ready Skills</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Placement Assistance Section */}
        <section className="mb-12 sm:mb-16 bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
            What placement assistance will you receive?
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="hidden md:block order-2">
              <div className="bg-linear-to-br from-green-100 to-blue-100 rounded-2xl p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-32 h-32 mx-auto text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p className="text-primary-800 font-semibold text-lg">Career Success</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 order-1">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Free Placement Prep Training</h3>
                <p className="text-gray-700 text-base sm:text-lg">
                  Learn how to build your resume, make great applications, and ace your interviews.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Curated internships & jobs</h3>
                <p className="text-gray-700 text-base sm:text-lg">
                  Get internships and fresher jobs as per your preference in your inbox.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Get highlighted on KiwisEdutech</h3>
                <p className="text-gray-700 text-base sm:text-lg">
                  Top performers will be highlighted in their internship & job applications on KiwisEdutech.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How Training Works Section */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
            How will your training work?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Learn concepts</h3>
              <p className="text-gray-600 text-sm sm:text-base">Go through training videos to learn concepts</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Test yourself</h3>
              <p className="text-gray-600 text-sm sm:text-base">Test your knowledge through quizzes & module tests at regular intervals</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hands-on practice</h3>
              <p className="text-gray-600 text-sm sm:text-base">Get hands on practice by doing assignments and project</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1:1 doubt solving</h3>
              <p className="text-gray-600 text-sm sm:text-base">Get your doubts solved by experts through Q&A forum within 24 hours</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Take final exam</h3>
              <p className="text-gray-600 text-sm sm:text-base">Complete your training by taking the final exam</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Get certified</h3>
              <p className="text-gray-600 text-sm sm:text-base">Get certified in {course.title} upon successful completion of training</p>
            </div>
          </div>
        </section>

        {/* AI Tools Section */}
        {course.syllabus && course.syllabus.aiTools && course.syllabus.aiTools.length > 0 && (
          <section className="mb-12 sm:mb-16 bg-primary-50 rounded-2xl p-6 sm:p-8 lg:p-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
              How will your tech career become future-proof with AI tools in this course?
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">NEW</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                {course.syllabus.aiTools.slice(0, 2).map((tool, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {typeof tool === 'string' ? tool : tool.name || tool}
                    </h3>
                    <p className="text-gray-700 text-base">
                      {typeof tool === 'object' && tool.description ? tool.description : 
                       tool === 'ChatGPT' || (typeof tool === 'object' && tool.name === 'ChatGPT') 
                         ? "Build smart, responsive AI chat systems using OpenAI's powerful conversational engine."
                         : "Make your app speak. Convert any text to audio and support multiple languages with ease."}
                    </p>
                  </div>
                ))}
              </div>
              <div className="hidden md:block">
                <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl p-8 h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-32 h-32 mx-auto text-primary-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-primary-800 font-semibold text-lg">AI-Powered Future</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Why Learn with KiwisEdutech Comparison Table */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">
            Why learn with KiwisEdutech?
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-sm font-bold text-gray-900">Benefits</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-900">KiwisEdutech</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-900">Other platforms</th>
                    <th className="px-4 sm:px-6 py-4 text-center text-sm font-bold text-gray-900">Youtube</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Government certified by NSDC</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Free placement assistance</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">3x visibility in recruiter searches</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Direct interview invites</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Industry-ready curriculum & projects</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Real time doubt resolution</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Multi language support</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">Trusted by 4 Million+ learners</td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <svg className="w-6 h-6 text-green-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="text-gray-400">—</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <span className="text-gray-400">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Course Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 wrap-break-words">
          Course Syllabus
        </h2>

        {/* Course Statistics */}
        {stats && (
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">{stats.videos}+ video tutorials</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
              <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">{stats.assignments} assignments</span>
                </div>
            <div className="flex items-center gap-2 shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
              <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">{stats.projects} projects</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
              <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">{stats.aiTools || 0} AI tools covered</span>
            </div>
                </div>
              )}

        {/* Download Videos Message */}
        <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          After completing the training, you can also download videos for future reference
        </p>

        {/* Syllabus Modules - Accordion Style */}
        {course.syllabus && course.syllabus.modules && course.syllabus.modules.length > 0 ? (
          <div className="space-y-3">
            {course.syllabus.modules.map((module, idx) => {
              const isExpanded = expandedModules[idx]
              const topicCount = module.topics?.length || 0
              // Show demo video for modules with more than 3 topics
              const hasDemoVideo = topicCount >= 4

              return (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Module Header - Clickable */}
                  <button
                    onClick={() => toggleModule(idx)}
                    className="w-full flex items-center justify-between p-3 sm:p-4 text-left"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                      {/* Document Icon */}
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      
                      {/* Module Title & Info */}
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base wrap-break-words">{module.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1">
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{topicCount} Topics</span>
                          {hasDemoVideo && (
                            <a
                              href="#"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs sm:text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 whitespace-nowrap shrink-0"
                            >
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                              <span className="hidden sm:inline">1 Demo video inside</span>
                              <span className="sm:hidden">Demo</span>
                            </a>
                          )}
                        </div>
                  </div>
                </div>

                    {/* Chevron Icon */}
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform shrink-0 ml-2 ${isExpanded ? 'transform rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && module.topics && module.topics.length > 0 && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100 w-full">
                      <ul className="mt-3 space-y-2 w-full">
                        {module.topics.map((topic, topicIdx) => (
                          <li key={topicIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 wrap-break-words w-full">
                            <span className="text-primary-600 mt-1 shrink-0">•</span>
                            <span className="flex-1 wrap-break-words">{topic}</span>
                          </li>
                        ))}
                      </ul>
                </div>
              )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Syllabus Coming Soon</h2>
            <p className="text-gray-600 mb-6">The detailed syllabus for this course is being prepared. Check back soon!</p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Projects Section */}
        {course.syllabus && course.syllabus.projects && course.syllabus.projects.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Required Projects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {course.syllabus.projects.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <span className="text-primary-600 font-bold text-sm sm:text-base">{idx + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 wrap-break-words">{project.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 wrap-break-words">{project.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Tools Section */}
        {course.syllabus && course.syllabus.aiTools && course.syllabus.aiTools.length > 0 && (
          <div className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Tools Covered
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {course.syllabus.aiTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base wrap-break-words">
                        {typeof tool === 'string' ? tool : tool.name || tool}
                      </h3>
                      {typeof tool === 'object' && tool.description && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 wrap-break-words">{tool.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          </div>

          {/* Right Sidebar - Enrollment Form */}
          <div className="lg:w-80 xl:w-96 shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 sm:p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Enroll Now</h3>
              
              <form onSubmit={handleEnroll} className="space-y-4">
                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={enrollmentData.mobile}
                      onChange={(e) => setEnrollmentData({ ...enrollmentData, mobile: e.target.value })}
                      placeholder="8586080747"
                      className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-r-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>

                {/* Batch Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose batch
                  </label>
                  <select
                    value={enrollmentData.batch}
                    onChange={(e) => setEnrollmentData({ ...enrollmentData, batch: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select batch</option>
                    {upcomingBatches.map((batch, idx) => (
                      <option key={idx} value={batch.date}>
                        {batch.date} {batch.status && `(${batch.status})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Objective Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to learn {course.title} to
                  </label>
                  <select
                    value={enrollmentData.objective}
                    onChange={(e) => setEnrollmentData({ ...enrollmentData, objective: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Choose your objective</option>
                    {objectives.map((obj, idx) => (
                      <option key={idx} value={obj}>{obj}</option>
                    ))}
                  </select>
                </div>

                {/* Pricing */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-orange-600">{formatPrice(discountedPrice)}</span>
                    {originalPrice && (
                      <span className="text-lg text-gray-500 line-through">{formatPrice(originalPrice)}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Valid till 5th Nov</p>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors text-base"
                  >
                    Enroll Now
                  </button>
                </div>
              </form>

              {/* Course Duration Info */}
              {course.duration && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">{course.duration}</span> online course
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
