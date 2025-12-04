import React from 'react'

const ourCoursesLinks = [
  { label: 'Courses', hash: '#/courses' },
  { label: 'Certification Courses', hash: '#/courses/certifications' },
  { label: 'Placement Training', hash: '#/courses/placement' },
  { label: 'Workshops', hash: '#/courses/workshops' },
  { label: 'Internships', hash: '#/internships' },
]

const quickLinks = [
  { label: 'Home', hash: '#/' },
  { label: 'About Us', hash: '#/about' },
  { label: 'Blog', hash: '#/blog' },
  { label: 'Careers', hash: '#/careers' },
  { label: 'FAQ', hash: '#/faq' },
  { label: 'College Registration', hash: '#/college-registration' },
  { label: 'Student Membership', hash: '#/student-membership' },
]

const kiwisEdutechLinks = [
  { label: 'Contact', hash: '#/contact' },
  { label: 'Privacy Policy', hash: '#/privacy' },
  { label: 'Refund Policy', hash: '#/refund' },
  { label: 'Terms Of Use', hash: '#/terms' },
]

const loginLinks = [
  { label: 'Employer Login', hash: '#/auth?tab=employer' },
  { label: 'College Login', hash: '#/auth?tab=college' },
]

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-primary-800 via-primary-900 to-primary-950">
      {/* Large KIWISEDUTECH Header - Full Width */}
      <div className="w-full py-8 border-b border-primary-700">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white text-center uppercase tracking-wider leading-tight footer-header-premium">
            KIWISEDUTECH
          </h2>
        </div>
      </div>

      {/* Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Our Courses Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Our Courses</h3>
            <ul className="space-y-3">
              {ourCoursesLinks.map((link) => (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    className="text-base text-primary-200 hover:text-white font-medium transition-colors duration-200"
                  >
                    {link.label}
                </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    className="text-base text-primary-200 hover:text-white font-medium transition-colors duration-200"
                  >
                  {link.label}
                </a>
                </li>
              ))}
            </ul>
            </div>

          {/* KiwisEdutech Column */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">KiwisEdutech</h3>
            <ul className="space-y-3">
              {kiwisEdutechLinks.map((link) => (
                <li key={link.hash}>
                  <a
                    href={link.hash}
                    className="text-base text-primary-200 hover:text-white font-medium transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
                ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-primary-700">
              <p className="text-lg font-bold text-white mb-3">Login</p>
              <ul className="space-y-2">
                {loginLinks.map((link) => (
                  <li key={link.hash}>
                    <a
                      href={link.hash}
                      className="text-base text-primary-200 hover:text-white font-medium transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Badges Section */}
          <div>
            <div className="space-y-4">
              {/* Google Review Badge */}
              <div className="bg-white rounded-lg p-4 flex items-center gap-3 shadow-lg">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">Google</p>
                  <p className="text-xs text-gray-600">(4.8)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-primary-700 text-sm text-primary-300 text-center">
          © {new Date().getFullYear()} KiwisEdutech. All rights reserved.
        </div>
      </div>
    </footer>
  )
}


