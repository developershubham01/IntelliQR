import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function Privacy() {
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
              <Shield className="w-4 h-4" />
              Legal
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Privacy <span className="text-gradient-cyan">Policy</span>
            </h1>
            <p className="text-gray-400">Last updated: June 29, 2026</p>
          </motion.div>

          <div className="glass-panel rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                QRify Pro (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Account information (name, email address)</li>
                <li>QR code content and styling preferences</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Communications you send to us</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Understand how users interact with our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal information. All data is transmitted over HTTPS and stored securely. However, no method of transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                <li>Access the personal information we hold about you</li>
                <li>Request correction or deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We may use third-party services for analytics, payment processing, and hosting. These services have their own privacy policies and may collect information as specified in their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Cookies</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at hello@qrify.pro.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
