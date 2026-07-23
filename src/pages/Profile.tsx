import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Building, 
  Globe, 
  FileText, 
  ArrowLeft, 
  Save, 
  Calendar, 
  ShieldAlert, 
  Loader2 
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Profile() {
  const { user, isLoading, refresh } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");

  // Sync state with user data once loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCompany(user.company || "");
      setWebsite(user.website || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: async () => {
      toast.success("Profile updated successfully!");
      await refresh();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    updateProfileMutation.mutate({
      name,
      phone: phone || null,
      company: company || null,
      website: website || null,
      bio: bio || null,
    });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <Loader2 className="w-8 h-8 text-slate-800 animate-spin" />
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground relative flex flex-col font-sans">
      <Header />

      <div className="relative flex-1 z-10 pt-32 pb-24 relative overflow-hidden">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        <div className="max-w-3xl w-full mx-auto px-4 relative z-10">
          {/* Back Button */}
          <button
            onClick={() => navigate("/generator")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest mb-6 focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.02)]"
          >
            {/* Header info */}
            <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-slate-100 mb-8">
              <Avatar className="h-20 w-20 border-2 border-white shadow-md">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name || "User Avatar"} className="object-cover w-full h-full" />
                ) : (
                  <AvatarFallback className="text-xl font-bold bg-slate-900 text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  {user.name}
                </h1>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  {user.email || "No email linked"}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-600 border border-indigo-100">
                    {user.role}
                  </span>
                  {user.unionId.startsWith("google_") && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-green-50 text-green-600 border border-green-100">
                      Google Account
                    </span>
                  )}
                  {!user.unionId.startsWith("google_") && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-slate-50 text-slate-600 border border-slate-200">
                      Email & Password
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={updateProfileMutation.isPending}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address (disabled) */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      placeholder="name@company.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/30 bg-slate-100/50 text-sm text-slate-400 font-medium cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      disabled={updateProfileMutation.isPending}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      disabled={updateProfileMutation.isPending}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Website URL
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://company.com"
                      disabled={updateProfileMutation.isPending}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Bio / Description
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Write a short bio about yourself..."
                      disabled={updateProfileMutation.isPending}
                      rows={4}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Readonly info cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Last Sign In</p>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">{formatDate(user.lastSignInAt)}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-md shadow-slate-950/10 disabled:opacity-50"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving changes
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
