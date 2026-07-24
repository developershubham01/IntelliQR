import { useState, useEffect } from "react";
import QRTypeSelector from "@/components/qr/QRTypeSelector";
import QRContentForm from "@/components/qr/QRContentForm";
import QRPreview from "@/components/qr/QRPreview";
import QRDesignPanel from "@/components/qr/QRDesignPanel";
import QRExportPanel from "@/components/qr/QRExportPanel";
import Header from "@/components/Header";
import { FileText, Palette, Download, History, Zap } from "lucide-react";
import { useQRStore } from "@/store/qrStore";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

type Tab = "content" | "design" | "export";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "content", label: "Content", icon: FileText },
  { id: "design", label: "Design", icon: Palette },
  { id: "export", label: "Export", icon: Download },
];

export default function Generator() {
  const { isAuthenticated } = useAuth();
  const setStoreAuth = useQRStore((state) => state.setStoreAuth);

  useEffect(() => {
    setStoreAuth(isAuthenticated);
  }, [isAuthenticated, setStoreAuth]);

  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [showHistory, setShowHistory] = useState(false);
  const { history, loadQR, toggleFavorite, removeFromHistory, duplicateQR } = useQRStore();

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <Header />

      <div className="relative z-10 pt-24 pb-8 min-h-screen">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 lg:h-[calc(100vh-7rem)] min-h-screen lg:min-h-0 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-full">
            {/* Left Panel - Type Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 overflow-hidden flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-5 border-b border-slate-100/60 pb-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  QR Type
                </h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-white/80 transition-all border border-slate-200/50 shadow-sm bg-white/40"
                  title="History"
                >
                  <History className="w-4 h-4" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {showHistory ? (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 overflow-y-auto scrollbar-thin space-y-1"
                  >
                    <button
                      onClick={() => setShowHistory(false)}
                      className="text-xs text-indigo-600 hover:underline mb-3 font-semibold block"
                    >
                      &larr; Back to types
                    </button>
                    {history.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-8">
                        No history yet
                      </p>
                    ) : (
                      history.map((item) => (
                        <div
                          key={item.id}
                          className="group flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                        >
                          <button
                            onClick={() => {
                              loadQR(item);
                              setShowHistory(false);
                            }}
                            className="flex-1 flex items-center gap-2.5 min-w-0"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-9 h-9 rounded-lg object-contain bg-slate-50 border border-slate-100 p-0.5 flex-shrink-0"
                            />
                            <div className="min-w-0 text-left">
                              <div className="text-[13px] text-slate-800 truncate font-semibold">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1.5 mt-0.5 font-medium">
                                {item.type}
                                {item.isDynamic && (
                                  <>
                                    <span>•</span>
                                    <span className="text-indigo-600 font-semibold flex items-center gap-0.5">
                                      <Zap className="w-2.5 h-2.5" />
                                      Dynamic
                                    </span>
                                  </>
                                )}
                                {item.scanCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{item.scanCount} scans</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </button>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.isDynamic && item.shortId && (
                              <button
                                onClick={() => {
                                  window.open(`/r/${item.shortId}`, "_blank");
                                }}
                                className="p-1 rounded text-slate-400 hover:text-indigo-600"
                                title="Open Link"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => toggleFavorite(item.id)}
                              className={`p-1 rounded ${
                                item.isFavorite
                                  ? "text-amber-400"
                                  : "text-slate-400 hover:text-amber-400"
                              }`}
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                fill={item.isFavorite ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => duplicateQR(item.id)}
                              className="p-1 rounded text-slate-400 hover:text-slate-600"
                              title="Duplicate"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => removeFromHistory(item.id)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600"
                              title="Delete"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="types"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 overflow-hidden"
                  >
                    <QRTypeSelector />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Center - Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 flex items-center justify-center relative"
            >
              {/* Background soft mesh decoration */}
              <div className="absolute w-[350px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse" />
              <QRPreview />
            </motion.div>

            {/* Right Panel - Tabs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] overflow-hidden flex flex-col h-full"
            >
              {/* Tab Headers */}
              <div className="flex p-1.5 gap-1 bg-slate-100/60 backdrop-blur-sm border-b border-white/40">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors focus:outline-none ${
                        isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-700"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabPill"
                          className="absolute inset-0 bg-white border border-slate-200/50 shadow-sm rounded-full -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <tab.icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === "content" && <QRContentForm />}
                    {activeTab === "design" && <QRDesignPanel />}
                    {activeTab === "export" && <QRExportPanel />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
