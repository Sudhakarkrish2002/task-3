import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { courseAPI } from '../utils/api.js'

export default function SyllabusEditor({ courseId, courseTitle, courseCategory, onClose, onSave, onSaveAndPublish }) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [syllabus, setSyllabus] = useState({
    overview: '',
    modules: [],
    learningOutcomes: [],
    prerequisites: [],
    projects: [],
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
          learningOutcomes: module.learningOutcomes || []
        }))
        
        setSyllabus({
          overview: response.data.syllabus.overview || '',
          modules: modules,
          learningOutcomes: response.data.syllabus.learningOutcomes || [],
          prerequisites: response.data.syllabus.prerequisites || [],
          projects: response.data.syllabus.projects || [],
          certification: response.data.syllabus.certification || ''
        })
      }
    } catch (error) {
      console.error('Error loading syllabus:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (shouldPublish = false) => {
    setSaving(true)
    try {
      const response = await courseAPI.updateCourseSyllabus(courseId, syllabus)
      if (response.success) {
        if (shouldPublish) {
          // Save and publish in one call - include syllabus in courseData
          const publishResponse = await courseAPI.publishCourse(courseId, 'publish', { syllabus })
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
        learningOutcomes: [] 
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

  const addLearningOutcome = (moduleIndex) => {
    const updated = [...syllabus.modules]
    updated[moduleIndex].learningOutcomes = [...(updated[moduleIndex].learningOutcomes || []), '']
    setSyllabus({ ...syllabus, modules: updated })
  }

  const updateLearningOutcome = (moduleIndex, outcomeIndex, value) => {
    const updated = [...syllabus.modules]
    updated[moduleIndex].learningOutcomes[outcomeIndex] = value
    setSyllabus({ ...syllabus, modules: updated })
  }

  const removeLearningOutcome = (moduleIndex, outcomeIndex) => {
    const updated = [...syllabus.modules]
    updated[moduleIndex].learningOutcomes = updated[moduleIndex].learningOutcomes.filter((_, i) => i !== outcomeIndex)
    setSyllabus({ ...syllabus, modules: updated })
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
      projects: [...syllabus.projects, { name: '', description: '' }]
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Module Description *</label>
                    <textarea
                      value={module.description || ''}
                      onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                      placeholder="Enter module description"
                      rows="3"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
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
                  <label className="block text-xs font-semibold text-gray-600">Learning Outcomes</label>
                  <button
                    onClick={() => addLearningOutcome(moduleIndex)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-1 rounded hover:bg-primary-50"
                  >
                    + Add Learning Outcome
                  </button>
                </div>
                <div className="space-y-2">
                  {(module.learningOutcomes || []).map((outcome, outcomeIndex) => (
                    <div key={outcomeIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={outcome}
                        onChange={(e) => updateLearningOutcome(moduleIndex, outcomeIndex, e.target.value)}
                        placeholder="Enter learning outcome"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      />
                      <button
                        onClick={() => removeLearningOutcome(moduleIndex, outcomeIndex)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove learning outcome"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {(!module.learningOutcomes || module.learningOutcomes.length === 0) && (
                    <p className="text-xs text-gray-400 italic">No learning outcomes added yet</p>
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
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(index, 'name', e.target.value)}
                    placeholder="Project Name"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Project Description"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    rows="2"
                  />
                </div>
                <button
                  onClick={() => removeProject(index)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
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

