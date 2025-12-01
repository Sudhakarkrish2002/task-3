import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { consultationAPI } from '../utils/api.js'

export default function Consultation() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    educationalQualification: '',
    interestedCareerPath: '',
    currentProfile: '',
    yearOfGraduation: '',
    speakingLanguage: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await consultationAPI.createConsultation(formData)
      
      if (response.success) {
        toast.success('Thank you for booking your consultation! Our career expert will contact you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          educationalQualification: '',
          interestedCareerPath: '',
          currentProfile: '',
          yearOfGraduation: '',
          speakingLanguage: '',
        })
      } else {
        toast.error(response.message || 'Failed to submit consultation request')
      }
    } catch (error) {
      console.error('Error submitting consultation:', error)
      toast.error(error.message || 'Failed to submit consultation request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const educationalQualifications = [
    'High School',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ]

  const currentProfiles = [
    'Student',
    'Fresher',
    'Working Professional',
    'Career Changer',
    'Unemployed',
    'Other'
  ]

  // Generate years from 2030 down to 20 years before current year
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 20
  const graduationYears = Array.from({ length: 2030 - startYear + 1 }, (_, i) => 2030 - i)

  const languages = [
    'English',
    'Hindi',
    'Tamil',
    'Telugu',
    'Kannada',
    'Malayalam',
    'Bengali',
    'Marathi',
    'Gujarati',
    'Other'
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-linear-to-br from-purple-900 via-purple-800 to-purple-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Achieve Your Career Goals with
            </h1>
            <h2 className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-6">
              Free 1 on 1 Consultation
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Are you looking to take your career to new heights? Make the most of this exclusive chance! 
              Book your Free 1-on-1 Career Consultation for personalized guidance from expert advisors to help 
              you explore fresh opportunities and achieve your career goals.
            </p>
            
            {/* Feature Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex items-center gap-3">
                <svg className="w-8 h-8 text-white flshrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-white font-medium">Consultation in Native Language</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex items-center gap-3">
                <svg className="w-8 h-8 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
                <span className="text-white font-medium">Flexible Scheduling Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why to Take Career Consultation Section */}
      <section className="py-16 bg-white border-t-2 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why to Take Career Consultation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Card 1: Bridge Skills to Industry */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="/Assets/skills image.webp" 
                  alt="Bridge Skills to Industry - Professional development and skill building illustration"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Bridge Skills to Industry</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Learn how to gain a skill set to meet industry expectations.</p>
              </div>
            </div>

            {/* Card 2: Begin Your Ideal Career */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-64 relative overflow-hidden">
                <img 
                  src="/Assets/step-up image.webp" 
                  alt="Begin Your Ideal Career - Career path and professional growth illustration"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Begin Your Ideal Career</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Discover the best career path tailored to your strengths and goals.</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a 
              href="#consultation-form"
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('consultation-form');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-purple-600 text-white font-semibold text-base transition-all duration-300 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 cursor-pointer"
            >
              Get Free Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Simple Steps Section */}
      <section className="py-16 bg-white border-b-2 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple Steps to Your Consultation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-xl bg-primary-500 border-4 border-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Schedule Your Consultation</h3>
              <p className="text-gray-600 text-sm">Book a convenient time slot that fits your schedule</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-xl bg-primary-500 border-4 border-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Get a Call from Career Expert</h3>
              <p className="text-gray-600 text-sm">Receive personalized guidance from our experienced career counselors</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-xl bg-primary-500 border-4 border-white shadow-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Discover Your Opportunities</h3>
              <p className="text-gray-600 text-sm">Explore career paths and opportunities tailored to your skills</p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Form Section */}
      <section id="consultation-form" className="py-16 bg-gray-50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              Book Your Free Consultation
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Fill out the form below and our career expert will contact you soon.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <div className="flex items-center px-4 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                    <span className="text-2xl mr-2">🇮🇳</span>
                    <span className="text-sm font-medium text-gray-700">+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="flex-1 rounded-r-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                    placeholder="Please type without country code"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Enter 10-digit mobile number</p>
              </div>

              {/* Educational Qualification */}
              <div>
                <label htmlFor="educationalQualification" className="block text-sm font-medium text-gray-700 mb-2">
                  Educational Qualification <span className="text-red-500">*</span>
                </label>
                <select
                  id="educationalQualification"
                  name="educationalQualification"
                  value={formData.educationalQualification}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                >
                  <option value="">Select</option>
                  {educationalQualifications.map((qual) => (
                    <option key={qual} value={qual}>{qual}</option>
                  ))}
                </select>
              </div>

              {/* Interested Career Path */}
              <div>
                <label htmlFor="interestedCareerPath" className="block text-sm font-medium text-gray-700 mb-2">
                  Interested Career Paths <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="interestedCareerPath"
                  name="interestedCareerPath"
                  value={formData.interestedCareerPath}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                  placeholder="Enter your interested career path (e.g., Software Development, Data Science, etc.)"
                />
              </div>

              {/* Current Profile */}
              <div>
                <label htmlFor="currentProfile" className="block text-sm font-medium text-gray-700 mb-2">
                  Current Profile <span className="text-red-500">*</span>
                </label>
                <select
                  id="currentProfile"
                  name="currentProfile"
                  value={formData.currentProfile}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                >
                  <option value="">Select</option>
                  {currentProfiles.map((profile) => (
                    <option key={profile} value={profile}>{profile}</option>
                  ))}
                </select>
              </div>

              {/* Year of Graduation */}
              <div>
                <label htmlFor="yearOfGraduation" className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Graduation <span className="text-red-500">*</span>
                </label>
                <select
                  id="yearOfGraduation"
                  name="yearOfGraduation"
                  value={formData.yearOfGraduation}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                >
                  <option value="">Select</option>
                  {graduationYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* Speaking Language */}
              <div>
                <label htmlFor="speakingLanguage" className="block text-sm font-medium text-gray-700 mb-2">
                  Speaking Language <span className="text-red-500">*</span>
                </label>
                <select
                  id="speakingLanguage"
                  name="speakingLanguage"
                  value={formData.speakingLanguage}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-colors"
                >
                  <option value="">Select</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-primary-600 px-6 py-4 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden mt-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">
                  {submitting ? 'Submitting...' : 'Book Free Consultation'}
                </span>
                <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

