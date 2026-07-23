import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#030C14] text-white relative">
      
      <Header />

      <div className="relative z-10 pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Terms of <span className="text-gradient-cyan">Service</span>
            </h1>
            <p className="text-gray-400">Last updated: June 29, 2026</p>
          </motion.div>

          <div className="glass-panel rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                By accessing or using QRify Pro (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                QRify Pro is a web-based QR code generation platform that allows users to create, customize, and download QR codes for various purposes. The Service is provided &quot;as is&quot; and may be updated or modified at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                To access certain features of the Service, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Ensuring your account information is accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Generate QR codes for illegal, harmful, or fraudulent purposes</li>
                <li>Distribute malware, viruses, or malicious content</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass, abuse, or harm others</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Use the Service in any way that could damage or overload our systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Subscription and Payments</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Some features of the Service require a paid subscription. By subscribing, you agree to pay all fees associated with your chosen plan. Subscriptions automatically renew unless cancelled. Refunds are provided in accordance with our refund policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Service and its original content, features, and functionality are owned by QRify Pro and are protected by international copyright, trademark, and other intellectual property laws. QR codes you generate are yours to use as you see fit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                In no event shall QRify Pro be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the Service. Our total liability shall not exceed the amount you paid us in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Disclaimer of Warranties</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Service is provided without warranties of any kind, whether express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                These Terms shall be governed by the laws of the State of California, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of significant changes by posting the new Terms on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Information</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                If you have any questions about these Terms, please contact us at hello@qrify.pro.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
