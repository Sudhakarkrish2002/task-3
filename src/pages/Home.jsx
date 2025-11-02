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
  // Central Government Colleges
  { name: 'IIT Delhi', category: 'Engineering', type: 'Central Government' },
  { name: 'IIT Bombay', category: 'Engineering', type: 'Central Government' },
  { name: 'IIT Madras', category: 'Engineering', type: 'Central Government' },
  { name: 'IIT Kanpur', category: 'Engineering', type: 'Central Government' },
  { name: 'IIT Kharagpur', category: 'Engineering', type: 'Central Government' },
  { name: 'NIT Trichy', category: 'Engineering', type: 'Central Government' },
  { name: 'NIT Surathkal', category: 'Engineering', type: 'Central Government' },
  { name: 'NIT Warangal', category: 'Engineering', type: 'Central Government' },
  { name: 'NIT Calicut', category: 'Engineering', type: 'Central Government' },
  { name: 'IIM Ahmedabad', category: 'Management', type: 'Central Government' },
  { name: 'IIM Bangalore', category: 'Management', type: 'Central Government' },
  { name: 'IIM Calcutta', category: 'Management', type: 'Central Government' },
  { name: 'JNU', category: 'University', type: 'Central Government' },
  { name: 'DU', category: 'University', type: 'Central Government' },
  { name: 'Jadavpur University', category: 'Engineering', type: 'Central Government' },
  // Private Top Colleges
  { name: 'BITS Pilani', category: 'Engineering', type: 'Private' },
  { name: 'VIT Vellore', category: 'Engineering', type: 'Private' },
  { name: 'Manipal University', category: 'Engineering', type: 'Private' },
  { name: 'SRM University', category: 'Engineering', type: 'Private' },
  { name: 'Amity University', category: 'University', type: 'Private' },
  { name: 'LPU', category: 'University', type: 'Private' },
  { name: 'Symbiosis', category: 'University', type: 'Private' },
  { name: 'Christ University', category: 'University', type: 'Private' },
  { name: 'NMIMS', category: 'Management', type: 'Private' },
  { name: 'Xavier University', category: 'Management', type: 'Private' },
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
      <section className="pt-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/Assets/hero-home-banner.jpeg)'
          }}
        ></div>
        <div className="absolute inset-0 bg-linear-to-br from-primary-900/70 via-primary-800/60 to-primary-700/70"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
              Transforming Freshers into Industry-Ready Professionals
            </h1>
            <p className="mt-5 text-white/95 text-base sm:text-lg drop-shadow-md">
              Welcome to KiwisEdutech, where we believe every student can build a
              successful career. Explore certifications, internship opportunities, direct
              hiring-links, and more — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a 
                href="#/courses" 
                className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
              >
                <span className="relative z-10">Browse Courses</span>
                <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              <a 
                href="#/auth" 
                className="inline-flex items-center justify-center rounded-lg border-2 border-primary-600 px-6 py-3 text-primary-700 text-base font-semibold bg-white transition-all duration-300 ease-in-out shadow-md hover:scale-105 hover:bg-primary-50 hover:shadow-xl hover:shadow-primary-400/30 relative overflow-hidden"
              >
                <span className="relative z-10">Register Now</span>
                <span className="absolute inset-0 bg-linear-to-br from-primary-50 to-primary-100 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
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
            <a href="#/courses" className="text-sm font-medium text-primary-700 transition-all duration-300 ease-in-out hover:text-primary-800 hover:font-bold hover:shadow-sm inline-block">
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
                  <a href="#/courses/certifications" className="text-sm text-primary-700 font-medium transition-all duration-300 ease-in-out hover:text-primary-800 hover:font-bold hover:shadow-sm inline-flex items-center gap-1 hover:gap-2">
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-linear-to-b from-white to-primary-50">
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

      {/* Where Do Our Students Work */}
      <section className="py-16 bg-linear-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Where Do Our Students Work?</h2>
            <p className="text-gray-600">Our students are placed in top MNCs and leading companies</p>
          </div>

          {/* Row 1 - Scroll Left */}
          <div className="partner-scroll-container mb-4">
            <div className="partner-scroll-content scroll-left">
              {partnerCompanies.map((company) => (
                <div
                  key={`left-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
              {partnerCompanies.map((company) => (
                <div
                  key={`left-duplicate-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 - Scroll Right */}
          <div className="partner-scroll-container">
            <div className="partner-scroll-content scroll-right">
              {[...partnerCompanies].reverse().map((company) => (
                <div
                  key={`right-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
              {[...partnerCompanies].reverse().map((company) => (
                <div
                  key={`right-duplicate-${company.name}`}
                  className="flex flex-col items-center justify-center rounded-lg bg-white border border-gray-200 p-3 h-20 w-32 shrink-0 mx-2"
                >
                  <img
                    src={company.name === 'Zoho' ? 'https://logo.clearbit.com/zohocorp.com?size=256' : 
                      ['Tech Mahindra', 'Infosys', 'Wipro', 'IBM', 'HCL', 'Adobe', 'PwC', 'TCS', 'SAP'].includes(company.name) 
                        ? `https://logo.clearbit.com/${company.domain}?size=256` 
                        : `https://logo.clearbit.com/${company.domain}?size=128`}
                    alt={company.name}
                    className="h-10 w-auto max-w-full object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const nameDiv = e.target.nextElementSibling
                      if (nameDiv) {
                        nameDiv.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-semibold text-gray-900 text-center hidden">
                    {company.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Colleges */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-gray-900">Partner Colleges</h2>
            <p className="mt-2 text-gray-600">Trusted by leading educational institutions</p>
          </div>

          {/* 3 Column Grid with Vertical Scrolling */}
          <div className="grid grid-cols-3 gap-6">
            {/* Column 1 - Scroll Down */}
            <div className="college-scroll-container">
              <div className="college-scroll-content college-scroll-down">
                {partnerColleges.filter((_, idx) => idx % 3 === 0).map((college) => (
                  <div
                    key={`col1-${college.name}`}
                    className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shrink-0"
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">{college.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{college.type}</div>
                    </div>
                  </div>
                ))}
                {partnerColleges.filter((_, idx) => idx % 3 === 0).map((college) => (
                  <div
                    key={`col1-duplicate-${college.name}`}
                    className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shrink-0"
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">{college.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{college.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 - Scroll Up */}
            <div className="college-scroll-container">
              <div className="college-scroll-content college-scroll-up">
                {partnerColleges.filter((_, idx) => idx % 3 === 1).map((college) => (
                  <div
                    key={`col2-${college.name}`}
                    className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shrink-0"
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">{college.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{college.type}</div>
                    </div>
                  </div>
                ))}
                {partnerColleges.filter((_, idx) => idx % 3 === 1).map((college) => (
                  <div
                    key={`col2-duplicate-${college.name}`}
                    className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shrink-0"
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">{college.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{college.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3 - Scroll Down */}
            <div className="college-scroll-container">
              <div className="college-scroll-content college-scroll-down">
                {partnerColleges.filter((_, idx) => idx % 3 === 2).map((college) => (
                  <div
                    key={`col3-${college.name}`}
                    className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shrink-0"
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">{college.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{college.type}</div>
                    </div>
                  </div>
                ))}
                {partnerColleges.filter((_, idx) => idx % 3 === 2).map((college) => (
                  <div
                    key={`col3-duplicate-${college.name}`}
                    className="flex h-24 items-center justify-center rounded-lg border border-gray-200 bg-white p-4 shrink-0"
                  >
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-800">{college.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{college.category}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{college.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


