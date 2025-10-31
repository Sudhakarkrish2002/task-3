import React from 'react'
import { partnerCompanies } from '../utils/partnerCompanies.js'

const placementCourses = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    tagline: 'Highest salary offered: ₹12 LPA',
    description: 'Comprehensive MERN stack training with guaranteed placement assistance.',
    duration: '12 weeks',
    features: [
      '100+ hours of live coding sessions',
      '1-on-1 mentoring sessions',
      'Resume building and interview prep',
      'Direct referrals to top companies',
    ],
    placementRate: '92%',
    avgSalary: '₹8.5 LPA',
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning',
    tagline: 'Highest salary offered: ₹15 LPA',
    description: 'Master data science with real-world projects and guaranteed placement support.',
    duration: '16 weeks',
    features: [
      'Industry mentorship program',
      'Portfolio project development',
      'Mock interviews with industry experts',
      'Exclusive job portal access',
    ],
    placementRate: '89%',
    avgSalary: '₹9.2 LPA',
  },
  {
    id: 3,
    title: 'DevOps Engineering',
    tagline: 'Highest salary offered: ₹14 LPA',
    description: 'Complete DevOps training with hands-on experience and placement guarantee.',
    duration: '12 weeks',
    features: [
      'Cloud infrastructure projects',
      'CI/CD pipeline building',
      'Technical interview preparation',
      'LinkedIn profile optimization',
    ],
    placementRate: '88%',
    avgSalary: '₹10.5 LPA',
  },
  {
    id: 4,
    title: 'Cloud Computing (AWS & Azure)',
    tagline: 'Highest salary offered: ₹13 LPA',
    description: 'Dual cloud certifications with guaranteed placement in top tech companies.',
    duration: '10 weeks',
    features: [
      'AWS & Azure hands-on labs',
      'Certification exam prep',
      'Career counseling sessions',
      'Placement support for 6 months',
    ],
    placementRate: '91%',
    avgSalary: '₹8.8 LPA',
  },
  {
    id: 5,
    title: 'Mobile App Development',
    tagline: 'Highest salary offered: ₹11 LPA',
    description: 'React Native and Flutter training with placement guarantee.',
    duration: '10 weeks',
    features: [
      'Cross-platform app development',
      'App store deployment guidance',
      'Startup connections',
      'Freelancing opportunities',
    ],
    placementRate: '87%',
    avgSalary: '₹7.5 LPA',
  },
]

const successStories = [
  {
    name: 'Priya Sharma',
    course: 'Full-Stack Web Development',
    company: 'TechCorp',
    salary: '₹10 LPA',
    quote: 'The mentorship and live sessions helped me land my dream job at a top tech company within 2 months of completion.',
    image: 'PS',
  },
  {
    name: 'Rajesh Kumar',
    course: 'Data Science & ML',
    company: 'DataViz',
    salary: '₹12 LPA',
    quote: 'The placement support team worked tirelessly with me. Got placed at a leading data analytics firm with an amazing package.',
    image: 'RK',
  },
  {
    name: 'Anita Patel',
    course: 'DevOps Engineering',
    company: 'CloudNova',
    salary: '₹11 LPA',
    quote: 'From zero knowledge to getting hired - the training program transformed my career completely. Highly recommended!',
    image: 'AP',
  },
]

const successMetrics = [
  { label: 'Placement Rate', value: '90%', description: 'Average placement rate across all programs' },
  { label: 'Average Salary', value: '₹9.2 LPA', description: 'Average starting salary for placed students' },
  { label: 'Hiring Partners', value: '500+', description: 'Companies actively hiring our graduates' },
  { label: 'Students Placed', value: '15,000+', description: 'Total students successfully placed' },
]

export default function PlacementTraining() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Placement-Guaranteed Training Programs
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Get job-ready with our comprehensive training and dedicated placement support
          </p>
        </div>
      </section>

      {/* Guarantee Description */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Placement Guarantee</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We guarantee your placement success through our comprehensive training approach. Our programs are designed 
              to make you industry-ready with hands-on experience, expert mentorship, and dedicated job support.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Sessions</h3>
                <p className="text-sm text-gray-600">
                  Interactive live coding sessions with industry experts. Ask questions, get real-time feedback, and learn from the best.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Mentoring</h3>
                <p className="text-sm text-gray-600">
                  1-on-1 mentorship sessions with industry professionals. Get personalized guidance on your career path and skill development.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-gray-200 bg-linear-to-br from-primary-50 to-white">
                <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Support</h3>
                <p className="text-sm text-gray-600">
                  Dedicated placement support team helps with resume building, interview preparation, and connects you with hiring partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-12 bg-linear-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Success Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {successMetrics.map((metric, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{metric.value}</div>
                <div className="text-primary-100 font-medium mb-1">{metric.label}</div>
                <div className="text-sm text-primary-200">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Courses */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Placement-Guaranteed Programs</h2>
            <p className="text-gray-600">Choose a program that aligns with your career goals</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {placementCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border-2 border-primary-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Course Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Placement Guaranteed
                    </span>
                  </div>
                  <div className="mt-2 p-3 rounded-lg bg-primary-50 border border-primary-200">
                    <div className="text-sm font-semibold text-primary-900">{course.tagline}</div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">{course.description}</p>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Duration</div>
                    <div className="text-sm font-semibold text-gray-900">{course.duration}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Placement Rate</div>
                    <div className="text-sm font-semibold text-green-700">{course.placementRate}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Average Salary</div>
                    <div className="text-sm font-semibold text-gray-900">{course.avgSalary}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Program Type</div>
                    <div className="text-sm font-semibold text-gray-900">Guaranteed</div>
                  </div>
                </div>

                {/* Course Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Program Features:</h4>
                  <ul className="space-y-2">
                    {course.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button - Prominent */}
                <button className="w-full rounded-lg bg-primary-600 px-6 py-4 text-white text-base font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                  Enroll Now - Get Guaranteed Placement
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Stories</h2>
            <p className="text-gray-600">Real stories from students who got placed through our programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                    {story.image}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-600">{story.course}</div>
                  </div>
                </div>
                <blockquote className="text-sm text-gray-700 italic mb-4">"{story.quote}"</blockquote>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">Placed at</div>
                    <div className="text-sm font-semibold text-gray-900">{story.company}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500">Package</div>
                    <div className="text-sm font-semibold text-primary-700">{story.salary}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Companies - Placement Partners */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Placement Partners</h2>
            <p className="text-gray-600">Top companies that hire from our placement-guaranteed programs</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {partnerCompanies.map((company) => (
              <div
                key={company.name}
                className="flex h-28 items-center justify-center rounded-lg border-2 border-gray-200 bg-white hover:border-primary-400 hover:shadow-lg transition-all cursor-pointer group p-4"
              >
                <div className="text-center w-full">
                  <img
                    src={`https://logo.clearbit.com/${company.domain}`}
                    alt={company.name}
                    className="h-12 w-auto mx-auto mb-2 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const fallback = e.target.nextElementSibling
                      if (fallback) {
                        fallback.style.display = 'block'
                      }
                    }}
                  />
                  <div className="text-xs font-bold text-gray-800 group-hover:text-primary-700 transition-colors hidden">
                    {company.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

