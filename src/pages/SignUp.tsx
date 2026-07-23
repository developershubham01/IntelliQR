import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { QrCode, Lock, Mail, User, ArrowRight } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const utils = trpc.useUtils();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      toast.success("Account created successfully!");
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create account. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    registerMutation.mutate({ name, email, password });
  };

  const handleGoogleSignUp = () => {
    // Simulate sign up with Google by registering with a default Google account
    registerMutation.mutate({
      name: "Google User",
      email: "google_user@gmail.com",
      password: "googleoauthpassword123",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground relative flex flex-col font-sans">
      <Header />

      <div className="relative flex-1 z-10 pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-orange-400/10 via-rose-500/10 to-indigo-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-400/10 via-teal-500/10 to-emerald-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        <div className="max-w-[420px] w-full mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.03)]"
          >
            {/* Header / Brand Logo */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-4 shadow-sm">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-slate-400 text-sm font-medium">Sign up to unlock advanced custom QR design</p>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={registerMutation.isPending}
              className="w-full py-3.5 px-4 rounded-full border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
            >
              {/* Google SVG Icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.58h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.4C21.68,11.83 21.57,11.45 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.8c2.43,0 4.47,-0.8 5.96,-2.2l-2.92,-2.28c-0.8,0.54 -1.84,0.87 -3.04,0.87 -2.34,0 -4.33,-1.58 -5.04,-3.7H3.54v2.36C5.03,18.73 8.27,20.8 12,20.8z" fill="#34A853" />
                  <path d="M6.96,13.5c-0.18,-0.54 -0.29,-1.11 -0.29,-1.7c0,-0.59 0.11,-1.16 0.29,-1.7V7.74H3.54C2.93,8.96 2.58,10.37 2.58,12c0,1.63 0.35,3.04 0.96,4.26L6.96,13.5z" fill="#FBBC05" />
                  <path d="M12,6.5c1.32,0 2.5,0.45 3.44,1.35l2.58,-2.58C16.46,3.84 14.43,3.2 12,3.2c-3.73,0 -6.97,2.07 -8.46,5.06l3.42,2.66C7.67,8.08 9.66,6.5 12,6.5z" fill="#EA4335" />
                </g>
              </svg>
              Sign up with Google
            </button>

            {/* Separator */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-slate-100" />
              <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">or details</span>
              <div className="flex-1 border-t border-slate-100" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={registerMutation.isPending}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    disabled={registerMutation.isPending}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={registerMutation.isPending}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full mt-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-950/10 disabled:opacity-50"
              >
                Create Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-slate-500 text-xs font-medium">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
