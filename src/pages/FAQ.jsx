import React, { useState } from 'react'

const faqCategories = [
  { id: 'general', label: 'General', icon: '📋' },
  { id: 'courses', label: 'Courses', icon: '🎓' },
  { id: 'enrollment', label: 'Enrollment', icon: '✅' },
  { id: 'payments', label: 'Payments', icon: '💳' },
  { id: 'certificates', label: 'Certificates', icon: '🏆' },
  { id: 'placements', label: 'Placements', icon: '💼' },
]

const faqs = {
  general: [
    {
      question: 'What is KiwisEdutech?',
      answer: 'KiwisEdutech is a leading online education platform that transforms freshers into industry-ready professionals through comprehensive training programs, industry-recognized certifications, and placement support. We bridge the gap between academic learning and industry requirements.'
    },
    {
      question: 'Who can enroll in KiwisEdutech courses?',
      answer: 'Our courses are designed for students, freshers, working professionals, and anyone looking to upskill or transition into tech careers. Most courses have no strict prerequisites, making them accessible to beginners.'
    },
    {
      question: 'Are the courses self-paced or instructor-led?',
      answer: 'We offer both self-paced and instructor-led courses. Most certification courses are self-paced with lifetime access, while placement training programs include live sessions, mock interviews, and personalized mentorship.'
    },
    {
      question: 'What makes KiwisEdutech different from other platforms?',
      answer: 'Our unique value proposition includes: industry-aligned curriculum, hands-on projects, placement guarantee programs, direct connections with 800+ partner companies, personalized mentorship, and lifetime access to course materials.'
    },
    {
      question: 'Do you offer support after course completion?',
      answer: 'Yes! We provide lifetime access to course materials, ongoing community support, career guidance, interview preparation, and placement assistance even after course completion.'
    }
  ],
  courses: [
    {
      question: 'What types of courses do you offer?',
      answer: 'We offer Certification Courses (Full-Stack Development, Data Science, Cloud Computing, DevOps, etc.), Placement Training Programs, Workshops, and Internships. Each course is designed with industry requirements in mind.'
    },
    {
      question: 'How long are the courses?',
      answer: 'Course duration varies: Certification courses typically range from 8-16 weeks, Placement Training programs are 12-24 weeks, and Workshops are usually 1-3 days. All courses include lifetime access to materials.'
    },
    {
      question: 'Will I get hands-on project experience?',
      answer: 'Absolutely! Every course includes multiple real-world projects, case studies, and assignments. Our placement training programs include live projects with industry partners to build your portfolio.'
    },
    {
      question: 'What is the course structure?',
      answer: 'Our courses follow a structured learning path: video lectures, reading materials, hands-on coding exercises, projects, quizzes, and assessments. Placement programs also include mock interviews, resume building, and soft skills training.'
    },
    {
      question: 'Can I access course materials offline?',
      answer: 'Course videos and materials can be downloaded for offline viewing through our mobile app. However, some interactive features require an internet connection.'
    },
    {
      question: 'Are there any prerequisites for courses?',
      answer: 'Most beginner courses have no prerequisites. Advanced courses may require basic programming knowledge, which is clearly mentioned in the course description. We also offer foundation courses for complete beginners.'
    }
  ],
  enrollment: [
    {
      question: 'How do I enroll in a course?',
      answer: 'Simply browse our courses, select the one you\'re interested in, click "Enroll Now", and complete the payment. For free courses, enrollment is instant. You\'ll receive access immediately after enrollment.'
    },
    {
      question: 'Can I enroll in multiple courses?',
      answer: 'Yes! You can enroll in multiple courses simultaneously. We also offer bundle discounts when you enroll in multiple related courses together.'
    },
    {
      question: 'What happens after I enroll?',
      answer: 'After enrollment, you\'ll receive an email confirmation with course access details. You can log in to your student dashboard to access all enrolled courses, track progress, and interact with instructors.'
    },
    {
      question: 'Can I switch courses after enrollment?',
      answer: 'Yes, you can switch to a different course within 7 days of enrollment, subject to availability and price difference. Contact our support team for assistance.'
    },
    {
      question: 'Is there a deadline to complete courses?',
      answer: 'Certification courses have no strict deadlines - you can learn at your own pace with lifetime access. Placement training programs may have structured timelines with milestones.'
    },
    {
      question: 'Can I get a refund if I\'m not satisfied?',
      answer: 'Yes, we offer a 7-day money-back guarantee. If you\'re not satisfied with the course content, contact our support team within 7 days of enrollment for a full refund. See our Refund Policy for details.'
    }
  ],
  payments: [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including Credit/Debit cards, UPI, Net Banking, Wallets (Paytm, PhonePe, etc.), and EMI options through Razorpay. All transactions are secure and encrypted.'
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No, there are no hidden charges. The price displayed is the final amount you pay. Course fees include all materials, certificates, and lifetime access. Payment gateway charges are borne by us.'
    },
    {
      question: 'Do you offer EMI options?',
      answer: 'Yes! We offer EMI options through our payment partner Razorpay. You can choose EMI during checkout and pay in easy monthly installments. EMI eligibility depends on your bank and credit score.'
    },
    {
      question: 'Can I pay in installments?',
      answer: 'Yes, we offer flexible payment plans for select courses. You can pay 50% upfront and the remaining 50% before course completion. Contact our support team for installment options.'
    },
    {
      question: 'Will I receive a payment receipt?',
      answer: 'Yes, you\'ll receive an email receipt immediately after payment confirmation. You can also download invoices and receipts from your student dashboard under Payment History.'
    },
    {
      question: 'What if my payment fails?',
      answer: 'If payment fails, your enrollment won\'t be processed. Please check your payment method, ensure sufficient funds, and try again. If issues persist, contact our support team or your bank.'
    },
    {
      question: 'Do you offer discounts or scholarships?',
      answer: 'Yes! We offer early bird discounts, student discounts, bundle discounts, and scholarships for meritorious students. Follow our social media and check the website for ongoing offers.'
    }
  ],
  certificates: [
    {
      question: 'Will I receive a certificate after course completion?',
      answer: 'Yes! Upon successful completion of certification courses (including all assignments and assessments), you\'ll receive a digital certificate that you can download and share on LinkedIn.'
    },
    {
      question: 'Are the certificates recognized by employers?',
      answer: 'Yes, our certificates are industry-recognized and valued by 800+ partner companies. They validate your skills and demonstrate your commitment to professional development. Many employers specifically look for KiwisEdutech certifications.'
    },
    {
      question: 'What information is included on the certificate?',
      answer: 'Certificates include your name, course title, completion date, certificate ID (for verification), and our company seal. They are professionally designed and suitable for sharing on professional networks.'
    },
    {
      question: 'How do I verify my certificate?',
      answer: 'Each certificate has a unique ID that can be verified on our website. Employers can verify the authenticity of your certificate using this ID through our certificate verification portal.'
    },
    {
      question: 'Can I get a physical certificate?',
      answer: 'Digital certificates are provided free with course completion. Physical certificates can be ordered for an additional fee and will be shipped to your registered address.'
    },
    {
      question: 'What if I don\'t complete the course?',
      answer: 'Certificates are only issued upon successful completion of all course requirements (assignments, projects, and assessments). However, you retain lifetime access to complete the course at your own pace.'
    }
  ],
  placements: [
    {
      question: 'Do you guarantee placements?',
      answer: 'Yes! Our Placement Guarantee Program ensures placement within 6 months of course completion, or we refund 100% of your fees. This applies to our dedicated placement training programs with specific eligibility criteria.'
    },
    {
      question: 'What companies do you partner with?',
      answer: 'We partner with 800+ companies including startups, mid-size companies, and Fortune 500 organizations across IT, Finance, E-commerce, Healthcare, and other sectors. Our partner companies actively recruit from our talent pool.'
    },
    {
      question: 'What placement support do you provide?',
      answer: 'We provide comprehensive placement support including: resume building, LinkedIn optimization, mock interviews, technical interview preparation, soft skills training, job referrals, direct company connections, and interview scheduling.'
    },
    {
      question: 'How does the placement process work?',
      answer: 'After course completion, our placement team reviews your profile, helps optimize your resume, conducts mock interviews, and matches you with suitable opportunities. We schedule interviews and provide feedback throughout the process.'
    },
    {
      question: 'What is the average placement package?',
      answer: 'Placement packages vary based on role, location, and experience. Our students have been placed with packages ranging from ₹3 LPA to ₹25 LPA, with an average of ₹6-8 LPA for freshers.'
    },
    {
      question: 'Do you help with internships?',
      answer: 'Yes! We offer internship opportunities through our partner companies. Students can apply for internships during or after course completion. Many internships convert to full-time positions.'
    },
    {
      question: 'What if I don\'t get placed?',
      answer: 'If you\'re enrolled in our Placement Guarantee Program and don\'t get placed within 6 months (meeting all program requirements), we refund 100% of your fees. We also provide continued support until placement.'
    }
  ]
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [openIndex, setOpenIndex] = useState(0)

  const currentFaqs = faqs[activeCategory] || []

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-linear-to-br from-primary-50 to-white border-b border-primary-200 pt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Find answers to common questions about our courses, enrollment, payments, and more
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id)
                  setOpenIndex(0)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className={`w-5 h-5 text-primary-600 shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="bg-linear-to-br from-primary-50 to-white rounded-xl border border-primary-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you. Get in touch with us and we'll respond within 24 hours.
            </p>
            <a
              href="mailto:support@kiwisedutech.com"
              className="inline-block rounded-lg bg-primary-600 px-8 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-2xl shadow-primary-600/50 hover:scale-105 hover:bg-primary-700 hover:shadow-[0_25px_60px_rgba(147,51,234,0.7)] relative overflow-hidden"
            >
              <span className="relative z-10">Email Us</span>
              <span className="absolute inset-0 bg-linear-to-r from-primary-400 via-primary-500 to-primary-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

