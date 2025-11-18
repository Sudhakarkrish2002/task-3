import React, { useState } from 'react'

const jobCategories = [
  { id: 'all', label: 'All Positions' },
  { id: 'teaching', label: 'Teaching & Training' },
  { id: 'tech', label: 'Technology' },
  { id: 'sales', label: 'Sales & Marketing' },
  { id: 'operations', label: 'Operations' },
  { id: 'hr', label: 'HR & Recruitment' },
]

const openPositions = [
  {
    id: 1,
    title: 'Senior Full-Stack Development Instructor',
    category: 'teaching',
    location: 'Remote / Bangalore',
    type: 'Full-time',
    experience: '5+ years',
    description: 'We are looking for an experienced Full-Stack Developer to join our teaching team. You will be responsible for creating course content, conducting live sessions, mentoring students, and helping them build real-world projects.',
    requirements: [
      '5+ years of experience in Full-Stack Development (MERN/MEAN stack)',
      'Strong knowledge of React, Node.js, MongoDB, Express.js',
      'Experience in teaching or mentoring developers',
      'Excellent communication and presentation skills',
      'Passion for education and student success'
    ],
    responsibilities: [
      'Design and develop comprehensive course curriculum',
      'Conduct live coding sessions and workshops',
      'Mentor students through projects and assignments',
      'Review and provide feedback on student work',
      'Stay updated with latest industry trends and technologies'
    ],
    benefits: [
      'Competitive salary + performance bonuses',
      'Flexible working hours',
      'Work from home options',
      'Professional development opportunities',
      'Health insurance and wellness programs'
    ]
  },
  {
    id: 2,
    title: 'Data Science Course Developer',
    category: 'teaching',
    location: 'Remote / Mumbai',
    type: 'Full-time',
    experience: '4+ years',
    description: 'Join our team as a Data Science Course Developer to create engaging and practical courses on Python, Machine Learning, Data Analytics, and AI. Help students transition into data science careers.',
    requirements: [
      '4+ years of experience in Data Science and Machine Learning',
      'Proficiency in Python, SQL, Pandas, Scikit-learn, TensorFlow',
      'Experience with data visualization tools (Tableau, Power BI)',
      'Previous teaching or content creation experience preferred',
      'Strong analytical and problem-solving skills'
    ],
    responsibilities: [
      'Develop comprehensive data science course content',
      'Create hands-on projects and case studies',
      'Record video lectures and tutorials',
      'Design assessments and coding challenges',
      'Collaborate with industry experts for real-world insights'
    ],
    benefits: [
      'Attractive compensation package',
      'Remote work flexibility',
      'Access to latest tools and technologies',
      'Opportunity to impact thousands of students',
      'Career growth in EdTech industry'
    ]
  },
  {
    id: 3,
    title: 'Placement Coordinator',
    category: 'hr',
    location: 'Bangalore / Hyderabad',
    type: 'Full-time',
    experience: '2+ years',
    description: 'We are seeking a dynamic Placement Coordinator to manage our placement program, build relationships with companies, and help students secure their dream jobs.',
    requirements: [
      '2+ years of experience in recruitment or placement',
      'Strong network in IT/tech industry',
      'Excellent communication and negotiation skills',
      'Understanding of tech roles and requirements',
      'Passion for helping students succeed'
    ],
    responsibilities: [
      'Build and maintain relationships with partner companies',
      'Match students with suitable job opportunities',
      'Coordinate interviews and placement processes',
      'Conduct mock interviews and provide feedback',
      'Track placement metrics and success rates'
    ],
    benefits: [
      'Performance-based incentives',
      'Opportunity to work with top companies',
      'Career development in HR/Talent Acquisition',
      'Make a real impact on student careers',
      'Collaborative and supportive work environment'
    ]
  },
  {
    id: 4,
    title: 'Frontend Developer (EdTech Platform)',
    category: 'tech',
    location: 'Remote / Bangalore',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Join our tech team to build and enhance our learning platform. Work on creating an amazing user experience for students, instructors, and administrators.',
    requirements: [
      '3+ years of experience in React.js and modern JavaScript',
      'Strong knowledge of HTML5, CSS3, Tailwind CSS',
      'Experience with state management (Redux/Context API)',
      'Understanding of RESTful APIs and GraphQL',
      'Experience with responsive design and mobile-first approach'
    ],
    responsibilities: [
      'Develop and maintain frontend features of the platform',
      'Collaborate with backend developers and designers',
      'Optimize application performance and user experience',
      'Write clean, maintainable, and testable code',
      'Participate in code reviews and technical discussions'
    ],
    benefits: [
      'Competitive salary and equity options',
      'Latest MacBook Pro and development tools',
      'Flexible work schedule',
      'Learning and conference budget',
      'Health insurance and remote work setup allowance'
    ]
  },
  {
    id: 5,
    title: 'Sales & Business Development Manager',
    category: 'sales',
    location: 'Bangalore / Delhi / Mumbai',
    type: 'Full-time',
    experience: '3+ years',
    description: 'Drive growth by acquiring new students, building partnerships with colleges, and expanding our market presence. Help us reach more students and transform careers.',
    requirements: [
      '3+ years of experience in B2C sales or EdTech sales',
      'Proven track record of meeting sales targets',
      'Excellent communication and persuasion skills',
      'Understanding of education and career development market',
      'Willingness to travel for client meetings'
    ],
    responsibilities: [
      'Acquire new students through various channels',
      'Build partnerships with colleges and institutions',
      'Conduct product demonstrations and webinars',
      'Manage sales pipeline and CRM',
      'Collaborate with marketing team on campaigns'
    ],
    benefits: [
      'Attractive base salary + high commission structure',
      'Performance bonuses and incentives',
      'Travel allowance and expense reimbursement',
      'Career advancement opportunities',
      'Training and skill development programs'
    ]
  },
  {
    id: 6,
    title: 'Student Success Manager',
    category: 'operations',
    location: 'Remote',
    type: 'Full-time',
    experience: '2+ years',
    description: 'Ensure student success by providing support, tracking progress, addressing concerns, and helping students achieve their learning goals. Be the bridge between students and the platform.',
    requirements: [
      '2+ years of experience in customer success or student support',
      'Excellent communication and empathy skills',
      'Ability to handle multiple student queries',
      'Understanding of online learning platforms',
      'Problem-solving and conflict resolution skills'
    ],
    responsibilities: [
      'Monitor student progress and engagement',
      'Provide timely support and assistance',
      'Conduct regular check-ins with students',
      'Gather feedback and suggest improvements',
      'Coordinate with instructors and technical team'
    ],
    benefits: [
      'Work from home flexibility',
      'Competitive salary',
      'Impact student lives directly',
      'Growth opportunities in EdTech',
      'Supportive and inclusive work culture'
    ]
  },
  {
    id: 7,
    title: 'DevOps Engineer',
    category: 'tech',
    location: 'Remote / Bangalore',
    type: 'Full-time',
    experience: '4+ years',
    description: 'Join our infrastructure team to ensure our platform is scalable, reliable, and performant. Work with cloud technologies and modern DevOps practices.',
    requirements: [
      '4+ years of experience in DevOps/SRE roles',
      'Strong knowledge of AWS/GCP/Azure',
      'Experience with Docker, Kubernetes, CI/CD pipelines',
      'Knowledge of monitoring tools (Prometheus, Grafana)',
      'Scripting skills (Bash, Python)'
    ],
    responsibilities: [
      'Manage cloud infrastructure and deployments',
      'Set up and maintain CI/CD pipelines',
      'Monitor system performance and reliability',
      'Implement security best practices',
      'Automate infrastructure and deployment processes'
    ],
    benefits: [
      'Competitive salary + stock options',
      'Latest tools and cloud credits',
      'Remote work options',
      'Learning budget for certifications',
      'Work on cutting-edge technologies'
    ]
  },
  {
    id: 8,
    title: 'Content Writer (Technical)',
    category: 'teaching',
    location: 'Remote',
    type: 'Full-time / Part-time',
    experience: '2+ years',
    description: 'Create engaging technical content including course descriptions, blog posts, documentation, and marketing materials. Help us communicate complex technical concepts clearly.',
    requirements: [
      '2+ years of technical writing experience',
      'Strong understanding of programming and tech concepts',
      'Excellent writing and editing skills',
      'Ability to simplify complex topics',
      'Portfolio of published technical content'
    ],
    responsibilities: [
      'Write course descriptions and marketing copy',
      'Create technical blog posts and tutorials',
      'Develop documentation and help articles',
      'Collaborate with instructors on content',
      'Ensure content quality and accuracy'
    ],
    benefits: [
      'Flexible work schedule',
      'Competitive compensation',
      'Work on diverse projects',
      'Build your writing portfolio',
      'Remote work from anywhere'
    ]
  }
]

