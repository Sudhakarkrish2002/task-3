import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { courseAPI } from '../utils/api.js'

const buildPointsFromDescription = (description = '') => {
  return description
    .split(/\n|\.(?=\s|$)/)
    .map(point => point.trim())
    .filter(Boolean)
}

const ensureProjectPoints = (project) => {
  const hasTypedPoints = Array.isArray(project?.points) && project.points.some(point => point && point.trim().length > 0)
  const derivedPoints = buildPointsFromDescription(project?.description || '')

  return {
    ...project,
    points: hasTypedPoints ? project.points.map(point => point.trim()).filter(Boolean) : derivedPoints
  }
}

const normalizeSyllabusForSave = (syllabus) => {
  const projects = (syllabus.projects || []).map(project => {
    const normalized = ensureProjectPoints(project)
    return {
      ...normalized,
      description: project.description || ''
    }
  })

  return {
    ...syllabus,
    projects
  }
}

export default function SyllabusEditor({ courseId, courseTitle, courseCategory, onClose, onSave, onSaveAndPublish }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syllabus, setSyllabus] = useState({
    overview: '',
    modules: [],
    learningOutcomes: [],
    prerequisites: [],
    projects: [],
    instructors: [],
    certification: ''
  })

  // Get course type label
  const getCourseTypeLabel = () => {
    switch (courseCategory) {
      case 'certification':
        return 'Certification Course'
      case 'placement_training':
        return 'Placement Training Course'
      case 'workshop':
        return 'Workshop'
      default:
        return 'Regular Course'
    }
  }

  // Get template hints based on course type
  const getTemplateHints = () => {
    switch (courseCategory) {
      case 'certification':
        return {
          overview: 'Focus on certification benefits, industry recognition, and exam preparation.',
          certification: 'Detail the certification process, exam requirements, and industry value.'
        }
      case 'placement_training':
        return {
          overview: 'Emphasize placement guarantee, interview preparation, and career support.',
          certification: 'Highlight placement assistance, job guarantee terms, and career support duration.'
        }
      default:
        return {
          overview: 'Provide a comprehensive overview of what students will learn.',
          certification: 'Describe the certificate students will receive upon completion.'
        }
    }
  }

  const hints = getTemplateHints()

  useEffect(() => {
    if (courseId) {
      loadSyllabus()
    }
  }, [courseId])

  const loadSyllabus = async () => {
    setLoading(true)
    try {
      const response = await courseAPI.getCourseSyllabus(courseId)
      if (response.success && response.data.syllabus) {
        // Transform old module structure to new structure if needed
        const modules = (response.data.syllabus.modules || []).map(module => ({
          title: module.title || '',
          description: module.description || '',
          duration: module.duration || '',
          topics: module.topics || []
        }))
        
        // Transform projects to new format (points array instead of description)
        const projects = (response.data.syllabus.projects || []).map(project => ({
          name: project.name || '',
          description: project.description || '',
          points: Array.isArray(project.points) ? project.points : []
        }))

        setSyllabus({
          overview: response.data.syllabus.overview || '',
          modules: modules,
          learningOutcomes: response.data.syllabus.learningOutcomes || [],
          prerequisites: response.data.syllabus.prerequisites || [],
          projects: projects,
          instructors: response.data.syllabus.instructors || [],
          certification: response.data.syllabus.certification || ''
        })
      }
    } catch (error) {
      console.error('Error loading syllabus:', error)
      toast.error('Error loading syllabus: ' + (error.message || 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (shouldPublish = false) => {
    setSaving(true)
    try {
      const normalizedSyllabus = normalizeSyllabusForSave(syllabus)
      const response = await courseAPI.updateCourseSyllabus(courseId, normalizedSyllabus)
      if (response.success) {
        if (shouldPublish) {
          // Save and publish in one call - include syllabus in courseData
          const publishResponse = await courseAPI.publishCourse(courseId, 'publish', { syllabus: normalizedSyllabus })
          if (publishResponse.success) {
            toast.success('Syllabus saved and course published successfully!')
            if (onSaveAndPublish) onSaveAndPublish(publishResponse.data)
          } else {
            toast.success('Syllabus saved successfully!')
            if (onSave) onSave(response.data)
          }
        } else {
          toast.success('Syllabus saved successfully!')
          if (onSave) onSave(response.data)
        }
        if (onClose) onClose()
      }
    } catch (error) {
      toast.error('Error saving syllabus: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const addModule = () => {
    setSyllabus({
      ...syllabus,
      modules: [...syllabus.modules, {
        title: '',
        description: '',
        duration: '',
        topics: []
      }]
    })
  }

  const updateModule = (index, field, value) => {
    const updated = [...syllabus.modules]
    updated[index] = { ...updated[index], [field]: value }
    setSyllabus({ ...syllabus, modules: updated })
  }

  const removeModule = (index) => {
    setSyllabus({
      ...syllabus,
      modules: syllabus.modules.filter((_, i) => i !== index)
    })
  }


  const addArrayItem = (field) => {
    setSyllabus({
      ...syllabus,
      [field]: [...(syllabus[field] || []), '']
    })
  }

  const updateArrayItem = (field, index, value) => {
    const updated = [...(syllabus[field] || [])]
    updated[index] = value
    setSyllabus({ ...syllabus, [field]: updated })
  }

  const removeArrayItem = (field, index) => {
    setSyllabus({
      ...syllabus,
      [field]: syllabus[field].filter((_, i) => i !== index)
    })
  }

  const addProject = () => {
    setSyllabus({
      ...syllabus,
      projects: [...syllabus.projects, { name: '', description: '', points: [] }]
    })
  }

  const updateProject = (index, field, value) => {
    const updated = [...syllabus.projects]
    updated[index] = { ...updated[index], [field]: value }
    setSyllabus({ ...syllabus, projects: updated })
  }

  const removeProject = (index) => {
    setSyllabus({
      ...syllabus,
      projects: syllabus.projects.filter((_, i) => i !== index)
    })
  }

  const addProjectPoint = (projectIndex) => {
    const updated = [...syllabus.projects]
    updated[projectIndex].points = [...(updated[projectIndex].points || []), '']
    setSyllabus({ ...syllabus, projects: updated })
  }

  const updateProjectPoint = (projectIndex, pointIndex, value) => {
    const updated = [...syllabus.projects]
    updated[projectIndex].points[pointIndex] = value
    setSyllabus({ ...syllabus, projects: updated })
  }

  const removeProjectPoint = (projectIndex, pointIndex) => {
    const updated = [...syllabus.projects]
    updated[projectIndex].points = updated[projectIndex].points.filter((_, i) => i !== pointIndex)
    setSyllabus({ ...syllabus, projects: updated })
  }

  // Topic management functions for modules
  const addTopic = (moduleIndex) => {
    const updated = [...syllabus.modules]
    updated[moduleIndex].topics = [...(updated[moduleIndex].topics || []), '']
    setSyllabus({ ...syllabus, modules: updated })
  }

  const updateTopic = (moduleIndex, topicIndex, value) => {
    const updated = [...syllabus.modules]
    updated[moduleIndex].topics[topicIndex] = value
    setSyllabus({ ...syllabus, modules: updated })
  }

  const removeTopic = (moduleIndex, topicIndex) => {
    const updated = [...syllabus.modules]
    updated[moduleIndex].topics = updated[moduleIndex].topics.filter((_, i) => i !== topicIndex)
    setSyllabus({ ...syllabus, modules: updated })
  }

  // Instructor management functions
  const addInstructor = () => {
    setSyllabus({
      ...syllabus,
      instructors: [...syllabus.instructors, { name: '', description: '' }]
    })
  }

  const updateInstructor = (index, field, value) => {
    const updated = [...syllabus.instructors]
    updated[index] = { ...updated[index], [field]: value }
    setSyllabus({ ...syllabus, instructors: updated })
  }

  const removeInstructor = (index) => {
    setSyllabus({
      ...syllabus,
      instructors: syllabus.instructors.filter((_, i) => i !== index)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-600">Loading syllabus...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Syllabus: {courseTitle}</h2>
            {courseCategory && (
              <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                {getCourseTypeLabel()}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600">Customize the course syllabus template based on course type</p>
      </div>

      {/* Overview */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Course Overview
        </label>
        {hints.overview && (
          <p className="text-xs text-gray-500 mb-2 italic">{hints.overview}</p>
        )}
        <textarea
          value={syllabus.overview}
          onChange={(e) => setSyllabus({ ...syllabus, overview: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          rows="4"
          placeholder="Enter course overview..."
        />
      </div>

      {/* Modules */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">Course Modules</label>
          <button
            onClick={addModule}
            className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            + Add Module
          </button>
        </div>
        <div className="space-y-4">
          {syllabus.modules.map((module, moduleIndex) => (
            <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Module Name *</label>
                    <input
                      type="text"
                      value={module.title || ''}
                      onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                      placeholder="Enter module name"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Duration (hours/days) *</label>
                    <input
                      type="text"
                      value={module.duration || ''}
                      onChange={(e) => updateModule(moduleIndex, 'duration', e.target.value)}
                      placeholder="e.g., 10 hours or 2 days"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
                      removeModule(moduleIndex)
                    }
                  }}
                  className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete module"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-600">Topics</label>
                  <button
                    onClick={() => addTopic(moduleIndex)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50"
                  >
                    + Add Topic
                  </button>
                </div>
                <div className="space-y-2">
                  {(module.topics || []).map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => updateTopic(moduleIndex, topicIndex, e.target.value)}
                        placeholder="Enter topic"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      />
                      <button
                        onClick={() => removeTopic(moduleIndex, topicIndex)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove topic"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {(!module.topics || module.topics.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No topics added yet</p>
                  )}
                </div>
              </div>
            </div>
          ))}
          {syllabus.modules.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No modules added yet. Click "Add Module" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">Learning Outcomes</label>
          <button
            onClick={() => addArrayItem('learningOutcomes')}
            className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {syllabus.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateArrayItem('learningOutcomes', index, e.target.value)}
                placeholder="Learning outcome"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              <button
                onClick={() => removeArrayItem('learningOutcomes', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Prerequisites */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">Prerequisites</label>
          <button
            onClick={() => addArrayItem('prerequisites')}
            className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {syllabus.prerequisites.map((prereq, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={prereq}
                onChange={(e) => updateArrayItem('prerequisites', index, e.target.value)}
                placeholder="Prerequisite"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              <button
                onClick={() => removeArrayItem('prerequisites', index)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">Hands-On Projects</label>
          <button
            onClick={addProject}
            className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            + Add Project
          </button>
        </div>
        <div className="space-y-4">
          {syllabus.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={project.name || ''}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    placeholder="Project Name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                      removeProject(index)
                    }
                  }}
                  className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete project"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Project Overview / Description</label>
                  <p className="text-xs text-gray-500 mb-2">Type a paragraph (or one sentence per line). We’ll convert it into bullet points automatically on the syllabus page.</p>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Describe the project outcomes, tech stack, deliverables, etc."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    rows="3"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-600">Project Details (Bullet Points)</label>
                  <button
                    onClick={() => addProjectPoint(index)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50"
                  >
                    + Add Point
                  </button>
                </div>
                <div className="space-y-2">
                  {(project.points || []).map((point, pointIndex) => (
                    <div key={pointIndex} className="flex items-center gap-2">
                      <span className="text-primary-600 shrink-0 flex items-center h-5">•</span>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateProjectPoint(index, pointIndex, e.target.value)}
                        placeholder="Enter project detail point"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      />
                      <button
                        onClick={() => removeProjectPoint(index, pointIndex)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove point"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {(!project.points || project.points.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No project details added yet. Click "+ Add Point" to add bullet points.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Instructors */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-semibold text-gray-700">Course Instructors</label>
          <button
            onClick={addInstructor}
            className="px-3 py-1 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
          >
            + Add Instructor
          </button>
        </div>
        <div className="space-y-4">
          {syllabus.instructors.map((instructor, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={instructor.name}
                    onChange={(e) => updateInstructor(index, 'name', e.target.value)}
                    placeholder="Instructor Name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <textarea
                    value={instructor.description || ''}
                    onChange={(e) => updateInstructor(index, 'description', e.target.value)}
                    placeholder="Instructor bio/description (e.g., 10+ years experience in AI/ML, worked at Google, etc.)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    rows="2"
                  />
                </div>
                <button
                  onClick={() => removeInstructor(index)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          {syllabus.instructors.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <p className="text-sm">No instructors added yet. Click "Add Instructor" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Certification */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {courseCategory === 'placement_training' ? 'Placement & Certification Information' : 'Certification Information'}
        </label>
        {hints.certification && (
          <p className="text-xs text-gray-500 mb-2 italic">{hints.certification}</p>
        )}
        <textarea
          value={syllabus.certification}
          onChange={(e) => setSyllabus({ ...syllabus, certification: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          rows="3"
          placeholder={courseCategory === 'placement_training' 
            ? "Enter placement guarantee details and certification information..." 
            : "Enter certification details..."}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-6 py-2 border border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving & Publishing...' : 'Save & Publish'}
        </button>
      </div>
    </div>
  )
}

