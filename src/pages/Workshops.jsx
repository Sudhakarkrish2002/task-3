import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext.jsx'
import { workshopAPI } from '../utils/api.js'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

export default function Workshops() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [workshops, setWorkshops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const formRef = useRef(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91',
    company: '',
  })

  useEffect(() => {
    loadWorkshops()
  }, [])

  // Check for workshop ID in URL after redirect from auth
  useEffect(() => {
    if (!authLoading && isAuthenticated && user && workshops.length > 0) {
      const hash = window.location.hash || ''
      // Parse workshopId from URL (format: #/courses/workshops?workshopId=xxx)
      const hashParts = hash.split('?')
      if (hashParts.length > 1) {
        const urlParams = new URLSearchParams(hashParts[1])
        const workshopId = urlParams.get('workshopId')
        
        if (workshopId) {
          const workshop = workshops.find(w => {
            const id = w._id || w.id
            return id && id.toString() === workshopId.toString()
          })
          
          if (workshop && !selectedWorkshop) {
            setSelectedWorkshop(workshop)
            // Pre-fill form with user data
            setFormData({
              name: user.name || '',
              email: user.email || '',
              phone: user.phone || '+91',
              company: user.company || user.employerDetails?.companyName || ''
            })
            // Scroll to form
            setTimeout(() => {
              if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }, 100)
            // Clean up URL
            window.history.replaceState(null, '', '#/courses/workshops')
          }
        }
      }
    }
  }, [authLoading, isAuthenticated, user, workshops, selectedWorkshop])

  const loadWorkshops = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('[Workshops] Fetching workshops from backend...')
      const response = await workshopAPI.getAllWorkshops({ limit: 100 })
      console.log('[Workshops] Backend response received:', response)
      console.log('[Workshops] Response success:', response.success)
      console.log('[Workshops] Response data:', response.data)
      
      if (response.success) {
        const list = response.data?.workshops || response.data || []
        console.log('[Workshops] Processed workshops list:', list)
        console.log('[Workshops] Number of workshops:', list.length)
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        setWorkshops(list)
        console.log('[Workshops] Workshops set in state successfully')
      } else {
        console.error('[Workshops] Response indicates failure:', response.message)
        throw new Error(response.message || 'Unable to load workshops')
      }
    } catch (err) {
      console.error('[Workshops] Error loading workshops:', err)
      console.error('[Workshops] Error details:', {
        message: err.message,
        status: err.status,
        data: err.data
      })
      setError(err.message || 'Unable to load workshops right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleWorkshopSelect = (workshop) => {
    // Check if user is authenticated before allowing workshop selection
    if (!isAuthenticated || !user) {
      toast.info('Please sign in to register for workshops')
      const workshopId = workshop._id || workshop.id
      const redirectUrl = `/#/courses/workshops?workshopId=${workshopId}`
      window.location.href = `/#/auth?redirect=${encodeURIComponent(redirectUrl)}`
      return
    }

    // User is authenticated, proceed with selection
    setSelectedWorkshop(workshop)
    // Pre-fill form with user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '+91',
      company: user.company || user.employerDetails?.companyName || ''
    })
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedWorkshop) {
      toast.error('Please select a workshop first')
      return
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      toast.info('Please sign in to register for workshops')
      const workshopId = selectedWorkshop._id || selectedWorkshop.id
      const redirectUrl = `/#/courses/workshops?workshopId=${workshopId}`
      window.location.href = `/#/auth?redirect=${encodeURIComponent(redirectUrl)}`
      return
    }

    // Validate form fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      const workshopId = selectedWorkshop._id || selectedWorkshop.id
      const response = await workshopAPI.registerForWorkshop(workshopId, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim() || ''
      })

      if (response.success) {
        toast.success(`Registration successful! You've registered for "${selectedWorkshop.title}".`)
        setFormData({ name: '', email: '', phone: '+91', company: '' })
        setSelectedWorkshop(null)
        // Reload workshops to update participant count
        loadWorkshops()
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Error registering for workshop:', error)
      const errorMessage = error.message || error.data?.message || 'Failed to register for workshop. Please try again.'
      toast.error(errorMessage)
    }
  }

  const getWorkshopId = (workshop) => workshop._id || workshop.id


  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hands-On Workshops for Skill Boost
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Join our expert-led workshops and enhance your skills with hands-on learning
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Workshop Calendar */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upcoming Workshops</h2>
              <p className="text-gray-600">Browse and register for upcoming workshops</p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading workshops...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={loadWorkshops}
                    className="mt-4 text-primary-700 hover:text-primary-800 font-semibold"
                  >
                    Retry loading
                  </button>
                </div>
              ) : workshops.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">No workshops available right now. Please check back soon.</p>
                </div>
              ) : (
                workshops.map((workshop) => {
                  const workshopId = getWorkshopId(workshop)
                  const isSelected = selectedWorkshop && getWorkshopId(selectedWorkshop) === workshopId
                  // Calculate available seats from backend fields
                  const maxSeats = workshop.maxParticipants || 0
                  const currentSeats = workshop.currentParticipants || 0
                  const seatsLeft = maxSeats > 0 ? maxSeats - currentSeats : null
                  const isFull = seatsLeft !== null && seatsLeft === 0
                  // Use mode from backend (online, offline, hybrid)
                  const modeLabel = workshop.mode || 'online'
                  const formatLabel = modeLabel.charAt(0).toUpperCase() + modeLabel.slice(1)
                  const feeLabel = workshop.price ? `₹${workshop.price}` : 'Free'
                  // Get date from schedule.startDate
                  const startDate = workshop.schedule?.startDate
                  const endDate = workshop.schedule?.endDate
                  return (
                    <div
                      key={workshopId}
                      className={`bg-white rounded-xl border-2 p-6 transition-all ${
                        isSelected ? 'border-primary-600 shadow-lg' : 'border-gray-200 hover:shadow-xl hover:shadow-gray-400/50'
                      } ${isFull ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <svg className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-bold text-gray-900">{workshop.title}</h3>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                  modeLabel === 'online'
                                    ? 'bg-blue-100 text-blue-800'
                                    : modeLabel === 'offline'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {formatLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{workshop.description || workshop.shortDescription || 'Workshop details coming soon.'}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 shrink-0 text-orange-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div className="text-gray-500 mb-1">Start Date</div>
                            <div className="font-semibold text-gray-900">
                              {startDate ? formatDate(startDate) : 'To be announced'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 shrink-0 text-pink-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div className="text-gray-500 mb-1">End Date</div>
                            <div className="font-semibold text-gray-900">
                              {endDate ? formatDate(endDate) : startDate ? 'Ongoing' : 'TBA'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 shrink-0 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-gray-500 mb-1">Duration</div>
                            <div className="font-semibold text-gray-900">{workshop.duration || '—'}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-5 h-5 shrink-0 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <div className="text-gray-500 mb-1">Fee</div>
                            <div className="font-semibold text-primary-700">{feeLabel}</div>
                          </div>
                        </div>
                      </div>

                      {workshop.location && (
                        <div className="mb-4 text-sm flex items-center gap-2">
                          <svg className="w-5 h-5 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <span className="text-gray-500">Location: </span>
                            <span className="font-semibold text-gray-900">{workshop.location}</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          {workshop.instructor && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 shrink-0 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <div>
                                <span className="text-gray-500">Instructor: </span>
                                <span className="font-semibold text-gray-900">{workshop.instructor}</span>
                              </div>
                            </div>
                          )}
                          {seatsLeft !== null && (
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 shrink-0 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <div>
                                <span className="text-gray-500">Seats: </span>
                                <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-gray-900'}`}>
                                  {seatsLeft} of {maxSeats} left
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleWorkshopSelect(workshop)}
                          disabled={isFull}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                            isFull
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-primary-700 text-white shadow-xl shadow-primary-700/50'
                              : 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)]'
                          }`}
                        >
                          <span className="relative z-10">{isFull ? 'Full' : isSelected ? 'Selected' : 'Register'}</span>
                          {!isFull && !isSelected && (
                            <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1" ref={formRef}>
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Workshop Registration</h2>

              {selectedWorkshop ? (
                <>
                  <div className="mb-4 p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <div className="text-sm font-semibold text-primary-900 mb-1">Selected Workshop:</div>
                    <div className="text-base font-bold text-gray-900">{selectedWorkshop.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {selectedWorkshop.schedule?.startDate ? formatDate(selectedWorkshop.schedule.startDate) : 'Date TBA'}
                      {selectedWorkshop.schedule?.endDate && ` - ${formatDate(selectedWorkshop.schedule.endDate)}`}
                    </div>
                    <button
                      onClick={() => setSelectedWorkshop(null)}
                      className="mt-2 text-xs text-primary-700 hover:text-primary-800 underline"
                    >
                      Change selection
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company/Organization (Optional)
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Your company name"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-lg bg-primary-600 px-4 py-3 text-white text-sm font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_35px_80px_rgba(147,51,234,0.9)] relative overflow-hidden"
                    >
                      <span className="relative z-10">Confirm Registration</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">Select a workshop to register</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

