import React from 'react'

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2024</p>

          <div className="prose max-w-none space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="mb-3 leading-relaxed">
                By accessing and using KiwisEdutech's platform, you accept and agree to be bound by the terms 
                and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. User Accounts</h2>
              <p className="mb-3 leading-relaxed">
                To access certain features of our platform, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for any activity under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Course Enrollment and Payment</h2>
              <p className="mb-3 leading-relaxed">
                When you enroll in a paid course:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>You agree to pay the fees specified at the time of enrollment</li>
                <li>All fees are in Indian Rupees (₹) unless otherwise stated</li>
                <li>Payment must be made through our authorized payment gateways</li>
                <li>Course fees are non-transferable to other courses or users</li>
                <li>Access to course materials is granted upon successful payment verification</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Intellectual Property Rights</h2>
              <p className="mb-3 leading-relaxed">
                All content on our platform, including courses, materials, videos, text, graphics, logos, and software, 
                is the property of KiwisEdutech or its content suppliers and is protected by copyright, trademark, 
                and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Reproduce, distribute, or transmit any content without our written permission</li>
                <li>Share your course access with others</li>
                <li>Use our content for commercial purposes without authorization</li>
                <li>Remove any copyright or proprietary notices from materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Placement Guarantee</h2>
              <p className="mb-3 leading-relaxed">
                Our placement-guaranteed programs are subject to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Completion of all course requirements and assessments</li>
                <li>Active participation in placement support activities</li>
                <li>Maintaining minimum attendance and performance standards</li>
                <li>Following our placement policies and procedures</li>
                <li>Guarantee applies within the specified timeframe and conditions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. User Conduct</h2>
              <p className="mb-3 leading-relaxed">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit any viruses or malicious code</li>
                <li>Engage in harassment, abuse, or harmful behavior</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p className="mb-3 leading-relaxed">
                KiwisEdutech shall not be liable for any indirect, incidental, special, consequential, or punitive 
                damages resulting from your use or inability to use the platform, including but not limited to loss of 
                profits, data, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Modifications to Terms</h2>
              <p className="mb-3 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any significant changes 
                through email or platform notifications. Continued use of the platform after changes constitutes 
                acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Termination</h2>
              <p className="mb-3 leading-relaxed">
                We reserve the right to terminate or suspend your account and access to the platform immediately, 
                without prior notice, for any violation of these terms or for any other reason we deem appropriate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
              <p className="mb-3 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes 
                arising from these terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, Karnataka.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Information</h2>
              <p className="mb-3 leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-1"><strong>Email:</strong> legal@kiwisedutech.com</p>
                <p className="mb-1"><strong>Phone:</strong> +91 98765 43210</p>
                <p><strong>Address:</strong> 123 Education Street, Tech Park Area, Bangalore - 560001, Karnataka, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

