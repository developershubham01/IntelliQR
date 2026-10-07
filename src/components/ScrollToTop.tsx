import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // 1. Automatically scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  // 2. Track scroll position to show/hide floating button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial state

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleScrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="fixed bottom-24 right-6 sm:bottom-24 sm:right-7 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-xl border border-slate-200/90 text-slate-700 hover:text-slate-900 hover:bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)] flex items-center justify-center transition-all hover:-translate-y-0.5 active:translate-y-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
        >
          <ArrowUp className="w-5 h-5 transition-transform duration-200 group-hover:-translate-y-0.5 text-slate-800" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
