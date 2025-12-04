import React from 'react'

const services = [
  {
    title: 'Product Research & Innovation',
    description: 'Comprehensive market research, competitive analysis, and product ideation to identify opportunities and develop innovative solutions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Technology Development',
    description: 'Custom software development, system architecture design, and technology integration services tailored to your business needs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    title: 'Prototype Development',
    description: 'Rapid prototyping and MVP development to validate concepts, test market viability, and accelerate time-to-market.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: 'Quality Assurance & Testing',
    description: 'Comprehensive testing strategies, quality assurance protocols, and performance optimization to ensure robust and reliable products.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Research Analytics & Insights',
    description: 'Data-driven research analysis, user behavior studies, and actionable insights to inform strategic decision-making.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Intellectual Property Support',
    description: 'Guidance on patent research, IP strategy development, and documentation support to protect your innovations.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
]

const benefits = [
  {
    title: 'Expert Team',
    description: 'Work with experienced researchers, developers, and engineers with proven track records in innovation.',
  },
  {
    title: 'Cost-Effective Solutions',
    description: 'Access professional R&D services at competitive rates without maintaining an in-house team.',
  },
  {
    title: 'Faster Time-to-Market',
    description: 'Accelerate your product development cycle with streamlined processes and agile methodologies.',
  },
  {
    title: 'Scalable Resources',
    description: 'Scale your R&D efforts up or down based on project requirements and business needs.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Discovery & Consultation',
    description: 'We begin by understanding your business goals, technical requirements, and market challenges through detailed consultation sessions.',
  },
  {
    step: '02',
    title: 'Research & Planning',
    description: 'Our team conducts comprehensive research, analyzes market trends, and develops a strategic roadmap for your project.',
  },
  {
    step: '03',
    title: 'Development & Prototyping',
    description: 'We build prototypes and develop solutions using industry best practices, ensuring quality and scalability.',
  },
  {
    step: '04',
    title: 'Testing & Refinement',
    description: 'Rigorous testing and iterative refinement ensure your product meets quality standards and user expectations.',
  },
  {
    step: '05',
    title: 'Deployment & Support',
    description: 'We assist with deployment, provide documentation, and offer ongoing support to ensure successful implementation.',
  },
]

export default function ResearchDevelopment() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative pt-16 border-b border-primary-200 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary-900/75 to-primary-700/60"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
            Research & Development Services
          </h1>
          <p className="mt-4 text-lg text-white/95 drop-shadow-md">
            Transform your ideas into innovative products with our comprehensive R&D solutions
          </p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Comprehensive R&D Solutions</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                At KiwisEdutech, our Research & Development Services division specializes in helping businesses, 
                startups, and educational institutions transform innovative concepts into market-ready products and 
                solutions. With a team of experienced researchers, engineers, and developers, we provide end-to-end 
                R&D support that accelerates innovation and drives business growth.
              </p>
              <p>
                Whether you're looking to develop a new software product, create innovative educational technology, 
                or build prototypes for market validation, our R&D services are designed to meet your specific needs. 
                We combine technical expertise with strategic insights to deliver solutions that are not only 
                technologically advanced but also commercially viable.
              </p>
              <p>
                Our approach emphasizes collaboration, transparency, and results-driven development. We work closely 
                with clients throughout the entire R&D lifecycle, from initial concept exploration to final product 
                deployment, ensuring that every project aligns with business objectives and market demands.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our R&D Services</h2>
            <p className="text-gray-600">Comprehensive solutions for your innovation needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 text-primary-600">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose Our R&D Services</h2>
            <p className="text-gray-600">Benefits that drive innovation and growth</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center shrink-0 mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 bg-linear-to-br from-primary-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our R&D Process</h2>
            <p className="text-gray-600">A structured approach to innovation</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-6 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                <div className="w-16 h-16 rounded-lg bg-primary-600 flex items-center justify-center shrink-0">
                  <span className="text-xl font-bold text-white">{step.step}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Industries We Serve</h2>
            <p className="text-gray-600">R&D solutions across diverse sectors</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'EdTech', description: 'Educational technology platforms and learning management systems' },
              { name: 'Healthcare Tech', description: 'Medical devices, health monitoring systems, and telemedicine solutions' },
              { name: 'FinTech', description: 'Financial applications, payment gateways, and banking solutions' },
              { name: 'E-Commerce', description: 'Online marketplaces, shopping platforms, and retail technology' },
              { name: 'IoT & Hardware', description: 'Connected devices, embedded systems, and smart solutions' },
              { name: 'Enterprise Software', description: 'Business applications, CRM systems, and enterprise tools' },
            ].map((industry, idx) => (
              <div key={idx} className="p-6 rounded-lg border border-gray-200 bg-gray-50 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kiwistron Website Section */}
      <section className="py-12 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 md:p-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Robotics & AI Solutions</h2>
                <p className="text-lg text-gray-300 mb-2">
                  We have a dedicated website for our cutting-edge robotics, AI, and embedded systems solutions.
                </p>
                <p className="text-base text-gray-400">
                  Discover innovative industrial automation, smart systems integration, and customized hardware solutions at Kiwistron.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.kiwistron.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-700 px-8 py-4 text-white text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 hover:shadow-xl"
                >
                  <span>Visit Kiwistron</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-linear-to-r from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Ideas into Reality?</h2>
            <p className="text-lg text-primary-100 mb-8">
              Let's discuss how our R&D services can accelerate your innovation journey and bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#/contact"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-primary-700 text-base font-semibold transition-all duration-300 ease-in-out shadow-lg hover:scale-105 hover:shadow-xl"
              >
                Get in Touch
              </a>
              <a
                href="#/courses"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 text-white text-base font-semibold transition-all duration-300 ease-in-out hover:bg-white/10"
              >
                Explore Our Courses
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

