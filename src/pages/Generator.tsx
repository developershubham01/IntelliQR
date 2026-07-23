import { useState } from "react";
import QRTypeSelector from "@/components/qr/QRTypeSelector";
import QRContentForm from "@/components/qr/QRContentForm";
import QRPreview from "@/components/qr/QRPreview";
import QRDesignPanel from "@/components/qr/QRDesignPanel";
import QRExportPanel from "@/components/qr/QRExportPanel";
import Header from "@/components/Header";
import { FileText, Palette, Download, History, Zap } from "lucide-react";
import { useQRStore } from "@/store/qrStore";
import { motion, AnimatePresence } from "framer-motion";

type Tab = "content" | "design" | "export";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "content", label: "Content", icon: FileText },
  { id: "design", label: "Design", icon: Palette },
  { id: "export", label: "Export", icon: Download },
];

export default function Generator() {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [showHistory, setShowHistory] = useState(false);
  const { history, loadQR, toggleFavorite, removeFromHistory, duplicateQR } = useQRStore();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground relative font-sans">
      <Header />

      <div className="relative z-10 pt-24 pb-8 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 lg:h-[calc(100vh-6rem)] min-h-screen lg:min-h-0 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:h-full">
            {/* Left Panel - Type Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3 bg-white border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] p-5 overflow-hidden flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h2 className="text-[15px] font-bold text-slate-800 tracking-tight">
                  QR Type
                </h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-all border border-slate-100"
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
              <div className="absolute w-[350px] h-[350px] bg-gradient-to-tr from-orange-400/10 via-rose-500/10 to-indigo-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
              <QRPreview />
            </motion.div>

            {/* Right Panel - Tabs */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4 bg-white border border-slate-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[28px] overflow-hidden flex flex-col h-full"
            >
              {/* Tab Headers */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3.5 text-sm font-semibold transition-all ${
                      activeTab === tab.id
                        ? "text-slate-800 border-b-2 border-slate-800 bg-white"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
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
