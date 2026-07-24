import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Sparkles } from "lucide-react";

export default function Privacy() {
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
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              Legal Policy
            </span>
            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              Privacy <span className="italic font-normal text-slate-500 font-serif">Policy</span>
            </h1>
            <p className="text-slate-500 text-sm font-bold">Last updated: July 24, 2026</p>
          </motion.div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-8 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">1. Introduction</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                IntelliQR (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">2. Information We Collect</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-slate-500 font-semibold text-sm space-y-1">
                <li>Account credentials (name, email address)</li>
                <li>QR code content configurations and design styling preferences</li>
                <li>Payment information (processed securely by our payment providers)</li>
                <li>Communications and support requests you submit</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">3. How We Use Your Information</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-slate-500 font-semibold text-sm space-y-1">
                <li>Provide, operate, and maintain our generation services</li>
                <li>Process secure checkout transactions</li>
                <li>Send technical notices, product updates, and email notifications</li>
                <li>Respond to feedback and help requests</li>
                <li>Analyze aggregate usage to optimize website speeds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">4. Data Security</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                We implement strict industry-standard technical security measures to protect your database assets. All data transfers occur over encrypted HTTPS connections and are stored securely under pooler relays.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">5. Data Retention</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                We retain your history details for as long as your profile remains active. Guests' local storage records are preserved locally in their own browser cache. You can request deletion of your account metadata at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">6. Third-Party Services</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                We utilize hosting platforms (Vercel) and database handlers (Supabase) to operate our redirect functions. These providers process data safely in accordance with their respective security policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">7. Contact Us</h2>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">
                If you have any questions or feedback regarding this Privacy Policy, please reach out to us directly at <a href="mailto:info@abwcurious.com" className="text-indigo-600 hover:underline">info@abwcurious.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
