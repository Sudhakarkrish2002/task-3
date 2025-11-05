import React, { useState } from 'react'
import { courseSyllabus } from '../utils/courseSyllabus.js'

const courses = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    description: 'Master MERN stack with hands-on projects and build production-ready applications.',
    duration: '12 weeks',
    fee: '₹25,999',
    category: 'Web Development',
    mode: 'Online',
    tag: 'Trending',
    tagColor: 'bg-orange-100 text-orange-800',
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    description: 'Learn Python, statistics, ML algorithms, and create data-driven solutions.',
    duration: '16 weeks',
    fee: '₹29,999',
    category: 'Data Science',
    mode: 'Hybrid',
    tag: 'Placement-Guaranteed',
    tagColor: 'bg-green-100 text-green-800',
  },
  {
    id: 3,
    title: 'React & Next.js Mastery',
    description: 'Advanced React concepts, Next.js framework, and modern frontend development.',
    duration: '8 weeks',
    fee: '₹19,999',
    category: 'Web Development',
    mode: 'Online',
    tag: 'Trending',
    tagColor: 'bg-orange-100 text-orange-800',
  },
  {
    id: 4,
    title: 'Cloud Computing (AWS & Azure)',
    description: 'Comprehensive cloud training with AWS and Azure certifications.',
    duration: '10 weeks',
    fee: '₹27,999',
    category: 'Cloud',
    mode: 'Hybrid',
    tag: null,
    tagColor: '',
  },
  {
    id: 5,
    title: 'DevOps Engineering',
    description: 'CI/CD pipelines, Docker, Kubernetes, and infrastructure automation.',
    duration: '12 weeks',
    fee: '₹28,999',
    category: 'DevOps',
    mode: 'Online',
    tag: 'Placement-Guaranteed',
    tagColor: 'bg-green-100 text-green-800',
  },
  {
    id: 6,
    title: 'Mobile App Development (React Native)',
    description: 'Build cross-platform mobile apps using React Native framework.',
    duration: '10 weeks',
    fee: '₹24,999',
    category: 'Mobile Development',
    mode: 'Online',
    tag: null,
    tagColor: '',
  },
  {
    id: 7,
    title: 'UI/UX Design Masterclass',
    description: 'Design thinking, Figma, prototyping, and user experience principles.',
    duration: '8 weeks',
    fee: '₹18,999',
    category: 'Design',
    mode: 'Hybrid',
    tag: 'Popular',
    tagColor: 'bg-red-100 text-red-800',
  },
  {
    id: 8,
    title: 'Cybersecurity Fundamentals',
    description: 'Ethical hacking, network security, and security best practices.',
    duration: '14 weeks',
    fee: '₹31,999',
    category: 'Security',
    mode: 'Online',
    tag: null,
    tagColor: '',
  },
]

const categories = ['All', 'Web Development', 'Data Science', 'Cloud', 'DevOps', 'Mobile Development', 'Design', 'Security']
const durations = ['All', '8 weeks', '10 weeks', '12 weeks', '14 weeks', '16 weeks']
const modes = ['All', 'Online', 'Hybrid']

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDuration, setSelectedDuration] = useState('All')
  const [selectedMode, setSelectedMode] = useState('All')

  const filteredCourses = courses.filter((course) => {
    const matchCategory = selectedCategory === 'All' || course.category === selectedCategory
    const matchDuration = selectedDuration === 'All' || course.duration === selectedDuration
    const matchMode = selectedMode === 'All' || course.mode === selectedMode
    return matchCategory && matchDuration && matchMode
  })

  const handleViewSyllabus = (course) => {
    // Navigate to syllabus page with course details as query params
    const params = new URLSearchParams({
      title: course.title,
      description: course.description || '',
      duration: course.duration || '',
      fee: course.fee || '',
      type: 'course'
    })
    
    // If course has an ID, include it for API fetching
    if (course._id || course.id) {
      params.set('id', course._id || course.id)
    }
    
    window.location.hash = `#/courses/syllabus?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative pt-16 border-b border-primary-200 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Assets/banner-courses.jpeg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/75 to-primary-700/60"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Our Courses – Upskill, Certify, Get Hired
          </h1>
          <p className="mt-4 text-lg text-white/95 drop-shadow-md">
            Choose from our wide range of industry-relevant courses designed to transform your career
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>

            {/* Mode Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {modes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No courses found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedDuration('All')
                  setSelectedMode('All')
                }}
                className="mt-4 text-primary-700 hover:text-primary-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-2xl hover:shadow-gray-400/50 transition-shadow"
                >
                  {/* Tag */}
                  {course.tag && (
                    <div className="mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${course.tagColor}`}>
                        {course.tag}
                      </span>
                    </div>
                  )}

                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>

                  {/* Course Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{course.mode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.fee}</span>
                      </div>
                      {course.fee && course.fee.toLowerCase().includes('free') ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          FREE
                        </span>
                      ) : course.fee && course.fee !== 'Free' ? (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                          PAID
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewSyllabus(course)}
                      className="flex-1 rounded-lg border-2 border-primary-600 px-4 py-3 text-primary-700 text-sm font-semibold transition-all duration-300 ease-in-out shadow-md hover:scale-105 hover:bg-primary-50 hover:shadow-xl hover:shadow-primary-400/30 relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Syllabus
                      </span>
                      <span className="absolute inset-0 bg-linear-to-br from-primary-50 to-primary-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                    <button className="flex-1 rounded-lg bg-primary-600 px-6 py-3 text-white text-sm font-bold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden">
                      <span className="relative z-10">Enroll Now</span>
                      <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

