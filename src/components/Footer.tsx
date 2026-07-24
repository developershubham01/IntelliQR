import { Link } from "react-router";
import { QrCode, Github, Linkedin, Twitter, Mail } from "lucide-react";
import { useState, useEffect } from "react";

const footerLinks = {
  PRODUCTS: [
    { label: "QR Generator", href: "/generator" },
    { label: "Dynamic Links", href: "/generator" },
    { label: "Bulk Creation", href: "/generator" },
    { label: "Custom Domain", href: "/generator" },
  ],
  APIs: [
    { label: "QR Generation", href: "/api-docs" },
    { label: "Analytics API", href: "/api-docs" },
    { label: "Redirection API", href: "/api-docs" },
  ],
  RESOURCES: [
    { label: "Documentation", href: "/api-docs" },
    { label: "Guides & Tutorials", href: "/features" },
    { label: "FAQ", href: "/faq" },
  ],
  COMPANY: [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
  ],
  LEGAL: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ]
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
              <div className="flex items-center gap-4 text-slate-400">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                  <Github className="w-[18px] h-[18px]" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                  <Linkedin className="w-[18px] h-[18px]" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition-colors">
                  <Twitter className="w-[18px] h-[18px]" />
                </a>
                <a href="mailto:hello@intelliqr.pro" className="hover:text-slate-900 transition-colors">
                  <Mail className="w-[18px] h-[18px]" />
                </a>
              </div>

              <div className="text-[13px] text-slate-400 leading-relaxed font-medium">
                <p>&copy; {new Date().getFullYear()} IntelliQR Labs Inc.</p>
                <p className="mt-1 text-slate-300">Navi Mumbai &bull; Maharashtra, India</p>
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

        {/* Huge Giant Background Clipped Text */}
        <div 
          className="text-center font-black tracking-tighter select-none mt-4 text-transparent bg-clip-text bg-cover bg-center pointer-events-none select-none transition-all duration-700 ease-in-out"
          style={{
            fontSize: "14.5vw",
            fontWeight: 900,
            lineHeight: "0.8",
            backgroundImage: `url('${themeImages[currentImageIndex]}')`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transform: "translateY(1.5vw)",
          }}
        >
          INTELLIQR
        </div>
      </div>
    </footer>
  );
}
