import React from 'react'

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Refund / Cancellation Policy
          </h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 2024</p>

          <div className="prose max-w-none space-y-8 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Overview</h2>
              <p className="mb-3 leading-relaxed">
                At Kiwistron Edutech, we strive to provide quality educational services. This Refund and Cancellation 
                Policy outlines the terms and conditions under which refunds and cancellations may be processed for 
                our paid courses and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Refund Eligibility for Paid Courses</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.1 Full Refund (100%)</h3>
              <p className="mb-3 leading-relaxed">
                You are eligible for a full refund if you request cancellation:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Within <strong>7 days</strong> of course enrollment date</li>
                <li>Before accessing more than <strong>20% of the course content</strong></li>
                <li>If the course has not been started (no video watched, no assignment submitted)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.2 Partial Refund (50%)</h3>
              <p className="mb-3 leading-relaxed">
                You are eligible for a 50% refund if:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>You request cancellation within <strong>15 days</strong> of enrollment</li>
                <li>You have accessed between <strong>20% to 50%</strong> of the course content</li>
                <li>No certificate has been issued for the course</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">2.3 No Refund</h3>
              <p className="mb-3 leading-relaxed">
                Refunds will not be processed in the following cases:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>More than <strong>50% of the course content</strong> has been accessed</li>
                <li>Course certificate has been issued</li>
                <li>More than <strong>30 days</strong> have passed since enrollment</li>
                <li>Violation of our Terms & Conditions</li>
                <li>Refund request made after course completion</li>
                <li>If you have received placement assistance or job referral through our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Placement-Guaranteed Courses</h2>
              <p className="mb-3 leading-relaxed">
                For placement-guaranteed courses, special refund terms apply:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Full refund if placement is not secured within <strong>6 months</strong> of course completion</li>
                <li>Condition: Student must have completed all course requirements and participated in placement activities</li>
                <li>No refund if student declines job offers (minimum 3 offers)</li>
                <li>Partial refund if placement secured but student withdraws before joining</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Workshop Refunds</h2>
              <p className="mb-3 leading-relaxed">
                For paid workshops:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Full refund if cancelled <strong>48 hours before</strong> workshop start time</li>
                <li>50% refund if cancelled <strong>24 hours before</strong> workshop start time</li>
                <li>No refund for cancellations less than 24 hours before or after workshop has started</li>
                <li>Free workshops are not eligible for refund claims</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Membership Refunds</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">5.1 Basic/Premium Membership</h3>
              <p className="mb-3 leading-relaxed">
                For annual memberships:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Full refund within <strong>30 days</strong> of purchase if no courses accessed</li>
                <li>Pro-rated refund after 30 days based on unused period (minus transaction fees)</li>
                <li>No refund if you have used membership benefits (discounted course enrollments, referrals)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">5.2 Free Membership</h3>
              <p className="mb-3 leading-relaxed">
                Free memberships can be cancelled anytime without refund implications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Refund Request Process</h2>
              <p className="mb-3 leading-relaxed">
                To request a refund, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2 mb-3">
                <li>Send an email to <strong>refunds@kiwistronedutech.com</strong> with:</li>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Your enrollment ID or transaction ID</li>
                  <li>Course/Service name</li>
                  <li>Reason for refund request</li>
                  <li>Date of enrollment</li>
                </ul>
                <li>Our team will review your request within <strong>5-7 business days</strong></li>
                <li>If approved, refund will be processed to the original payment method within <strong>10-15 business days</strong></li>
                <li>You will receive email confirmation once refund is processed</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Processing Time</h2>
              <p className="mb-3 leading-relaxed">
                Once your refund request is approved:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li><strong>Credit/Debit Cards:</strong> 5-10 business days</li>
                <li><strong>UPI:</strong> 2-5 business days</li>
                <li><strong>Net Banking:</strong> 5-10 business days</li>
                <li><strong>Bank Transfer:</strong> 7-14 business days</li>
              </ul>
              <p className="mb-3 leading-relaxed">
                Please note that processing time may vary depending on your bank or payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Transaction Fees</h2>
              <p className="mb-3 leading-relaxed">
                <strong>Payment Gateway Charges:</strong> Transaction fees charged by payment gateways (typically 2-3%) 
                will be deducted from the refund amount. This fee is non-refundable as it covers the cost of processing 
                the original transaction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Course Cancellation by Us</h2>
              <p className="mb-3 leading-relaxed">
                In the rare event that we cancel a course:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>You will receive a <strong>full refund</strong> automatically</li>
                <li>Refund will be processed within 7 business days</li>
                <li>You will be notified via email about the cancellation and refund</li>
                <li>You may be offered alternative courses or credit for future enrollments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Special Circumstances</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">10.1 Technical Issues</h3>
              <p className="mb-3 leading-relaxed">
                If you experience persistent technical issues preventing course access:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Contact our support team first for resolution</li>
                <li>If issues cannot be resolved within 7 days, you may be eligible for a refund</li>
                <li>Refund decision will be made on a case-by-case basis</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">10.2 Medical Emergencies</h3>
              <p className="mb-3 leading-relaxed">
                In case of documented medical emergencies preventing course completion:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Submit medical documentation along with refund request</li>
                <li>We may offer course extension or partial refund based on circumstances</li>
                <li>Review and decision within 10 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Non-Refundable Items</h2>
              <p className="mb-3 leading-relaxed">
                The following are non-refundable:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>Processing fees and transaction charges</li>
                <li>Certification exam fees (if separately paid)</li>
                <li>Course materials purchased separately</li>
                <li>Workshop recordings (if purchased)</li>
                <li>Any discounts or promotional offers applied</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Dispute Resolution</h2>
              <p className="mb-3 leading-relaxed">
                If you are not satisfied with our refund decision:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-3">
                <li>You may escalate your concern to our customer support manager</li>
                <li>All disputes will be reviewed by our refund committee</li>
                <li>Final decision will be communicated within 15 business days</li>
                <li>If still unresolved, disputes shall be subject to the jurisdiction of Bangalore courts</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">13. Contact for Refunds</h2>
              <p className="mb-3 leading-relaxed">
                For refund requests and inquiries, please contact:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-1"><strong>Email:</strong> refunds@kiwistronedutech.com</p>
                <p className="mb-1"><strong>Phone:</strong> +91 98765 43210</p>
                <p className="mb-1"><strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM IST</p>
                <p><strong>Address:</strong> 123 Education Street, Tech Park Area, Bangalore - 560001, Karnataka, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

