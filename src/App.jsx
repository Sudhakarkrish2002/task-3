import React, { useEffect, useState } from 'react'
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
import Employers from './pages/Employers.jsx'
import CollegeRegistration from './pages/CollegeRegistration.jsx'
import StudentMembership from './pages/StudentMembership.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Blog from './pages/Blog.jsx'
import Contact from './pages/Contact.jsx'
import Auth from './pages/Auth.jsx'
import SearchResults from './pages/SearchResults.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import EmployerDashboard from './pages/EmployerDashboard.jsx'
import CollegeDashboard from './pages/CollegeDashboard.jsx'
import AdminCourseManagement from './pages/AdminCourseManagement.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'
import Syllabus from './pages/Syllabus.jsx'

function Placeholder({ title }) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="mt-2 text-gray-600">This page will be available soon.</p>
    </main>
  )
}

const routes = {
  '#/': <Home />,
  '#/courses': <Courses />,
  '#/courses/certifications': <CertificationCourses />,
  '#/courses/placement': <PlacementTraining />,
  '#/courses/workshops': <Workshops />,
  '#/internships': <Internships />,
  '#/employers': <Employers />,
  '#/auth': <Auth />,
  '#/college-registration': <CollegeRegistration />,
  '#/student-membership': <StudentMembership />,
  '#/about': <AboutUs />,
  '#/blog': <Blog />,
  '#/contact': <Contact />,
  '#/search': <SearchResults />,
  '#/dashboard/student': <ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>,
  '#/dashboard/employer': <ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>,
  '#/dashboard/college': <ProtectedRoute requiredRole="college"><CollegeDashboard /></ProtectedRoute>,
  '#/admin/courses': <ProtectedRoute requiredRole="admin"><AdminCourseManagement /></ProtectedRoute>,
  '#/terms': <TermsConditions />,
  '#/privacy': <PrivacyPolicy />,
  '#/refund': <RefundPolicy />,
  '#/courses/syllabus': <Syllabus />,
  '#/faq': <Placeholder title="FAQ" />,
  '#/careers': <Placeholder title="Careers" />,
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const onHashChange = () => {
      setHash(window.location.hash || '#/')
      // Scroll to top when route changes
      window.scrollTo({ top: 0, behavior: 'smooth' })
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

  // Scroll to top when hash changes (including initial load)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [hash])

  const handleBannerClose = () => {
    setShowBanner(false)
  }

  // Get route without query parameters for matching
  const routeHash = hash.split('?')[0]
  const Content = routes[routeHash] || <Home />

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Discount Banner - Only shows on home page */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-200 bg-black text-white py-2 sm:py-3 px-2 sm:px-4 flex items-center justify-center w-full overflow-x-hidden">
          <div className="flex items-center justify-center gap-2 sm:gap-4 flex-1 text-center min-w-0 max-w-full">
            <span className="text-xs sm:text-sm md:text-base font-semibold break-words px-2">
              🎉 <span className="font-bold">Special Offer!</span> Get up to <span className="font-bold text-yellow-300">50% OFF</span> on all Certification Courses. Limited time only - Enroll now!
            </span>
          </div>
          <button
            onClick={handleBannerClose}
            className="ml-2 sm:ml-4 p-1 hover:bg-gray-800 rounded-full transition-colors shrink-0 flex-shrink-0"
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
      <Navbar bannerVisible={showBanner} />
      <div className="flex-1">
        <PageTransition key={routeHash}>
          {Content}
        </PageTransition>
      </div>
      <Footer />
    </div>
  )
}

