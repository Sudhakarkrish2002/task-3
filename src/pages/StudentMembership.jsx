import React, { useState } from 'react'

const membershipTiers = [
  {
    tier: 'Free',
    price: '₹0',
    period: 'Lifetime',
    features: [
      'Access to free courses',
      'Basic certificates',
      'Job listings access',
      'Community forum access',
      'Newsletter updates',
    ],
    popular: false,
  },
  {
    tier: 'Basic',
    price: '₹999',
    period: 'per year',
    features: [
      'All Free tier benefits',
      '20% discount on all courses',
      'Priority internship notifications',
      'Resume review (2 times/year)',
      'Career counseling session (1/year)',
      'Basic placement support',
    ],
    popular: false,
  },
  {
    tier: 'Premium',
    price: '₹2,999',
    period: 'per year',
    features: [
      'All Basic tier benefits',
      '40% discount on all courses',
      'Exclusive premium courses access',
      'Unlimited resume reviews',
      '1-on-1 career mentoring (monthly)',
      'Placement-guaranteed program access',
      'Early access to workshops',
      'LinkedIn profile optimization',
      'Interview preparation sessions',
      'Direct referrals to hiring partners',
    ],
    popular: true,
  },
]

export default function StudentMembership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    graduationYear: '',
    membershipTier: 'Free',
    paymentMethod: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tierName = formData.membershipTier
    if (tierName === 'Free') {
      alert(`Congratulations! Your ${tierName} membership has been activated. Check your email for confirmation and access details.`)
    } else {
      alert(`Thank you for choosing ${tierName} membership! You will be redirected to the payment page to complete your registration.`)
    }
    setFormData({
      name: '',
      email: '',
      phone: '',
      college: '',
      graduationYear: '',
      membershipTier: 'Free',
      paymentMethod: '',
    })
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl pt-15 font-bold text-gray-900">
            Become a Student Member
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Unlock exclusive benefits, discounts, and career support with our membership plans
          </p>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Membership Tier</h2>
            <p className="text-gray-600">Select a plan that best fits your career goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {membershipTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-xl border-2 p-6 ${
                  tier.popular
                    ? 'border-primary-600 bg-primary-50 shadow-lg scale-105'
                    : 'border-gray-200 bg-white'
                }`}
              >
                {tier.popular && (
                  <div className="mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-600 text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.tier}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-sm text-gray-600">{tier.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setFormData({ ...formData, membershipTier: tier.tier })}
                  className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 ease-in-out relative overflow-hidden ${
                    tier.popular
                      ? 'bg-primary-600 text-white shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_20px_50px_rgba(147,51,234,0.6)]'
                      : 'bg-gray-100 text-gray-900 shadow-md hover:bg-gray-200 hover:scale-105 hover:shadow-xl hover:shadow-gray-400/30'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  )}
                  <span className="relative z-10">Select {tier.tier}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Membership Benefits</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discounted Course Fees</h3>
                <p className="text-sm text-gray-600">
                  Enjoy significant discounts on all courses - up to 40% off for Premium members. 
                  Save money while investing in your future.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Exclusive Internships</h3>
                <p className="text-sm text-gray-600">
                  Get priority access to exclusive internship opportunities from top companies. 
                  Premium members get early notifications and direct referrals.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificates & Credentials</h3>
                <p className="text-sm text-gray-600">
                  Earn industry-recognized certificates for all completed courses. Premium members 
                  get verified digital badges for LinkedIn profiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border-2 border-gray-200 p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Register Now</h2>
                <p className="text-gray-600">Fill in your details to start your membership journey</p>
                {formData.membershipTier && (
                  <div className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-primary-50 border border-primary-200">
                    <span className="text-sm font-semibold text-primary-900">
                      Selected: <span className="text-primary-700">{formData.membershipTier} Membership</span>
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="membershipTier" className="block text-sm font-medium text-gray-700 mb-1">
                    Membership Tier *
                  </label>
                  <select
                    id="membershipTier"
                    name="membershipTier"
                    value={formData.membershipTier}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                  >
                    <option value="Free">Free - ₹0</option>
                    <option value="Basic">Basic - ₹999/year</option>
                    <option value="Premium">Premium - ₹2,999/year</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                    College/University *
                  </label>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder="Enter your college name"
                  />
                </div>

                <div>
                  <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Graduation Year *
                  </label>
                  <input
                    type="number"
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    required
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    placeholder={String(new Date().getFullYear())}
                  />
                </div>

                {formData.membershipTier !== 'Free' && (
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Payment Method
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    >
                      <option value="">Select payment method</option>
                      <option value="credit-card">Credit Card</option>
                      <option value="debit-card">Debit Card</option>
                      <option value="upi">UPI</option>
                      <option value="net-banking">Net Banking</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary-600 px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden mt-6"
                >
                  <span className="relative z-10">{formData.membershipTier === 'Free' ? 'Register for Free Membership' : 'Proceed to Payment'}</span>
                  <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

