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

const socials = [
  { label: 'LinkedIn', url: 'https://linkedin.com' },
  { label: 'Twitter/X', url: 'https://x.com' },
  { label: 'Instagram', url: 'https://instagram.com' },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2">
              <img
                src="/Asserts/Kiwistron-logo.jpeg"
                alt="Kiwistron Edutech Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-lg font-semibold text-gray-900">Kiwistron Edutech</span>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Transforming freshers into industry-ready professionals.
            </p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-primary-700">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {footerLinks.map((link) => (
              <a key={link.hash} href={link.hash} className="text-sm text-gray-700 hover:text-primary-700">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-xs text-gray-500">
          © {new Date().getFullYear()} Kiwistron Edutech. All rights reserved.
        </div>
      </div>
    </footer>
  )
}


