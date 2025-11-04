import React from 'react'

const footerLinks = [
  { label: 'College Registration', hash: '#/college-registration' },
  { label: 'Student Membership', hash: '#/student-membership' },
  { label: 'About Us', hash: '#/about' },
  { label: 'Blog / Resources', hash: '#/blog' },
  { label: 'Contact Us', hash: '#/contact' },
  { label: 'Terms & Conditions', hash: '#/terms' },
  { label: 'Privacy Policy', hash: '#/privacy' },
  { label: 'Refund Policy', hash: '#/refund' },
  { label: 'FAQ', hash: '#/faq' },
  { label: 'Careers', hash: '#/careers' },
]

const loginLinks = [
  { label: 'Employer Login', hash: '#/auth?tab=employer' },
  { label: 'College Login', hash: '#/auth?tab=college' },
]

const socials = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/kiwisedutech' },
  { label: 'Twitter/X', url: 'https://x.com' },
  { label: 'Instagram', url: 'https://instagram.com' },
]

export default function Footer() {
  return (
    <footer className="border-t border-primary-900 bg-linear-to-b from-primary-800 via-primary-900 to-primary-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src="/Assets/kiwisedutech_logo.jpeg"
                alt="KiwisEdutech Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-lg font-semibold text-white">KiwisEdutech</span>
            </div>
            <p className="mt-4 text-sm text-primary-200">
              Transforming freshers into industry-ready professionals.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-primary-200 hover:text-primary-400 font-medium transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {footerLinks.map((link) => (
                <a key={link.hash} href={link.hash} className="text-sm text-white hover:text-primary-400 font-medium transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-primary-700">
              <p className="text-sm font-semibold text-white mb-2">Login</p>
              <div className="flex flex-col gap-2">
                {loginLinks.map((link) => (
                  <a key={link.hash} href={link.hash} className="text-sm text-white hover:text-primary-400 font-medium transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-900 text-xs text-primary-300">
          © {new Date().getFullYear()} KiwisEdutech. All rights reserved.
        </div>
      </div>
    </footer>
  )
}


