import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useQRStore } from "@/store/qrStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Sparkles, ArrowLeft, Download, Wifi, Briefcase, Ticket, Tag, 
  ZoomIn, ZoomOut, RotateCcw, AlertCircle, Check, Loader2, Info
} from "lucide-react";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

type TemplateType = "wifi" | "business" | "ticket" | "tag";
type ExportFormat = "png" | "jpg" | "svg" | "pdf";

export default function Templates() {
  const { currentQR, history } = useQRStore();
  const activeQR = currentQR || history[0];

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("wifi");
  const [zoom, setZoom] = useState(1);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [resolution, setResolution] = useState<number>(2); // 1x, 2x, 3x
  const [isExporting, setIsExporting] = useState(false);

  // Template Custom Fields
  const [wifiData, setWifiData] = useState({
    title: "SCAN TO CONNECT",
    ssid: "IntelliQR_Guest_5G",
    password: "password123",
    note: "Please ask staff for help if you cannot connect."
  });

  const [businessData, setBusinessData] = useState({
    name: "Shubham Sharma",
    title: "Founder & CTO",
    phone: "+91 99303 38504",
    email: "info@abwcurious.com",
    company: "ABWcurious Pvt.Ltd"
  });

  const [ticketData, setTicketData] = useState({
    event: "Developer Conference 2026",
    location: "ABWcurious Labs, Navi Mumbai",
    date: "June 30, 2026",
    time: "10:00 AM IST",
    seat: "VIP-A12",
    ticketNo: "TCK-99428-X"
  });

  const [tagData, setTagData] = useState({
    product: "Premium Leather Wallet",
    price: "$49.99",
    sku: "SKU-WL-884-BRN",
    footer: "100% Genuine Leather"
  });

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.6));
  const handleResetZoom = () => setZoom(1);

  // Export Logic
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading("Generating template files...");

    try {
      const options = {
        pixelRatio: resolution,
        backgroundColor: "transparent",
        style: {
          transform: "scale(1)",
          transformOrigin: "top left",
          width: canvasRef.current.offsetWidth + "px",
          height: canvasRef.current.offsetHeight + "px"
        }
      };

      const filename = `intelliqr-template-${selectedTemplate}-${Date.now()}`;

      if (exportFormat === "png") {
        const dataUrl = await toPng(canvasRef.current, options);
        triggerDownload(dataUrl, `${filename}.png`);
      } else if (exportFormat === "jpg") {
        const dataUrl = await toJpeg(canvasRef.current, { ...options, quality: 0.95 });
        triggerDownload(dataUrl, `${filename}.jpg`);
      } else if (exportFormat === "svg") {
        const dataUrl = await toSvg(canvasRef.current, options);
        triggerDownload(dataUrl, `${filename}.svg`);
      } else if (exportFormat === "pdf") {
        const dataUrl = await toPng(canvasRef.current, { ...options, pixelRatio: 2 });
        const pdf = new jsPDF({
          orientation: canvasRef.current.offsetWidth > canvasRef.current.offsetHeight ? "landscape" : "portrait",
          unit: "px",
          format: [canvasRef.current.offsetWidth, canvasRef.current.offsetHeight]
        });
        pdf.addImage(dataUrl, "PNG", 0, 0, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);
        pdf.save(`${filename}.pdf`);
      }

      toast.success("Design exported successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate files. Please try again.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  const triggerDownload = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <Header />

      <div className="relative z-10 pt-28 pb-10 flex-1 flex flex-col">
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:h-[calc(100vh-8rem)]">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100/60 pb-4">
            <div className="flex items-center gap-3">
              <Link
                to="/generator"
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-all border border-slate-200/50 shadow-sm bg-white/40"
                title="Back to Generator"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  QR Template Compositor
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Embed your active QR code into premium physical print designs.
                </p>
              </div>
            </div>

            {/* Canvas Zoom Tools */}
            <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1 border border-white/80 shadow-sm rounded-full self-start sm:self-auto">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold text-slate-600 px-2 min-w-[45px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button
                onClick={handleResetZoom}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!activeQR && (
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-800">No active QR code detected</h3>
                <p className="text-xs text-amber-700/80 font-medium mt-1">
                  You are editing templates using a placeholder QR. Generate a QR code in the <Link to="/generator" className="underline font-bold">Generator dashboard</Link> to embed your own dynamic configuration!
                </p>
              </div>
            </div>
          )}

          {/* Main Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
            
            {/* Left Design Canvas Workspace */}
            <div className="lg:col-span-8 bg-slate-100/50 border border-slate-200/40 rounded-[32px] overflow-hidden relative flex items-center justify-center p-8 min-h-[400px] lg:min-h-0 shadow-inner">
              
              {/* Canvas Board Area */}
              <div 
                className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
                style={{ transform: `scale(${zoom})` }}
              >
                {/* 1. WiFi Tent Card (Portrait / Foldable Stand) */}
                {selectedTemplate === "wifi" && (
                  <div 
                    ref={canvasRef}
                    className="w-[340px] h-[480px] bg-amber-50/50 border border-amber-200/50 shadow-2xl rounded-[32px] p-8 flex flex-col items-center justify-between relative overflow-hidden bg-white"
                  >
                    {/* Decorative Header Arc */}
                    <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-amber-400 via-indigo-500 to-purple-600" />
                    
                    <div className="text-center mt-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                        <Wifi className="w-6 h-6 text-indigo-600" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800 tracking-wider uppercase">{wifiData.title}</h2>
                      <div className="w-12 h-0.5 bg-slate-200 mx-auto mt-2" />
                    </div>

                    {/* QR Embedding */}
                    <div className="p-4 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[24px] flex items-center justify-center relative">
                      <img 
                        src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                        alt="QR Code Embed"
                        className="w-36 h-36 object-contain"
                      />
                    </div>

                    <div className="w-full space-y-3 bg-slate-50/60 border border-slate-100 p-4 rounded-2xl text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Network SSID</span>
                        <span className="text-sm font-extrabold text-slate-700">{wifiData.ssid}</span>
                      </div>
                      <div className="w-full h-px bg-slate-100" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Password</span>
                        <span className="text-sm font-extrabold text-slate-700">{wifiData.password}</span>
                      </div>
                    </div>

                    <p className="text-[9px] text-slate-400 font-semibold text-center max-w-[220px] mb-4">
                      {wifiData.note}
                    </p>
                  </div>
                )}

                {/* 2. Corporate Business Card (Landscape) */}
                {selectedTemplate === "business" && (
                  <div 
                    ref={canvasRef}
                    className="w-[500px] h-[290px] bg-slate-900 border border-slate-800 shadow-2xl rounded-[24px] p-8 flex items-center justify-between relative overflow-hidden bg-white text-white"
                    style={{ backgroundColor: "#0B1520" }}
                  >
                    {/* Diagonal accent slash */}
                    <div className="absolute top-0 right-0 w-44 h-full bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent -z-0 pointer-events-none transform skew-x-12 origin-top-right" />
                    
                    {/* Left Info block */}
                    <div className="flex flex-col justify-between h-full relative z-10 max-w-[260px]">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase mb-1.5 block">
                          {businessData.company}
                        </span>
                        <h2 className="text-2xl font-serif tracking-tight font-medium mb-1 text-white">{businessData.name}</h2>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">{businessData.title}</span>
                      </div>

                      <div className="space-y-2 border-l border-indigo-500/30 pl-3">
                        <p className="text-[10px] font-semibold text-slate-300">{businessData.phone}</p>
                        <p className="text-[10px] font-semibold text-slate-300">{businessData.email}</p>
                      </div>
                    </div>

                    {/* Right QR block */}
                    <div className="flex flex-col items-center justify-center relative z-10 bg-white p-3 rounded-2xl shadow-lg border border-white/5">
                      <img 
                        src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                        alt="QR Code Embed"
                        className="w-28 h-28 object-contain"
                      />
                      <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Scan vCard</span>
                    </div>
                  </div>
                )}

                {/* 3. Event ticket / Pass (Horizontal) */}
                {selectedTemplate === "ticket" && (
                  <div 
                    ref={canvasRef}
                    className="w-[520px] h-[210px] bg-white border border-slate-200 shadow-2xl rounded-3xl flex overflow-hidden relative"
                  >
                    {/* Left main stub */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-3">
                          <Ticket className="w-3 h-3" />
                          ADMIT ONE
                        </span>
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{ticketData.event}</h2>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">{ticketData.location}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Date</span>
                          <span className="text-[10px] font-extrabold text-slate-700">{ticketData.date}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Time</span>
                          <span className="text-[10px] font-extrabold text-slate-700">{ticketData.time}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Seat</span>
                          <span className="text-[10px] font-extrabold text-indigo-600">{ticketData.seat}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dotted border ticket stub separator */}
                    <div className="w-px h-full border-l border-dashed border-slate-300 relative">
                      <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-100 border border-slate-200" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-100 border border-slate-200" />
                    </div>

                    {/* Right stub */}
                    <div className="w-[160px] bg-slate-50/50 p-6 flex flex-col items-center justify-between text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        <img 
                          src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                          alt="QR Code Embed"
                          className="w-20 h-20 object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[8px] font-bold text-slate-400 block tracking-widest">{ticketData.ticketNo}</span>
                        <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 block">Scan at Gate</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Product Retail Tag */}
                {selectedTemplate === "tag" && (
                  <div 
                    ref={canvasRef}
                    className="w-[280px] h-[450px] bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 flex flex-col items-center justify-between relative overflow-hidden"
                  >
                    {/* Decorative hole & string */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                      <div className="w-3.5 h-3.5 rounded-full bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      </div>
                      <div className="w-0.5 h-4 bg-slate-300" />
                    </div>

                    <div className="text-center mt-12 w-full">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Authentic Product</span>
                      <h2 className="text-base font-bold text-slate-800 tracking-tight truncate px-4">{tagData.product}</h2>
                      <span className="text-xs font-semibold text-slate-400 block mt-0.5">{tagData.sku}</span>
                    </div>

                    {/* QR Code Container */}
                    <div className="my-4 bg-slate-50 border border-slate-100 p-3 rounded-2xl shadow-inner flex items-center justify-center">
                      <img 
                        src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                        alt="QR Code Embed"
                        className="w-32 h-32 object-contain bg-white p-2 rounded-lg"
                      />
                    </div>

                    {/* Price and Details */}
                    <div className="text-center w-full mb-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Retail Price</span>
                      <div className="text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">{tagData.price}</div>
                      <div className="w-16 h-0.5 bg-slate-100 mx-auto my-3" />
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tagData.footer}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas drag/move details hint at top */}
              <div className="absolute top-4 left-6 right-6 text-center select-none pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <Info className="w-3 h-3" />
                  Visual design workspace is live. Modify text values in the side panel!
                </span>
              </div>
            </div>

            {/* Right Editor Controls Sidebar */}
            <div className="lg:col-span-4 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 overflow-y-auto flex flex-col h-full gap-6">
              
              {/* Step 1: Select Template */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  1. Select Design Template
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "wifi", label: "WiFi Tent", icon: Wifi },
                    { id: "business", label: "Biz Card", icon: Briefcase },
                    { id: "ticket", label: "Event Ticket", icon: Ticket },
                    { id: "tag", label: "Product Tag", icon: Tag },
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() => setSelectedTemplate(temp.id as TemplateType)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-2 relative overflow-hidden ${
                        selectedTemplate === temp.id
                          ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                          : "bg-white border-slate-200/60 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <temp.icon className={`w-4 h-4 ${selectedTemplate === temp.id ? "text-indigo-400" : "text-slate-400"}`} />
                      <span className="text-[11px] font-bold tracking-tight">{temp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Customize Fields */}
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  2. Customize Text Fields
                </h3>

                <div className="space-y-4 flex-1 overflow-y-auto pr-1">
                  
                  {/* WiFi Fields */}
                  {selectedTemplate === "wifi" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Card Heading</label>
                        <input
                          type="text"
                          value={wifiData.title}
                          onChange={(e) => setWifiData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">WiFi Network SSID</label>
                        <input
                          type="text"
                          value={wifiData.ssid}
                          onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">WiFi Password</label>
                        <input
                          type="text"
                          value={wifiData.password}
                          onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Footer Note</label>
                        <textarea
                          rows={3}
                          value={wifiData.note}
                          onChange={(e) => setWifiData(prev => ({ ...prev, note: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm resize-none"
                        />
                      </div>
                    </>
                  )}

                  {/* Business Card Fields */}
                  {selectedTemplate === "business" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Company Name</label>
                        <input
                          type="text"
                          value={businessData.company}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={businessData.name}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Job Title</label>
                        <input
                          type="text"
                          value={businessData.title}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                        <input
                          type="text"
                          value={businessData.phone}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                          type="text"
                          value={businessData.email}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                    </>
                  )}

                  {/* Event Ticket Fields */}
                  {selectedTemplate === "ticket" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Event Title</label>
                        <input
                          type="text"
                          value={ticketData.event}
                          onChange={(e) => setTicketData(prev => ({ ...prev, event: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location / Venue</label>
                        <input
                          type="text"
                          value={ticketData.location}
                          onChange={(e) => setTicketData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                          <input
                            type="text"
                            value={ticketData.date}
                            onChange={(e) => setTicketData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Time</label>
                          <input
                            type="text"
                            value={ticketData.time}
                            onChange={(e) => setTicketData(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seat / Class</label>
                          <input
                            type="text"
                            value={ticketData.seat}
                            onChange={(e) => setTicketData(prev => ({ ...prev, seat: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ticket ID</label>
                          <input
                            type="text"
                            value={ticketData.ticketNo}
                            onChange={(e) => setTicketData(prev => ({ ...prev, ticketNo: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Product Tag Fields */}
                  {selectedTemplate === "tag" && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Product Name</label>
                        <input
                          type="text"
                          value={tagData.product}
                          onChange={(e) => setTagData(prev => ({ ...prev, product: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Price Display</label>
                        <input
                          type="text"
                          value={tagData.price}
                          onChange={(e) => setTagData(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">SKU / Code</label>
                        <input
                          type="text"
                          value={tagData.sku}
                          onChange={(e) => setTagData(prev => ({ ...prev, sku: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Footer Accent Text</label>
                        <input
                          type="text"
                          value={tagData.footer}
                          onChange={(e) => setTagData(prev => ({ ...prev, footer: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step 3: Download Panel (Export formats & resolutions) */}
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  3. Export Settings
                </h3>

                <div className="space-y-4">
                  {/* Format Selector */}
                  <div className="flex gap-2">
                    {(["png", "jpg", "svg", "pdf"] as ExportFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`flex-1 py-2 text-center rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all ${
                          exportFormat === fmt
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {/* Resolution Selector (Not visible for PDF/SVG as they are vector/high res by default) */}
                  {exportFormat !== "pdf" && exportFormat !== "svg" && (
                    <div className="flex items-center justify-between bg-slate-50/60 border border-slate-100 px-3 py-2 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Export Resolution</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3].map((res) => (
                          <button
                            key={res}
                            onClick={() => setResolution(res)}
                            className={`w-7 h-7 rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
                              resolution === res
                                ? "bg-slate-900 text-white"
                                : "bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-100"
                            }`}
                          >
                            {res}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Files...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Design
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
