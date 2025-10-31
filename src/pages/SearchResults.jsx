import React, { useState } from 'react'

const sampleResults = [
  {
    id: 1,
    type: 'Course',
    title: 'Full-Stack Web Development',
    category: 'Web Development',
    location: 'Online',
    description: 'Master MERN stack with hands-on projects',
    fee: '₹25,999',
    duration: '12 weeks',
  },
  {
    id: 2,
    type: 'Internship',
    title: 'Frontend Development Intern',
    category: 'Web Development',
    location: 'Bangalore',
    company: 'TechStartup',
    stipend: '₹8,000/month',
    duration: '3 months',
  },
  {
    id: 3,
    type: 'Job',
    title: 'Senior Full-Stack Developer',
    category: 'Web Development',
    location: 'Remote',
    company: 'CloudTech Solutions',
    salary: '₹12-18 LPA',
    experience: '3-5 years',
  },
  {
    id: 4,
    type: 'Course',
    title: 'Data Science & Machine Learning',
    category: 'Data Science',
    location: 'Hybrid',
    description: 'Learn Python, statistics, ML algorithms',
    fee: '₹29,999',
    duration: '16 weeks',
  },
  {
    id: 5,
    type: 'Internship',
    title: 'Data Science Intern',
    category: 'Data Science',
    location: 'Mumbai',
    company: 'DataViz Analytics',
    stipend: '₹12,000/month',
    duration: '6 months',
  },
  {
    id: 6,
    type: 'Job',
    title: 'React Developer',
    category: 'Web Development',
    location: 'Delhi NCR',
    company: 'AppCraft',
    salary: '₹8-12 LPA',
    experience: '2-4 years',
  },
]

export default function SearchResults() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    type: 'All',
    category: 'All',
    location: 'All',
  })

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value })
  }

  const filteredResults = sampleResults.filter((result) => {
    const matchesSearch = searchQuery === '' || 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (result.company && result.company.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = filters.type === 'All' || result.type === filters.type
    const matchesCategory = filters.category === 'All' || result.category === filters.category
    const matchesLocation = filters.location === 'All' || result.location === filters.location

    return matchesSearch && matchesType && matchesCategory && matchesLocation
  })

  const categories = ['All', 'Web Development', 'Data Science', 'Cloud', 'DevOps', 'Mobile Development']
  const locations = ['All', 'Online', 'Remote', 'Bangalore', 'Mumbai', 'Delhi NCR', 'Hybrid']
  const types = ['All', 'Course', 'Internship', 'Job']

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Search Courses, Internships, Jobs
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find the perfect opportunity that matches your skills and interests
          </p>
        </div>
      </section>

      {/* Search Bar & Filters */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for courses, internships, or jobs..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-12 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-600">No results found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setFilters({ type: 'All', category: 'All', location: 'All' })
                }}
                className="mt-4 text-primary-700 hover:text-primary-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Type Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      result.type === 'Course'
                        ? 'bg-blue-100 text-blue-800'
                        : result.type === 'Internship'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {result.type}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{result.title}</h3>

                  {/* Company (for Internship/Job) */}
                  {result.company && (
                    <div className="text-sm font-semibold text-primary-700 mb-2">{result.company}</div>
                  )}

                  {/* Description (for Course) */}
                  {result.description && (
                    <p className="text-sm text-gray-600 mb-4">{result.description}</p>
                  )}

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span>{result.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{result.location}</span>
                    </div>
                    {result.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{result.duration}</span>
                      </div>
                    )}
                    {result.fee && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{result.fee}</span>
                      </div>
                    )}
                    {result.stipend && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{result.stipend}</span>
                      </div>
                    )}
                    {result.salary && (
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{result.salary}</span>
                      </div>
                    )}
                    {result.experience && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Experience: </span>
                        {result.experience}
                      </div>
                    )}
                  </div>

                  {/* Action Button - Prominent */}
                  <button className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-bold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg">
                    {result.type === 'Course' ? 'Enroll Now' : 'Apply Now'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

