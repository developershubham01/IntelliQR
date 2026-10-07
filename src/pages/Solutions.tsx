import { useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  ShoppingBag,
  Building2,
  CalendarCheck,
  Stethoscope,
  Hotel,
  Scissors,
  Dumbbell,
  GraduationCap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface IndustryMetadata {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  icon: any;
  overview: string;
  problemsSolved: string[];
  recommendedTypes: Array<{ name: string; url: string; reason: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

const INDUSTRY_DATA: Record<string, IndustryMetadata> = {
  restaurants: {
    slug: "restaurants",
    name: "Restaurants & Cafes",
    h1: "QR Code Solutions for Restaurants, Cafes & Bars",
    metaTitle: "QR Code Generator for Restaurants – Menus, Reviews & Table Ordering | IntelliQR",
    metaDescription: "Boost table turnaround and cut printing costs with touchless restaurant menu QR codes, Google review stands, and dynamic promotional table tents.",
    icon: UtensilsCrossed,
    overview:
      "Restaurants use IntelliQR dynamic QR codes to power contactless digital dining menus, collect instant Google 5-star reviews at checkout, and direct customers to table ordering or loyalty signup pages without ever reprinting paper menus when prices or seasonal dishes change.",
    problemsSolved: [
      "Eliminates thousands in recurring menu reprinting costs due to inflation or seasonal menu updates",
      "Accelerates table turnaround during peak lunch and dinner rush hours",
      "Increases Google Maps reviews by 300% with checkout bill QR codes",
      "Promotes daily chef specials and happy hour discounts in real time",
    ],
    recommendedTypes: [
      { name: "Digital Menu QR", url: "/qr-code-types/menu", reason: "Direct table menu view with zero app installation" },
      { name: "Google Review QR", url: "/qr-code-types/google-maps", reason: "Direct link to leave 5-star Google reviews on receipts" },
      { name: "Guest WiFi QR", url: "/qr-code-types/wifi", reason: "Passwordless dining guest network connection" },
    ],
    faqs: [
      {
        question: "Can I update food prices on the QR code without reprinting table stickers?",
        answer: "Yes. With IntelliQR dynamic QR codes, you update your menu destination link in the dashboard and every table QR code updates instantly.",
      },
      {
        question: "Do customers need to download an app to view the menu?",
        answer: "No. Standard smartphone cameras open the digital menu directly in their browser.",
      },
    ],
  },
  retail: {
    slug: "retail",
    name: "Retail & E-commerce",
    h1: "Smart Packaging & In-Store QR Code Solutions for Retail",
    metaTitle: "QR Codes for Retail & Packaging – Boost In-Store Engagement | IntelliQR",
    metaDescription: "Bridge physical merchandise with digital commerce. Use QR codes on product packaging, apparel tags, and retail shelves for warranties, reviews, and reorders.",
    icon: ShoppingBag,
    overview:
      "Retail brands use IntelliQR to turn physical products and in-store displays into interactive shopping experiences. From warranty registration and sustainability origin stories to instant re-orders, QR codes connect the physical shelf directly to digital loyalty.",
    problemsSolved: [
      "Bridges the gap between brick-and-mortar foot traffic and digital customer retention",
      "Simplifies product warranty registration and authenticity verification",
      "Reduces packaging clutter by hosting instruction manuals and ingredient lists digitally",
      "Drives repeat purchases via discount codes on delivery boxes and shopping bags",
    ],
    recommendedTypes: [
      { name: "Dynamic URL QR", url: "/dynamic-qr-code", reason: "Editable product landing pages and discount codes" },
      { name: "PDF Document QR", url: "/qr-code-types/pdf", reason: "User manuals, sizing charts, and certificates" },
      { name: "Social Media QR", url: "/qr-code-types/social-media", reason: "Follow brand accounts on Instagram and TikTok" },
    ],
    faqs: [
      {
        question: "Can I track which store location generated the most product scans?",
        answer: "Yes. Generate unique dynamic QR codes for each retail store or display fixture to compare location performance in IntelliQR analytics.",
      },
    ],
  },
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    h1: "QR Codes for Real Estate Agents, Yard Signs & Open Houses",
    metaTitle: "Real Estate QR Code Generator – Property Signs & Virtual Tours | IntelliQR",
    metaDescription: "Convert drive-by yard sign interest into active buyer inquiries. Share virtual video tours, digital floor plans, and agent contact vCards instantly.",
    icon: Building2,
    overview:
      "Real estate agencies deploy dynamic QR codes on yard signs, window displays, and property flyers. Prospective buyers scan to instantly view 3D virtual walkthroughs, price sheets, and save the listing agent's vCard contact directly to their phone.",
    problemsSolved: [
      "Eliminates outdated print flyers that run out in outdoor flyer boxes",
      "Captures immediate buyer interest from drive-by traffic 24 hours a day",
      "Enables instant destination redirection when a property status changes from 'Active' to 'Under Contract'",
      "Transfers complete realtor contact information to client address books with one tap",
    ],
    recommendedTypes: [
      { name: "vCard QR Code", url: "/qr-code-types/vcard", reason: "Save listing agent contact details instantly" },
      { name: "Dynamic URL QR", url: "/dynamic-qr-code", reason: "Direct link to 3D virtual tour or MLS listing" },
      { name: "WhatsApp QR", url: "/qr-code-types/whatsapp", reason: "Direct chat inquiry: 'Is this property still available?'" },
    ],
    faqs: [
      {
        question: "Can I reuse the same metal yard sign QR code for a new listing?",
        answer: "Yes! Because it is a dynamic QR code, when a house sells you simply point the QR code URL to your next property listing without buying new signage.",
      },
    ],
  },
  events: {
    slug: "events",
    name: "Events & Conferences",
    h1: "Event Ticketing, Badges & Conference Schedule QR Codes",
    metaTitle: "QR Codes for Events & Conferences – Badges, Schedules & RSVP | IntelliQR",
    metaDescription: "Streamline event check-ins, networking, and live agenda sharing with dynamic QR codes on conference badges, banners, and digital invitations.",
    icon: CalendarCheck,
    overview:
      "Event organizers use IntelliQR to accelerate attendee badge check-in, share real-time conference agendas, and facilitate seamless attendee networking. Speaker presentations and feedback surveys are accessible in one camera scan.",
    problemsSolved: [
      "Eliminates printed paper agendas that become obsolete when speaker schedules shift",
      "Speeds up registration queues and badge printing bottlenecks",
      "Enables interactive live polling, slide deck downloads, and session feedback",
      "Allows exhibitors to capture booth visitor leads effortlessly",
    ],
    recommendedTypes: [
      { name: "Event Calendar QR", url: "/qr-code-types/vcard", reason: "Add session timing directly to Apple or Google Calendar" },
      { name: "PDF Deck QR", url: "/qr-code-types/pdf", reason: "Download speaker slides and whitepapers" },
      { name: "Feedback Form QR", url: "/dynamic-qr-code", reason: "Collect real-time attendee session ratings" },
    ],
    faqs: [
      {
        question: "Can speaker slide links be updated during the event?",
        answer: "Yes, update the dynamic link instantly from the organizer dashboard without changing badge codes.",
      },
    ],
  },
  healthcare: {
    slug: "healthcare",
    name: "Healthcare & Clinics",
    h1: "Contactless Patient Check-In & Medical Info QR Codes",
    metaTitle: "Healthcare QR Codes – Patient Check-In & Clinic Information | IntelliQR",
    metaDescription: "Improve clinical workflows with touchless patient intake forms, prescription guidelines, and clinic location guidance. Secure and privacy-focused.",
    icon: Stethoscope,
    overview:
      "Medical practices, dental clinics, and diagnostic centers use IntelliQR to offer contactless patient intake, digital appointment bookings, and scannable medication administration instructions.",
    problemsSolved: [
      "Minimizes paper clipboard handling in waiting rooms for infection control",
      "Directs patients to pre-visit medical intake questionnaires before arrival",
      "Provides accessible video or PDF guides on post-operative recovery care",
      "Facilitates easy clinic location navigation and appointment re-scheduling",
    ],
    recommendedTypes: [
      { name: "Patient Intake QR", url: "/dynamic-qr-code", reason: "Touchless digital check-in form" },
      { name: "Clinic Directions QR", url: "/qr-code-types/google-maps", reason: "Accurate GPS navigation to hospital entrance" },
      { name: "vCard Contact QR", url: "/qr-code-types/vcard", reason: "Doctor and after-hours emergency phone contacts" },
    ],
    faqs: [
      {
        question: "Is patient medical data stored in the QR code?",
        answer: "No. The QR code securely routes patients to your HIPAA/GDPR-compliant portal or intake form hosted on your private clinical systems.",
      },
    ],
  },
  hotels: {
    slug: "hotels",
    name: "Hotels & Hospitality",
    h1: "QR Codes for Hotels, Resorts & Guest Hospitality",
    metaTitle: "Hotel QR Code Solutions – Guest WiFi, Concierge & Room Service | IntelliQR",
    metaDescription: "Elevate guest experience and streamline operations with digital room service menus, passwordless guest WiFi, in-room concierge guides, and instant check-in QR codes.",
    icon: Hotel,
    overview:
      "Luxury resorts, boutique hotels, and vacation rentals deploy IntelliQR codes to provide instant room-service ordering, passwordless high-speed guest WiFi, interactive resort maps, and seamless front desk check-in without paper directory binders.",
    problemsSolved: [
      "Eliminates expensive leather directory binders that need printing every season",
      "Connects guests to WiFi in 2 seconds without typing 16-character passwords",
      "Increases in-room dining and spa service booking revenue",
      "Collects TripAdvisor and Google reviews before guest check-out",
    ],
    recommendedTypes: [
      { name: "Guest WiFi QR", url: "/qr-code-types/wifi", reason: "Automatic secure guest network connection" },
      { name: "Room Service Menu QR", url: "/qr-code-types/menu", reason: "Browse dining menu and place room service orders" },
      { name: "Concierge Guide PDF", url: "/qr-code-types/pdf", reason: "Download local city guide and amenities booklet" },
    ],
    faqs: [
      {
        question: "Can we track which room scanned the room service QR code?",
        answer: "Yes, by generating unique room-numbered dynamic QR codes for each guest room or villa.",
      },
    ],
  },
  education: {
    slug: "education",
    name: "Education & Universities",
    h1: "QR Code Solutions for Schools, Universities & Campuses",
    metaTitle: "Education QR Code Solutions – Campus Maps, Syllabi & Attendance | IntelliQR",
    metaDescription: "Empower students and faculty with dynamic QR codes for course syllabi, campus navigation, library catalog lookup, student attendance, and digital event RSVP.",
    icon: GraduationCap,
    overview:
      "Colleges, schools, and educational institutions use IntelliQR to modernise campus communication. Dynamic QR codes on lecture hall doors, lab equipment, and notice boards provide direct access to syllabus downloads, lab safety manuals, and classroom check-ins.",
    problemsSolved: [
      "Replaces massive paper syllabus printouts with trackable digital documents",
      "Guides new freshmen across large campus facilities with Google Maps GPS routing",
      "Provides instant equipment safety videos in chemistry and engineering labs",
      "Simplifies event registrations and university career fair lead sharing",
    ],
    recommendedTypes: [
      { name: "PDF Syllabus QR", url: "/qr-code-types/pdf", reason: "Instant course syllabus and textbook reading lists" },
      { name: "Campus Map QR", url: "/qr-code-types/google-maps", reason: "Turn-by-turn navigation across university grounds" },
      { name: "vCard Faculty QR", url: "/qr-code-types/vcard", reason: "Professor office hours and contact info" },
    ],
    faqs: [
      {
        question: "Can instructors update course materials during the semester?",
        answer: "Yes, using dynamic QR codes, instructors can point the code to updated reading lists without replacing printed classroom placards.",
      },
    ],
  },
  salons: {
    slug: "salons",
    name: "Salons & Spas",
    h1: "QR Codes for Hair Salons, Spas & Beauty Parlors",
    metaTitle: "Salon & Spa QR Codes – Service Menus, Booking & Reviews | IntelliQR",
    metaDescription: "Streamline salon operations with digital treatment menus, direct WhatsApp appointment booking, Instagram lookbook showcases, and checkout Google review stands.",
    icon: Scissors,
    overview:
      "Beauty salons, barbershops, and wellness spas use IntelliQR to display touchless treatment price lists, drive appointments directly into WhatsApp or booking software, and turn satisfied clients into 5-star Google and Instagram reviews.",
    problemsSolved: [
      "Allows instant seasonal price updates for hair and beauty services",
      "Increases appointment bookings via direct WhatsApp click-to-chat codes",
      "Drives Instagram followers with mirror stickers showcasing before-and-after portfolios",
      "Automates review requests at the reception payment counter",
    ],
    recommendedTypes: [
      { name: "Service Menu QR", url: "/qr-code-types/menu", reason: "View hair, nail, and massage pricing" },
      { name: "WhatsApp Booking QR", url: "/qr-code-types/whatsapp", reason: "Direct chat: 'Book my next haircut appointment'" },
      { name: "Instagram Lookbook QR", url: "/qr-code-types/social-media", reason: "Follow stylist work and client transformations" },
    ],
    faqs: [
      {
        question: "Can we put QR codes on mirrors and stations?",
        answer: "Yes, waterproof mirror decals with IntelliQR codes let clients browse services or leave reviews while being pampered.",
      },
    ],
  },
  gyms: {
    slug: "gyms",
    name: "Gyms & Fitness Centers",
    h1: "QR Codes for Gyms, Crossfit Boxes & Personal Trainers",
    metaTitle: "Gym & Fitness QR Codes – Equipment Tutorials, Membership & Schedules | IntelliQR",
    metaDescription: "Enhance member workouts with exercise machine video tutorials, class timetable schedules, personal trainer vCards, and digital guest pass sign-ups.",
    icon: Dumbbell,
    overview:
      "Health clubs, CrossFit boxes, and boutique fitness studios place IntelliQR codes on workout machines and reception desks to stream exercise form video tutorials, display daily class schedules, and drive membership renewals.",
    problemsSolved: [
      "Prevents member injury by linking exercise machines directly to form video guides",
      "Keeps class schedules updated in real time without paper calendar reprints",
      "Enables contactless guest waivers and drop-in day pass payments",
      "Allows personal trainers to share contact cards and client intake forms instantly",
    ],
    recommendedTypes: [
      { name: "Video Tutorial QR", url: "/dynamic-qr-code", reason: "How to properly use weight machines" },
      { name: "Class Schedule PDF", url: "/qr-code-types/pdf", reason: "Weekly spin, yoga, and HIIT schedule" },
      { name: "Trainer vCard QR", url: "/qr-code-types/vcard", reason: "Save trainer phone and fitness consultation link" },
    ],
    faqs: [
      {
        question: "Can the QR codes withstand sweat and gym equipment cleaning?",
        answer: "IntelliQR generates high-res vector files that can be printed on durable vinyl or metal machine decals.",
      },
    ],
  },
  "marketing-agencies": {
    slug: "marketing-agencies",
    name: "Marketing Agencies",
    h1: "Enterprise QR Solutions for Marketing & Advertising Agencies",
    metaTitle: "QR Code Platform for Marketing Agencies – Campaign Tracking & White-Label | IntelliQR",
    metaDescription: "Deliver measurable offline-to-online ROI for client campaigns. Manage hundreds of dynamic QR codes with folder organization, team seats, and analytics.",
    icon: BarChart3,
    overview:
      "Advertising and growth agencies use IntelliQR to run multi-client print and billboard campaigns with complete tracking attribution. Measure exact scan spikes, test alternative landing page URLs, and export executive analytics reports.",
    problemsSolved: [
      "Proves print and outdoor advertising ROI with hard scan attribution numbers",
      "Enables rapid A/B testing of marketing landing pages without reprinting",
      "Centralizes client campaigns in dedicated folders with granular permissions",
      "Integrates with client analytics suites via UTM parameters and REST APIs",
    ],
    recommendedTypes: [
      { name: "Dynamic Campaign QR", url: "/dynamic-qr-code", reason: "A/B testable promotional links" },
      { name: "QR Analytics Engine", url: "/qr-code-analytics", reason: "Client reporting with geo and time metrics" },
      { name: "Developer API", url: "/api-docs", reason: "Programmatic bulk code creation for client apps" },
    ],
    faqs: [
      {
        question: "Can agencies generate QR codes programmatically via API?",
        answer: "Yes, IntelliQR provides developer-grade REST APIs to generate and update thousands of QR codes via code.",
      },
    ],
  },
};

export default function Solutions() {
  const { industrySlug } = useParams<{ industrySlug?: string }>();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const activeIndustry = industrySlug ? INDUSTRY_DATA[industrySlug] : null;

  if (activeIndustry) {
    const Icon = activeIndustry.icon;
    return (
      <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
        <SEOHead
          title={activeIndustry.metaTitle}
          description={activeIndustry.metaDescription}
          canonicalUrl={`https://intelli-qr.vercel.app/solutions/${activeIndustry.slug}`}
          breadcrumbs={[
            { name: "Industry Solutions", url: "/solutions" },
            { name: activeIndustry.name, url: `/solutions/${activeIndustry.slug}` },
          ]}
          faqs={activeIndustry.faqs}
        />

        <Header />

        {/* Hero Section matching Home Page */}
        <section className="sarvam-gradient pt-36 sm:pt-40 lg:pt-44 pb-20 border-b border-border overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="flex justify-start max-w-4xl mx-auto mb-4">
              <Breadcrumbs
                items={[
                  { name: "Industry Solutions", url: "/solutions" },
                  { name: activeIndustry.name, url: `/solutions/${activeIndustry.slug}` },
                ]}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
                <Icon className="w-3.5 h-3.5 text-orange-600" />
                Specialized Solution for {activeIndustry.name}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
                {activeIndustry.h1}
              </h1>

              <p className="text-base sm:text-xl text-slate-700/80 leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
                {activeIndustry.metaDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/generator?mode=dynamic"
                  className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2 shadow-sm"
                >
                  Create {activeIndustry.name} QR Code
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/qr-code-analytics"
                  className="btn-secondary text-base px-8 py-3.5 flex items-center justify-center gap-2"
                >
                  View Scan Analytics
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="flex-1 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* GEO Overview */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-16">
              <div className="border-l-4 border-indigo-600 pl-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                  Industry Overview (GEO Summary)
                </h2>
                <p className="text-2xl font-serif font-bold text-slate-900">
                  How {activeIndustry.name} Uses IntelliQR
                </p>
              </div>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-8">
                {activeIndustry.overview}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                {activeIndustry.problemsSolved.map((prob, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">{prob}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended QR Types */}
            <section className="mb-16">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Best Practices
                </h2>
                <p className="text-3xl font-serif font-bold text-slate-900">
                  Recommended QR Code Types for {activeIndustry.name}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {activeIndustry.recommendedTypes.map((rec, idx) => (
                  <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{rec.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed mb-6">{rec.reason}</p>
                    </div>
                    <Link
                      to={rec.url}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                    >
                      Explore Type <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="max-w-4xl mx-auto mb-20">
              <div className="text-center mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-2xl font-serif font-bold text-slate-900">
                  {activeIndustry.name} FAQs
                </p>
              </div>

              <div className="space-y-4">
                {activeIndustry.faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
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
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Directory view: /solutions
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <SEOHead
        title="Industry QR Code Solutions – Retail, Restaurants, Real Estate & Events"
        description="Discover how businesses in hospitality, retail, real estate, healthcare, and events leverage IntelliQR to boost engagement and customer lifetime value."
        canonicalUrl="https://intelli-qr.vercel.app/solutions"
        breadcrumbs={[{ name: "Industry Solutions", url: "/solutions" }]}
      />

      <Header />

      {/* Hero Section matching Home Page */}
      <section className="sarvam-gradient pt-36 sm:pt-40 lg:pt-44 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-start max-w-4xl mx-auto mb-4">
            <Breadcrumbs items={[{ name: "Industry Solutions", url: "/solutions" }]} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Cross-Industry Workflows
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Tailored QR Code Solutions <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600">
                for Every Industry
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-700/80 leading-relaxed max-w-2xl mx-auto font-medium">
              Explore purpose-built workflows, proven use cases, and recommended QR formats designed specifically for your industry vertical.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {Object.values(INDUSTRY_DATA).map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.slug}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">
                      {ind.name}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                      {ind.overview}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Link
                      to={`/solutions/${ind.slug}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                    >
                      View Solutions <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/generator?mode=dynamic"
                      className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Start Free
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
