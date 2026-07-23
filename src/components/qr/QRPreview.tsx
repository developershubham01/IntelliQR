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
    <div className="relative">
      {/* Glass Frame */}
      <div className="card-base rounded-2xl p-6 relative">
        {/* Corner Brackets */}
        <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-accent/60 rounded-tl-sm" />
        <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-accent/60 rounded-tr-sm" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-accent/60 rounded-bl-sm" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-accent/60 rounded-br-sm" />

        {/* QR Display */}
        <div className="scan-border rounded-xl p-4 bg-[background]/50 flex items-center justify-center min-h-[280px]">
          {currentQR?.imageUrl ? (
            <div className="relative animate-fade-in">
              <img
                src={currentQR.imageUrl}
                alt="Generated QR Code"
                className={`w-56 h-56 object-contain ${isGenerating ? "opacity-70 scale-[0.98]" : "opacity-100 scale-100"} transition-all duration-500`}
              />
              {currentQR.style.logoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={currentQR.style.logoUrl}
                    alt="Logo"
                    className="w-12 h-12 object-contain rounded-lg bg-[background]/80 p-1"
                  />
                </div>
              )}
              {currentQR.style.frame?.enabled && (
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  style={{
                    backgroundColor: currentQR.style.frame.color + "20",
                    color: currentQR.style.frame.color,
                    border: `1px solid ${currentQR.style.frame.color}40`,
                  }}
                >
                  {currentQR.style.frame.text}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-accent/40" />
              </div>
              <p className="text-muted-foreground text-sm">
                Fill in the details and click Generate
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                Your QR code will appear here
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {currentQR?.imageUrl && (
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all border border-border"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all border border-border"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={generateQR}
              disabled={isGenerating}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-all border border-accent/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default QRPreview;
