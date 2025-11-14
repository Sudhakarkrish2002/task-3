import React, { useState } from 'react'
import { toast } from 'react-toastify'

export default function CollegeRegistration() {
  const [formData, setFormData] = useState({
    collegeName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phone: '+91',
    address: '',
    city: '',
    state: '',
    pincode: '',
    numberOfStudents: '',
    numberOfFaculty: '',
    yearEstablished: '',
    collegeType: '',
    interestedServices: [],
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (service) => {
    const updatedServices = formData.interestedServices.includes(service)
      ? formData.interestedServices.filter((s) => s !== service)
      : [...formData.interestedServices, service]
    setFormData({ ...formData, interestedServices: updatedServices })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Thank you for your interest! We have received your college registration request. Our team will contact you within 24-48 hours to discuss partnership opportunities.')
    setFormData({
      collegeName: '',
      contactPerson: '',
      designation: '',
      email: '',
      phone: '+91',
      address: '',
      city: '',
      state: '',
      pincode: '',
      numberOfStudents: '',
      numberOfFaculty: '',
      yearEstablished: '',
      collegeType: '',
      interestedServices: [],
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold pt-15 text-gray-900">
            Partner with Us – Register Your College
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Transform your students' careers through industry-relevant training and placement support
          </p>
        </div>
      </section>

      {/* What College Gets Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Your College Gets</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Partner with us to provide your students with industry-relevant skills, certifications, 
              and placement opportunities. We offer comprehensive training programs, certification tie-ups, 
              and dedicated placement support to help your students succeed in their careers.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Training for Students</h3>
                <p className="text-sm text-gray-600">
                  Industry-aligned courses covering the latest technologies and skills. Live sessions, 
                  hands-on projects, and expert mentorship for comprehensive learning.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certification Tie-ups</h3>
                <p className="text-sm text-gray-600">
                  Industry-recognized certifications from leading tech companies. Boost your students' 
                  resumes with verified credentials that employers trust.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Placement Support</h3>
                <p className="text-sm text-gray-600">
                  Dedicated placement team connects students with top employers. Resume building, 
                  interview prep, and direct referrals to hiring companies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">College Registration Form</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
                        College Name *
                      </label>
                      <input
                        type="text"
                        id="collegeName"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Enter college name"
                      />
                    </div>

                    <div>
                      <label htmlFor="collegeType" className="block text-sm font-medium text-gray-700 mb-1">
                        College Type *
                      </label>
                      <select
                        id="collegeType"
                        name="collegeType"
                        value={formData.collegeType}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                      >
                        <option value="">Select type</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Arts & Science">Arts & Science</option>
                        <option value="Management">Management</option>
                        <option value="Polytechnic">Polytechnic</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="yearEstablished" className="block text-sm font-medium text-gray-700 mb-1">
                        Year Established *
                      </label>
                      <input
                        type="number"
                        id="yearEstablished"
                        name="yearEstablished"
                        value={formData.yearEstablished}
                        onChange={handleInputChange}
                        required
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 2000"
                      />
                    </div>

                    <div>
                      <label htmlFor="numberOfStudents" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Students *
                      </label>
                      <input
                        type="number"
                        id="numberOfStudents"
                        name="numberOfStudents"
                        value={formData.numberOfStudents}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 1000"
                      />
                    </div>

                    <div>
                      <label htmlFor="numberOfFaculty" className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Faculty *
                      </label>
                      <input
                        type="number"
                        id="numberOfFaculty"
                        name="numberOfFaculty"
                        value={formData.numberOfFaculty}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., 50"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Person Name *
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                        Designation *
                      </label>
                      <input
                        type="text"
                        id="designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="e.g., Principal, HOD"
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
                        placeholder="contact@college.edu"
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
                  </div>
                </div>

                {/* Address Information */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address *
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="College address"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          placeholder="City name"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State *
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          placeholder="State name"
                        />
                      </div>

                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          required
                          pattern="[0-9]{6}"
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interested Services */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Services of Interest *</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Student Training Programs',
                      'Industry Certifications',
                      'Placement Support',
                      'Workshops & Seminars',
                      'Internship Programs',
                      'Career Counseling',
                    ].map((service) => (
                      <label key={service} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interestedServices.includes(service)}
                          onChange={() => handleCheckboxChange(service)}
                          className="mr-2 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                  {formData.interestedServices.length === 0 && (
                    <p className="mt-2 text-xs text-red-600">Please select at least one service</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={formData.interestedServices.length === 0}
                  className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-2xl disabled:hover:shadow-primary-600/50 disabled:opacity-60"
                >
                  <span className="relative z-10">Submit Registration Request</span>
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

