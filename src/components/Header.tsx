import { useState } from "react";
import { Link, useLocation } from "react-router";
import { QrCode, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
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
  { label: "Generator", href: "/generator" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "API Docs", href: "/api-docs" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <header className="w-full max-w-5xl bg-white/60 backdrop-blur-md border border-white/20 shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full px-2"
            aria-label="Home"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight font-serif">
              IntelliQR
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-xs font-semibold tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive(link.href)
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full hover:bg-slate-100/50 p-1 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
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
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-2xl border border-slate-100 p-2 shadow-xl bg-white/95 backdrop-blur-md">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">
                        {user?.email}
                      </p>
                    </div>
                    <DropdownMenuItem asChild className="rounded-xl px-3 py-2 cursor-pointer focus:bg-slate-50 transition-colors">
                      <Link to="/generator" className="flex items-center text-slate-700 hover:text-slate-900 text-xs font-medium">
                        <LayoutDashboard className="mr-2 h-4 w-4 text-slate-400" />
                        My Dashboard
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
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-xs font-semibold tracking-widest uppercase text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary text-xs tracking-widest uppercase px-6 py-2.5">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:bg-white/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-border overflow-hidden fixed top-24 left-4 right-4 z-40 rounded-2xl shadow-xl border border-border/50"
          >
            <nav className="px-4 py-6 flex flex-col gap-4" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-medium px-4 py-2 rounded-md ${
                    isActive(link.href) ? "bg-slate-100 text-slate-900" : "text-slate-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-border w-full my-2"></div>
              {isAuthenticated ? (
                <div className="flex flex-col gap-3 px-4 pb-2">
                  <div className="flex items-center gap-3 py-2 border-b border-slate-100">
                    <Avatar className="h-10 w-10 border border-slate-200 shadow-sm shrink-0">
                      <AvatarFallback className="text-sm font-bold bg-slate-900 text-white">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Link to="/generator" onClick={() => setMobileOpen(false)} className="btn-primary text-center py-2.5">
                    My Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="w-full py-2.5 rounded-full border border-slate-200/80 text-red-600 hover:bg-rose-50/50 font-bold text-xs tracking-wider uppercase transition-all"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 px-4">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center">
                    Log In
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-center">
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
