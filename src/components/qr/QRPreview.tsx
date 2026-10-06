import { useQRStore } from "@/store/qrStore";
import { Copy, Printer, RefreshCw, Sparkles, Zap, Edit3, BarChart2 } from "lucide-react";
import { useState } from "react";
import { copyQRToClipboard, printQR } from "@/lib/qr-generator";
import { toast } from "sonner";
import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import DynamicQREditModal from "./DynamicQREditModal";

const QRPreview = memo(function QRPreview() {
  const { currentQR, isGenerating, generateQR } = useQRStore();
  const [copied, setCopied] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleCopy = async () => {
    if (!currentQR?.imageUrl) return;
    const success = await copyQRToClipboard(currentQR.imageUrl);
    if (success) {
      setCopied(true);
      toast.success("QR Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy QR code");
    }
  };

  const handlePrint = () => {
    if (!currentQR?.imageUrl) return;
    printQR(currentQR.imageUrl);
  };

  // Safe checks for frame and logo config from legacy/partial history store items
  const logoUrl = currentQR?.style?.logoUrl;
  const frameEnabled = currentQR?.style?.frame?.enabled ?? false;
  const frameColor = currentQR?.style?.frame?.color || "#000000";
  const frameText = currentQR?.style?.frame?.text || "SCAN ME";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full max-w-[400px] flex flex-col items-center gap-6"
    >
      {/* Glass Frame */}
      <div className="w-full bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 relative">
        {/* Corner Brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-indigo-500/20 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-indigo-500/20 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-indigo-500/20 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-indigo-500/20 rounded-br-lg" />

        {/* QR Display */}
        <div className="scan-border rounded-2xl p-6 bg-white/40 backdrop-blur-sm flex items-center justify-center min-h-[300px] border-slate-200/50 shadow-inner">
          {currentQR?.imageUrl ? (
            <div className="relative animate-fade-in">
              <img
                src={currentQR.imageUrl}
                alt="Generated QR Code"
                className={`w-56 h-56 object-contain rounded-xl ${isGenerating ? "opacity-70 scale-[0.98]" : "opacity-100 scale-100"} transition-all duration-500`}
              />
              {logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={logoUrl}
                    alt="Logo"
                    className="w-12 h-12 object-contain rounded-lg bg-white/90 shadow-sm p-1"
                  />
                </div>
              )}
              {frameEnabled && (
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-sm"
                  style={{
                    backgroundColor: frameColor + "15",
                    color: frameColor,
                    border: `1px solid ${frameColor}30`,
                  }}
                >
                  {frameText}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-[24px] bg-slate-100/80 border border-slate-200/50 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-slate-400/80 animate-pulse" />
              </div>
              <p className="text-slate-600 text-sm font-semibold">
                Design Your QR Code
              </p>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                Enter details on the right to start
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {currentQR?.imageUrl && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white hover:bg-slate-50 text-slate-800 transition-all border border-slate-200/60 shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white hover:bg-slate-50 text-slate-800 transition-all border border-slate-200/60 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={generateQR}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-bold tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md shadow-slate-950/10 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              Update
            </button>
          </div>
        )}
      </div>

      {/* Dynamic QR Info & Management Card */}
      {currentQR?.isDynamic && currentQR?.shortId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-white/90 backdrop-blur-xl border border-indigo-100 rounded-3xl p-5 shadow-sm space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200/50 flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              Dynamic QR Active
            </span>
            <Link
              to="/dashboard"
              className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
            >
              Dashboard &rarr;
            </Link>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">QR Name</div>
            <div className="text-xs font-bold text-slate-800 truncate">{currentQR.name}</div>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Permanent Short URL</div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-semibold text-slate-800 truncate">
                {window.location.origin}/q/{currentQR.shortId}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/q/${currentQR.shortId}`);
                  toast.success("Short link copied!");
                }}
                className="p-1 text-slate-400 hover:text-slate-800"
                title="Copy Link"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-1 flex flex-wrap gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <Edit3 className="w-3 h-3" />
              Edit Destination
            </button>
            <Link
              to="/dashboard"
              className="py-2 px-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <BarChart2 className="w-3 h-3" />
              Analytics
            </Link>
          </div>
        </motion.div>
      )}

      {/* Choose Template Action */}
      {currentQR?.imageUrl && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Link
            to="/templates"
            className="w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-[#1C1E2D] hover:bg-slate-800 text-white transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-indigo-300 animate-pulse" />
            Choose Template
          </Link>
        </motion.div>
      )}

      {/* Edit Destination Modal */}
      {currentQR?.isDynamic && (
        <DynamicQREditModal
          qr={{
            id: Number(currentQR.id) || 0,
            name: currentQR.name,
            shortId: currentQR.shortId,
            destinationUrl: currentQR.destinationUrl || currentQR.content,
            content: currentQR.content,
          }}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </motion.div>
  );
});

export default QRPreview;
