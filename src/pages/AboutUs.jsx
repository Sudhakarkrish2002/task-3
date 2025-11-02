import React from 'react'
import { partnerCompanies } from '../utils/partnerCompanies.js'

const foundingTeam = [
  {
    name: 'Mugeshwaran',
    role: 'Founder & CEO',
    description: 'Former VP at a leading tech company with 20+ years in education technology and talent development.',
    image: 'M',
  },
  {
    name: 'Immu',
    role: 'Co-Founder & CTO',
    description: 'Ex-Microsoft engineer, passionate about making quality education accessible to all students.',
    image: 'I',
  },
  {
    name: 'Amit Patel',
    role: 'Co-Founder & Head of Placements',
    description: '15 years of experience in recruitment and talent management across Fortune 500 companies.',
    image: 'AP',
  },
]

const stats = [
  { label: 'Students Placed', value: '25,000+', description: 'Successfully placed across top companies' },
  { label: 'Internships Conducted', value: '50,000+', description: 'Internship opportunities created' },
  { label: 'Partner Companies', value: '800+', description: 'Companies actively hiring through us' },
  { label: 'Colleges Partnered', value: '500+', description: 'Educational institutions working with us' },
  { label: 'Courses Offered', value: '100+', description: 'Industry-relevant courses and programs' },
  { label: 'Success Rate', value: '92%', description: 'Average placement success rate' },
]

const mediaMentions = [
  { source: 'TechCrunch', title: 'KiwisEdutech Revolutionizes Skill-Based Learning', year: '2023' },
  { source: 'The Hindu', title: 'Bridging the Gap Between Education and Industry', year: '2023' },
  { source: 'Economic Times', title: 'How EdTech is Transforming Career Readiness', year: '2024' },
  { source: 'Forbes India', title: 'Top 10 EdTech Startups to Watch', year: '2024' },
]

const accreditations = [
  { name: 'ISO 9001:2015', description: 'Quality Management System Certified' },
  { name: 'AICTE Recognized', description: 'Approved Training Partner' },
  { name: 'Microsoft Partner', description: 'Authorized Education Provider' },
  { name: 'AWS Education', description: 'Certified Cloud Training Partner' },
]

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Our Mission & Vision
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Transforming education to create industry-ready professionals
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-gray-200 bg-linear-to-br from-primary-50 to-white">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To bridge the gap between academic learning and industry requirements by providing 
                accessible, high-quality training programs that equip students with practical skills 
                and industry-recognized certifications, ultimately connecting them with rewarding 
                career opportunities.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-gray-200 bg-linear-to-br from-primary-50 to-white">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To become India's most trusted platform for career transformation, where every 
                student has access to world-class training, industry connections, and placement 
                support, creating a skilled workforce that drives innovation and economic growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Story</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                KiwisEdutech was founded in 2020 with a simple yet powerful vision: to make 
                quality education and career opportunities accessible to every student in India. 
                Recognizing the critical gap between what students learn in college and what 
                industries actually need, our founding team set out to create a platform that 
                bridges this divide.
              </p>
              <p>
                Starting with just 50 students in our first batch, we've grown to serve over 100,000 
                students across 500+ colleges. Our journey has been marked by constant innovation, 
                industry partnerships, and an unwavering commitment to student success.
              </p>
              <p>
                Today, we're proud to be recognized as a leading platform for skill development and 
                placement, having successfully placed thousands of students in top companies while 
                partnering with hundreds of educational institutions to transform their career 
                programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founding Team */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Founding Team</h2>
            <p className="text-gray-600">The visionaries behind KiwisEdutech</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {foundingTeam.map((member, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">{member.image}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <div className="text-sm font-semibold text-primary-700 mb-3">{member.role}</div>
                <p className="text-sm text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers / Stats */}
      <section className="py-12 bg-linear-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">Our Impact in Numbers</h2>
            <p className="text-primary-100">Transforming careers, one student at a time</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-primary-200">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Mentions */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Media Mentions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mediaMentions.map((mention, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-gray-200 bg-gray-50 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="font-bold text-gray-900">{mention.source}</div>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">{mention.year}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800">{mention.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Partner Companies */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
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

      {/* Accreditations */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Accreditations & Partnerships</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {accreditations.map((accreditation, idx) => (
                <div key={idx} className="p-6 rounded-lg border-2 border-primary-200 bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{accreditation.name}</h3>
                      <p className="text-sm text-gray-600">{accreditation.description}</p>
                    </div>
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

