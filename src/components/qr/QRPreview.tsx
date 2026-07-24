import { useQRStore } from "@/store/qrStore";
import { Copy, Printer, RefreshCw } from "lucide-react";
import { useState } from "react";
import { copyQRToClipboard, printQR } from "@/lib/qr-generator";
import { toast } from "sonner";
import { memo } from "react";

const QRPreview = memo(function QRPreview() {
  const { currentQR, isGenerating, generateQR } = useQRStore();
  const [copied, setCopied] = useState(false);

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

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="relative w-full max-w-[400px]"
    >
      {/* Glass Frame */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 relative">
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
              {currentQR.style.logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={currentQR.style.logoUrl}
                    alt="Logo"
                    className="w-12 h-12 object-contain rounded-lg bg-white/90 shadow-sm p-1"
                  />
                </div>
              )}
              {currentQR.style.frame?.enabled && (
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest whitespace-nowrap shadow-sm"
                  style={{
                    backgroundColor: currentQR.style.frame.color + "15",
                    color: currentQR.style.frame.color,
                    border: `1px solid ${currentQR.style.frame.color}30`,
                  }}
                >
                  {currentQR.style.frame.text}
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
    </motion.div>
  );
});

export default QRPreview;
