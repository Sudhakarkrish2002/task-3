import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
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
import TermsConditions from './pages/TermsConditions.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import RefundPolicy from './pages/RefundPolicy.jsx'

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
  '#/dashboard/student': <StudentDashboard />,
  '#/dashboard/employer': <EmployerDashboard />,
  '#/dashboard/college': <CollegeDashboard />,
  '#/terms': <TermsConditions />,
  '#/privacy': <PrivacyPolicy />,
  '#/refund': <RefundPolicy />,
  '#/faq': <Placeholder title="FAQ" />,
  '#/careers': <Placeholder title="Careers" />,
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash || '#/')

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

  // Scroll to top when hash changes (including initial load)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [hash])

  const Content = routes[hash] || <Home />

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1">{Content}</div>
      <Footer />
    </div>
  )
}

