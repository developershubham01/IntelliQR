import { motion } from "framer-motion";
import { Link } from "react-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  QrCode, Palette, Download, Zap, Shield, BarChart3,
  Globe, Clock, Heart, Sparkles, Layers, Lock,
  Smartphone, Printer, Copy, Image, FileText, FileCode,
} from "lucide-react";

const allFeatures = [
  {
    icon: QrCode,
    title: "25+ QR Code Types",
    description: "Support for Website URL, Text, Email, Phone, SMS, WhatsApp, WiFi, vCard, Google Maps, PDF, Image, Video, Instagram, Facebook, LinkedIn, YouTube, Twitter/X, Telegram, Spotify, PayPal, UPI Payment, App Store, Play Store, Event, and Calendar.",
    color: "#00F0FF",
  },
  {
    icon: Palette,
    title: "Advanced Customization",
    description: "Full control over foreground color, background color, gradients (linear & radial), dot styles (square, rounded, dots, classy, smooth), eye styles (square, circle, ring), and corner radius.",
    color: "#D0FF59",
  },
  {
    icon: Image,
    title: "Logo Embedding",
    description: "Upload your brand logo to be centered in the QR code. Automatically adjusts for optimal scannability with high error correction.",
    color: "#FF2BD6",
  },
  {
    icon: Download,
    title: "Multi-Format Export",
    description: "Export as PNG, SVG, JPG, WEBP, or PDF. Sizes from 256px to 2048px. Copy to clipboard, print directly, or download for any use case.",
    color: "#FFD600",
  },
  {
    icon: Shield,
    title: "4 Error Correction Levels",
    description: "Choose from Low (7%), Medium (15%), Quartile (25%), or High (30%) error correction. Higher levels allow logo embedding and still scan even when damaged.",
    color: "#00F0FF",
  },
  {
    icon: Zap,
    title: "Real-Time Preview",
    description: "See your QR code update instantly as you type and customize. No waiting, no refresh — just immediate visual feedback.",
    color: "#D0FF59",
  },
  {
    icon: Clock,
    title: "Generation History",
    description: "All generated QR codes are saved to your history. Access, reuse, duplicate, or modify them anytime without starting over.",
    color: "#FF2BD6",
  },
  {
    icon: Heart,
    title: "Favorites",
    description: "Mark frequently used QR codes as favorites for quick access. Filter your history to show only favorited items.",
    color: "#FFD600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track total generated QR codes, download counts, and favorite counts. Visual stats to understand your usage patterns.",
    color: "#00F0FF",
  },
  {
    icon: Layers,
    title: "Frame & Labels",
    description: "Add decorative frames around your QR code with custom text like 'SCAN ME' or your brand message.",
    color: "#D0FF59",
  },
  {
    icon: Lock,
    title: "Transparent Background",
    description: "Generate QR codes with transparent backgrounds for seamless integration into any design or background.",
    color: "#FF2BD6",
  },
  {
    icon: Sparkles,
    title: "Design Presets",
    description: "4 built-in presets — Minimal Dark, Neon Cyan, Tactical Grid, and Candy Pop. Apply a complete style in one click.",
    color: "#FFD600",
  },
];

const techSpecs = [
  { icon: Globe, label: "Web-Based", desc: "No installation required" },
  { icon: Smartphone, label: "Mobile Responsive", desc: "Works on all devices" },
  { icon: Printer, label: "Print Ready", desc: "High-res PDF exports" },
  { icon: Copy, label: "One-Click Copy", desc: "Copy to clipboard instantly" },
  { icon: FileCode, label: "SVG Export", desc: "Scalable vector graphics" },
  { icon: FileText, label: "PDF Export", desc: "Print-quality documents" },
];

export default function Features() {
  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <Header />

      {/* Hero Section */}
      <section className="sarvam-gradient pt-32 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              Powerful Features
            </h1>
            <p className="text-slate-700/80 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Everything you need to create stunning, professional QR codes for any purpose. Built for the modern developer.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {allFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex flex-col bg-white border border-slate-100/80 rounded-[28px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300"
              >
                <div
                  className="w-full h-[140px] rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden bg-gradient-to-br"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${feature.color}30, ${feature.color}10)`
                  }}
                >
                  <feature.icon className="w-7 h-7 text-slate-800" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-[14px] leading-[1.6] font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tech Specs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-3xl sm:text-4xl font-serif text-center mb-12 text-slate-900 tracking-tight">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {techSpecs.map((spec, i) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-100 rounded-2xl p-5 text-center shadow-[0_4px_20px_rgb(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300"
                >
                  <spec.icon className="w-6 h-6 text-slate-400 mx-auto mb-3" />
                  <div className="text-[14px] font-bold text-slate-800 tracking-tight mb-1">{spec.label}</div>
                  <div className="text-[12px] text-slate-400 font-medium leading-tight">{spec.desc}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[40px] p-2 bg-white border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)] max-w-5xl mx-auto"
          >
            <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-[#25283D] to-[#464D77] py-16 px-8 text-center flex flex-col items-center justify-center">
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[200px] opacity-20 flex justify-center items-end pointer-events-none overflow-hidden">
                  <div className="w-[600px] h-[600px] rounded-full border border-white/20 absolute -bottom-[450px]"></div>
                  <div className="w-[450px] h-[450px] rounded-full border border-white/20 absolute -bottom-[325px]"></div>
                  <div className="w-[300px] h-[300px] rounded-full border border-white/20 absolute -bottom-[200px]"></div>
               </div>
               
               <h2 className="text-3xl font-serif text-white tracking-tight leading-tight mb-8 relative z-10">
                 Ready to experience these features?
               </h2>
               
               <div className="relative z-10">
                  <Link to="/generator" className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white border border-white/30 px-10 py-3.5 rounded-full text-[15px] font-semibold transition-colors shadow-lg inline-flex items-center gap-2">
                    <QrCode className="w-4 h-4" /> Start Generating
                  </Link>
               </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
