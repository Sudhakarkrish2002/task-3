import React, { useEffect, useState } from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PageTransition from './components/PageTransition.jsx'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import CertificationCourses from './pages/CertificationCourses.jsx'
import PlacementTraining from './pages/PlacementTraining.jsx'
import Workshops from './pages/Workshops.jsx'
import Internships from './pages/Internships.jsx'
import InternshipApplication from './pages/InternshipApplication.jsx'
import Employers from './pages/Employers.jsx'
import CollegeRegistration from './pages/CollegeRegistration.jsx'
import StudentMembership from './pages/StudentMembership.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Blog from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'
import Auth from './pages/Auth.jsx'
import SearchResults from './pages/SearchResults.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import StudentInternshipApplicationDetails from './pages/StudentInternshipApplicationDetails.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import CollegeDashboard from './pages/CollegeDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminStudents from './pages/admin/AdminStudents.jsx'
import AdminEmployers from './pages/admin/AdminEmployers.jsx'
import AdminColleges from './pages/admin/AdminColleges.jsx'
import AdminCourses from './pages/admin/AdminCourses.jsx'
import AdminBlogs from './pages/admin/AdminBlogs.jsx'
import AdminSubmissions from './pages/admin/AdminSubmissions.jsx'
import AdminInternships from './pages/admin/AdminInternships.jsx'
import ContentDashboard from './pages/ContentDashboard.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import Syllabus from './pages/Syllabus.jsx'
import FAQ from './pages/FAQ.jsx'
import Careers from './pages/Careers.jsx'
import ResearchDevelopment from './pages/ResearchDevelopment.jsx'
import BlogDetail from './pages/BlogDetail.jsx'

const routes = {
  '#/': <Home />,
  '#/courses': <Courses />,
  '#/courses/certifications': <CertificationCourses />,
  '#/courses/placement': <PlacementTraining />,
  '#/courses/workshops': <Workshops />,
  '#/internships': <Internships />,
  '#/internship-application': <InternshipApplication />,
  '#/employers': <Employers />,
  '#/auth': <Auth />,
  '#/college-registration': <CollegeRegistration />,
  '#/student-membership': <StudentMembership />,
  '#/about': <AboutUs />,
  '#/blog': <Blog />,
  '#/contact': <Contact />,
  '#/search': <SearchResults />,
  '#/dashboard/student': <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>,
  '#/student-internship-application-details': (
    <ProtectedRoute requiredRole="student">
      <StudentInternshipApplicationDetails />
    </ProtectedRoute>
  ),
  '#/dashboard/employer': <ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>,
  '#/dashboard/college': <ProtectedRoute requiredRole="college"><CollegeDashboard /></ProtectedRoute>,
  '#/dashboard/content': <ProtectedRoute requiredRole="content_writer"><ContentDashboard /></ProtectedRoute>,
  '#/admin': <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>,
  '#/admin/students': <ProtectedRoute requiredRole="admin"><AdminStudents /></ProtectedRoute>,
  '#/admin/employers': <ProtectedRoute requiredRole="admin"><AdminEmployers /></ProtectedRoute>,
  '#/admin/colleges': <ProtectedRoute requiredRole="admin"><AdminColleges /></ProtectedRoute>,
  '#/admin/courses': <ProtectedRoute requiredRole="admin"><AdminCourses /></ProtectedRoute>,
  '#/admin/blogs': <ProtectedRoute requiredRole="admin"><AdminBlogs /></ProtectedRoute>,
  '#/admin/submissions': <ProtectedRoute requiredRole="admin"><AdminSubmissions /></ProtectedRoute>,
  '#/admin/internships': <ProtectedRoute requiredRole="admin"><AdminInternships /></ProtectedRoute>,
  '#/terms': <TermsConditions />,
  '#/privacy': <PrivacyPolicy />,
  '#/refund': <RefundPolicy />,
  '#/courses/syllabus': <Syllabus />,
  '#/faq': <FAQ />,
  '#/careers': <Careers />,
  '#/other-services/research': <ResearchDevelopment />,
  '#/blog/detail': <BlogDetail />,
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  const [showBanner, setShowBanner] = useState(false)
  const [bannerHeight, setBannerHeight] = useState(0)
  const [navHeight, setNavHeight] = useState(() => {
    if (typeof window === 'undefined') return 80
    return window.innerWidth >= 640 ? 80 : 64
  })

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '#/')
      // Smooth scroll to top when route changes
      requestAnimationFrame(() => {
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth' 
        })
      })
    }
    window.addEventListener('hashchange', onHashChange)
    if (!window.location.hash) {
      window.location.hash = '#/'
    }
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Check if banner should be shown (only on home page)
  useEffect(() => {
    const routeHash = hash.split('?')[0]
    setShowBanner(routeHash === '#/')
  }, [hash])

  // Smooth scroll to top when hash changes (including initial load)
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      })
    })
  }, [hash])

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return
      setNavHeight(window.innerWidth >= 640 ? 80 : 64)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!showBanner) {
      setBannerHeight(0)
      return
    }

    const measure = () => {
      const el = document.getElementById('promo-banner')
      setBannerHeight(el ? el.offsetHeight : 0)
    }

    measure()
    window.addEventListener('resize', measure)

    return () => window.removeEventListener('resize', measure)
  }, [showBanner])

  const handleBannerClose = () => {
    setShowBanner(false)
  }

  // Get route without query parameters for matching
  const routeHash = hash.split('?')[0]
  const Content = routes[routeHash] || <Home />

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-white">
        {/* Discount Banner - Only shows on home page */}
        {showBanner && (
        <div
          id="promo-banner"
          className="fixed top-0 left-0 right-0 z-100 bg-black text-white py-2 sm:py-3 px-2 sm:px-4 flex items-center justify-center w-full overflow-x-hidden"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-1 text-center min-w-0 max-w-full">
            <span className="text-xs sm:text-sm md:text-base font-semibold wrap-break-words px-2">
              🎉 <span className="font-bold">Special Offer!</span> Get up to <span className="font-bold text-yellow-300">50% OFF</span> on all Certification Courses. Limited time only - Enroll now!
            </span>
          </div>
          <button
            onClick={handleBannerClose}
            className="ml-2 sm:ml-4 p-1 hover:bg-gray-800 rounded-full transition-colors  shrink-0"
            aria-label="Close banner"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      <Navbar bannerVisible={showBanner} bannerHeight={bannerHeight} navHeight={navHeight} />
      <div className="flex-1" style={{ paddingTop: `${bannerHeight + navHeight}px` }}>
        <PageTransition routeKey={routeHash}>
          {Content}
        </PageTransition>
      </div>
      <Footer />
      </div>
    </AuthProvider>
  )
}

