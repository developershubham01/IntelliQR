import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <Header />

      <div className="relative z-10 pt-32 pb-20 min-h-[calc(100vh-6rem)]">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              Legal Policy
            </span>
            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              Terms of <span className="italic font-normal text-slate-500 font-serif">Service</span>
            </h1>
            <p className="text-slate-500 text-sm font-bold">Last updated: July 24, 2026</p>
          </motion.div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">1. Acceptance of Terms</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                By accessing or using IntelliQR (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">2. Description of Service</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                IntelliQR is a web-based QR code generation platform that allows users to create, style, and download QR codes for various purposes. The Service is provided &quot;as is&quot; and may be updated or modified at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">3. User Accounts</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">
                To access certain features of the Service (like dynamic redirect links, team analytics, or custom domain mapping), you are required to log in or create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-slate-500 font-semibold text-sm space-y-1">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Ensuring your account details are accurate and up-to-date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">4. Acceptable Use</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-slate-500 font-semibold text-sm space-y-1">
                <li>Generate QR codes for illegal, harmful, or fraudulent purposes</li>
                <li>Distribute malware, viruses, or malicious redirection targets</li>
                <li>Attempt to gain unauthorized access to our APIs or database poolers</li>
                <li>Infringe on the intellectual property rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">5. Subscription & Payments</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                Paid plans (Pro, Business) require subscription renewals. Subscription fees are processed securely. You can manage or cancel renewals at any time from your billing configurations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">6. Limitation of Liability</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                In no event shall IntelliQR or ABWcurious Pvt.Ltd be liable for any indirect, incidental, or consequential damages arising out of your use of the generated QR assets.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">7. Contact Information</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                If you have any questions or feedback regarding these Terms, please reach out to us directly at <a href="mailto:info@abwcurious.com" className="text-indigo-600 hover:underline">info@abwcurious.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
