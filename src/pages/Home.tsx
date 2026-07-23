import { Link } from "react-router";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  QrCode,
  Shield,
  Palette,
} from "lucide-react";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <Header />

      {/* Hero Section */}
      <section className="sarvam-gradient pt-32 pb-24 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-sm font-medium text-slate-800 mb-8 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              Intelligent QR for developers
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-6xl sm:text-[80px] leading-[1.1] tracking-tight mb-8 text-slate-900 font-serif"
            >
              Beautiful QR codes, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600">generated instantly.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-slate-700/80 leading-relaxed mb-10 max-w-2xl mx-auto font-medium"
            >
              Create dynamic, customizable, and trackable QR codes in seconds. Elevate your brand with intelligent redirection.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/generator" className="btn-primary text-lg px-8 py-4">
                Start Generating
              </Link>
              <Link to="/features" className="btn-secondary text-lg px-8 py-4">
                Explore Features
              </Link>
            </motion.div>
          </div>
          
          {/* Hero Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-3 border border-white/40 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <div className="bg-white rounded-2xl h-[400px] sm:h-[600px] flex items-center justify-center overflow-hidden relative border border-white/60 shadow-inner">
                {/* Mock Dashboard UI inside */}
                <div className="absolute top-0 left-0 right-0 h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center px-6">
                  <div className="flex gap-2">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-400"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-8 mt-16">
                   <div className="w-56 h-56 bg-white border border-slate-100 shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-6 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                     <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     <QrCode className="w-full h-full text-slate-800" />
                   </div>
                   <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 shadow-sm shadow-orange-400/20"></div>
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-400 to-purple-400 shadow-sm shadow-rose-400/20"></div>
                     <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-400 shadow-sm shadow-purple-400/20"></div>
                     <div className="w-10 h-10 rounded-full bg-slate-900 shadow-sm"></div>
                   </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-[44px] font-serif text-slate-900 tracking-tight leading-tight">
              Intelligent QR Code Platform
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* Card 1 */}
            <div className="flex flex-col bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
              <div className="w-full h-[200px] rounded-2xl bg-gradient-to-br from-[#E0C3FC] to-[#8EC5FC] mb-6 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent mix-blend-overlay"></div>
                 <div className="w-16 h-16 border-[2px] border-white/60 rounded-full flex items-center justify-center text-white relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                   <QrCode className="w-8 h-8" />
                 </div>
              </div>
              <h3 className="text-[20px] font-bold text-slate-900 mb-3 tracking-tight">Dynamic QR Code Generation</h3>
              <p className="text-[15px] text-slate-500 font-medium leading-[1.6]">
                Create intelligent, dynamic QR codes. Update your destination URLs instantly without ever reprinting your physical marketing materials.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
              <div className="w-full h-[200px] rounded-2xl bg-gradient-to-br from-[#FF9A9E] via-[#FECFEF] to-[#FECFEF] mb-6 flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#F6D365] to-[#FDA085] mix-blend-multiply opacity-80"></div>
                 <div className="w-16 h-16 border-[2px] border-white/60 rounded-full flex items-center justify-center text-white relative z-10 rotate-45 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                   <Palette className="w-8 h-8 -rotate-45" />
                 </div>
              </div>
              <h3 className="text-[20px] font-bold text-slate-900 mb-3 tracking-tight">Custom Branded QR Design</h3>
              <p className="text-[15px] text-slate-500 font-medium leading-[1.6]">
                Design custom QR codes that align perfectly with your corporate identity. Incorporate logos, frames, and precise brand colors.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
              <div className="w-full h-[200px] rounded-2xl bg-gradient-to-br from-[#84FAB0] to-[#8FD3F4] mb-6 flex items-center justify-center relative overflow-hidden">
                 <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white relative z-10 border border-white/50 shadow-inner">
                   <Shield className="w-10 h-10" />
                 </div>
              </div>
              <h3 className="text-[20px] font-bold text-slate-900 mb-3 tracking-tight">Enterprise QR Analytics</h3>
              <p className="text-[15px] text-slate-500 font-medium leading-[1.6]">
                Gain actionable insights with comprehensive scan tracking. Monitor locations, device types, and daily performance metrics globally.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Powering Section */}
      <section className="py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-[40px] sm:text-[44px] font-serif text-slate-900 tracking-tight leading-tight">
               Powering the QR-first future
             </h2>
          </div>
          
          <div className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
               <div className="bg-gradient-to-b from-[#E0E7FF] via-[#E8EAFF] to-[#C7D2FE] rounded-[28px] h-[400px] sm:h-[480px] w-full relative overflow-hidden flex flex-col items-center justify-center">
                  {/* Decorative Abstract Vectors */}
                  <div className="absolute bottom-0 w-full h-[40%] bg-[#A5B4FC] opacity-40 blur-[80px]"></div>
                  <div className="relative z-10 w-24 h-24 rounded-full border-[2px] border-white flex items-center justify-center mb-12">
                     <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center rotate-45">
                        <QrCode className="w-8 h-8 text-white -rotate-45" />
                     </div>
                  </div>
                  <div className="absolute bottom-0 w-full h-1/2 flex items-end justify-center">
                     <svg viewBox="0 0 400 200" fill="none" className="w-full h-full text-[#93A5F5] opacity-50">
                        <path d="M0 200C100 200 150 150 200 100C250 150 300 200 400 200V200H0Z" fill="currentColor"/>
                        <path d="M50 200C125 200 160 170 200 130C240 170 275 200 350 200V200H50Z" fill="currentColor" className="text-[#818CF8]"/>
                     </svg>
                  </div>
               </div>

               <div className="py-10 px-6 lg:px-12 flex flex-col justify-center space-y-12">
                  {[
                    { title: "Sovereign by design", desc: "Build, deploy, and track QR codes with full control, operated entirely securely." },
                    { title: "Dynamic architecture", desc: "Industry-leading routing built for high-traffic environments and seamless updates." },
                    { title: "Enterprise at the core", desc: "Advanced analytics and team management capabilities for production-ready deployments." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5 items-start">
                       <div className="mt-1 flex-shrink-0 text-[#86EFAC]">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                          </svg>
                       </div>
                       <div>
                          <h4 className="text-[17px] font-semibold text-slate-900 mb-2 tracking-tight">{item.title}</h4>
                          <p className="text-[15px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <Link to="/generator" className="bg-[#2A2C3C] hover:bg-[#1A1C29] text-white px-8 py-3.5 rounded-full text-[15px] font-medium transition-colors shadow-lg">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
           <div className="rounded-[40px] p-2 bg-white border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.06)] max-w-6xl mx-auto">
              <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-b from-[#25283D] to-[#464D77] py-28 px-8 text-center flex flex-col items-center justify-center">
                 
                 {/* Wireframe globe / glow effects */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] opacity-30 flex justify-center items-end pointer-events-none overflow-hidden">
                    <div className="w-[800px] h-[800px] rounded-full border border-white/20 absolute -bottom-[600px]"></div>
                    <div className="w-[600px] h-[600px] rounded-full border border-white/20 absolute -bottom-[450px]"></div>
                    <div className="w-[400px] h-[400px] rounded-full border border-white/20 absolute -bottom-[300px]"></div>
                    <div className="w-px h-[300px] bg-white/20 absolute bottom-0"></div>
                 </div>
                 <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-white/20 to-transparent mix-blend-overlay"></div>

                 <h2 className="text-3xl sm:text-[44px] font-serif text-white tracking-tight leading-tight max-w-xl mx-auto mb-16 relative z-10">
                   Build the Future of Connected Experiences
                 </h2>
                 
                 <div className="relative z-10 flex flex-col items-center gap-8">
                    <div className="text-white">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" />
                       </svg>
                    </div>
                    <Link to="/generator" className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white border border-white/30 px-10 py-3 rounded-full text-[16px] tracking-wide transition-colors shadow-lg">
                      Sign Up
                    </Link>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
