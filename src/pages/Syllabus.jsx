import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { courseSyllabus, certificationCourseSyllabus, placementCourseSyllabus } from '../utils/courseSyllabus.js'
import { courseAPI } from '../utils/api.js'

export default function Syllabus() {
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState({})
  const [activeTab, setActiveTab] = useState('Syllabus')
  const [openProjectIndex, setOpenProjectIndex] = useState(null)
  const [enrollmentData, setEnrollmentData] = useState({
    mobile: '',
    batch: '',
    objective: ''
  })
  const [user, setUser] = useState(null)
  const projectsList = course?.syllabus?.projects || []
  const instructors = course?.syllabus?.instructors || []
  const hasMultipleInstructors = instructors.length > 1

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
      toast.error('Unable to save your course view history.')
    }
  }

  const resolveCourseIdByTitle = async (courseTitle) => {
    if (!courseTitle) return null
    try {
      const response = await courseAPI.getAllCourses({ search: courseTitle, limit: 5 })
      if (response.success && response.data?.courses?.length) {
        const normalizedTitle = courseTitle.trim().toLowerCase()
        const exactMatch = response.data.courses.find(
          (courseItem) => courseItem.title?.trim().toLowerCase() === normalizedTitle
        )
        return (exactMatch || response.data.courses[0])?._id || null
      }
    } catch (error) {
      console.warn('Unable to resolve course ID by title:', error)
      toast.error('Unable to find that course right now. Please retry.')
    }
    return null
  }
 useEffect(() => {
    const loadCourse = async () => {
      try {
        // Get course info from URL hash/query params
        const hash = window.location.hash
        const params = new URLSearchParams(hash.split('?')[1] || '')
        let courseId = params.get('id')
        const courseTitle = params.get('title')
        const courseType = params.get('type') || 'course' // 'course' or 'certification'

        if (!courseId && courseTitle) {
          courseId = await resolveCourseIdByTitle(courseTitle)
        }

        if (courseId) {
          // Try to fetch from API
          try {
            const response = await courseAPI.getCourseSyllabus(courseId)
            if (response.success && response.data) {
              console.log('Syllabus API data:', response.data)
              const courseData = {
                ...response.data,
                syllabus: response.data.syllabus,
                id: courseId,
                type: courseType
              }
              console.log('Normalized course data for syllabus page:', courseData)
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
          toast.error('No course information found. Please try again.')
        }
      } catch (error) {
        console.error('Error loading course:', error)
        setCourse(null)
        toast.error('Unable to load course details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [])

  useEffect(() => {
    if (!projectsList.length) {
      if (openProjectIndex !== null) {
        setOpenProjectIndex(null)
      }
      return
    }

    if (openProjectIndex === null) {
      setOpenProjectIndex(0)
      return
    }

    if (openProjectIndex > projectsList.length - 1) {
      setOpenProjectIndex(0)
    }
  }, [projectsList.length, openProjectIndex])

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
      toast.success('Your interest has been recorded! We will contact you soon.')
      setEnrollmentData({ mobile: '', batch: '', objective: '' })
    } catch (error) {
      console.error('Error storing enrollment interest:', error)
      toast.error('Unable to save your interest right now. Please retry.')
    }
  }

  const handleEnroll = (e) => {
    e.preventDefault()
    if (enrollmentData.mobile && enrollmentData.batch && enrollmentData.objective) {
      handleEnrollmentInterest(enrollmentData)
    } else {
      toast.error('Please fill in all fields')
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

  const getProjectPoints = (project) => {
    if (!project) return []

    if (Array.isArray(project.points)) {
      const sanitizedPoints = project.points
        .map(point => (typeof point === 'string' ? point.trim() : ''))
        .filter(point => point.length > 0)

      if (sanitizedPoints.length > 0) {
        return sanitizedPoints
      }
    }

    if (project.description) {
      const fallbackPoints = project.description
        .split(/\n|\.(?=\s|$)/)
        .map(point => point.trim())
        .filter(point => point.length > 0)

      if (fallbackPoints.length > 0) {
        return fallbackPoints
      }
    }

    return []
  }

  const toggleProjectAccordion = (idx) => {
    setOpenProjectIndex((prev) => (prev === idx ? null : idx))
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
  const isPlacementGuaranteed = course?.type === 'placement'
  const navTabs = isPlacementGuaranteed 
    ? ['Overview', 'Syllabus', 'Placement', 'Career Support', 'Success Stories'] 
    : ['Certificate', 'Placement', 'Syllabus', 'Projects', 'Teachers']

  // Function to handle tab click and smooth scroll to section
  const handleTabClick = (tab) => {
    setActiveTab(tab)
    
    // Map tab names to section IDs
    const sectionMap = {
      'Certificate': 'certificate-section',
      'Placement': 'placement-section',
      'Syllabus': 'syllabus-section',
      'Projects': 'projects-section',
      'Teachers': 'teachers-section',
      'Overview': 'overview-section',
      'Career Support': 'career-support-section',
      'Success Stories': 'success-stories-section'
    }
    
    const sectionId = sectionMap[tab]
    if (sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        // Get the sticky header height to offset the scroll
        const headerOffset = 90 // Adjust based on your sticky header height
        const elementPosition = element.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }
  }

  // Format price for display
  const formatPrice = (price) => {
    if (!price || price === null || price === undefined) return ''
    if (typeof price === 'string' && price.includes('₹')) return price
    if (typeof price === 'number') return `₹${price.toLocaleString('en-IN')}`
    return `₹${price}`
  }

  // Helper function to extract numeric value from price (handles both number and string)
  const getNumericPrice = (price) => {
    if (!price) return 0
    if (typeof price === 'number') return price
    if (typeof price === 'string') {
      return parseInt(price.replace(/[₹,]/g, '')) || 0
    }
    return 0
  }

  // Use the actual prices from the course data
  const originalPrice = course.originalPrice || null
  const discountedPrice = course.fee || course.price || null

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
                  onClick={() => handleTabClick(tab)}
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
              {discountedPrice && (
                <div className="text-right min-w-0">
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    <span className="text-lg sm:text-2xl font-bold text-orange-600 whitespace-nowrap">{formatPrice(discountedPrice)}</span>
                    {originalPrice && (
                      <span className="text-xs sm:text-lg text-gray-500 line-through whitespace-nowrap">{formatPrice(originalPrice)}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 whitespace-nowrap">Valid till 5th Nov</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button className="px-3 sm:px-6 py-2 bg-primary-600 text-white text-xs sm:text-base font-semibold rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap shrink-0">
                  Enroll Now
                </button>
              </div>
              </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="overview-section" className="relative overflow-hidden bg-linear-to-br from-primary-900 via-primary-800 to-primary-700 min-h-[500px] sm:min-h-[600px]" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
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
            {/* Left Content - Course Info (thumbnail removed as per requirement) */}
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
        <section id="certificate-section" className="mb-12 sm:mb-16">
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

         {/* Placement Assistance Section - Enhanced for Placement Guaranteed Courses */}
        {isPlacementGuaranteed ? (
            <section id="placement-section" className="mb-12 sm:mb-16 bg-linear-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 lg:p-10 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  100% Placement Guarantee
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Guaranteed Job Placement
                    </h3>
                    <p className="text-gray-700 text-base mb-4">
                      We guarantee job placement within 6 months of course completion. If you don't get placed, we'll refund 100% of your course fee.
                    </p>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Minimum 3 job interviews guaranteed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Salary range: ₹3-8 LPA for freshers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>Direct company referrals from our network</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Placement Process Timeline
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shrink-0">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Week 1-2: Profile Building</h4>
                          <p className="text-gray-600 text-sm">Resume optimization, LinkedIn profile enhancement, GitHub portfolio setup</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shrink-0">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Week 3-4: Interview Preparation</h4>
                          <p className="text-gray-600 text-sm">Mock interviews, technical rounds preparation, coding practice sessions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold shrink-0">3</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Week 5-6: Job Applications</h4>
                          <p className="text-gray-600 text-sm">Apply to 50+ curated job openings, company referrals, direct interview calls</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">✓</div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Placement Achieved</h4>
                          <p className="text-gray-600 text-sm">Get placed in your dream company with competitive salary package</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Company Connections</h3>
                    <p className="text-gray-700 text-base mb-4">We have direct partnerships with 200+ leading tech companies:</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                        <p className="font-semibold text-gray-900">Tech Startups</p>
                        <p className="text-sm text-gray-600">50+ companies</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                        <p className="font-semibold text-gray-900">MNCs & IT Giants</p>
                        <p className="text-sm text-gray-600">100+ companies</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                        <p className="font-semibold text-gray-900">Product Companies</p>
                        <p className="text-sm text-gray-600">30+ companies</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                        <p className="font-semibold text-gray-900">Service Companies</p>
                        <p className="text-sm text-gray-600">20+ companies</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Success Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Placement Rate</span>
                        <span className="text-2xl font-bold text-green-600">95%+</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Average Salary</span>
                        <span className="text-2xl font-bold text-blue-600">₹5.5 LPA</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700 font-medium">Students Placed</span>
                        <span className="text-2xl font-bold text-purple-600">2000+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        ) : (
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
        )}

        {!isPlacementGuaranteed && (
          <section id="placement-section" className="mb-12 sm:mb-16 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 lg:p-10 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Placement Assistance
              </h2>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Career Support
                </h3>
                <p className="text-gray-700 text-base">
                  Get personalized career guidance and job placement support to help you land your dream job after course completion.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume Building & Interview Prep
                </h3>
                <p className="text-gray-700 text-base">
                  Learn how to create an impressive resume and prepare for technical interviews with mock sessions and expert feedback.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Industry Connections
                </h3>
                <p className="text-gray-700 text-base">
                  Connect with our network of partner companies and get access to exclusive job opportunities in your field.
                </p>
              </div>
            </div>
          </section>
        )}

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

        {/* Additional Sections for Placement Guaranteed Courses */}
        {isPlacementGuaranteed && (
          <>
            {/* Comprehensive Career Support Section */}
            <section id="career-support-section" className="mb-12 sm:mb-16 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                Comprehensive Career Support Services
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Building</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>ATS-optimized resume templates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Professional formatting & design</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>1-on-1 resume review sessions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Industry-specific resume customization</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Interview Preparation</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Mock interviews with industry experts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Technical & HR round practice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Behavioral interview training</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>Real-time feedback & improvement tips</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">LinkedIn Optimization</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Profile headline & summary optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Skills endorsement strategies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Network building techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>Recruiter visibility enhancement</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Portfolio Development</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>GitHub portfolio optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Project showcase website creation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Live project demonstrations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span>Code review & best practices</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Job Application Support</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Curated job opportunities daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Application tracking & follow-ups</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Cover letter writing assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span>Salary negotiation guidance</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Coding Practice</h3>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>Daily coding challenges & solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>Data structures & algorithms practice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>System design interview prep</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>Problem-solving strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Motivation & Success Stories Section */}
            <section id="success-stories-section" className="mb-12 sm:mb-16 bg-linear-to-br from-yellow-50 via-orange-50 to-red-50 rounded-2xl p-6 sm:p-8 lg:p-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                Your Success is Our Mission
              </h2>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Why Choose Placement Guaranteed?
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-600 font-bold text-lg mt-1">✓</span>
                      <div>
                        <strong>No Placement? 100% Refund</strong>
                        <p className="text-sm text-gray-600">Complete guarantee - if you don't get placed within 6 months, we refund your entire course fee</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-600 font-bold text-lg mt-1">✓</span>
                      <div>
                        <strong>Dedicated Career Mentor</strong>
                        <p className="text-sm text-gray-600">1-on-1 mentorship from industry professionals throughout your job search</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-600 font-bold text-lg mt-1">✓</span>
                      <div>
                        <strong>Continuous Support</strong>
                        <p className="text-sm text-gray-600">6 months of placement support even after course completion</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-yellow-600 font-bold text-lg mt-1">✓</span>
                      <div>
                        <strong>Industry Connections</strong>
                        <p className="text-sm text-gray-600">Direct referrals to 200+ top tech companies</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Success Stories
                  </h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-600 pl-4">
                      <p className="text-gray-700 mb-2">"Got placed at Infosys with ₹6 LPA package just 2 months after completing the course!"</p>
                      <p className="text-sm font-semibold text-gray-900">- Rahul Sharma, Full-Stack Developer</p>
                    </div>
                    <div className="border-l-4 border-green-600 pl-4">
                      <p className="text-gray-700 mb-2">"The placement support team helped me crack 3 interviews. Now working at TCS with ₹5.5 LPA!"</p>
                      <p className="text-sm font-semibold text-gray-900">- Priya Patel, Software Engineer</p>
                    </div>
                    <div className="border-l-4 border-purple-600 pl-4">
                      <p className="text-gray-700 mb-2">"From zero coding knowledge to landing a job at Wipro in 4 months. Best investment ever!"</p>
                      <p className="text-sm font-semibold text-gray-900">- Amit Kumar, Junior Developer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">Join 2000+ Successfully Placed Students</h3>
                <p className="text-lg mb-4">Start your journey to a successful tech career today!</p>
                <div className="flex flex-wrap justify-center gap-6 text-sm">
                  <div>
                    <p className="text-3xl font-bold">95%+</p>
                    <p className="text-yellow-100">Placement Rate</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">₹5.5L</p>
                    <p className="text-yellow-100">Avg. Salary</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">2000+</p>
                    <p className="text-yellow-100">Students Placed</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Comprehensive Course Syllabus Section */}
            <section className="mb-12 sm:mb-16 bg-white rounded-2xl border-2 border-primary-200 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Comprehensive Course Syllabus
                </h2>
              </div>
              <p className="text-gray-700 text-lg mb-6">
                Our placement guaranteed course includes industry-relevant curriculum designed by experts from top tech companies. 
                Every module includes hands-on projects that you can showcase in your portfolio.
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Course Highlights</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">100+ Hours Live Coding</p>
                      <p className="text-sm text-gray-600">Interactive sessions with real-time coding practice</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">5+ Real-World Projects</p>
                      <p className="text-sm text-gray-600">Build production-ready applications for your portfolio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">1-on-1 Mentoring</p>
                      <p className="text-sm text-gray-600">Personalized guidance from industry experts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold text-gray-900">Industry Best Practices</p>
                      <p className="text-sm text-gray-600">Learn coding standards used in top companies</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Course Syllabus Section */}
        <div id="syllabus-section">
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

        {/* Course Overview Information */}
        {course.syllabus && (course.syllabus.learningOutcomes?.length > 0 || course.syllabus.prerequisites?.length > 0) && (
          <div className="mb-6 sm:mb-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Learning Outcomes */}
            {course.syllabus.learningOutcomes && course.syllabus.learningOutcomes.length > 0 && (
              <div className="bg-linear-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Learning Outcomes
                </h3>
                <ul className="space-y-2">
                  {course.syllabus.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="flex gap-2 text-xs sm:text-sm text-gray-700">
                      <span className="text-green-600 shrink-0 flex items-center h-5">✓</span>
                      <span className="flex-1 leading-5">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prerequisites */}
            {course.syllabus.prerequisites && course.syllabus.prerequisites.length > 0 && (
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {course.syllabus.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex gap-2 text-xs sm:text-sm text-gray-700">
                      <span className="text-blue-600 shrink-0 flex items-center h-5">•</span>
                      <span className="flex-1 leading-5">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
                          {module.duration && (
                            <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap flex items-center gap-1">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {module.duration}
                            </span>
                          )}
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
                          <li key={topicIdx} className="flex gap-2 text-xs sm:text-sm text-gray-700 wrap-break-words w-full">
                            <span className="text-primary-600 shrink-0 flex items-center h-5">•</span>
                            <span className="flex-1 wrap-break-words leading-5">{topic}</span>
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
        </div>
        {/* End Syllabus Section */}

        {/* Projects Section */}
        <div id="projects-section" className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Required Projects
          </h2>
          {projectsList.length > 0 ? (
            <div className="space-y-3">
              {projectsList.map((project, idx) => {
                const points = getProjectPoints(project)
                const isOpen = openProjectIndex === idx
                return (
                  <div key={idx} className="border border-gray-200 rounded-xl bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggleProjectAccordion(idx)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-100 text-primary-600 font-semibold flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">Project brief</p>
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 wrap-break-words">
                            {project.name || `Project ${idx + 1}`}
                          </h3>
                        </div>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        {points.length > 0 ? (
                          <ul className="space-y-2">
                            {points.map((point, pointIdx) => (
                              <li key={pointIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <span className="text-primary-600 shrink-0 mt-1">•</span>
                                <span className="flex-1 wrap-break-words">{point}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No project details available</p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {openProjectIndex === null && projectsList.length > 0 && (
                <p className="text-xs text-gray-500 text-center pt-2">Select a project to see its details.</p>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects Coming Soon</h3>
              <p className="text-gray-600">
                Hands-on projects will be added to this course to help you apply what you've learned.
              </p>
            </div>
          )}
        </div>

        {/* Certification Information Section */}
        {course.syllabus && course.syllabus.certification && (
          <div id="certificate-info-section" className="mt-8 sm:mt-10">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
              <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Certification Information
            </h2>
            <div className="bg-linear-to-br from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 sm:p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {course.syllabus.certification}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Course Instructors Section */}
        <div id="teachers-section" className="mt-8 sm:mt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Course Instructors
          </h2>
          {instructors.length > 0 ? (
            <div
              className={`gap-4 sm:gap-6 ${
                hasMultipleInstructors ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'max-w-2xl mx-auto'
              }`}
            >
              {instructors.map((instructor, idx) => (
                <div
                  key={`${instructor.name || 'instructor'}-${idx}`}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary-500 via-amber-400 to-primary-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-linear-to-br from-primary-50 to-primary-100 text-primary-600 font-semibold flex items-center justify-center shrink-0">
                      {(instructor.name || 'Instructor').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        {hasMultipleInstructors ? 'Instructor' : 'Lead Instructor'}
                      </p>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight wrap-break-words">
                        {instructor.name}
                      </h3>
                    </div>
                  </div>
                  {instructor.description && (
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed wrap-break-words">
                      {instructor.description}
                    </p>
                  )}
                  <div className="mt-auto pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-between">
                    <span className="flex items-center gap-2 font-medium text-primary-600">
                      <span className="inline-block h-2 w-2 rounded-full bg-primary-500" />
                      {hasMultipleInstructors ? 'Specialization mentor' : 'Program director'}
                    </span>
                    <span>Available for mentoring</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Instructors</h3>
              <p className="text-gray-600">
                Learn from experienced industry professionals who bring real-world expertise to the course.
              </p>
            </div>
          )}
        </div>
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
                  {discountedPrice && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-orange-600">{formatPrice(discountedPrice)}</span>
                        {originalPrice && (
                          <span className="text-lg text-gray-500 line-through">{formatPrice(originalPrice)}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mb-4">Valid till 5th Nov</p>
                    </>
                  )}
                  
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