export default function Careers() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)

  const filteredJobs = selectedCategory === 'all'
    ? openPositions
    : openPositions.filter(job => job.category === selectedCategory)

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Join Our Team
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Help us transform education and build the future of career development
          </p>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Why Work at KiwisEdutech?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-gray-200 bg-linear-to-br from-primary-50 to-white">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact Lives</h3>
              <p className="text-gray-600">
                Make a real difference by helping thousands of students transform their careers and achieve their dreams.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-linear-to-br from-primary-50 to-white">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth & Learning</h3>
              <p className="text-gray-600">
                Continuous learning opportunities, skill development programs, and access to all our courses for free.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-gray-200 bg-linear-to-br from-primary-50 to-white">
              <div className="w-12 h-12 rounded-lg bg-primary-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Work</h3>
              <p className="text-gray-600">
                Work from home options, flexible hours, and a healthy work-life balance. We trust you to deliver results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3">
            {jobCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSelectedJob(null)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {selectedJob ? (
            <div className="max-w-4xl mx-auto">
              <button
                onClick={() => setSelectedJob(null)}
                className="mb-6 text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to All Positions
              </button>
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedJob.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {selectedJob.type}
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {selectedJob.experience}
                    </span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 mb-6">{selectedJob.description}</p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    {selectedJob.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Benefits</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                    {selectedJob.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href={`mailto:careers@kiwisedutech.com?subject=Application for ${encodeURIComponent(selectedJob.title)}`}
                    className="inline-block rounded-lg bg-primary-600 px-8 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
                  >
                    <span className="relative z-10">Apply Now</span>
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedJob(job)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <svg className="w-5 h-5 text-primary-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {job.experience}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {job.type}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedJob(job)
                    }}
                    className="mt-4 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* No Open Positions */}
      {filteredJobs.length === 0 && (
        <section className="py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 text-lg">
              No open positions in this category at the moment. Check back soon for future opportunities.
            </p>
          </div>
        </section>
      )}

      {/* General Application */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-primary-50 to-white rounded-xl border border-primary-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Don't See a Perfect Match?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented individuals to join our team. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <a
              href="mailto:careers@kiwisedutech.com?subject=General Application"
              className="inline-block rounded-lg bg-primary-600 px-8 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
            >
              <span className="relative z-10">Submit General Application</span>
              <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

