import { Link } from "react-router";
import { QrCode, Linkedin, Instagram, Youtube, Facebook, Mail } from "lucide-react";
import { useState, useEffect } from "react";

function XIcon({ className = "w-[18px] h-[18px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerLinks = {
  PRODUCTS: [
    { label: "QR Generator", href: "/generator" },
    { label: "Dynamic QR Codes", href: "/dynamic-qr-code" },
    { label: "QR Analytics & Tracking", href: "/qr-code-analytics" },
    { label: "Design Templates", href: "/templates" },
    { label: "Platform Features", href: "/features" },
    { label: "Blog & Knowledge Hub", href: "/blog" },
  ],
  "QR TYPES": [
    { label: "WiFi QR Code", href: "/qr-code-types/wifi" },
    { label: "WhatsApp QR", href: "/qr-code-types/whatsapp" },
    { label: "vCard Business Card", href: "/qr-code-types/vcard" },
    { label: "PDF Document QR", href: "/qr-code-types/pdf" },
    { label: "URL & Website QR", href: "/qr-code-types/url" },
    { label: "App Download QR", href: "/qr-code-types/app-store" },
    { label: "Payment & UPI QR", href: "/qr-code-types/payment" },
    { label: "Google Maps Location", href: "/qr-code-types/google-maps" },
    { label: "Digital Menu QR", href: "/qr-code-types/menu" },
    { label: "All 25+ QR Formats", href: "/qr-code-types" },
  ],
  SOLUTIONS: [
    { label: "Restaurants & Cafes", href: "/solutions/restaurants" },
    { label: "Hotels & Hospitality", href: "/solutions/hotels" },
    { label: "Retail & Packaging", href: "/solutions/retail" },
    { label: "Real Estate Listings", href: "/solutions/real-estate" },
    { label: "Events & Badges", href: "/solutions/events" },
    { label: "Gyms & Fitness", href: "/solutions/gyms" },
    { label: "Salons & Spas", href: "/solutions/salons" },
    { label: "Education & Campuses", href: "/solutions/education" },
    { label: "All Industry Solutions", href: "/solutions" },
  ],
  DEVELOPERS: [
    { label: "REST API Docs", href: "/api-docs" },
    { label: "Developer Portal", href: "/developers" },
    { label: "Pricing & Plans", href: "/pricing" },
    { label: "Frequently Asked Questions", href: "/faq" },
    { label: "Contact Sales", href: "/contact" },
  ],
  COMPANY: [
    { label: "About Us", href: "/about" },
    { label: "Knowledge Hub / Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const themeImages = [
  "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=2000", // Green Tea Garden / India Landscape
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000", // Majestic Valley / Nature
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000", // Cyber/Tech Grid
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000", // Deep Purple Mesh Gradient
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000"  // Global Data / Network Sphere
];

export default function Footer() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % themeImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="relative z-10 border-t border-border bg-[#FCFCFC] mt-auto pt-16 pb-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12 pb-16">
          {/* Brand & Left Info */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <Link 
                to="/" 
                className="flex items-center gap-2 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md inline-flex"
                aria-label="IntelliQR Home"
              >
                <div className="w-8 h-8 rounded-md bg-slate-900 flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-serif text-slate-900 tracking-tight font-bold">
                  IntelliQR
                </span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xs font-medium">
                Intelligent QR for developers. Built for the intelligence age.
              </p>

             
    </div>

            {/* Socials & Address */}
            <div className="space-y-6">
              <div className="flex items-center gap-3.5 text-slate-400">
                <a 
                  href="https://in.linkedin.com/company/abwcurious?trk=public_post_feed-actor-name" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="LinkedIn"
                  className="hover:text-slate-900 transition-colors"
                >
                  <Linkedin className="w-[18px] h-[18px]" />
                </a>
                <a 
                  href="https://x.com/abwcurious?t=Y6CfDuM_ljg1gNvd7ByVQA&s=09" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="X"
                  className="hover:text-slate-900 transition-colors"
                >
                  <XIcon className="w-[17px] h-[17px]" />
                </a>
                <a 
                  href="http://instagram.com/abwcurious?igsh=b2o3eGxxbGtlM2pu" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  className="hover:text-slate-900 transition-colors"
                >
                  <Instagram className="w-[18px] h-[18px]" />
                </a>
                <a 
                  href="https://www.youtube.com/@ABWcurious" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="YouTube"
                  className="hover:text-slate-900 transition-colors"
                >
                  <Youtube className="w-[18px] h-[18px]" />
                </a>
                <a 
                  href="https://www.facebook.com/share/1aTRdmi65g/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className="hover:text-slate-900 transition-colors"
                >
                  <Facebook className="w-[18px] h-[18px]" />
                </a>
                <a 
                  href="mailto:info@abwcurious.com" 
                  aria-label="Email"
                  className="hover:text-slate-900 transition-colors"
                >
                  <Mail className="w-[18px] h-[18px]" />
                </a>
              </div>

              <div className="text-[13px] text-slate-400 leading-relaxed font-medium">
                <p>
                  Product of{" "}
                  <a
                    href="https://www.abwcurious.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-slate-900 underline underline-offset-4 decoration-slate-300 hover:decoration-slate-900 transition-colors font-semibold"
                  >
                    abwcurious
                  </a>
                </p>
                <p className="mt-1">&copy; {new Date().getFullYear()} IntelliQR Labs Inc.</p>
                <p className="mt-0.5 text-slate-300">Navi Mumbai &bull; Maharashtra, India</p>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-5 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <nav key={category} aria-label={`${category} links`} className="flex flex-col">
                <h3 className="text-slate-400 font-bold text-[11px] tracking-widest uppercase mb-6">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-slate-500 hover:text-slate-900 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Huge Giant Background Clipped Text - Full Width & Responsive */}
      <div className="w-full overflow-hidden flex justify-center items-center select-none pointer-events-none px-4 sm:px-6 pt-6 pb-8 border-t border-slate-100/60">
        <div 
          className="text-center font-black tracking-tighter uppercase whitespace-nowrap text-transparent bg-clip-text bg-cover bg-center transition-all duration-700 ease-in-out select-none"
          style={{
            fontSize: "clamp(2.5rem, 10.5vw, 13.5rem)",
            fontWeight: 900,
            lineHeight: "1.05",
            backgroundImage: `url('${themeImages[currentImageIndex]}')`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          INTELLIQR
        </div>
      </div>
    </footer>
  );
}
