import React from 'react'

const internships = [
  {
    id: 1,
    title: 'Frontend Development Intern',
    company: 'TechStartup',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹8,000/month',
    type: 'Full-time',
    posted: '2 days ago',
    applicants: '125',
    skills: ['React', 'JavaScript', 'HTML/CSS'],
    description: 'Work on cutting-edge web applications using React and modern frontend technologies.',
  },
  {
    id: 2,
    title: 'Data Science Intern',
    company: 'DataViz Analytics',
    location: 'Bangalore',
    duration: '6 months',
    stipend: '₹12,000/month',
    type: 'Full-time',
    posted: '1 day ago',
    applicants: '89',
    skills: ['Python', 'Machine Learning', 'SQL'],
    description: 'Analyze real-world datasets and build ML models for business insights.',
  },
  {
    id: 3,
    title: 'Backend Development Intern',
    company: 'CloudTech Solutions',
    location: 'Hybrid',
    duration: '3 months',
    stipend: '₹10,000/month',
    type: 'Full-time',
    posted: '3 days ago',
    applicants: '156',
    skills: ['Node.js', 'MongoDB', 'Express'],
    description: 'Develop scalable backend APIs and work with cloud infrastructure.',
  },
  {
    id: 4,
    title: 'UI/UX Design Intern',
    company: 'DesignStudio',
    location: 'Mumbai',
    duration: '4 months',
    stipend: '₹9,000/month',
    type: 'Full-time',
    posted: '5 days ago',
    applicants: '203',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    description: 'Design user interfaces and create interactive prototypes for web and mobile apps.',
  },
  {
    id: 5,
    title: 'DevOps Intern',
    company: 'InfraCloud',
    location: 'Remote',
    duration: '6 months',
    stipend: '₹15,000/month',
    type: 'Full-time',
    posted: '1 week ago',
    applicants: '67',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    description: 'Manage cloud infrastructure, CI/CD pipelines, and container orchestration.',
  },
  {
    id: 6,
    title: 'Mobile App Development Intern',
    company: 'AppCraft',
    location: 'Delhi NCR',
    duration: '3 months',
    stipend: '₹11,000/month',
    type: 'Full-time',
    posted: '4 days ago',
    applicants: '142',
    skills: ['React Native', 'Flutter', 'Mobile UI'],
    description: 'Build cross-platform mobile applications using modern frameworks.',
  },
  {
    id: 7,
    title: 'Marketing Intern',
    company: 'GrowthHacks',
    location: 'Remote',
    duration: '3 months',
    stipend: '₹7,000/month',
    type: 'Part-time',
    posted: '6 days ago',
    applicants: '234',
    skills: ['Digital Marketing', 'SEO', 'Content Creation'],
    description: 'Create marketing campaigns and manage social media presence.',
  },
  {
    id: 8,
    title: 'Content Writing Intern',
    company: 'EduBlog',
    location: 'Remote',
    duration: '2 months',
    stipend: '₹5,000/month',
    type: 'Part-time',
    posted: '1 week ago',
    applicants: '189',
    skills: ['Content Writing', 'SEO', 'Research'],
    description: 'Write engaging blog posts and educational content for our platform.',
  },
]

export default function Internships() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Internships to Launch Your Career
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gain real-world experience, build your portfolio, and kickstart your professional journey
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How Internships Work on Our Platform</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Our platform connects students with leading companies offering internships across various domains. 
              Whether you're looking for technical roles, design positions, or business internships, we have opportunities 
              that match your skills and interests. Apply directly through our platform, get matched with companies, 
              and start your professional journey.
            </p>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Browse Opportunities</h3>
                <p className="text-sm text-gray-600">
                  Explore internships across tech, design, marketing, and more
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply Easily</h3>
                <p className="text-sm text-gray-600">
                  Submit your application with one click - no complex forms
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Get Matched</h3>
                <p className="text-sm text-gray-600">
                  Companies review your profile and reach out directly
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-700">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Start Internship</h3>
                <p className="text-sm text-gray-600">
                  Begin your journey with mentorship and real projects
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Openings</h2>
              <p className="text-gray-600">Available internships from top companies</p>
            </div>
            <div className="text-sm text-gray-600">
              Showing {internships.length} internships
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {internships.map((internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{internship.title}</h3>
                    <div className="text-lg font-semibold text-primary-700 mb-2">{internship.company}</div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    internship.type === 'Full-time' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {internship.type}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{internship.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{internship.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{internship.stipend}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Posted {internship.posted}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{internship.description}</p>

                {/* Skills */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {internship.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    {internship.applicants} applicants
                  </div>
                  <button className="rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-bold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden">
                    <span className="relative z-10">Apply Now</span>
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

