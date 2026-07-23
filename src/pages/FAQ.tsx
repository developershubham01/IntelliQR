import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router";

const faqs = [
  { q: "What is QRify Pro?", a: "QRify Pro is a modern, professional QR code generator that lets you create beautiful, customizable QR codes for any purpose. With 25+ QR types, advanced styling options, and multiple export formats, it's the most powerful QR tool available." },
  { q: "Is QRify Pro free to use?", a: "Yes! Our Free plan includes unlimited QR generation, all QR types, basic customization, and PNG/JPG export. Upgrade to Pro for advanced features like SVG/PDF export, logo embedding, and gradient support." },
  { q: "What QR types are supported?", a: "We support 25+ types: Website URL, Plain Text, Email, Phone, SMS, WhatsApp, WiFi, vCard, Google Maps, PDF Link, Image Link, Video Link, Instagram, Facebook, LinkedIn, YouTube, Twitter/X, Telegram, Spotify, PayPal, UPI Payment, App Store, Play Store, Event, and Calendar." },
  { q: "Can I add my logo to a QR code?", a: "Absolutely! Pro and higher plans support logo embedding. Upload your logo image and it will be centered in the QR code. We recommend using High (30%) error correction for best results with logos." },
  { q: "What export formats are available?", a: "You can export as PNG, SVG, JPG, WEBP, or PDF. Sizes range from 256px to 2048px. You can also copy directly to clipboard or print." },
  { q: "Are the QR codes scannable?", a: "Yes, all QR codes generated are fully standards-compliant and scannable by any QR code reader app or camera. We use industry-standard encoding and validation." },
  { q: "What is error correction?", a: "Error correction allows QR codes to be read even if partially damaged or obscured. We offer 4 levels: Low (7%), Medium (15%), Quartile (25%), and High (30%). Higher levels are recommended for QR codes with logos." },
  { q: "Can I make the background transparent?", a: "Yes! Enable the 'Transparent Background' option in the Design tab. This is perfect for overlaying QR codes on designs or colored backgrounds." },
  { q: "How does the history feature work?", a: "Every QR code you generate is automatically saved to your history (up to 100 items). You can access, duplicate, favorite, rename, or delete items from the history panel in the generator." },
  { q: "Is my data secure?", a: "Yes. We take security seriously. All data is transmitted over HTTPS, and we never share your information with third parties. Generated QR code content is processed locally when possible." },
  { q: "Can I use QRify Pro for commercial purposes?", a: "Yes! All plans allow commercial use. Pro and Business plans offer additional features like white-label exports and team collaboration that are ideal for business use." },
  { q: "Do you offer an API?", a: "Yes! Pro and Business plans include API access. You can programmatically generate QR codes, manage your history, and integrate QRify Pro into your own applications." },
  { q: "How do I cancel my subscription?", a: "You can cancel anytime from your account settings. Your access will continue until the end of your current billing period. No questions asked." },
  { q: "Can I upgrade or downgrade my plan?", a: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades take effect at the next billing cycle." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and UPI for Indian customers." },
  { q: "Is there a team or business plan?", a: "Yes! Our Business plan supports up to 5 team members with shared history and collaboration features. Enterprise plans offer unlimited seats and custom integrations." },
  { q: "Can I use QRify Pro offline?", a: "The web app requires an internet connection. However, once a QR code is generated, the image is yours to use offline. We're exploring a desktop app for full offline functionality." },
  { q: "What browsers are supported?", a: "QRify Pro works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser up to date for the best experience." },
  { q: "How do I report a bug or request a feature?", a: "We'd love to hear from you! Use the Contact page to send us a message, or email us directly at hello@qrify.pro. We read every message and prioritize based on user feedback." },
  { q: "Do you offer refunds?", a: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund — no questions asked." },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.02 }}
      className="glass-panel rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-sm font-medium pr-4">{faq.q}</span>
        <ChevronDown
          className={`w-4 h-4 text-cyan-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-gray-400 leading-relaxed border-t border-cyan-500/10 pt-3">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#030C14] text-white relative">
      
      <Header />

      <div className="relative z-10 pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              <HelpCircle className="w-4 h-4" />
              FAQ
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Frequently Asked{" "}
              <span className="text-gradient-cyan">Questions</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Everything you need to know about QRify Pro.
            </p>
          </motion.div>

          {/* FAQ List */}
          <div className="space-y-3 mb-12">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel-strong rounded-2xl p-8 text-center"
          >
            <MessageCircle className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Still have questions?</h2>
            <p className="text-gray-400 text-sm mb-6">
              We're here to help. Reach out and we'll get back to you as soon
              as possible.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
