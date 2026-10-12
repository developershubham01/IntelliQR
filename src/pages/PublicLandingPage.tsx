import { useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  UtensilsCrossed, Hotel, ShoppingBag, Building2, Ticket, Dumbbell,
  Scissors, GraduationCap, Star, Globe, Phone, MapPin,
  CheckCircle2, Share2, Wifi, Download, Calendar,
  ShieldCheck, ArrowRight, MessageCircle, Loader2, Sparkles
} from "lucide-react";
import { toast } from "sonner";

export default function PublicLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [warrantySubmitted, setWarrantySubmitted] = useState(false);

  // Fetch landing page data via public tRPC query
  const { data: page, isLoading } = trpc.landing.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug, retry: 1 }
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: page?.title || "IntelliQR Page",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Page link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading IntelliQR Experience...</p>
      </div>
    );
  }

  // Fallback demo mock if accessing a sample demo slug or newly created page without DB record yet
  const content = (page?.content as Record<string, any>) || {};
  const industry = page?.industry || "restaurants";
  const title = page?.title || "Welcome to Our Business";
  const subtitle = page?.subtitle || "Scan & explore our digital touchpoint";

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start p-0 sm:p-4 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Mobile Shell Container */}
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[840px] sm:rounded-[36px] shadow-2xl sm:border sm:border-slate-200/80 overflow-hidden flex flex-col relative pb-10">
        
        {/* Top Header / Brand Bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              ⚡
            </div>
            <span className="text-xs font-bold text-slate-900 tracking-tight">
              IntelliQR <span className="text-indigo-600 font-semibold">• Live Pass</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative bg-slate-900 text-white px-6 pt-8 pb-10 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-44 h-44 rounded-full bg-rose-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            {page?.logoUrl ? (
              <img
                src={page.logoUrl}
                alt="Logo"
                className="w-16 h-16 rounded-2xl mx-auto mb-4 object-contain bg-white/10 p-1.5 border border-white/20 shadow-md"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4 text-white">
                {industry === "restaurants" && <UtensilsCrossed className="w-7 h-7" />}
                {industry === "hotels" && <Hotel className="w-7 h-7" />}
                {industry === "retail" && <ShoppingBag className="w-7 h-7" />}
                {industry === "real-estate" && <Building2 className="w-7 h-7" />}
                {industry === "events" && <Ticket className="w-7 h-7" />}
                {industry === "gyms" && <Dumbbell className="w-7 h-7" />}
                {industry === "salons" && <Scissors className="w-7 h-7" />}
                {industry === "education" && <GraduationCap className="w-7 h-7" />}
                {(!["restaurants", "hotels", "retail", "real-estate", "events", "gyms", "salons", "education"].includes(industry)) && (
                  <Sparkles className="w-7 h-7" />
                )}
              </div>
            )}

            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-indigo-300 mb-3 border border-white/10">
              {industry.replace("-", " ")}
            </span>

            <h1 className="text-2xl font-serif font-bold text-white tracking-tight leading-snug mb-2">
              {title}
            </h1>

            {subtitle && (
              <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xs mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Content Body based on Industry Vertical */}
        <div className="flex-1 px-5 py-6 space-y-6">

          {/* ================= A. RESTAURANTS & CAFES ================= */}
          {(industry === "restaurants" || industry === "restaurant_menu") && (
            <div className="space-y-6">
              {/* Table alert if present */}
              {content.tableNumber && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900 font-medium">
                  <span>Dining at <strong>{content.tableNumber}</strong></span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200/60">Table Active</span>
                </div>
              )}

              {/* Sample Digital Menu Showcase */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Dining Menu</h2>
                  <span className="text-[10px] text-indigo-600 font-bold">Touchless & Fresh</span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Truffle Burrata & Prosciutto", price: "$18.50", desc: "Creamy pugliese burrata, 24-month aged prosciutto di Parma, wild rocket, balsamic glaze", tag: "Chef Special" },
                    { name: "Woodfired Margherita DOC", price: "$16.00", desc: "San Marzano tomatoes, buffalo mozzarella, fresh sweet basil, extra virgin olive oil", tag: "Popular" },
                    { name: "Slow-Braised Short Rib Rigatoni", price: "$24.00", desc: "Red wine ragù, fresh handmade rigatoni, 36-month parmigiano-reggiano", tag: "Signature" },
                    { name: "Signature Tiramisu Classico", price: "$9.50", desc: "Savoiardi ladyfingers, espresso, mascarpone mousse, Valrhona dark cocoa", tag: "Dessert" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm text-slate-900 truncate">{item.name}</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{item.tag}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <span className="font-bold text-xs text-slate-900 shrink-0 font-mono mt-0.5">{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {content.phone && (
                  <a
                    href={`tel:${content.phone}`}
                    className="w-full py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call for Reservations / Orders
                  </a>
                )}
                {content.googleReview && (
                  <a
                    href={content.googleReview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Leave a 5-Star Google Review
                  </a>
                )}
              </div>
            </div>
          )}

          {/* ================= B. HOTELS & HOSPITALITY ================= */}
          {(industry === "hotels" || industry === "hotel_info") && (
            <div className="space-y-6">
              {content.roomNumber && (
                <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest block mb-1">Guest Room</span>
                  <div className="text-xl font-bold text-slate-900 font-serif">{content.roomNumber}</div>
                </div>
              )}

              {/* Wi-Fi Connection Card */}
              {content.wifiSsid && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-2">
                      <Wifi className="w-4 h-4 text-emerald-400" /> High-Speed Guest Wi-Fi
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Complimentary</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    Network: <strong className="text-white font-mono">{content.wifiSsid}</strong>
                  </div>
                  {content.wifiPassword && (
                    <div className="text-xs text-slate-300">
                      Password: <strong className="text-white font-mono">{content.wifiPassword}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Hospitality Directory */}
              <div className="space-y-2.5">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resort & Guest Services</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Room Service Dining", desc: "24/7 in-room menu", icon: UtensilsCrossed },
                    { label: "Spa & Wellness", desc: "Massages & facials", icon: Scissors },
                    { label: "Concierge Desk", desc: "Tours & transfers", icon: Hotel },
                    { label: "Housekeeping", desc: "Towels & amenities", icon: CheckCircle2 },
                  ].map((svc, i) => (
                    <div key={i} className="p-3 rounded-2xl border border-slate-200/70 bg-slate-50/50 flex flex-col justify-between">
                      <svc.icon className="w-4 h-4 text-indigo-600 mb-2" />
                      <div className="font-bold text-xs text-slate-900">{svc.label}</div>
                      <div className="text-[10px] text-slate-500">{svc.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {content.frontDeskPhone && (
                <a
                  href={`tel:${content.frontDeskPhone}`}
                  className="w-full py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Dial Front Desk / Concierge
                </a>
              )}
            </div>
          )}

          {/* ================= C. RETAIL & PACKAGING ================= */}
          {(industry === "retail" || industry === "product_catalog") && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Product Authenticity</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Genuine Product
                  </span>
                </div>
                {content.sku && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    SKU: <strong>{content.sku}</strong>
                  </div>
                )}
                {content.authenticityCode && (
                  <div className="text-[11px] text-slate-500 font-mono">
                    Security Code: <strong>{content.authenticityCode}</strong>
                  </div>
                )}
              </div>

              {/* Warranty Registration Section */}
              <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 space-y-3">
                <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  1-Year Manufacturer Warranty
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Register your device today to activate instant replacement coverage and software firmware alerts.
                </p>

                {warrantySubmitted ? (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Warranty successfully registered!
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setWarrantySubmitted(true);
                      toast.success("Warranty registration confirmed!");
                    }}
                    className="space-y-2 pt-1"
                  >
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                    >
                      Activate Warranty Now
                    </button>
                  </form>
                )}
              </div>

              {content.specsUrl && (
                <a
                  href={content.specsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Download Product User Manual (PDF)
                </a>
              )}
            </div>
          )}

          {/* ================= D. REAL ESTATE ================= */}
          {(industry === "real-estate" || industry === "real_estate") && (
            <div className="space-y-5">
              {content.price && (
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">Asking Price</span>
                    <span className="text-xl font-bold font-serif text-white">{content.price}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">Active Listing</span>
                </div>
              )}

              {content.location && (
                <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{content.location}</span>
                </div>
              )}

              {/* Agent Contact Card */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {content.agentName ? content.agentName.charAt(0) : "A"}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">{content.agentName || "Listing Agent"}</div>
                    <div className="text-[10px] text-slate-500">Certified Luxury Property Specialist</div>
                  </div>
                </div>

                {content.agentPhone && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <a
                      href={`tel:${content.agentPhone}`}
                      className="py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Agent
                    </a>
                    <a
                      href={`https://wa.me/${(content.agentPhone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I scanned the yard sign for ${title}. Is this property still available?`)}`}
                      className="py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {content.brochureUrl && (
                <a
                  href={content.brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> View Floor Plan & Brochure (PDF)
                </a>
              )}
            </div>
          )}

          {/* ================= E. EVENTS & BADGES ================= */}
          {(industry === "events" || industry === "event_ticket") && (
            <div className="space-y-5">
              {/* Ticket Validation Card */}
              <div className="p-5 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 text-center space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest">
                  ✓ Verified Authentic Ticket
                </span>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500">Attendee Name</div>
                  <div className="text-base font-bold text-slate-900">{content.attendeeName || "Guest Attendee"}</div>
                </div>

                {content.ticketCode && (
                  <div className="py-2 px-3 rounded-xl bg-white border border-slate-200 font-mono text-sm font-bold text-indigo-700 tracking-widest inline-block">
                    {content.ticketCode}
                  </div>
                )}

                {content.eventDate && (
                  <div className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {content.eventDate}
                  </div>
                )}
              </div>

              {content.venue && (
                <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{content.venue}</span>
                </div>
              )}

              <Link
                to={`/ticket/verify?code=${encodeURIComponent(content.ticketCode || "DEMO")}`}
                className="w-full py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Gate Scanner Check-In Portal
              </Link>
            </div>
          )}

          {/* ================= F. GYMS & FITNESS ================= */}
          {(industry === "gyms" || industry === "gym_membership") && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Digital Member Pass</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Active</span>
                </div>

                <div>
                  <div className="text-lg font-bold font-serif">{content.memberName || "Active Member"}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{content.memberId || "MBR-2026-FIT"}</div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-slate-400">Tier: <strong>{content.membershipTier || "VIP Access"}</strong></span>
                  <span className="text-emerald-400 font-bold">Valid Check-In</span>
                </div>
              </div>

              {content.scheduleUrl && (
                <a
                  href={content.scheduleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" /> View Daily Workout Class Timetable
                </a>
              )}
            </div>
          )}

          {/* ================= G. SALONS & SPAS ================= */}
          {(industry === "salons" || industry === "salon_services") && (
            <div className="space-y-5">
              <div className="space-y-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Featured Treatments & Styling</h2>
                <div className="space-y-2.5">
                  {[
                    { name: "Balayage & Gloss Finish", time: "120 mins", price: "$145" },
                    { name: "Signature Scalp Detox & Blowout", time: "60 mins", price: "$65" },
                    { name: "HydraFacial Glow Treatment", time: "45 mins", price: "$95" },
                    { name: "Deluxe Gel Manicure & Pedicure", time: "75 mins", price: "$80" },
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-900">{s.name}</div>
                        <div className="text-[10px] text-slate-400">{s.time}</div>
                      </div>
                      <span className="font-bold text-xs text-slate-900 font-mono">{s.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {content.whatsappBooking && (
                <a
                  href={`https://wa.me/${(content.whatsappBooking || "").replace(/\D/g, "")}?text=${encodeURIComponent("Hi! I would like to book an appointment.")}`}
                  className="w-full py-3 rounded-full bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Instant WhatsApp Booking
                </a>
              )}
            </div>
          )}

          {/* ================= H. EDUCATION & CAMPUSES ================= */}
          {(industry === "education" || industry === "student_id") && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Credentials</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">Enrolled</span>
                </div>
                <div>
                  <div className="font-bold text-base text-slate-900">{content.studentName || "Student Name"}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">ID: {content.rollNumber || "STU-2026-001"}</div>
                  {content.department && <div className="text-xs text-slate-600 mt-1">{content.department}</div>}
                </div>
              </div>

              {content.portalUrl && (
                <a
                  href={content.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <Globe className="w-3.5 h-3.5" /> Access Campus Portal & Course Syllabus
                </a>
              )}
            </div>
          )}

          {/* Fallback / General Destination Action */}
          {content.primaryUrl && (
            <div className="pt-2">
              <a
                href={content.primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                {content.ctaText || "Open Destination"} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Footer Brand Seal */}
        <div className="mt-auto px-6 pt-6 pb-4 border-t border-slate-100 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Powered by <span className="text-slate-900 font-black">IntelliQR</span> SaaS
          </Link>
        </div>

      </div>
    </div>
  );
}
