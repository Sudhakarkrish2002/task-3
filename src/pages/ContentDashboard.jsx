import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { courseAPI } from '../utils/api.js'
import SyllabusEditor from '../components/SyllabusEditor.jsx'

const defaultCourseForm = {
  title: '',
  description: '',
  shortDescription: '',
  category: 'other',
  courseType: 'non-certified',
  instructor: '',
  price: '',
  originalPrice: '',
  duration: '',
  level: 'all',
  language: 'English',
  thumbnail: '',
  certificateIncluded: false,
  placementGuaranteed: false
}


export default function ContentDashboard() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showSyllabusEditor, setShowSyllabusEditor] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all') // all, certification, placement_training, other
  const [user, setUser] = useState(null)
  const [courseForm, setCourseForm] = useState(() => ({ ...defaultCourseForm }))
  const [activeSection, setActiveSection] = useState('courses')


  useEffect(() => {
    // Get user info from localStorage
    // Note: ProtectedRoute already handles authentication, so we can safely assume user is authenticated
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        toast.error('Error loading user data. Please try logging in again.')
      }
    }

    // Always load data - ProtectedRoute ensures we have the right user
    loadCourses()
  }, [])

  useEffect(() => {
    if (activeSection !== 'courses' && activeSection !== 'placements') {
      setShowSyllabusEditor(false)
      setSelectedCourse(null)
    }
  }, [activeSection])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const response = await courseAPI.getMyCourses({ limit: 100 })
      if (response.success) {
        setCourses(response.data.courses || [])
      } else {
        console.error('Failed to load courses:', response.message)
        toast.error('Failed to load courses: ' + (response.message || 'Unknown error'))
        setCourses([]) // Set empty array to prevent undefined errors
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error('Error loading courses: ' + (error.message || 'Unknown error'))
      setCourses([]) // Set empty array to prevent undefined errors
    } finally {
      setLoading(false)
    }
  }


  const handleEditSyllabus = (course) => {
    setSelectedCourse(course)
    setShowSyllabusEditor(true)
    setEditorKey(prev => prev + 1) // Force remount to reload data
  }

  const handleSyllabusSaved = () => {
    setShowSyllabusEditor(false)
    setSelectedCourse(null)
    loadCourses() // Refresh courses list
  }

  const handleSyllabusSavedAndPublished = () => {
    setShowSyllabusEditor(false)
    setSelectedCourse(null)
    loadCourses() // Refresh courses list
  }

  const handleCreateCourse = (overrides = {}) => {
    setCourseForm({
      ...defaultCourseForm,
      ...overrides
    })
    setShowCreateModal(true)
  }

  const handleEditCourse = (course) => {
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      category: course.category || 'other',
      courseType: course.certificateIncluded ? 'certified' : 'non-certified',
      instructor: course.instructor || '',
      price: course.price || '',
      originalPrice: course.originalPrice || '',
      duration: course.duration || '',
      level: course.level || 'all',
      language: course.language || 'English',
      thumbnail: course.thumbnail || '',
      certificateIncluded: course.certificateIncluded || false,
      placementGuaranteed: course.placementGuaranteed || false
    })
    setSelectedCourse(course)
    setShowEditModal(true)
  }

  const handleDeleteCourse = (course) => {
    setCourseToDelete(course)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!courseToDelete) return
    
    setSaving(true)
    try {
      const response = await courseAPI.deleteCourse(courseToDelete._id)
      if (response.success) {
        toast.success('Course deleted successfully!')
        setShowDeleteConfirm(false)
        setCourseToDelete(null)
        loadCourses()
      }
    } catch (error) {
      toast.error('Error deleting course: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handleSaveCourse = async (shouldPublish = false) => {
    // Validate required fields
    if (!courseForm.title || !courseForm.description || !courseForm.category || 
        !courseForm.instructor || !courseForm.price || !courseForm.duration) {
      toast.error('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      // Map courseType to certificateIncluded
      const certificateIncluded = courseForm.courseType === 'certified'
      
      const courseData = {
        ...courseForm,
        price: parseFloat(courseForm.price),
        originalPrice: courseForm.originalPrice ? parseFloat(courseForm.originalPrice) : undefined,
        certificateIncluded,
        // Remove courseType from data sent to API
        courseType: undefined
      }

      let response
      if (showEditModal && selectedCourse) {
        // If publishing, fetch the latest course data to include existing syllabus
        if (shouldPublish) {
          try {
            const courseResponse = await courseAPI.getCourseById(selectedCourse._id)
            if (courseResponse.success && courseResponse.data && courseResponse.data.syllabus) {
              // Include existing syllabus when publishing to ensure it's preserved
              courseData.syllabus = courseResponse.data.syllabus
            }
          } catch (error) {
            console.warn('Could not fetch course syllabus, continuing without it:', error)
          }
          // Save and publish in one call
          response = await courseAPI.publishCourse(selectedCourse._id, 'publish', courseData)
        } else {
          response = await courseAPI.updateCourse(selectedCourse._id, courseData)
        }
      } else {
        response = await courseAPI.createCourse(courseData)
        // If it's a new course and should publish, publish it
        if (shouldPublish && response.success) {
          response = await courseAPI.publishCourse(response.data._id, 'publish')
        }
      }

      if (response.success) {
        toast.success(
          shouldPublish 
            ? (showEditModal ? 'Course updated and published successfully!' : 'Course created and published successfully!')
            : (showEditModal ? 'Course updated successfully!' : 'Course created successfully!')
        )
        setShowCreateModal(false)
        setShowEditModal(false)
        setSelectedCourse(null)
        loadCourses()
      }
    } catch (error) {
      toast.error('Error saving course: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const handlePublishCourse = async (course, action = 'publish', courseData = null, syllabusData = null) => {
    if (action === 'publish' && !confirm(`Are you sure you want to publish "${course.title}"? It will be visible to all users.`)) {
      return
    }
    if (action === 'unpublish' && !confirm(`Are you sure you want to unpublish "${course.title}"? It will no longer be visible to users.`)) {
      return
    }

    setSaving(true)
    try {
      // Fetch the latest course data including syllabus to ensure we publish with the most recent syllabus
      let latestCourse = course
      if (action === 'publish' && !courseData && !syllabusData) {
        try {
          const courseResponse = await courseAPI.getCourseById(course._id)
          if (courseResponse.success && courseResponse.data) {
            latestCourse = courseResponse.data
          }
        } catch (error) {
          console.warn('Could not fetch latest course data, using cached data:', error)
        }
      }

      // If courseData or syllabusData is provided, include them in the publish request
      const publishData = courseData ? { ...courseData } : {}
      
      // Include syllabus: use provided syllabusData, or fetch from latest course, or use existing course syllabus
      if (syllabusData) {
        publishData.syllabus = syllabusData
      } else if (latestCourse.syllabus && Object.keys(latestCourse.syllabus).length > 0) {
        // Include the latest syllabus if available
        publishData.syllabus = latestCourse.syllabus
      }
      
      const response = await courseAPI.publishCourse(course._id, action, Object.keys(publishData).length > 0 ? publishData : null)
      if (response.success) {
        toast.success(response.message || `Course ${action === 'publish' ? 'published' : 'unpublished'} successfully!`)
        loadCourses() // Refresh courses list
      }
    } catch (error) {
      toast.error('Error updating course: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const getCourseTypeLabel = (category) => {
    switch (category) {
      case 'certification':
        return 'Certification Course'
      case 'placement_training':
        return 'Placement Training'
      case 'workshop':
        return 'Workshop'
      default:
        return 'Regular Course'
    }
  }

  const getCourseTypeColor = (category) => {
    switch (category) {
      case 'certification':
        return 'bg-blue-100 text-blue-800'
      case 'placement_training':
        return 'bg-green-100 text-green-800'
      case 'workshop':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.category === filter)
  const placementCourses = courses.filter(course => course.placementGuaranteed)

  const renderCourseTableEmptyState = (isPlacementView) => (
    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {isPlacementView ? 'No placement programs found' : 'No courses found'}
      </h3>
      <p className="text-gray-600 mb-4">
        {isPlacementView
          ? 'Start by creating your first placement guaranteed program.'
          : (filter === 'all'
              ? "You haven't created any courses yet."
              : `No ${getCourseTypeLabel(filter)} courses found.`)}
      </p>
    </div>
  )



  const getSyllabusStats = (course) => {
    const modules = course?.syllabus?.modules?.length || 0
    const projects = course?.syllabus?.projects?.length || 0
    return { modules, projects }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <div className="text-gray-600 mt-4">Loading your courses...</div>
          </div>
        </div>
      </main>
    )
  }

  const isPlacementView = activeSection === 'placements'
  const sectionDescriptionMap = {
    courses: 'Manage standard courses and edit course syllabuses',
    placements: 'Curate placement guaranteed programs with end-to-end support'
  }
  const currentDescription = sectionDescriptionMap[activeSection] || 'Manage your content assets'

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Content Writer Dashboard</h1>
            {user && (
              <span className="text-sm text-gray-500">Welcome, {user.name}</span>
            )}
          </div>
          <p className="text-gray-600">{currentDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isPlacementView) {
                handleCreateCourse({
                  category: 'placement_training',
                  placementGuaranteed: true,
                  certificateIncluded: true,
                  courseType: 'certified'
                })
              } else {
                handleCreateCourse()
              }
            }}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg whitespace-nowrap"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {isPlacementView ? 'Create Placement Course' : 'Create Course'}
          </button>
        </div>
      </div>

      <div className="mb-8 bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'courses', label: 'Courses' },
            { key: 'placements', label: 'Placement Programs' }
          ].map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeSection === section.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {(activeSection === 'courses' || isPlacementView) && (
        <>
          {showSyllabusEditor && selectedCourse ? (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <SyllabusEditor
                key={`syllabus-editor-${selectedCourse._id}-${editorKey}`}
                courseId={selectedCourse._id}
                courseTitle={selectedCourse.title}
                courseCategory={selectedCourse.category}
                onClose={() => {
                  setShowSyllabusEditor(false)
                  setSelectedCourse(null)
                }}
                onSave={handleSyllabusSaved}
                onSaveAndPublish={handleSyllabusSavedAndPublished}
              />
            </div>
          ) : (
            <>
              {!isPlacementView && (
                <div className="mb-6 bg-white rounded-lg shadow p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        filter === 'all'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Courses ({courses.length})
                    </button>
                    <button
                      onClick={() => setFilter('certification')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        filter === 'certification'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Certification ({courses.filter(c => c.category === 'certification').length})
                    </button>
                    <button
                      onClick={() => setFilter('placement_training')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        filter === 'placement_training'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Placement Training ({courses.filter(c => c.category === 'placement_training').length})
                    </button>
                    <button
                      onClick={() => setFilter('other')}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        filter === 'other'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Regular Courses ({courses.filter(c => c.category === 'other' || !c.category).length})
                    </button>
                  </div>
                </div>
              )}

              {(isPlacementView ? placementCourses : filteredCourses).length === 0 ? (
                renderCourseTableEmptyState(isPlacementView)
              ) : (
                <>
                  <div className="hidden md:block bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 table-auto">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Course Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Syllabus
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[240px]">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(isPlacementView ? placementCourses : filteredCourses).map((course) => (
                            <tr key={course._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                {course.shortDescription && (
                                  <div className="text-sm text-gray-500 mt-1">{course.shortDescription.substring(0, 60)}...</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCourseTypeColor(course.category)}`}>
                                  {getCourseTypeLabel(course.category)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  course.certificateIncluded 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {course.certificateIncluded ? 'Certified' : 'Non-Certified'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {course.duration}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  course.isPublished 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {course.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(() => {
                                  const { modules, projects } = getSyllabusStats(course)
                                  if (!modules && !projects) {
                                    return <span className="text-gray-400">No syllabus</span>
                                  }
                                  return (
                                    <div className="flex flex-col">
                                      {modules > 0 && (
                                        <span className="text-green-600 font-semibold">{modules} modules</span>
                                      )}
                                      {projects > 0 && (
                                        <span className="text-purple-600 font-semibold">{projects} projects</span>
                                      )}
                                    </div>
                                  )
                                })()}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium">
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleEditCourse(course)}
                                    className="text-blue-600 hover:text-blue-900 font-semibold whitespace-nowrap"
                                    title="Edit course"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => handleEditSyllabus(course)}
                                    className="text-primary-600 hover:text-primary-900 font-semibold whitespace-nowrap"
                                    title="Edit syllabus"
                                  >
                                    Edit Syllabus
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  {course.isPublished ? (
                                    <button
                                      onClick={() => handlePublishCourse(course, 'unpublish')}
                                      className="text-orange-600 hover:text-orange-900 font-semibold whitespace-nowrap disabled:opacity-50"
                                      title="Unpublish course"
                                      disabled={saving}
                                    >
                                      Unpublish
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handlePublishCourse(course, 'publish')}
                                      className="text-green-600 hover:text-green-900 font-semibold whitespace-nowrap disabled:opacity-50"
                                      title="Publish course"
                                      disabled={saving}
                                    >
                                      Publish
                                    </button>
                                  )}
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() => handleDeleteCourse(course)}
                                    className="text-red-600 hover:text-red-900 font-semibold whitespace-nowrap"
                                    title="Delete course"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="md:hidden space-y-4">
                    {(isPlacementView ? placementCourses : filteredCourses).map((course) => (
                      <div key={course._id} className="bg-white rounded-lg shadow-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                            {course.shortDescription && (
                              <p className="text-sm text-gray-500 mb-2">{course.shortDescription}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCourseTypeColor(course.category)}`}>
                            {getCourseTypeLabel(course.category)}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            course.certificateIncluded 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {course.certificateIncluded ? 'Certified' : 'Non-Certified'}
                          </span>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            course.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3 space-y-1">
                          <div>
                            <span className="font-medium">Duration:</span> {course.duration}
                          </div>
                          {(() => {
                            const { modules, projects } = getSyllabusStats(course)
                            if (!modules && !projects) return null
                            return (
                              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                                {modules > 0 && (
                                  <span className="text-green-600">{modules} modules</span>
                                )}
                                {projects > 0 && (
                                  <span className="text-purple-600">{projects} projects</span>
                                )}
                              </div>
                            )
                          })()}
                        </div>
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleEditCourse(course)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleEditSyllabus(course)}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                          >
                            Syllabus
                          </button>
                          {course.isPublished ? (
                            <button
                              onClick={() => handlePublishCourse(course, 'unpublish')}
                              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
                              disabled={saving}
                            >
                              Unpublish
                            </button>
                          ) : (
                            <button
                              onClick={() => handlePublishCourse(course, 'publish')}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                              disabled={saving}
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteCourse(course)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}


        {/* Create Course Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] my-4 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Course</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CourseForm 
                  formData={courseForm} 
                  setFormData={setCourseForm}
                />
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCourse}
                  disabled={saving}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Course Modal */}
        {showEditModal && selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] my-4 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Course</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setSelectedCourse(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <CourseForm 
                  formData={courseForm} 
                  setFormData={setCourseForm}
                />
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedCourse(null)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveCourse(false)}
                  disabled={saving}
                  className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={() => handleSaveCourse(true)}
                  disabled={saving}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving & Publishing...' : 'Save & Publish'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && courseToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Delete Course</h2>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setCourseToDelete(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete the course <strong>"{courseToDelete.title}"</strong>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setCourseToDelete(null)
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={saving}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

// Course Form Component
function CourseForm({ formData, setFormData }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Course Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="Enter course title"
          required
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Short Description
        </label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="Brief description (max 200 characters)"
          maxLength={200}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Full Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          rows="4"
          placeholder="Enter detailed course description"
          required
        />
      </div>

      {/* Category and Course Type */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            required
          >
            <option value="other">Regular Course</option>
            <option value="certification">Certification</option>
            <option value="placement_training">Placement Training</option>
            <option value="workshop">Workshop</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Course Type <span className="text-red-500">*</span>
          </label>
          <select
            name="courseType"
            value={formData.courseType}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            required
          >
            <option value="certified">Certified</option>
            <option value="non-certified">Non-Certified</option>
          </select>
        </div>
      </div>

      {/* Instructor and Duration */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="Instructor name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="e.g., 12 weeks"
            required
          />
        </div>
      </div>

      {/* Thumbnail Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Thumbnail Image URL (Optional)
        </label>
        <input
          type="url"
          name="thumbnail"
          value={formData.thumbnail}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="https://example.com/image.jpg"
        />
        {formData.thumbnail && (
          <div className="mt-2">
            <img
              src={formData.thumbnail}
              alt="Thumbnail preview"
              className="w-32 h-32 object-cover rounded-lg border border-gray-300"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      {/* Price and Original Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Original Price (₹)
          </label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Level
        </label>
        <select
          name="level"
          value={formData.level}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Language
        </label>
        <input
          type="text"
          name="language"
          value={formData.language}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          placeholder="English"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="certificateIncluded"
            checked={formData.certificateIncluded}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Certificate Included</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="placementGuaranteed"
            checked={formData.placementGuaranteed}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">Placement Guaranteed</span>
        </label>
      </div>
    </div>
  )
}


