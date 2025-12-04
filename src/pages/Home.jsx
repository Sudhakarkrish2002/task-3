import React, { useCallback, useEffect, useRef, useState } from 'react'
import { partnerCompanies } from '../utils/partnerCompanies.js'
import { courseAPI, checkBackendHealth } from '../utils/api.js'
import { getDisplayStudentCount, formatStudentCount } from '../utils/courseUtils.js'

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
    name: 'Lakshmi Priya',
    role: 'AI + IoT Engineer',
    quote:
      'The mentorship and projects helped me crack my first job within 8 weeks.',
  },
  {
    name: 'Karthik Rajan',
    role: 'Edge AI & ML Developer',
    quote: 'Clear roadmap and guidance—exactly what I needed as a fresher.',
  },
  {
    name: 'Divya Krishnan',
    role: 'Autonomous Drone Systems Engineer',
    quote: 'The placement-guaranteed course changed my career trajectory. Got placed with a package beyond my expectations!',
  },
  {
    name: 'Arun Suresh',
    role: 'IoT Solutions Developer',
    quote: 'Excellent hands-on training with real-world projects. The certification helped me stand out in interviews.',
  },
  {
    name: 'Nithya Raman',
    role: 'Edge Computing Specialist',
    quote: 'From zero knowledge to job-ready in 3 months! The structured curriculum and mentor support made all the difference.',
  },
  {
    name: 'Vignesh Iyer',
    role: 'AI Embedded Systems Engineer',
    quote: 'The industry-relevant skills I learned here opened doors to multiple opportunities. Highly recommended!',
  },
  {
    name: 'Meera Subramanian',
    role: 'ML Engineer (Edge Deployment)',
    quote: 'Best decision I made! The practical approach and continuous support helped me transition from a non-tech background.',
  },
  {
    name: 'Surya Narayanan',
    role: 'Autonomous Systems Developer',
    quote: 'The workshops and live sessions were incredibly valuable. Found my dream job within 6 weeks of completing the course.',
  },
  {
    name: 'Deepika Venkatesh',
    role: 'Smart Systems Integration Engineer',
    quote: 'The hands-on approach with real IoT projects made all the difference. I now work on cutting-edge AI-powered smart systems!',
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
  const bannerContainerRef = useRef(null)
  const heroSectionRef = useRef(null)
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0)
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [trendingCourses, setTrendingCourses] = useState([])
  const [loadingFeatured, setLoadingFeatured] = useState(true)
  const [loadingTrending, setLoadingTrending] = useState(true)
  const [bannerIndex, setBannerIndex] = useState(0)
  const [isBannerHovered, setIsBannerHovered] = useState(false)
  const [isHeroVisible, setIsHeroVisible] = useState(false)
  const [isTestimonialsVisible, setIsTestimonialsVisible] = useState(false)
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false)
  const [isTrendingVisible, setIsTrendingVisible] = useState(false)
  const [isSkillsVisible, setIsSkillsVisible] = useState(false)
  const [isStepsVisible, setIsStepsVisible] = useState(false)
  const [isCompaniesVisible, setIsCompaniesVisible] = useState(false)
  const [isCollegesVisible, setIsCollegesVisible] = useState(false)
  const testimonialsRef = useRef(null)
  const featuredRef = useRef(null)
  const trendingRef = useRef(null)
  const skillsRef = useRef(null)
  const stepsRef = useRef(null)
  const companiesRef = useRef(null)
  const collegesRef = useRef(null)

  // Fetch featured courses
  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      // Component-level timeout fallback (35 seconds - slightly longer than API timeout)
      const componentTimeout = setTimeout(() => {
        setLoadingFeatured(false);
        setFeaturedCourses([]);
      }, 35000);
      
      try {
        setLoadingFeatured(true)
        
        // Health check before making requests (non-blocking - don't wait for it)
        checkBackendHealth().catch(() => {
          // Ignore health check errors - don't block the request
        });
        
        // First try to get featured courses
        let response = await courseAPI.getAllCourses({
          category: 'certification',
          featuredOnHome: true,
          limit: 3
        })
        
        clearTimeout(componentTimeout);
        
        if (response && response.success && response.data && response.data.courses) {
          const courses = response.data.courses
          // If we have featured courses, use them
          if (courses.length > 0) {
            setFeaturedCourses(courses)
            return
          }
        }
        
        // Fallback: get any published certification courses (without featuredOnHome requirement)
        response = await courseAPI.getAllCourses({
          category: 'certification',
          limit: 3
        }, { enableRetry: true, maxRetries: 1 })
        
        if (response && response.success && response.data && response.data.courses) {
          setFeaturedCourses(response.data.courses)
        } else {
          setFeaturedCourses([])
        }
      } catch (error) {
        clearTimeout(componentTimeout);
        console.error('Error fetching featured courses:', error.message);
        // Try fallback on error too - get any published certification courses
        try {
          const fallbackResponse = await courseAPI.getAllCourses({
            category: 'certification',
            limit: 3
          }, { enableRetry: true, maxRetries: 1 })
          if (fallbackResponse && fallbackResponse.success && fallbackResponse.data && fallbackResponse.data.courses) {
            setFeaturedCourses(fallbackResponse.data.courses)
          } else {
            setFeaturedCourses([])
          }
        } catch (fallbackError) {
          setFeaturedCourses([])
        }
      } finally {
        clearTimeout(componentTimeout);
        setLoadingFeatured(false)
      }
    }
    fetchFeaturedCourses()
  }, [])

  // Fetch trending courses
  useEffect(() => {
    const fetchTrendingCourses = async () => {
      // Component-level timeout fallback (35 seconds - slightly longer than API timeout)
      const componentTimeout = setTimeout(() => {
        setLoadingTrending(false);
        setTrendingCourses([]);
      }, 35000);
      
      try {
        setLoadingTrending(true)
        
        // Health check before making requests (non-blocking - don't wait for it)
        checkBackendHealth().catch(() => {
          // Ignore health check errors - don't block the request
        });
        
        // First try to get trending courses
        let response = await courseAPI.getAllCourses({
          category: 'certification',
          trendingOnHome: true,
          limit: 8
        })
        
        clearTimeout(componentTimeout);
        
        if (response && response.success && response.data && response.data.courses) {
          const courses = response.data.courses
          // If we have trending courses, use them
          if (courses.length > 0) {
            setTrendingCourses(courses)
            return
          }
        }
        
        // Fallback: get any published certification courses (without trendingOnHome requirement)
        response = await courseAPI.getAllCourses({
          category: 'certification',
          limit: 8
        }, { enableRetry: true, maxRetries: 1 })
        
        if (response && response.success && response.data && response.data.courses) {
          setTrendingCourses(response.data.courses)
        } else {
          setTrendingCourses([])
        }
      } catch (error) {
        clearTimeout(componentTimeout);
        console.error('Error fetching trending courses:', error.message);
        // Try fallback on error too - get any published certification courses
        try {
          const fallbackResponse = await courseAPI.getAllCourses({
            category: 'certification',
            limit: 8
          }, { enableRetry: true, maxRetries: 1 })
          if (fallbackResponse && fallbackResponse.success && fallbackResponse.data && fallbackResponse.data.courses) {
            setTrendingCourses(fallbackResponse.data.courses)
          } else {
            setTrendingCourses([])
          }
        } catch (fallbackError) {
          setTrendingCourses([])
        }
      } finally {
        clearTimeout(componentTimeout);
        setLoadingTrending(false)
      }
    }
    fetchTrendingCourses()
  }, [])

  // Banner scrolling effect - cycle through 2 banners
  useEffect(() => {
    if (isBannerHovered) return

    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % 2)
    }, 3000)

    return () => clearInterval(interval)
  }, [isBannerHovered])

  // Hero section scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeroVisible(true)
          } else {
            setIsHeroVisible(false)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current)
    }

    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSectionRef.current)
      }
    }
  }, [])

  // Testimonials section scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTestimonialsVisible(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    )

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current)
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current)
      }
    }
  }, [])

  // Generic scroll observer for all sections - optimized for performance
  useEffect(() => {
    const observers = []
    const sections = [
      { ref: featuredRef, setter: setIsFeaturedVisible },
      { ref: trendingRef, setter: setIsTrendingVisible },
      { ref: skillsRef, setter: setIsSkillsVisible },
      { ref: stepsRef, setter: setIsStepsVisible },
      { ref: companiesRef, setter: setIsCompaniesVisible },
      { ref: collegesRef, setter: setIsCollegesVisible },
    ]

    sections.forEach(({ ref, setter }) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setter(true)
              // Unobserve after first intersection to reduce overhead
              observer.unobserve(entry.target)
            }
          })
        },
        {
          threshold: 0.1,
          rootMargin: '50px'
        }
      )

      if (ref.current) {
        observer.observe(ref.current)
        observers.push({ observer, ref })
      }
    })

    return () => {
      observers.forEach(({ observer, ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  const scrollToIndex = useCallback((index, behavior = 'smooth') => {
    const container = trendingScrollRef.current
    const cardWidth = cardWidthRef.current
    if (!container || cardWidth === 0 || trendingCourses.length === 0) return
    const clampedIndex = Math.max(0, Math.min(trendingCourses.length - 1, index))
    const targetScroll = clampedIndex * cardWidth
    
    if (behavior === 'smooth') {
      // Use smooth scroll with better easing
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      })
    } else {
      container.scrollLeft = targetScroll
    }
  }, [trendingCourses.length])

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
    
    // Throttle scroll updates to reduce lag
    if (container._scrollTimeout) {
      cancelAnimationFrame(container._scrollTimeout)
    }
    
    container._scrollTimeout = requestAnimationFrame(() => {
      const newIndex = Math.round(container.scrollLeft / cardWidth)
      setCurrentCourseIndex((prev) => {
        if (prev !== newIndex) {
          return newIndex
        }
        return prev
      })
    })
  }, [])


  return (
    <main>
      {/* Hero */}
      <section 
        ref={heroSectionRef}
        className="pt-16 relative overflow-hidden"
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
      >
        <div 
          ref={bannerContainerRef}
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${bannerIndex * 50}%)`,
            width: '200%'
          }}
        >
          <div 
            className="w-1/2 h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/Assets/hero-home-banner.jpeg)'
            }}
          ></div>
          <div 
            className="w-1/2 h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/Assets/Home-page-banner-2.png)'
            }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-linear-to-br from-primary-900/50 via-primary-800/40 to-primary-700/50"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg flex flex-wrap items-center gap-2">
              <span 
                className={`inline-block transition-all ease-in-out ${
                  isHeroVisible 
                    ? 'translate-x-0 opacity-100' 
                    : '-translate-x-full opacity-0'
                }`}
                style={{ 
                  transitionDuration: '1200ms',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.1s'
                }}
              >
                Transforming Freshers into
              </span>
              <span 
                className={`inline-block transition-all ease-in-out ${
                  isHeroVisible 
                    ? 'translate-x-0 opacity-100' 
                    : 'translate-x-full opacity-0'
                }`}
                style={{ 
                  transitionDuration: '1200ms',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: '0.3s'
                }}
              >
                Industry-Ready Professionals
              </span>
            </h1>
            <p className="mt-5 text-white/95 text-base sm:text-lg drop-shadow-md">
              Welcome to KiwisEdutech, where we believe every student can build a
              successful career. Explore certifications, internship opportunities, and more — all in one place.
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
      <section ref={featuredRef} className="py-16 bg-primary-50 border-t-2 border-primary-200 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-200/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between gap-4 mb-2">
            <div className={`transition-all duration-1000 ease-out ${
              isFeaturedVisible 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Featured</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-primary-700 via-primary-600 to-primary-800">
                  Certification Courses
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full transform scale-x-0 origin-left transition-transform duration-700" style={{ transform: isFeaturedVisible ? 'scaleX(1)' : 'scaleX(0)' }}></span>
              </h2>
            </div>
            <a href="#/courses" className="text-sm font-medium text-primary-700 transition-all duration-300 ease-in-out hover:text-primary-800 hover:font-bold hover:shadow-lg hover:shadow-primary-400/30 inline-block">
              View All
            </a>
          </div>

          {loadingFeatured ? (
            <div className="mt-8 text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading featured courses...</p>
              <p className="text-sm text-gray-500 mt-2">If this takes too long, the server may be starting up (Render.com free tier)</p>
            </div>
          ) : featuredCourses.length === 0 ? (
            <div className="mt-8 text-center py-8">
              <p className="text-gray-600">No featured courses available at the moment.</p>
              <p className="text-sm text-gray-500 mt-2">Please check back later or contact support if the issue persists.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <div 
                  key={course._id} 
                  className="group relative rounded-2xl bg-white p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* Floating icon circle */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-linear-to-br from-primary-400 to-primary-600 opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300"></div>
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>

                  {/* Badge with icon */}
                  <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-4">
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-primary-700">
                      {course.placementGuaranteed ? 'Placement-Guaranteed' : 'Certification'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="relative text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors pr-20">
                    {course.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="relative text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">
                    {course.shortDescription || course.description}
                  </p>
                  
                  {/* CTA with icon */}
                  <a 
                    href={`#/courses/syllabus?title=${encodeURIComponent(course.title)}`} 
                    className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105 group/btn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>Explore Course</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Courses */}
      <section ref={trendingRef} className="py-16 bg-linear-to-b from-primary-200 via-primary-100/80 to-primary-100 border-t-2 border-primary-300 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-10 left-10 w-48 h-48 bg-primary-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div className={`transition-all duration-1000 ease-out ${
              isTrendingVisible 
                ? 'translate-x-0 opacity-100' 
                : '-translate-x-8 opacity-0'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-orange-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 3L4 14v7h6v-6h6v6h6v-7L13 3z"/>
                </svg>
                <span className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Trending Now</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 relative inline-block">
                <span className="relative z-10">Courses at KiwisEdutech</span>
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-orange-500 via-primary-600 to-primary-600 rounded-full transition-all duration-1000" style={{ width: isTrendingVisible ? '100%' : '0%' }}></span>
              </h2>
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
                scrollBehavior: 'smooth',
              }}
            >
              <div ref={trendingContentRef} className="trending-courses-scroll-content">
                {loadingTrending ? (
                  <div className="shrink-0 w-80 sm:w-96 mx-3 flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                      <p className="text-gray-600 mt-4 text-sm">Loading trending courses...</p>
                    </div>
                  </div>
                ) : trendingCourses.length === 0 ? (
                  <div className="shrink-0 w-80 sm:w-96 mx-3 flex items-center justify-center py-12">
                    <p className="text-gray-600 text-sm">No trending courses available at the moment.</p>
                  </div>
                ) : (
                  trendingCourses.map((course, index) => {
                    const isActive = currentCourseIndex === index
                    const enrolledText = formatStudentCount(getDisplayStudentCount(course))
                    const rating = course.rating || 4.5
                    const fullStars = Math.floor(rating)
                    
                    return (
                      <div
                        key={`trending-${course._id}`}
                        className={`group relative shrink-0 w-80 sm:w-96 mx-3 rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 ease-out ${isActive ? 'shadow-primary-200/50' : ''} hover:-translate-y-3 hover:shadow-2xl hover:shadow-primary-500/30 overflow-hidden`}
                        style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
                      >
                        {/* Decorative icon circles */}
                        <div className="absolute top-0 left-0 w-20 h-20 rounded-full bg-primary-100/50 -translate-x-10 -translate-y-10 transition-opacity duration-500"></div>
                        <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-primary-200/50 translate-x-8 translate-y-8 transition-opacity duration-500"></div>

                        {/* Header with icon and rating */}
                        <div className="relative flex items-start justify-between mb-5">
                          {/* Icon circle */}
                          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 group-hover:-rotate-6 transition-transform duration-300">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>
                          </div>
                          
                          {/* Rating badge */}
                          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-50 border border-yellow-200">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i < fullStars ? 'text-yellow-500 fill-current' : 'text-gray-300 fill-current'}`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-gray-800 text-sm font-bold">{rating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Badge */}
                        <div className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-4">
                          <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold text-primary-700">
                            {course.placementGuaranteed ? 'Placement-Guaranteed' : 'Certification'}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="relative text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="relative text-sm text-gray-600 leading-relaxed mb-5 line-clamp-2">
                          {course.shortDescription || course.description}
                        </p>

                        {/* Footer */}
                        <div className="relative flex items-center justify-between pt-4 border-t border-gray-200">
                          {/* Enrolled with icon */}
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700">
                            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-semibold">{enrolledText}</span>
                          </div>
                          
                          {/* CTA */}
                          <a 
                            href={`#/courses/syllabus?title=${encodeURIComponent(course.title)}`}
                            className="px-4 py-2 rounded-xl bg-linear-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold transition-all duration-300 hover:from-primary-700 hover:to-primary-800 hover:shadow-lg hover:shadow-primary-500/50 inline-flex items-center gap-2 group/btn"
                          >
                            <span>Explore</span>
                            <svg className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Skills and Tools You Will Learn */}
      <section ref={skillsRef} className="py-16 bg-linear-to-b from-primary-300 via-primary-200 to-primary-100 border-t-2 border-primary-400 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary-300/15 rounded-full blur-3xl"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className={`inline-block transition-all duration-1000 ease-out ${
              isSkillsVisible 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-95'
            }`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-20 bg-linear-to-r from-transparent via-primary-500 to-primary-500"></div>
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="h-px w-20 bg-linear-to-l from-transparent via-primary-500 to-primary-500"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-primary-700 via-primary-600 to-primary-800">
                  Skills and Tools You Will Learn
                </span>
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full"></span>
              </h2>
              <p className="text-gray-600 text-lg mt-4">Essential technologies and tools required for freshers in current industry standards</p>
            </div>
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

      {/* Simple Steps Section */}
      <section ref={stepsRef} className="py-16 bg-linear-to-b from-primary-50 via-white to-primary-50 border-t-2 border-primary-200 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-primary-200/30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ease-out ${
              isStepsVisible 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 border-2 border-primary-300 shadow-lg">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary-700 via-primary-600 to-primary-800">
                  Simple Steps to Your Consultation
                </span>
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-0.5 w-16 bg-linear-to-r from-transparent to-primary-400"></div>
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="h-0.5 w-16 bg-linear-to-l from-transparent to-primary-400"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
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

          <div className="text-center">
            <a 
              href="#/consultation"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-primary-600 text-white font-semibold text-base transition-all duration-300 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/50 hover:scale-105"
            >
              View More
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section 
        ref={testimonialsRef}
        className="py-16 bg-linear-to-b from-primary-100/50 via-primary-50/30 to-primary-100/50 border-t-2 border-primary-300 relative overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Heading */}
          <div className="text-center mb-12">
            <div className={`inline-block transition-all duration-1000 ease-out ${
              isTestimonialsVisible 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-linear-to-r from-transparent via-primary-500 to-primary-500"></div>
                <svg className="w-8 h-8 text-primary-600 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div className="h-px w-16 bg-linear-to-l from-transparent via-primary-500 to-primary-500"></div>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 relative inline-block">
                <span className="relative z-10 bg-clip-text text-transparent bg-linear-to-r from-primary-600 via-primary-700 to-primary-900">
                  Testimonials
                </span>
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-linear-to-r from-primary-400 via-primary-600 to-primary-400 rounded-full"></span>
              </h2>
              <p className="text-lg text-gray-600 mt-4">Hear from our successful graduates</p>
            </div>
          </div>
          
          {/* Animated Testimonial Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <figure 
                key={t.name} 
                className={`rounded-xl border-2 border-gray-200 bg-white p-6 hover:shadow-2xl hover:shadow-primary-400/30 transition-all duration-500 hover:scale-105 hover:border-primary-300 relative overflow-hidden group ${
                  isTestimonialsVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-12 opacity-0'
                }`}
                style={{
                  transitionDelay: `${index * 150}ms`
                }}
              >
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-primary-50/0 via-primary-100/0 to-primary-200/0 group-hover:from-primary-50/30 group-hover:via-primary-100/20 group-hover:to-primary-200/30 transition-all duration-500 rounded-xl"></div>
                
                {/* Quote icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                  <svg className="w-16 h-16 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                
                <blockquote className="relative z-10 text-gray-700 text-sm leading-relaxed mb-4">"{t.quote}"</blockquote>
                <figcaption className="relative z-10 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                      <div className="text-xs text-primary-600 font-medium">{t.role}</div>
                    </div>
                  </div>
                </figcaption>
                
                {/* Animated border effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary-400/50 transition-all duration-500 pointer-events-none"></div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Where Do Our Students Work */}
      <section ref={companiesRef} className="py-16 bg-linear-to-b from-primary-200/70 via-primary-100/60 to-primary-200/70 border-t-2 border-primary-400 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ease-out ${
              isCompaniesVisible 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 border-2 border-primary-300 shadow-lg">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary-700 via-primary-600 to-primary-800">
                  Where Do Our Students Work?
                </span>
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-0.5 w-16 bg-linear-to-r from-transparent to-primary-400"></div>
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="h-0.5 w-16 bg-linear-to-l from-transparent to-primary-400"></div>
              </div>
              <p className="text-gray-600 text-lg">Our students are placed in top MNCs and leading companies</p>
            </div>
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
      <section ref={collegesRef} className="py-16 bg-linear-to-b from-primary-50/80 via-white to-primary-50/80 border-t-2 border-primary-200 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className={`transition-all duration-1000 ease-out ${
              isCollegesVisible 
                ? 'translate-y-0 opacity-100' 
                : '-translate-y-8 opacity-0'
            }`}>
              <div className="flex items-center justify-center mb-3">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 border-2 border-primary-300 shadow-lg">
                  <svg className="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-primary-700 via-primary-600 to-primary-800">
                  Partner Colleges
                </span>
              </h2>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="h-0.5 w-16 bg-linear-to-r from-transparent to-primary-400"></div>
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <div className="h-0.5 w-16 bg-linear-to-l from-transparent to-primary-400"></div>
              </div>
              <p className="text-gray-600 text-lg">Trusted by leading educational institutions</p>
            </div>
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


