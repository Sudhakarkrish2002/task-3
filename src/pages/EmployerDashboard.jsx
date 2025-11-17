import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { internshipAPI, workshopAPI } from '../utils/api.js'

export default function EmployerDashboard() {
  const [contentType, setContentType] = useState('internships') // 'internships' or 'workshops'
  const [activeTab, setActiveTab] = useState('my-internships')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [internships, setInternships] = useState([])
  const [workshops, setWorkshops] = useState([])
  const [editingInternship, setEditingInternship] = useState(null)
  const [editingWorkshop, setEditingWorkshop] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    duration: '',
    applicationDeadline: '',
    positionsAvailable: 1,
    category: 'Technology',
    type: 'full-time',
    isRemote: false,
    stipend: {
      amount: '',
      currency: 'INR',
      type: 'fixed'
    },
    skillsRequired: '',
    qualifications: '',
    responsibilities: '',
    benefits: '',
    startDate: ''
  })
  const [workshopFormData, setWorkshopFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'technical',
    instructor: '',
    instructorEmail: '',
    instructorBio: '',
    price: '',
    duration: '',
    level: 'all',
    language: 'English',
    mode: 'online',
    location: '',
    maxParticipants: 1,
    schedule: {
      startDate: '',
      endDate: ''
    },
    learningOutcomes: '',
    prerequisites: '',
    tags: '',
    certificateIncluded: false
  })

  useEffect(() => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
      if (contentType === 'internships') {
        fetchMyInternships()
      } else {
        fetchMyWorkshops()
      }
    } catch (error) {
      console.error('Error loading employer profile:', error)
      toast.error('Unable to load employer profile. Please refresh.')
    }
  }, [contentType])

  const fetchMyInternships = async () => {
    try {
      setLoading(true)
      const response = await internshipAPI.getMyInternships()
      if (response.success) {
        setInternships(response.data.internships || [])
      }
    } catch (error) {
      toast.error('Error fetching internships: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyWorkshops = async () => {
    try {
      setLoading(true)
      const response = await workshopAPI.getMyWorkshops()
      if (response.success) {
        setWorkshops(response.data.workshops || [])
      }
    } catch (error) {
      toast.error('Error fetching workshops: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('stipend.')) {
      const stipendKey = name.split('.')[1]
      setFormData({
        ...formData,
        stipend: {
          ...formData.stipend,
          [stipendKey]: value
        }
      })
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked })
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseInt(value) || 0 })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      description: '',
      duration: '',
      applicationDeadline: '',
      positionsAvailable: 1,
      category: 'Technology',
      type: 'full-time',
      isRemote: false,
      stipend: {
        amount: '',
        currency: 'INR',
        type: 'fixed'
      },
      skillsRequired: '',
      qualifications: '',
      responsibilities: '',
      benefits: '',
      startDate: ''
    })
    setEditingInternship(null)
  }

  const resetWorkshopForm = () => {
    setWorkshopFormData({
      title: '',
      description: '',
      shortDescription: '',
      category: 'technical',
      instructor: '',
      instructorEmail: '',
      instructorBio: '',
      price: '',
      duration: '',
      level: 'all',
      language: 'English',
      mode: 'online',
      location: '',
      maxParticipants: 1,
      schedule: {
        startDate: '',
        endDate: ''
      },
      learningOutcomes: '',
      prerequisites: '',
      tags: '',
      certificateIncluded: false
    })
    setEditingWorkshop(null)
  }

  const handleWorkshopFormChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name.startsWith('schedule.')) {
      const scheduleKey = name.split('.')[1]
      setWorkshopFormData({
        ...workshopFormData,
        schedule: {
          ...workshopFormData.schedule,
          [scheduleKey]: value
        }
      })
    } else if (type === 'checkbox') {
      setWorkshopFormData({ ...workshopFormData, [name]: checked })
    } else if (type === 'number') {
      setWorkshopFormData({ ...workshopFormData, [name]: parseInt(value) || 0 })
    } else {
      setWorkshopFormData({ ...workshopFormData, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const internshipData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        duration: formData.duration,
        applicationDeadline: formData.applicationDeadline,
        positionsAvailable: formData.positionsAvailable,
        category: formData.category,
        type: formData.type,
        isRemote: formData.isRemote,
        stipend: formData.stipend.amount ? {
          amount: parseFloat(formData.stipend.amount),
          currency: formData.stipend.currency,
          type: formData.stipend.type
        } : {},
        skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : [],
        qualifications: formData.qualifications ? formData.qualifications.split('\n').filter(q => q.trim()) : [],
        responsibilities: formData.responsibilities ? formData.responsibilities.split('\n').filter(r => r.trim()) : [],
        benefits: formData.benefits ? formData.benefits.split('\n').filter(b => b.trim()) : [],
        startDate: formData.startDate || undefined,
        isPublished: false
      }

      if (editingInternship) {
        await internshipAPI.updateInternship(editingInternship._id, internshipData)
        toast.success('Internship updated successfully!')
      } else {
        await internshipAPI.createInternship(internshipData)
        toast.success('Internship created successfully!')
      }

      resetForm()
      fetchMyInternships()
      setActiveTab('my-internships')
    } catch (error) {
      toast.error('Error saving internship: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (internship) => {
    setEditingInternship(internship)
    setFormData({
      title: internship.title || '',
      location: internship.location || '',
      description: internship.description || '',
      duration: internship.duration || '',
      applicationDeadline: internship.applicationDeadline ? new Date(internship.applicationDeadline).toISOString().split('T')[0] : '',
      positionsAvailable: internship.positionsAvailable || 1,
      category: internship.category || 'Technology',
      type: internship.type || 'full-time',
      isRemote: internship.isRemote || false,
      stipend: {
        amount: internship.stipend?.amount || '',
        currency: internship.stipend?.currency || 'INR',
        type: internship.stipend?.type || 'fixed'
      },
      skillsRequired: internship.skillsRequired?.join(', ') || '',
      qualifications: internship.qualifications?.join('\n') || '',
      responsibilities: internship.responsibilities?.join('\n') || '',
      benefits: internship.benefits?.join('\n') || '',
      startDate: internship.startDate ? new Date(internship.startDate).toISOString().split('T')[0] : ''
    })
    setActiveTab('post-job')
  }

  const handleDelete = async (internshipId) => {
    if (!window.confirm('Are you sure you want to delete this internship?')) {
      return
    }

    try {
      setLoading(true)
      await internshipAPI.deleteInternship(internshipId)
      toast.success('Internship deleted successfully!')
      fetchMyInternships()
    } catch (error) {
      toast.error('Error deleting internship: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (internship) => {
    const action = internship.isPublished ? 'unpublish' : 'publish'
    const confirmMessage = action === 'publish'
      ? `Are you sure you want to publish "${internship.title}"? It will be visible to all users.`
      : `Are you sure you want to unpublish "${internship.title}"? It will no longer be visible to users.`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setLoading(true)
      const newIsPublished = !internship.isPublished
      
      const updateData = { isPublished: newIsPublished }
      
      const response = await internshipAPI.updateInternship(internship._id, updateData)
      
      if (response.success) {
        toast.success(`Internship ${newIsPublished ? 'published' : 'unpublished'} successfully!`)
        fetchMyInternships()
      } else {
        throw new Error(response.message || 'Failed to update internship status')
      }
    } catch (error) {
      // Extract detailed error message from API response
      let errorMessage = 'Failed to update internship status. Please try again.'
      
      if (error.data?.message) {
        errorMessage = error.data.message
        // Include missing fields if available
        if (error.data.missingFields && error.data.missingFields.length > 0) {
          errorMessage += ` Missing fields: ${error.data.missingFields.join(', ')}`
        }
      } else if (error.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      console.error('Error publishing internship:', {
        error,
        errorData: error.data,
        status: error.status,
        message: errorMessage,
        internshipId: internship._id,
        isPublished: internship.isPublished
      })
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkshopSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate schedule
      if (!workshopFormData.schedule.startDate || !workshopFormData.schedule.endDate) {
        toast.error('Start date and end date are required')
        setLoading(false)
        return
      }

      // Validate location for offline/hybrid modes
      if ((workshopFormData.mode === 'offline' || workshopFormData.mode === 'hybrid') && !workshopFormData.location) {
        toast.error('Location is required for offline and hybrid workshops')
        setLoading(false)
        return
      }

      const workshopData = {
        title: workshopFormData.title,
        description: workshopFormData.description,
        shortDescription: workshopFormData.shortDescription || undefined,
        category: workshopFormData.category,
        instructor: workshopFormData.instructor,
        instructorEmail: workshopFormData.instructorEmail || undefined,
        instructorBio: workshopFormData.instructorBio || undefined,
        price: parseFloat(workshopFormData.price),
        duration: workshopFormData.duration,
        level: workshopFormData.level,
        language: workshopFormData.language,
        mode: workshopFormData.mode,
        location: workshopFormData.location || undefined,
        maxParticipants: workshopFormData.maxParticipants,
        schedule: {
          startDate: workshopFormData.schedule.startDate,
          endDate: workshopFormData.schedule.endDate
        },
        learningOutcomes: workshopFormData.learningOutcomes ? workshopFormData.learningOutcomes.split('\n').filter(lo => lo.trim()) : [],
        prerequisites: workshopFormData.prerequisites ? workshopFormData.prerequisites.split('\n').filter(p => p.trim()) : [],
        tags: workshopFormData.tags ? workshopFormData.tags.split(',').map(t => t.trim()) : [],
        certificateIncluded: workshopFormData.certificateIncluded
      }

      if (editingWorkshop) {
        await workshopAPI.updateWorkshop(editingWorkshop._id, workshopData)
        toast.success('Workshop updated successfully!')
      } else {
        await workshopAPI.createWorkshop(workshopData)
        toast.success('Workshop created successfully!')
      }

      resetWorkshopForm()
      fetchMyWorkshops()
      setActiveTab('my-workshops')
    } catch (error) {
      toast.error('Error saving workshop: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEditWorkshop = (workshop) => {
    setEditingWorkshop(workshop)
    setWorkshopFormData({
      title: workshop.title || '',
      description: workshop.description || '',
      shortDescription: workshop.shortDescription || '',
      category: workshop.category || 'technical',
      instructor: workshop.instructor || '',
      instructorEmail: workshop.instructorEmail || '',
      instructorBio: workshop.instructorBio || '',
      price: workshop.price || '',
      duration: workshop.duration || '',
      level: workshop.level || 'all',
      language: workshop.language || 'English',
      mode: workshop.mode || 'online',
      location: workshop.location || '',
      maxParticipants: workshop.maxParticipants || 1,
      schedule: {
        startDate: workshop.schedule?.startDate ? new Date(workshop.schedule.startDate).toISOString().split('T')[0] : '',
        endDate: workshop.schedule?.endDate ? new Date(workshop.schedule.endDate).toISOString().split('T')[0] : ''
      },
      learningOutcomes: workshop.learningOutcomes?.join('\n') || '',
      prerequisites: workshop.prerequisites?.join('\n') || '',
      tags: workshop.tags?.join(', ') || '',
      certificateIncluded: workshop.certificateIncluded || false
    })
    setActiveTab('post-workshop')
  }

  const handleDeleteWorkshop = async (workshopId) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) {
      return
    }

    try {
      setLoading(true)
      await workshopAPI.deleteWorkshop(workshopId)
      toast.success('Workshop deleted successfully!')
      fetchMyWorkshops()
    } catch (error) {
      toast.error('Error deleting workshop: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublishWorkshop = async (workshop) => {
    const action = workshop.isPublished ? 'unpublish' : 'publish'
    const confirmMessage = action === 'publish'
      ? `Are you sure you want to publish "${workshop.title}"? It will be visible to all users.`
      : `Are you sure you want to unpublish "${workshop.title}"? It will no longer be visible to users.`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      setLoading(true)
      const newIsPublished = !workshop.isPublished
      
      console.log('[EmployerDashboard] Publishing workshop:', {
        workshopId: workshop._id,
        title: workshop.title,
        currentIsPublished: workshop.isPublished,
        currentIsActive: workshop.isActive,
        newIsPublished: newIsPublished
      })
      
      // Use updateWorkshop for both publish and unpublish (consistent with internships)
      const updateData = { isPublished: newIsPublished }
      
      const response = await workshopAPI.updateWorkshop(workshop._id, updateData)
      
      console.log('[EmployerDashboard] Workshop update response:', {
        success: response.success,
        data: response.data,
        workshopId: response.data?._id,
        isPublished: response.data?.isPublished,
        isActive: response.data?.isActive,
        title: response.data?.title
      })
      
      if (response.success) {
        // Verify the workshop was saved correctly
        if (response.data) {
          const savedWorkshop = response.data
          console.log('[EmployerDashboard] Saved workshop verification:', {
            id: savedWorkshop._id,
            title: savedWorkshop.title,
            isPublished: savedWorkshop.isPublished,
            isActive: savedWorkshop.isActive
          })
          
          if (newIsPublished && (!savedWorkshop.isPublished || !savedWorkshop.isActive)) {
            console.error('[EmployerDashboard] WARNING: Workshop was not saved with correct publish status!', {
              expected: { isPublished: true, isActive: true },
              actual: { isPublished: savedWorkshop.isPublished, isActive: savedWorkshop.isActive }
            })
            toast.warning('Workshop published, but there may be an issue. Please check the workshop status.')
          }
        }
        
        toast.success(`Workshop ${newIsPublished ? 'published' : 'unpublished'} successfully!`)
        fetchMyWorkshops()
      } else {
        throw new Error(response.message || 'Failed to update workshop status')
      }
    } catch (error) {
      // Extract detailed error message from API response
      let errorMessage = 'Failed to update workshop status. Please try again.'
      
      if (error.data?.message) {
        errorMessage = error.data.message
      } else if (error.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      console.error('[EmployerDashboard] Error publishing workshop:', {
        error,
        errorData: error.data,
        status: error.status,
        message: errorMessage,
        workshopId: workshop._id,
        isPublished: workshop.isPublished
      })
      
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = () => {
    if (!user || !user.employerDetails?.companyName) return 'E'
    return user.employerDetails.companyName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusBadgeColor = (isPublished) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }

  const getApprovalStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage internships, workshops, and company profile</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => {
              setContentType('internships')
              setActiveTab('my-internships')
              resetForm()
              resetWorkshopForm()
            }}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out ${
              contentType === 'internships'
                ? 'bg-primary-600 text-white shadow-lg hover:bg-primary-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Internships
          </button>
          <button
            onClick={() => {
              setContentType('workshops')
              setActiveTab('my-workshops')
              resetForm()
              resetWorkshopForm()
            }}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out ${
              contentType === 'workshops'
                ? 'bg-primary-600 text-white shadow-lg hover:bg-primary-700'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Workshops
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {contentType === 'internships' ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('my-internships')
                      resetForm()
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                      activeTab === 'my-internships'
                        ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                        : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">My Internships</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('post-job')
                      resetForm()
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                      activeTab === 'post-job'
                        ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                        : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">{editingInternship ? 'Edit Internship' : 'Post Internship'}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('my-workshops')
                      resetWorkshopForm()
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                      activeTab === 'my-workshops'
                        ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                        : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">My Workshops</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('post-workshop')
                      resetWorkshopForm()
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                      activeTab === 'post-workshop'
                        ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                        : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10">{editingWorkshop ? 'Edit Workshop' : 'Post Workshop'}</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out relative overflow-hidden ${
                  activeTab === 'profile'
                    ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)] hover:bg-primary-700'
                    : 'bg-white text-gray-700 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-2xl hover:shadow-gray-400/60 hover:text-gray-900'
                }`}
              >
                <span className="relative z-10">Company Profile</span>
              </button>
            </nav>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'my-internships' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Internships</h2>
                {loading && internships.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : internships.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No internships posted yet. Click "Post Internship" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {internships.map((internship) => (
                      <div key={internship._id} className="p-5 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{internship.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{internship.location} {internship.isRemote && '(Remote)'}</p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{internship.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(internship.isPublished)}`}>
                                {internship.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getApprovalStatusBadgeColor(internship.adminApprovalStatus)}`}>
                                {internship.adminApprovalStatus}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                {internship.applicationsReceived || 0} Applications
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleEdit(internship)}
                            className="flex-1 rounded-lg border border-primary-600 px-4 py-2 text-primary-600 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-primary-50 hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePublish(internship)}
                            disabled={loading}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                              internship.isPublished
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {loading ? 'Processing...' : (internship.isPublished ? 'Unpublish' : 'Publish')}
                          </button>
                          <button
                            onClick={() => handleDelete(internship._id)}
                            className="flex-1 rounded-lg border border-red-600 px-4 py-2 text-red-600 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-red-50 hover:scale-105"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'post-job' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingInternship ? 'Edit Internship' : 'Post a New Internship'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., Frontend Developer Intern"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., Bangalore, Mumbai"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      >
                        <option value="Technology">Technology</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 3 months, 6 months"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type *</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                      <input
                        type="date"
                        name="applicationDeadline"
                        value={formData.applicationDeadline}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Positions Available *</label>
                      <input
                        type="number"
                        name="positionsAvailable"
                        value={formData.positionsAvailable}
                        onChange={handleFormChange}
                        min="1"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      />
                    </div>
                    <div className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleFormChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label className="ml-2 text-sm font-medium text-gray-700">Remote Position</label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Amount</label>
                      <input
                        type="number"
                        name="stipend.amount"
                        value={formData.stipend.amount}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Amount"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        name="stipend.currency"
                        value={formData.stipend.currency}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stipend Type</label>
                      <select
                        name="stipend.type"
                        value={formData.stipend.type}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="fixed">Fixed</option>
                        <option value="performance-based">Performance-based</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
                    <textarea
                      rows={5}
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Describe the role, responsibilities, requirements..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma-separated)</label>
                    <input
                      type="text"
                      name="skillsRequired"
                      value={formData.skillsRequired}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., React, JavaScript, Node.js"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (one per line)</label>
                    <textarea
                      rows={3}
                      name="qualifications"
                      value={formData.qualifications}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Bachelor's degree in Computer Science&#10;0-2 years of experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities (one per line)</label>
                    <textarea
                      rows={3}
                      name="responsibilities"
                      value={formData.responsibilities}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Develop and maintain web applications&#10;Collaborate with the team"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (one per line)</label>
                    <textarea
                      rows={3}
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Certificate of completion&#10;Letter of recommendation"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">{loading ? 'Saving...' : editingInternship ? 'Update Internship' : 'Create Internship'}</span>
                    </button>
                    {editingInternship && (
                      <button
                        type="button"
                        onClick={() => {
                          resetForm()
                          setActiveTab('my-internships')
                        }}
                        className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'my-workshops' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Workshops</h2>
                {loading && workshops.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Loading...</p>
                  </div>
                ) : workshops.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No workshops posted yet. Click "Post Workshop" to create one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workshops.map((workshop) => (
                      <div key={workshop._id} className="p-5 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{workshop.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {workshop.instructor} • {workshop.location || 'Online'}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{workshop.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                workshop.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {workshop.isPublished ? 'Published' : 'Draft'}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                workshop.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {workshop.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                                ₹{workshop.price}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                {workshop.currentParticipants || 0}/{workshop.maxParticipants} Participants
                              </span>
                              {workshop.schedule?.startDate && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                  {new Date(workshop.schedule.startDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleEditWorkshop(workshop)}
                            className="flex-1 rounded-lg border border-primary-600 px-4 py-2 text-primary-600 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-primary-50 hover:scale-105"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePublishWorkshop(workshop)}
                            disabled={loading}
                            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                              workshop.isPublished
                                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                : 'bg-green-600 text-white hover:bg-green-700'
                            }`}
                          >
                            {loading ? 'Processing...' : (workshop.isPublished ? 'Unpublish' : 'Publish')}
                          </button>
                          <button
                            onClick={() => handleDeleteWorkshop(workshop._id)}
                            className="flex-1 rounded-lg border border-red-600 px-4 py-2 text-red-600 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-red-50 hover:scale-105"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'post-workshop' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  {editingWorkshop ? 'Edit Workshop' : 'Post a New Workshop'}
                </h2>
                <form onSubmit={handleWorkshopSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={workshopFormData.title}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., React Workshop for Beginners"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={workshopFormData.shortDescription}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Brief description (max 200 characters)"
                      maxLength={200}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      rows={5}
                      name="description"
                      value={workshopFormData.description}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Describe the workshop content, objectives..."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                      <select
                        name="category"
                        value={workshopFormData.category}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      >
                        <option value="technical">Technical</option>
                        <option value="soft_skills">Soft Skills</option>
                        <option value="career">Career</option>
                        <option value="industry">Industry</option>
                        <option value="certification">Certification</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                      <select
                        name="level"
                        value={workshopFormData.level}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="all">All Levels</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Name *</label>
                      <input
                        type="text"
                        name="instructor"
                        value={workshopFormData.instructor}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Email</label>
                      <input
                        type="email"
                        name="instructorEmail"
                        value={workshopFormData.instructorEmail}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="instructor@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor Bio</label>
                    <textarea
                      rows={2}
                      name="instructorBio"
                      value={workshopFormData.instructorBio}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Brief biography of the instructor"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={workshopFormData.price}
                        onChange={handleWorkshopFormChange}
                        min="0"
                        step="0.01"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        name="duration"
                        value={workshopFormData.duration}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 2 days, 4 hours"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants *</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={workshopFormData.maxParticipants}
                        onChange={handleWorkshopFormChange}
                        min="1"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mode *</label>
                      <select
                        name="mode"
                        value={workshopFormData.mode}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        name="language"
                        value={workshopFormData.language}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {(workshopFormData.mode === 'offline' || workshopFormData.mode === 'hybrid') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        name="location"
                        value={workshopFormData.location}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., Bangalore, Mumbai"
                        required={workshopFormData.mode === 'offline' || workshopFormData.mode === 'hybrid'}
                      />
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                      <input
                        type="date"
                        name="schedule.startDate"
                        value={workshopFormData.schedule.startDate}
                        onChange={handleWorkshopFormChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                      <input
                        type="date"
                        name="schedule.endDate"
                        value={workshopFormData.schedule.endDate}
                        onChange={handleWorkshopFormChange}
                        min={workshopFormData.schedule.startDate}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Learning Outcomes (one per line)</label>
                    <textarea
                      rows={3}
                      name="learningOutcomes"
                      value={workshopFormData.learningOutcomes}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="What participants will learn&#10;Outcome 1&#10;Outcome 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites (one per line)</label>
                    <textarea
                      rows={3}
                      name="prerequisites"
                      value={workshopFormData.prerequisites}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="Required knowledge or skills&#10;Prerequisite 1&#10;Prerequisite 2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={workshopFormData.tags}
                      onChange={handleWorkshopFormChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      placeholder="e.g., React, JavaScript, Web Development"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="certificateIncluded"
                      checked={workshopFormData.certificateIncluded}
                      onChange={handleWorkshopFormChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label className="ml-2 text-sm font-medium text-gray-700">Certificate Included</label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10">{loading ? 'Saving...' : editingWorkshop ? 'Update Workshop' : 'Create Workshop'}</span>
                    </button>
                    {editingWorkshop && (
                      <button
                        type="button"
                        onClick={() => {
                          resetWorkshopForm()
                          setActiveTab('my-workshops')
                        }}
                        className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 text-sm font-semibold transition-all duration-300 ease-in-out hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Company Profile</h2>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  toast.info('Profile update functionality coming soon!')
                }}>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-lg bg-primary-100 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary-700">{getUserInitials()}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{user?.employerDetails?.companyName || 'Company Name'}</h3>
                        <p className="text-sm text-gray-600">{user?.email || 'company@example.com'}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          defaultValue={user?.employerDetails?.companyName || ''}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                        <input
                          type="text"
                          defaultValue={user?.employerDetails?.industry || ''}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                          disabled
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Description</label>
                      <textarea
                        rows={4}
                        defaultValue={user?.employerDetails?.companyDescription || ''}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        disabled
                      />
                    </div>

                    <button type="submit" className="rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden">
                      <span className="relative z-10">Update Profile</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
