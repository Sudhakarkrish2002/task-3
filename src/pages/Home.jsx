import React from 'react'
import { partnerCompanies } from '../utils/partnerCompanies.js'

const featuredCourses = [
  {
    title: 'Full-Stack Web Development',
    tag: 'Certification',
    description: 'Hands-on MERN training with real-world projects and mentoring.',
  },
  {
    title: 'Data Science Foundations',
    tag: 'Certification',
    description: 'Python, statistics, ML, and dashboards to kickstart your career.',
  },
  {
    title: 'Placement Accelerator',
    tag: 'Placement-Guaranteed',
    description: 'Structured interview prep, mock interviews, and referral support.',
  },
]

const partnerColleges = [
  { name: 'IIT Delhi', category: 'Engineering' },
  { name: 'IIT Bombay', category: 'Engineering' },
  { name: 'NIT Trichy', category: 'Engineering' },
  { name: 'BITS Pilani', category: 'Engineering' },
  { name: 'IIM Bangalore', category: 'Management' },
  { name: 'DU', category: 'University' },
]

const testimonials = [
  {
    name: 'Ananya Sharma',
    role: 'Frontend Engineer at TechCorp',
    quote:
      'The mentorship and projects helped me crack my first job within 8 weeks.',
  },
  {
    name: 'Rahul Verma',
    role: 'Data Analyst at FinEdge',
    quote: 'Clear roadmap and guidance—exactly what I needed as a fresher.',
  },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              Transforming Freshers into Industry-Ready Professionals
            </h1>
            <p className="mt-5 text-gray-700 text-base sm:text-lg">
              Welcome to Kiwistron Edutech, where we believe every student can build a
              successful career. Explore certifications, internship opportunities, direct
              hiring-links, and more — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a 
                href="#/courses" 
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold hover:bg-primary-700 transition-colors shadow-sm hover:shadow-md"
              >
                Browse Courses
              </a>
              <a 
                href="#/auth" 
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-6 py-3 text-primary-700 text-base font-semibold hover:bg-primary-50 transition-colors bg-white"
              >
                Register Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Featured Certification Courses</h2>
            <a href="#/courses" className="text-sm font-medium text-primary-700 hover:text-primary-800">
              View All
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.title} className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow bg-white">
                <div className="text-xs font-medium text-primary-700 inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-600" />
                  {course.tag}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{course.description}</p>
                <div className="mt-4 flex gap-2">
                  <a href="#/courses/certifications" className="text-sm text-primary-700 font-medium hover:text-primary-800">
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Placement Promise / Success Stories</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-xl border border-gray-200 bg-white p-5">
                <blockquote className="text-gray-700 text-sm">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-medium text-gray-900">
                  {t.name}
                  <span className="block text-gray-600 font-normal">{t.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900">Partner Employers & Colleges</h2>
            <p className="mt-2 text-gray-600">Trusted by leading companies and educational institutions</p>
          </div>

          {/* Partner Employers */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Partner Employers</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {partnerCompanies.slice(0, 10).map((partner) => (
                <div
                  key={partner.name}
                  className="flex h-28 items-center justify-center rounded-lg border-2 border-gray-200 bg-white hover:border-primary-400 hover:shadow-lg transition-all cursor-pointer group p-4"
                >
                  <div className="text-center w-full">
                    <img
                      src={`https://logo.clearbit.com/${partner.domain}`}
                      alt={partner.name}
                      className="h-12 w-auto mx-auto mb-2 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                      onError={(e) => {
                        // Fallback to text if logo fails to load
                        e.target.style.display = 'none'
                        const fallback = e.target.nextElementSibling
                        if (fallback) {
                          fallback.style.display = 'block'
                        }
                      }}
                    />
                    <div className="text-xs font-bold text-gray-800 group-hover:text-primary-700 transition-colors hidden">
                      {partner.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{partner.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner Colleges */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Partner Colleges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {partnerColleges.map((college) => (
                <div
                  key={college.name}
                  className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="text-center px-3">
                    <div className="text-sm font-bold text-gray-800 group-hover:text-primary-700 transition-colors">
                      {college.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


