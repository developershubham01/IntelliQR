import { motion } from "framer-motion";
import { Link } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sparkles, ArrowRight, Code2, Heart, ShieldCheck, Zap } from "lucide-react";

export default function About() {
  const stats = [
    { value: "10M+", label: "QRs Generated" },
    { value: "99.99%", label: "Uptime Guarantee" },
    { value: "25+", label: "Supported QR Types" },
    { value: "< 10ms", label: "Redirection Speed" },
  ];

  const pillars = [
    {
      icon: Code2,
      title: "Developer First",
      description: "Crafted by developers, for developers. Simple REST APIs, SDKs, and clean UI configurations built to save you time.",
      gradient: "from-sky-500/10 to-blue-500/10",
      color: "text-blue-600",
    },
    {
      icon: Zap,
      title: "Limitless Customization",
      description: "Go beyond black-and-white. Shape your dots, style your eyes, insert high-fidelity logos, and add custom frames in seconds.",
      gradient: "from-amber-500/10 to-orange-500/10",
      color: "text-orange-600",
    },
    {
      icon: ShieldCheck,
      title: "Privacy & Reliability",
      description: "Your users' security is paramount. Dynamic redirects are vetted in real-time, blocking phishing attempts and malicious targets.",
      gradient: "from-emerald-500/10 to-teal-500/10",
      color: "text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <Header />

      <div className="relative z-10 pt-32 pb-20 min-h-[calc(100vh-6rem)]">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              Our Story
            </span>
            <h1 className="text-5xl sm:text-7xl font-serif text-slate-900 mb-6 tracking-tight max-w-4xl mx-auto leading-[1.1]">
              Intelligent QR codes, crafted for the <span className="italic font-normal text-slate-500 font-serif">modern web</span>
            </h1>
            <p className="text-slate-700/80 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              We started with a simple belief: QR codes shouldn't be boring, rigid, or hard to manage. IntelliQR combines premium styling controls with developer-grade API access.
            </p>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] text-center"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mission Grid */}
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-6 space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 tracking-tight">
                Our Mission: Bridging the physical and digital worlds seamlessly.
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Whether you are a developer looking to embed high-fidelity batch printing workflows, a brand designer striving for matching styles, or a business owner deploying redirect campaigns with real-time scan analytics, we have you covered.
              </p>
              <p className="text-slate-600 font-medium leading-relaxed">
                Everything is served from global edge caches with instantaneous redirect resolution times. Rest easy knowing your campaigns are robust and secure.
              </p>
              <div className="pt-2">
                <Link
                  to="/generator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-md"
                >
                  Try the Generator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-6"
            >
              <div className="bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">Designed with love</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Every layout is fully customizable down to the pixel. From canvas sizes to gradient vectors, choose what fits your brand best.
                    </p>
                  </div>
                </div>
                <hr className="border-slate-100" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Supported Formats: SVG &bull; PNG &bull; JPEG &bull; PDF
                </p>
              </div>
            </motion.div>
          </div>

          {/* Pillars Section */}
          <div className="space-y-12">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-serif text-slate-900 tracking-tight">Our Core Pillars</h2>
              <p className="text-slate-500 text-sm font-medium mt-3">The values that guide every single feature we design and ship.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {pillars.map((pillar, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 + 0.3 }}
                  className="flex flex-col bg-white border border-slate-100 rounded-[28px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${pillar.gradient}`}>
                    <pillar.icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">{pillar.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium flex-1">{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
