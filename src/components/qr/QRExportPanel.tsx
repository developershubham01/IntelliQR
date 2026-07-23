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
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center">
          <Download className="w-8 h-8 text-accent/40" />
        </div>
        <p className="text-muted-foreground text-sm">Generate a QR code first</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Format Selection */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Format</label>
        <div className="grid grid-cols-1 gap-1.5">
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                format === f.value
                  ? "bg-accent/10 text-accent border border-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              }`}
            >
              <f.icon className="w-4 h-4 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">{f.label}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Size</label>
        <div className="grid grid-cols-4 gap-1.5">
          {sizes.map((s) => (
            <button
              key={s.value}
              onClick={() => setSize(s.value)}
              className={`px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                size === s.value
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* QR Info */}
      <div className="p-3 rounded-lg bg-secondary border border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="text-muted-foreground capitalize">{currentQR.type}</span>
          </div>
          <div className="flex justify-between">
            <span>Error Correction:</span>
            <span className="text-muted-foreground">{style.errorCorrectionLevel}</span>
          </div>
          <div className="flex justify-between">
            <span>Created:</span>
            <span className="text-muted-foreground">
              {currentQR.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          {downloading ? "Downloading..." : `Download ${format.toUpperCase()}`}
        </button>

        <button
          onClick={handleCopy}
          className="w-full btn-ghost flex items-center justify-center gap-2 py-3"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </>
          )}
        </button>
      </div>
    </div>
  );
}
