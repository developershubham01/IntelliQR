import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send, MessageSquare, Check } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#030C14] text-white relative">
      
      <Header />

      <div className="relative z-10 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Get in <span className="text-gradient-cyan">touch</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions, feedback, or need help? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <a href="mailto:hello@qrify.pro" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                        hello@qrify.pro
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <a href="tel:+1234567890" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                        +1 (234) 567-890
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <p className="text-sm text-gray-400">
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-3">Quick Links</h2>
                <div className="space-y-2">
                  <Link to="/faq" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    Frequently Asked Questions
                  </Link>
                  <Link to="/pricing" className="flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors">
                    <Mail className="w-4 h-4" />
                    Pricing Information
                  </Link>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="aspect-video bg-[#081828] flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-cyan-400/50 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="glass-panel rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold mb-6">Send us a message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message sent!</h3>
                    <p className="text-gray-400 text-sm">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          Name <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="input-cyber w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1.5">
                          Email <span className="text-cyan-400">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="input-cyber w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Subject <span className="text-cyan-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What's this about?"
                        className="input-cyber w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1.5">
                        Message <span className="text-cyan-400">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more..."
                        className="input-cyber w-full resize-none"
                      />
                    </div>

                    <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
