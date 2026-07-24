import { useState } from "react";
import { useQRStore } from "@/store/qrStore";
import { downloadQR, copyQRToClipboard } from "@/lib/qr-generator";
import type { ExportConfig } from "@/types/qr";
import {
  Download,
  Copy,
  FileImage,
  FileCode,
  FileText,
  Check,
  Image,
} from "lucide-react";

const formats = [
  { value: "png" as const, label: "PNG", icon: FileImage, desc: "Best for web" },
  { value: "svg" as const, label: "SVG", icon: FileCode, desc: "Scalable vector" },
  { value: "jpg" as const, label: "JPG", icon: Image, desc: "Small file size" },
  { value: "webp" as const, label: "WEBP", icon: FileImage, desc: "Modern format" },
  { value: "pdf" as const, label: "PDF", icon: FileText, desc: "Print ready" },
];

const sizes = [
  { value: 256, label: "256px" },
  { value: 512, label: "512px" },
  { value: 1024, label: "1024px" },
  { value: 2048, label: "2048px" },
];

export default function QRExportPanel() {
  const { currentQR, style } = useQRStore();
  const [format, setFormat] = useState<ExportConfig["format"]>("png");
  const [size, setSize] = useState(1024);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!currentQR) return;
    setDownloading(true);
    try {
      await downloadQR(
        currentQR.imageUrl,
        currentQR.svgContent || "",
        { format, size },
        `qrify-${currentQR.type}-${Date.now()}`
      );
    } catch (err) {
      console.error("Download failed:", err);
    }
    setDownloading(false);
  };

  const handleCopy = async () => {
    if (!currentQR?.imageUrl) return;
    const success = await copyQRToClipboard(currentQR.imageUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!currentQR) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 border border-slate-200/50 flex items-center justify-center shadow-inner">
          <Download className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 text-sm font-semibold">Generate a QR code first</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Format</label>
        <div className="grid grid-cols-1 gap-2">
          {formats.map((f) => {
            const isActive = format === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFormat(f.value)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)] border-slate-900"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white border-slate-200/30 hover:border-slate-200/60 shadow-sm bg-white/40"
                }`}
              >
                <f.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <div className="text-left min-w-0">
                  <div className={`font-bold tracking-widest ${isActive ? "text-white" : "text-slate-800"}`}>{f.label}</div>
                  <div className={`text-[10px] lowercase first-letter:uppercase ${isActive ? "text-slate-300" : "text-slate-400"}`}>{f.desc}</div>
                </div>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-lg shadow-indigo-400/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Size</label>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((s) => {
            const isActive = size === s.value;
            return (
              <button
                key={s.value}
                onClick={() => setSize(s.value)}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-950/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border-slate-200/20 hover:border-slate-200 shadow-sm"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* QR Info */}
      <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-slate-200/30 shadow-sm">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2.5">QR Specifications</div>
        <div className="text-xs text-slate-600 space-y-2 font-medium">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Type:</span>
            <span className="text-slate-800 capitalize font-bold">{currentQR.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Error Correction:</span>
            <span className="text-slate-800 font-bold">{style?.errorCorrectionLevel || "M"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Created:</span>
            <span className="text-slate-800 font-bold">
              {currentQR.createdAt instanceof Date 
                ? currentQR.createdAt.toLocaleDateString() 
                : new Date(currentQR.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Downloading..." : `Download ${format.toUpperCase()}`}
        </button>

        <button
          onClick={handleCopy}
          className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-white hover:bg-slate-50 text-slate-800 transition-all border border-slate-200/60 shadow-sm flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-bold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-slate-500" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
    </div>
  );
}
