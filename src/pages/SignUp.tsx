import { useState, useEffect } from "react";
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

  const googleLoginMutation = trpc.auth.googleLogin.useMutation({
    onSuccess: async () => {
      toast.success("Account created successfully!");
      await utils.auth.me.invalidate();
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to authenticate with Google.");
    },
  });

  const handleGoogleCallback = (response: any) => {
    const credential = response.credential;
    if (credential) {
      googleLoginMutation.mutate({ credential });
    }
  };

  useEffect(() => {
    const google = (window as any).google;
    if (google) {
      google.accounts.id.initialize({
        client_id: "109467875222-v0vgjm6ot9kb85411tvk3veohms4ur4p.apps.googleusercontent.com",
        callback: handleGoogleCallback,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        { theme: "outline", size: "large", width: 356, shape: "pill" }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    registerMutation.mutate({ name, email, password });
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
            <div id="google-signup-btn" className="w-full flex justify-center h-[44px]" />

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
