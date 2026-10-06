import { useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  RefreshCw,
  BarChart3,
  ChevronDown,
  Sparkles,
  Zap,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export default function DynamicQR() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is a dynamic QR code?",
      answer:
        "A dynamic QR code is an editable and trackable QR code that encodes a lightweight short redirect URL instead of a static raw destination. When scanned, IntelliQR routes the user through its cloud redirect engine to the designated URL, enabling creators to modify destination links anytime without reprinting physical materials, while collecting real-time scan analytics.",
    },
    {
      question: "Can I change the destination URL after printing a dynamic QR code?",
      answer:
        "Yes, 100%. The primary advantage of a dynamic QR code is instant editability. You can log into your IntelliQR dashboard, update the destination URL, and the change takes effect immediately worldwide without needing to modify or reprint any existing posters, packaging, or business cards.",
    },
    {
      question: "What metrics can I track with IntelliQR dynamic QR codes?",
      answer:
        "IntelliQR captures total scan counts, unique scanners, scan timestamps, geographic location (country/city), device operating system (iOS, Android, Windows, macOS), browser, and referrers—all in full compliance with GDPR and privacy standards.",
    },
    {
      question: "Do IntelliQR dynamic QR codes expire?",
      answer:
        "No. Dynamic QR codes created on IntelliQR remain active and functional indefinitely as long as your account is in good standing. You can also configure optional custom expiration dates if you are running time-limited marketing campaigns.",
    },
    {
      question: "What is the difference between a static QR code and a dynamic QR code?",
      answer:
        "A static QR code permanently hardcodes data directly into the pixel matrix; it cannot be modified once generated and provides zero scan tracking. A dynamic QR code routes through an editable short URL, permitting real-time URL updates, scan analytics, password protection, and campaign tracking.",
    },
    {
      question: "How do dynamic QR codes maintain faster scanning speeds?",
      answer:
        "Because dynamic QR codes only encode a short IntelliQR URL (such as intelli-qr.vercel.app/q/ABC123) rather than a complex 150-character query string, the pixel grid density is substantially lower. Lower dot density allows smartphone cameras to scan the code faster and from longer distances, even under low-light or angled conditions.",
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "IntelliQR Dynamic QR Code Generator",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Enterprise dynamic QR code generator that enables real-time destination editing, scan analytics, and vector exports.",
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground flex flex-col font-sans">
      <SEOHead
        title="Dynamic QR Code Generator – Track & Edit QR Codes Online"
        description="Create dynamic QR codes with editable destinations, real-time scan tracking, geolocation analytics, and vector SVG exports. Update links anytime without reprinting."
        canonicalUrl="https://intelli-qr.vercel.app/dynamic-qr-code"
        breadcrumbs={[{ name: "Dynamic QR Codes", url: "/dynamic-qr-code" }]}
        faqs={faqs}
        structuredData={structuredData}
      />

      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ name: "Dynamic QR Codes", url: "/dynamic-qr-code" }]} />

          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Editable • Trackable • Enterprise-Ready
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Dynamic QR Code Generator with Real-Time Edits & Analytics
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-10 font-normal">
              Change your QR code destination URL anytime without reprinting marketing collateral. 
              Track every scan with live geolocation, device breakdowns, and conversion metrics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/generator?mode=dynamic"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-950/15"
              >
                Create Dynamic QR Code
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/qr-code-analytics"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Explore QR Analytics
              </Link>
            </div>
          </section>

          {/* GEO / AEO Answer-First Definition Card */}
          <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm mb-16">
            <div className="border-l-4 border-indigo-600 pl-6 mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                Direct Definition (GEO / AI Summary)
              </h2>
              <p className="text-2xl font-serif font-bold text-slate-900">
                What is a Dynamic QR Code?
              </p>
            </div>
            <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-6">
              A <strong>dynamic QR code</strong> is a scannable barcode that points to a cloud-managed redirect URL rather than hardcoding raw destination content into the QR pattern. 
              Because the data is hosted dynamically by IntelliQR, administrators can edit the target landing page, toggle campaigns on or off, and capture comprehensive scanner telemetry—including time, device, and location—without altering the printed graphic.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Never Reprint Again</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Update links on posters, packaging, menus, and billboards on the fly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Precise Scan Attribution</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Monitor scan volumes, city-level demographics, and peak interaction times.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Faster Scannability</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Compact short links keep the QR pixel matrix sparse for rapid scanning.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Static vs Dynamic Comparison Table */}
          <section className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Feature Comparison
              </h2>
              <p className="text-3xl font-serif font-bold text-slate-900">
                Static QR Codes vs. Dynamic QR Codes
              </p>
            </div>

            <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75">
                    <th className="py-4 px-6 font-bold text-slate-700">Capabilities</th>
                    <th className="py-4 px-6 font-bold text-slate-500">Static QR Code</th>
                    <th className="py-4 px-6 font-bold text-indigo-700 bg-indigo-50/50">
                      IntelliQR Dynamic QR Code
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Edit Destination After Printing</td>
                    <td className="py-4 px-6 text-rose-600 font-medium">No (Impossible)</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold bg-indigo-50/30">
                      Yes (Instant via Dashboard)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Real-Time Scan Tracking</td>
                    <td className="py-4 px-6 text-rose-600 font-medium">No (Zero Data)</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold bg-indigo-50/30">
                      Yes (Full Geo & Device Telemetry)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">QR Density & Scannability</td>
                    <td className="py-4 px-6 text-slate-600">High density for long URLs</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold bg-indigo-50/30">
                      Low density short links (Rapid Scan)
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Campaign Expiration Scheduling</td>
                    <td className="py-4 px-6 text-slate-600">Permanent only</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold bg-indigo-50/30">
                      Supported with Custom Fallbacks
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">A/B URL Testing & Routing</td>
                    <td className="py-4 px-6 text-rose-600 font-medium">Not Supported</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold bg-indigo-50/30">
                      Supported
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-slate-900">Reprinting Cost Risk</td>
                    <td className="py-4 px-6 text-rose-600 font-medium">High (Reprint on URL typo)</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold bg-indigo-50/30">
                      Zero Risk (Fix typos in seconds)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* How It Works: 3 Steps */}
          <section className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Workflow
              </h2>
              <p className="text-3xl font-serif font-bold text-slate-900">
                How Dynamic QR Codes Work in 3 Steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm mb-6">
                  01
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Generate & Customize</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Enter your initial destination URL. Customize dot patterns, eye styles, brand colors, and add your brand logo. IntelliQR assigns a short permanent redirect code.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm mb-6">
                  02
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Print & Distribute</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Export vector SVG or high-resolution PNG formats. Place the QR code across packaging, menus, marketing flyers, business cards, or billboard banners.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-6">
                  03
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Edit & Track in Real Time</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  When promotions change or campaigns evolve, modify the destination link in one click. Watch live scans, geographic attribution, and conversion counts populate your dashboard.
                </p>
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
                Everything You Need to Know About Dynamic QR Codes
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
                      className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-indigo-600" : ""
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

          {/* Bottom Conversion CTA */}
          <section className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 tracking-tight">
                Ready to Upgrade to Dynamic QR Codes?
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                Start generating trackable, fully editable QR codes in seconds. Never worry about broken links or reprint expenses again.
              </p>
              <Link
                to="/generator?mode=dynamic"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs tracking-widest uppercase transition-all shadow-lg"
              >
                Create Your First Dynamic QR Code
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
