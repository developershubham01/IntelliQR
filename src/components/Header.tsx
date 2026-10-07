import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  QrCode,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  User,
  Sparkles,
  Layers,
  Zap,
  CreditCard,
  BookOpen,
  Code2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Generator", href: "/generator", icon: QrCode },
  { label: "Dynamic QR", href: "/dynamic-qr-code", icon: Sparkles },
  { label: "Solutions", href: "/solutions", icon: Layers },
  { label: "Features", href: "/features", icon: Zap },
  { label: "Pricing", href: "/pricing", icon: CreditCard },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "API Docs", href: "/api-docs", icon: Code2 },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) => location.pathname === href;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <header className="w-full max-w-6xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06),0_1px_3px_rgb(0,0,0,0.04)] rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between pointer-events-auto transition-all">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-full px-1 shrink-0"
            aria-label="IntelliQR Home"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight font-serif whitespace-nowrap">
              IntelliQR
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3"
            aria-label="Main Navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  isActive(link.href)
                    ? "text-slate-900 bg-slate-900/10 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-900/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                    isActive("/dashboard")
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-500" />
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full hover:bg-slate-100/60 p-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900">
                      <Avatar className="h-8 w-8 border border-slate-200 shadow-sm shrink-0">
                        <AvatarFallback className="text-xs font-bold bg-slate-900 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-xs font-bold text-slate-700 max-w-[100px] truncate pr-1">
                        {user?.name}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2 rounded-2xl border border-slate-100 p-2 shadow-xl bg-white/95 backdrop-blur-md"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50 transition-colors"
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center text-slate-700 hover:text-slate-900 text-xs font-medium"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4 text-indigo-500" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50 transition-colors"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center text-slate-700 hover:text-slate-900 text-xs font-medium"
                      >
                        <User className="mr-2 h-4 w-4 text-slate-400" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={logout}
                      className="rounded-xl px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-rose-50/50 transition-colors flex items-center text-xs font-medium"
                    >
                      <LogOut className="mr-2 h-4 w-4 text-red-500" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  to="/login"
                  className="whitespace-nowrap text-xs font-semibold tracking-wider uppercase text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full hover:bg-slate-900/5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="whitespace-nowrap text-xs font-semibold tracking-wider uppercase bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full shadow-sm hover:shadow transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-full text-slate-700 hover:bg-slate-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
              aria-hidden="true"
            />

            {/* Menu Panel */}
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 sm:top-24 left-3 right-3 sm:left-6 sm:right-6 max-w-md mx-auto z-50 bg-white/95 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-2xl p-4 sm:p-5 overflow-hidden max-h-[82vh] overflow-y-auto flex flex-col lg:hidden"
            >
              <nav className="flex flex-col gap-1.5" aria-label="Mobile Navigation">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                        active
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="tracking-wide">{link.label}</span>
                    </Link>
                  );
                })}

                <div className="h-px bg-slate-150 my-2" />

                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center gap-3 px-2 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                      <Avatar className="h-9 w-9 border border-slate-200 shadow-sm shrink-0">
                        <AvatarFallback className="text-xs font-bold bg-slate-900 text-white">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-center text-xs font-bold tracking-wider uppercase shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      My Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 rounded-full border border-slate-200/90 text-slate-700 hover:bg-slate-50 text-center font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full py-2.5 rounded-full border border-rose-200/80 text-rose-600 hover:bg-rose-50/60 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 rounded-full text-center text-xs font-bold tracking-wider uppercase text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileOpen(false)}
                      className="w-full py-2.5 rounded-full text-center text-xs font-bold tracking-wider uppercase text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

