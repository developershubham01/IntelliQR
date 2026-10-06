import { useState } from "react";
import { Link } from "react-router";
import {
  Smartphone,
  Calendar,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  MapPin,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function QRAnalytics() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is QR code analytics?",
      answer:
        "QR code analytics is the measurement, collection, and analysis of physical-to-digital engagement data generated when users scan a dynamic QR code. It tracks metrics such as total scan volume, unique visitor counts, timestamp peaks, device operating systems, and geographic location to measure ROI on marketing campaigns.",
    },
    {
      question: "How does IntelliQR track QR code scans?",
      answer:
        "When a user scans an IntelliQR dynamic QR code, their device visits a secure, high-speed redirect endpoint (e.g. /q/ABC123). Before instantly routing the scanner to their destination, the server securely extracts standard HTTP request metadata—such as User-Agent (for device/OS/browser) and IP header (resolved to city/country and immediately anonymized for GDPR compliance).",
    },
    {
      question: "Can I see which city and country the QR code was scanned in?",
      answer:
        "Yes. IntelliQR provides country and city-level geolocation analytics. This enables multi-location retail chains, event organizers, and billboard advertisers to evaluate regional engagement and compare campaign performance across markets.",
    },
    {
      question: "Is QR code tracking GDPR compliant?",
      answer:
        "Yes. IntelliQR does not harvest personally identifiable information (PII) like names or phone numbers during a scan. IP addresses are anonymized or hashed, and user tracking adheres to global data privacy laws including GDPR, CCPA, and PECR.",
    },
    {
      question: "Can I connect QR code scans to Google Analytics 4 (GA4)?",
      answer:
        "Yes. You can append standard UTM tracking parameters (e.g. utm_source=billboard&utm_medium=qr&utm_campaign=summer_sale) to your destination URL within IntelliQR. When users scan the QR code and land on your website, Google Analytics seamlessly records the session source and attribution.",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IntelliQR Analytics Platform",
    applicationCategory: "AnalyticsSoftware",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Real-time QR code scan tracking platform with geolocation, device intelligence, and campaign attribution.",
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground flex flex-col font-sans">
      <SEOHead
        title="QR Code Analytics & Tracking Software – Real-Time Scan Insights"
        description="Monitor QR code campaign performance with real-time scan counts, geographic heatmaps, device breakdowns, and UTM attribution. Privacy-first, GDPR-compliant analytics."
        canonicalUrl="https://intelli-qr.vercel.app/qr-code-analytics"
        breadcrumbs={[{ name: "QR Analytics", url: "/qr-code-analytics" }]}
        faqs={faqs}
        structuredData={structuredData}
      />

      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ name: "QR Analytics", url: "/qr-code-analytics" }]} />

          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Real-Time Scan Telemetry & Attribution
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Turn Offline Interactions into Actionable Scan Analytics
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
              Measure every scan across print flyers, restaurant tables, product packaging, and billboard campaigns. 
              Gain deep visibility into scanner demographics, time peaks, and device platforms.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/generator?mode=dynamic"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/15"
              >
                Start Tracking Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-emerald-600" />
                View Sample Dashboard
              </Link>
            </div>
          </section>

          {/* GEO / AEO Answer-First Definition Card */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm mb-16">
            <div className="border-l-4 border-emerald-600 pl-6 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1">
                Direct Definition (GEO / AI Summary)
              </h2>
              <p className="text-2xl font-serif font-bold text-slate-900">
                What is QR Code Analytics and How Does It Work?
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-6">
              <strong>QR code analytics</strong> refers to the automated recording and synthesis of engagement telemetry every time a smartphone camera scans a dynamic QR code. 
              Unlike static barcodes, which provide zero feedback, IntelliQR's cloud redirection server captures scan timestamps, location data (country and city), hardware architecture (iOS vs. Android), and referring channels in real time, delivering empirical campaign ROI for marketers and business owners.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Scan Metrics</p>
                <p className="text-base font-bold text-slate-900">Total & Unique Scans</p>
                <p className="text-xs text-slate-500 mt-1">Differentiate first-time scans from repeat scans.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Geography</p>
                <p className="text-base font-bold text-slate-900">Country & City Level</p>
                <p className="text-xs text-slate-500 mt-1">Track which regions drive offline foot traffic.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Devices</p>
                <p className="text-base font-bold text-slate-900">iOS, Android, Desktop</p>
                <p className="text-xs text-slate-500 mt-1">Optimize landing pages for majority platforms.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Privacy</p>
                <p className="text-base font-bold text-slate-900">100% GDPR Compliant</p>
                <p className="text-xs text-slate-500 mt-1">Zero PII stored, privacy-preserving IP hashing.</p>
              </div>
            </div>
          </section>

          {/* Deep Feature Breakdown */}
          <section className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Telemetry Breakdown
              </h2>
              <p className="text-3xl font-serif font-bold text-slate-900">
                Everything You Can Measure with IntelliQR
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Geographic Distribution</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Identify top performing markets with regional city breakdowns. Perfect for evaluating billboard placements across metropolitan hubs like Mumbai, London, or New York.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-500">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Country & city detection</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Heatmap visualizations</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                  <Smartphone className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Operating System & Browser</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Discover whether your audience uses iPhones (iOS), Android, Windows, or Mac. Direct app download QR codes can automatically route to App Store or Play Store based on OS.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-500">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> iOS vs. Android split</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Browser user-agent analysis</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
                  <Calendar className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Peak Times & Hourly Trends</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Analyze hourly, daily, and weekly scan surges. Restaurants can see lunchtime vs. dinnertime menu scans; retail shops can measure weekend footfall spikes.
                </p>
                <ul className="space-y-2 text-xs font-medium text-slate-500">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Day-of-week engagement</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Campaign lifespan curves</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Frequently Asked Questions
              </h2>
              <p className="text-3xl font-serif font-bold text-slate-900">
                Common Questions on QR Tracking & Analytics
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-emerald-600 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-emerald-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Conversion CTA */}
          <section className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 tracking-tight">
                Unlock Complete Scan Intelligence Today
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                Stop flying blind on physical marketing campaigns. Generate trackable dynamic QR codes with live analytics in under 60 seconds.
              </p>
              <Link
                to="/generator?mode=dynamic"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-widest uppercase transition-all shadow-lg"
              >
                Create Trackable QR Code
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
