import React, { useCallback, useEffect, useRef, useState } from 'react'
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

const trendingCourses = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    tag: 'Certification',
    description: 'Master MERN stack with real-world projects',
    students: '2.5K+',
    rating: 4.8,
  },
  {
    id: 2,
    title: 'Data Science & Analytics',
    tag: 'Certification',
    description: 'Python, ML, and AI fundamentals',
    students: '1.8K+',
    rating: 4.9,
  },
  {
    id: 3,
    title: 'Cloud Computing & AWS',
    tag: 'Certification',
    description: 'Deploy scalable applications on cloud',
    students: '1.2K+',
    rating: 4.7,
  },
  {
    id: 4,
    title: 'DevOps & CI/CD',
    tag: 'Certification',
    description: 'Master deployment and automation',
    students: '950+',
    rating: 4.8,
  },
  {
    id: 5,
    title: 'UI/UX Design Mastery',
    tag: 'Certification',
    description: 'Design beautiful and functional interfaces',
    students: '1.5K+',
    rating: 4.6,
  },
  {
    id: 6,
    title: 'Mobile App Development',
    tag: 'Certification',
    description: 'Build iOS and Android applications',
    students: '1.1K+',
    rating: 4.7,
  },
  {
    id: 7,
    title: 'Cyber Security Fundamentals',
    tag: 'Certification',
    description: 'Protect systems from threats',
    students: '800+',
    rating: 4.9,
  },
  {
    id: 8,
    title: 'Machine Learning & AI',
    tag: 'Certification',
    description: 'Advanced ML algorithms and models',
    students: '1.3K+',
    rating: 4.8,
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

const skillsAndTools = [
  // Programming Languages
  { name: 'JavaScript', category: 'Programming Language', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' },
  { name: 'Python', category: 'Programming Language', logo: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'TypeScript', category: 'Programming Language', logo: 'https://cdn.simpleicons.org/typescript/3178C6' },
  { name: 'Java', category: 'Programming Language', logo: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg' },
  
  // Frontend Frameworks & Libraries
  { name: 'React', category: 'Frontend Framework', logo: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Next.js', category: 'Frontend Framework', logo: 'https://cdn.simpleicons.org/nextdotjs/000000' },
  { name: 'Vue.js', category: 'Frontend Framework', logo: 'https://cdn.simpleicons.org/vuedotjs/4FC08D' },
  { name: 'Angular', category: 'Frontend Framework', logo: 'https://cdn.simpleicons.org/angular/DD0031' },
  { name: 'Tailwind CSS', category: 'CSS Framework', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' },
  
  // Backend Technologies
  { name: 'Node.js', category: 'Backend Runtime', logo: 'https://cdn.simpleicons.org/nodedotjs/339933' },
  { name: 'Express.js', category: 'Backend Framework', logo: 'https://cdn.simpleicons.org/express/000000' },
  { name: 'Django', category: 'Backend Framework', logo: 'https://cdn.simpleicons.org/django/092E20' },
  { name: 'Flask', category: 'Backend Framework', logo: 'https://cdn.simpleicons.org/flask/000000' },
  
  // Databases
  { name: 'MongoDB', category: 'Database', logo: 'https://cdn.simpleicons.org/mongodb/47A248' },
  { name: 'PostgreSQL', category: 'Database', logo: 'https://cdn.simpleicons.org/postgresql/4169E1' },
  { name: 'MySQL', category: 'Database', logo: 'https://cdn.simpleicons.org/mysql/4479A1' },
  { name: 'Redis', category: 'Database', logo: 'https://cdn.simpleicons.org/redis/DC382D' },
  
  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud Platform', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg' },
  { name: 'Docker', category: 'DevOps Tool', logo: 'https://cdn.simpleicons.org/docker/2496ED' },
  { name: 'Kubernetes', category: 'DevOps Tool', logo: 'https://cdn.simpleicons.org/kubernetes/326CE5' },
  { name: 'Git & GitHub', category: 'Version Control', logo: 'https://cdn.simpleicons.org/git/F05032' },
  { name: 'CI/CD', category: 'DevOps', logo: 'https://cdn.simpleicons.org/githubactions/2088FF' },
  
  // Data Science & ML
  { name: 'TensorFlow', category: 'Machine Learning', logo: 'https://cdn.simpleicons.org/tensorflow/FF6F00' },
  { name: 'Pandas', category: 'Data Science', logo: 'https://cdn.simpleicons.org/pandas/150458' },
  { name: 'NumPy', category: 'Data Science', logo: 'https://cdn.simpleicons.org/numpy/013243' },
  { name: 'Scikit-learn', category: 'Machine Learning', logo: 'https://cdn.simpleicons.org/scikitlearn/F7931E' },
  
  // Testing & Tools
  { name: 'Jest', category: 'Testing', logo: 'https://cdn.simpleicons.org/jest/C21325' },
  { name: 'Cypress', category: 'Testing', logo: 'https://cdn.simpleicons.org/cypress/17202C' },
  { name: 'Postman', category: 'API Testing', logo: 'https://cdn.simpleicons.org/postman/FF6C37' },
  { name: 'VS Code', category: 'Development Tool', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg' },
]

export default function Home() {
  const trendingScrollRef = useRef(null)
  const trendingContentRef = useRef(null)
  const cardWidthRef = useRef(0)
  const trendingSectionRef = useRef(null)
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0)

  const scrollToIndex = useCallback((index, behavior = 'smooth') => {
    const container = trendingScrollRef.current
    const cardWidth = cardWidthRef.current
    if (!container || cardWidth === 0) return
    const clampedIndex = Math.max(0, Math.min(trendingCourses.length - 1, index))
    container.scrollTo({
      left: clampedIndex * cardWidth,
      behavior,
    })
  }, [])

  const measureCardWidth = useCallback(() => {
    const contentEl = trendingContentRef.current
    if (!contentEl || !contentEl.children.length) return
    const firstCard = contentEl.children[0]
    if (!(firstCard instanceof HTMLElement)) return
    const styles = window.getComputedStyle(firstCard)
    const marginLeft = parseFloat(styles.marginLeft) || 0
    const marginRight = parseFloat(styles.marginRight) || 0
    const width = firstCard.getBoundingClientRect().width + marginLeft + marginRight
    cardWidthRef.current = width
    scrollToIndex(currentCourseIndex, 'auto')
  }, [currentCourseIndex, scrollToIndex])

  useEffect(() => {
    measureCardWidth()
    window.addEventListener('resize', measureCardWidth)
    return () => window.removeEventListener('resize', measureCardWidth)
  }, [measureCardWidth])

  useEffect(() => {
    scrollToIndex(currentCourseIndex)
  }, [currentCourseIndex, scrollToIndex])

  const totalCourses = trendingCourses.length
  const hasMultipleCourses = totalCourses > 1

  const handleDotClick = (index) => {
    setCurrentCourseIndex(index)
  }

  const handleScroll = useCallback(() => {
    const container = trendingScrollRef.current
    const cardWidth = cardWidthRef.current
    if (!container || cardWidth === 0) return
    const newIndex = Math.round(container.scrollLeft / cardWidth)
    setCurrentCourseIndex((prev) => (prev === newIndex ? prev : newIndex))
  }, [])

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
      <section className="py-16 bg-white border-t-2 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Featured Certification Courses</h2>
            <a href="#/courses" className="text-sm font-medium text-primary-700 transition-all duration-300 ease-in-out hover:text-primary-800 hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-block">
              View All
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.title} className="rounded-xl border border-gray-200 p-5 hover:shadow-xl hover:shadow-gray-400/50 transition-shadow bg-white">
                <div className="text-xs font-medium text-primary-700 inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary-600" />
                  {course.tag}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{course.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{course.description}</p>
                <div className="mt-4 flex gap-2">
                  <a href="#/courses/certifications" className="text-sm text-primary-700 font-medium transition-all duration-300 ease-in-out hover:text-primary-800 hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-flex items-center gap-1 hover:gap-2">
                    Learn more →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Courses */}
      <section ref={trendingSectionRef} className="py-16 bg-linear-to-b from-white to-primary-50 border-t-2 border-primary-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Trending Courses at KiwisEdutech</h2>
              <p className="mt-2 text-sm text-gray-600">Most popular courses chosen by our students</p>
            </div>
            <a href="#/courses" className="text-sm font-medium text-primary-700 transition-all duration-300 ease-in-out hover:text-primary-800 hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-block">
              View All
            </a>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 mx-4 rounded-3xl bg-linear-to-r from-primary-100/60 via-white to-primary-100/60 blur-3xl opacity-70"
            ></div>

            <div
              ref={trendingScrollRef}
              onScroll={handleScroll}
              className="trending-courses-scroll-container rounded-3xl bg-white/90 px-5 py-6 shadow-2xl shadow-primary-200/40 backdrop-blur-sm"
              style={{
                maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
              }}
            >
              <div ref={trendingContentRef} className="trending-courses-scroll-content">
                {trendingCourses.map((course, index) => {
                  const isActive = currentCourseIndex === index
                  return (
                    <div
                      key={`trending-${course.id}`}
                      className={`group shrink-0 w-80 sm:w-96 mx-3 rounded-2xl border bg-white/95 p-6 transition-all duration-300 ease-in-out shadow-lg hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-primary-500/70 ${isActive ? 'border-primary-200/80 shadow-primary-200/80 scale-[1.02]' : 'border-gray-100 hover:border-transparent'}`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-primary-700 bg-primary-50/80 px-3 py-1 rounded-full uppercase tracking-wide">
                          {course.tag}
                        </span>
                        <div className="flex items-center gap-1 text-primary-600">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="text-sm font-semibold text-gray-800">{course.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-5 mt-5 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          <span>{course.students} enrolled</span>
                        </div>
                        <a 
                          href="#/courses" 
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 transition-colors group-hover:text-primary-700"
                        >
                          Learn more
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {hasMultipleCourses && (
            <div className="mt-7 flex items-center justify-center gap-3">
              {trendingCourses.map((course, index) => {
                const isActive = currentCourseIndex === index
                return (
                  <button
                    key={`trending-dot-${course.id}`}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    aria-label={`View slide ${index + 1}`}
                    className={`h-2.5 w-6 rounded-full transition-all duration-200 ${isActive ? 'bg-primary-600 shadow-md shadow-primary-300/70' : 'bg-primary-200 hover:bg-primary-300'}`}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Skills and Tools You Will Learn */}
      <section className="py-16 bg-linear-to-b from-primary-50 via-white to-primary-50 border-t-2 border-primary-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Skills and Tools You Will Learn</h2>
            <p className="text-gray-600 text-lg">Essential technologies and tools required for freshers in current industry standards</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {skillsAndTools.map((skill, index) => {
              // Color variations based on category
              const colorClasses = [
                'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
                'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
                'bg-gradient-to-br from-pink-500 to-pink-600 text-white',
                'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white',
                'bg-gradient-to-br from-green-500 to-green-600 text-white',
                'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
                'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white',
                'bg-gradient-to-br from-red-500 to-red-600 text-white',
              ]
              const colorIndex = index % colorClasses.length
              
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:shadow-2xl hover:shadow-gray-400/60 transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-2 hover:bg-black flex flex-col items-center justify-center text-center group cursor-pointer relative overflow-hidden"
                >
                  {/* Animated background gradient on hover */}
                  <div className={`absolute inset-0 ${colorClasses[colorIndex]} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                  
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg group-hover:shadow-xl relative z-10 p-2 border-2 border-gray-100 group-hover:border-gray-200">
                    <img 
                      src={skill.logo} 
                      alt={skill.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const fallback = document.createElement('div')
                        fallback.className = `w-full h-full rounded-lg ${colorClasses[colorIndex]} flex items-center justify-center`
                        const text = document.createElement('span')
                        text.className = 'text-xs font-bold text-white'
                        text.textContent = skill.name.substring(0, 2).toUpperCase()
                        fallback.appendChild(text)
                        e.target.parentElement.appendChild(fallback)
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-0.5 group-hover:text-white transition-colors relative z-10">{skill.name}</h3>
                  <p className="text-[10px] text-gray-500 font-medium group-hover:text-white relative z-10">{skill.category}</p>
                  
                  {/* Decorative corner accent */}
                  <div className={`absolute top-0 right-0 w-10 h-10 ${colorClasses[colorIndex]} opacity-0 group-hover:opacity-5 rounded-bl-full transition-opacity duration-300`}></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50 border-t-2 border-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900">Placement Promise / Success Stories</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-xl hover:shadow-gray-400/50 transition-shadow">
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
      <section className="py-16 bg-linear-to-b from-primary-50 to-white border-t-2 border-primary-200">
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
      <section className="py-16 bg-gray-50 border-t-2 border-gray-300">
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


