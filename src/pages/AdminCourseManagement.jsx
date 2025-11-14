import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { courseAPI, apiRequest } from '../utils/api.js'
import SyllabusEditor from '../components/SyllabusEditor.jsx'

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showSyllabusEditor, setShowSyllabusEditor] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      // Try admin endpoint first, fallback to public endpoint
      try {
        const queryParams = new URLSearchParams({ limit: '100' }).toString()
        const response = await apiRequest(`/admin/courses?${queryParams}`)
        if (response.success) {
          setCourses(response.data.courses || [])
          return
        }
      } catch (adminError) {
        console.log('Admin endpoint failed, trying public endpoint')
      }
      
      const response = await courseAPI.getAllCourses({ limit: 100 })
      if (response.success) {
        setCourses(response.data.courses || [])
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error('Error loading courses: ' + (error.message || 'Unknown error'))
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-gray-600">Loading courses...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Syllabus Management</h1>
          <p className="text-gray-600">Manage and customize course syllabuses</p>
        </div>

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
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
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
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No courses found
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{course.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{course.duration}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.isPublished
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditSyllabus(course)}
                            className="text-primary-600 hover:text-primary-900 font-semibold"
                          >
                            Edit Syllabus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

