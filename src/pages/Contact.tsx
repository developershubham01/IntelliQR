import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send, MessageSquare, Check, Sparkles, Loader2 } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <Header />

      <div className="relative z-10 pt-32 pb-20 min-h-[calc(100vh-6rem)]">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              Contact Support
            </span>
            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              Get in <span className="italic font-normal text-slate-500 font-serif">touch</span>
            </h1>
            <p className="text-slate-700/80 text-lg max-w-xl mx-auto font-medium">
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
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</div>
                      <a href="mailto:info@abwcurious.com" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                        info@abwcurious.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</div>
                      <a href="tel:+919930338504" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                        +91 99303 38504
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</div>
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                        ABWcurious Pvt.Ltd<br />
                        Navi Mumbai, Maharashtra<br />
                        India
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Quick Links</h2>
                <div className="space-y-3">
                  <Link to="/faq" className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    Frequently Asked Questions
                  </Link>
                  <Link to="/pricing" className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-all">
                    <Mail className="w-4 h-4 text-slate-400" />
                    Pricing Information
                  </Link>
                </div>
              </div>

              {/* Map Embed */}
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden aspect-video">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.884945309367!2d73.0221279!3d19.0247909!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3d076147f7b%3A0xe421751ae4517f6d!2sABWcurious%20Pvt.Ltd!5e0!3m2!1sen!2sin!4v1784896709239!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="strict-origin-when-cross-origin"
                ></iframe>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Send us a message</h2>

                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Message sent!</h3>
                    <p className="text-slate-500 font-semibold text-sm">
                      We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Name <span className="text-indigo-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          disabled={contactMutation.isPending}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your name"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm placeholder-slate-400 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Email <span className="text-indigo-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          disabled={contactMutation.isPending}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="your@email.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm placeholder-slate-400 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Subject <span className="text-indigo-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={contactMutation.isPending}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="What's this about?"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm placeholder-slate-400 disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Message <span className="text-indigo-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        disabled={contactMutation.isPending}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us more..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm placeholder-slate-400 resize-none disabled:opacity-50"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={contactMutation.isPending}
                      className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
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
