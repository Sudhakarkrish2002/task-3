import React, { useState, useEffect } from 'react'
import { courseAPI } from '../utils/api.js'

export default function SyllabusEditor({ courseId, courseTitle, onClose, onSave }) {
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
        setSyllabus({
          overview: response.data.syllabus.overview || '',
          modules: response.data.syllabus.modules || [],
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

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await courseAPI.updateCourseSyllabus(courseId, syllabus)
      if (response.success) {
        alert('Syllabus saved successfully!')
        if (onSave) onSave(response.data)
        if (onClose) onClose()
      }
    } catch (error) {
      alert('Error saving syllabus: ' + (error.message || 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const addModule = () => {
    setSyllabus({
      ...syllabus,
      modules: [...syllabus.modules, { title: '', duration: '', topics: [] }]
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Edit Syllabus: {courseTitle}</h2>
        <p className="text-sm text-gray-600">Customize the course syllabus template</p>
      </div>

      {/* Overview */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Course Overview
        </label>
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
            <div key={moduleIndex} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    placeholder="Module Title"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold mb-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                  <input
                    type="text"
                    value={module.duration || ''}
                    onChange={(e) => updateModule(moduleIndex, 'duration', e.target.value)}
                    placeholder="Duration (e.g., 2 weeks)"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  />
                </div>
                <button
                  onClick={() => removeModule(moduleIndex)}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Topics</span>
                  <button
                    onClick={() => addTopic(moduleIndex)}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
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
                        placeholder="Topic name"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      />
                      <button
                        onClick={() => removeTopic(moduleIndex, topicIndex)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
          Certification Information
        </label>
        <textarea
          value={syllabus.certification}
          onChange={(e) => setSyllabus({ ...syllabus, certification: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          rows="3"
          placeholder="Enter certification details..."
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
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Syllabus'}
        </button>
      </div>
    </div>
  )
}

