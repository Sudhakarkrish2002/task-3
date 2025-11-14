import React, { useState } from 'react'
import { toast } from 'react-toastify'

const workshops = [
  {
    id: 1,
    title: 'React Hooks Mastery',
    topic: 'Web Development',
    date: '2024-02-15',
    time: '6:00 PM - 8:00 PM',
    format: 'Online',
    duration: '2 hours',
    instructor: 'John Doe',
    description: 'Learn advanced React Hooks patterns, custom hooks, and performance optimization techniques.',
    seats: 50,
    registered: 32,
    fee: 'Free',
  },
  {
    id: 2,
    title: 'Data Visualization with Python',
    topic: 'Data Science',
    date: '2024-02-20',
    time: '3:00 PM - 5:00 PM',
    format: 'Offline',
    duration: '2 hours',
    instructor: 'Jane Smith',
    description: 'Create stunning visualizations using Matplotlib, Seaborn, and Plotly for data analysis.',
    seats: 30,
    registered: 18,
    fee: '₹500',
    location: 'Bangalore Tech Park',
  },
  {
    id: 3,
    title: 'Docker & Kubernetes Basics',
    topic: 'DevOps',
    date: '2024-02-25',
    time: '10:00 AM - 1:00 PM',
    format: 'Online',
    duration: '3 hours',
    instructor: 'Mike Johnson',
    description: 'Hands-on workshop on containerization and orchestration with Docker and Kubernetes.',
    seats: 40,
    registered: 25,
    fee: 'Free',
  },
  {
    id: 4,
    title: 'UI/UX Design Principles',
    topic: 'Design',
    date: '2024-03-01',
    time: '2:00 PM - 5:00 PM',
    format: 'Hybrid',
    duration: '3 hours',
    instructor: 'Sarah Williams',
    description: 'Learn fundamental design principles and create user-friendly interfaces with Figma.',
    seats: 35,
    registered: 28,
    fee: '₹750',
    location: 'Mumbai Design Hub',
  },
  {
    id: 5,
    title: 'AWS Cloud Basics',
    topic: 'Cloud Computing',
    date: '2024-03-05',
    time: '11:00 AM - 2:00 PM',
    format: 'Online',
    duration: '3 hours',
    instructor: 'David Brown',
    description: 'Get started with AWS services, EC2, S3, and basic cloud architecture concepts.',
    seats: 60,
    registered: 45,
    fee: '₹1,000',
  },
  {
    id: 6,
    title: 'API Testing with Postman',
    topic: 'Testing',
    date: '2024-03-10',
    time: '4:00 PM - 6:00 PM',
    format: 'Online',
    duration: '2 hours',
    instructor: 'Emily Davis',
    description: 'Master API testing, automation, and integration testing using Postman.',
    seats: 45,
    registered: 30,
    fee: 'Free',
  },
]

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
  return date.toLocaleDateString('en-US', options)
}

const getMonthYear = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function Workshops() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+91',
    company: '',
  })

  const handleWorkshopSelect = (workshop) => {
    setSelectedWorkshop(workshop)
    setFormData({ name: '', email: '', phone: '+91', company: '' })
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (selectedWorkshop) {
      toast.success(`Registration successful! You've registered for "${selectedWorkshop.title}". Check your email for confirmation.`)
      setFormData({ name: '', email: '', phone: '+91', company: '' })
      setSelectedWorkshop(null)
    }
  }

  const availableSeats = (workshop) => workshop.seats - workshop.registered

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Hands-On Workshops for Skill Boost
          </h1>
          <p className="mt-4 text-lg text-gray-600">
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
              {workshops.map((workshop) => {
                const seatsLeft = availableSeats(workshop)
                const isFull = seatsLeft === 0
                return (
                  <div
                    key={workshop.id}
                    className={`bg-white rounded-xl border-2 p-6 transition-all ${
                      selectedWorkshop?.id === workshop.id
                        ? 'border-primary-600 shadow-lg'
                        : 'border-gray-200 hover:shadow-xl hover:shadow-gray-400/50'
                    } ${isFull ? 'opacity-75' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{workshop.title}</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            workshop.format === 'Online'
                              ? 'bg-blue-100 text-blue-800'
                              : workshop.format === 'Offline'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {workshop.format}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{workshop.description}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <div className="text-gray-500 mb-1">Date</div>
                        <div className="font-semibold text-gray-900">{formatDate(workshop.date)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Time</div>
                        <div className="font-semibold text-gray-900">{workshop.time}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Duration</div>
                        <div className="font-semibold text-gray-900">{workshop.duration}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 mb-1">Fee</div>
                        <div className="font-semibold text-primary-700">{workshop.fee}</div>
                      </div>
                    </div>

                    {workshop.location && (
                      <div className="mb-4 text-sm">
                        <span className="text-gray-500">Location: </span>
                        <span className="font-semibold text-gray-900">{workshop.location}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Instructor: </span>
                          <span className="font-semibold text-gray-900">{workshop.instructor}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Seats: </span>
                          <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-gray-900'}`}>
                            {seatsLeft} left
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleWorkshopSelect(workshop)}
                        disabled={isFull}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                          isFull
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : selectedWorkshop?.id === workshop.id
                            ? 'bg-primary-700 text-white shadow-xl shadow-primary-700/50'
                            : 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_30px_70px_rgba(147,51,234,0.8)]'
                        }`}
                      >
                        <span className="relative z-10">{isFull ? 'Full' : selectedWorkshop?.id === workshop.id ? 'Selected' : 'Register'}</span>
                        {!isFull && selectedWorkshop?.id !== workshop.id && (
                          <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Workshop Registration</h2>

              {selectedWorkshop ? (
                <>
                  <div className="mb-4 p-4 rounded-lg bg-primary-50 border border-primary-200">
                    <div className="text-sm font-semibold text-primary-900 mb-1">Selected Workshop:</div>
                    <div className="text-base font-bold text-gray-900">{selectedWorkshop.title}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatDate(selectedWorkshop.date)} • {selectedWorkshop.time}
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

