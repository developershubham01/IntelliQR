import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useQRStore } from "@/store/qrStore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Sparkles, ArrowLeft, Download, Wifi, Briefcase, Ticket, Tag, 
  ZoomIn, ZoomOut, RotateCcw, AlertCircle, Check, Loader2, Info,
  Palette, Search, Filter, Layers, Maximize
} from "lucide-react";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

type TemplateCategory = "all" | "wifi" | "business" | "ticket" | "tag";
type ExportFormat = "png" | "jpg" | "svg" | "pdf";

interface QRTemplate {
  id: string;
  name: string;
  category: "wifi" | "business" | "ticket" | "tag";
  theme: string;
  border: string;
  badge: string;
  fields: Record<string, string>;
}

interface DesignTheme {
  id: string;
  name: string;
  className: string;
}

export default function Templates() {
  const { currentQR, history } = useQRStore();
  const activeQR = currentQR || history[0];

  // Dynamic Template Catalog Generation (100 Predefined Templates)
  const allTemplates = useMemo(() => {
    const list: QRTemplate[] = [];
    const themesList = ["default", "dark", "spring", "ocean", "sunset", "emerald", "gold", "cyber", "glass", "foliage"];
    const bordersList = ["none", "solid", "dotted", "double", "brackets"];

    // 25 WiFi templates
    const wifiNames = [
      "Cozy Coffee Shop WiFi", "Executive Boardroom", "VIP Guest Lounge", "Indian Chai Tapri", "Starbucks Guest 5G",
      "Home Sweet Home", "Grand Hotel Lobby", "Cyberpunk Net Café", "Airport Transit WiFi", "Co-working Space Net",
      "Art Gallery Guest", "Gym & Fitness Club", "Retro Arcade Zone", "Smart Office Network", "Public Library Quiet",
      "Rooftop Bar & Bistro", "Tesla Supercharger WiFi", "Digital Nomad Hub", "Boutique Spa Quiet", "Startup Garage Net",
      "University Campus Link", "Medical Clinic Guest", "Beach Resort Free", "Pizza Parlor WiFi", "Local Bakery Guest"
    ];
    for (let i = 0; i < 25; i++) {
      list.push({
        id: `wifi-${i}`,
        name: wifiNames[i],
        category: "wifi",
        theme: themesList[i % themesList.length],
        border: bordersList[i % bordersList.length],
        badge: i % 4 === 0 ? "wifi" : (i % 5 === 0 ? "secure" : "none"),
        fields: {
          title: wifiNames[i].toUpperCase(),
          ssid: `${wifiNames[i].replace(/\s+/g, "_")}_Guest`,
          password: `pass_code_${i * 11}`,
          note: `Welcome to ${wifiNames[i]}! Please scan to connect safely.`
        }
      });
    }

    // 25 Business card templates
    const bizNames = [
      "Corporate Director", "CTO & Co-founder", "Senior Architect", "Creative Designer", "Medical Doctor",
      "Digital Marketing Lead", "Financial Analyst", "Real Estate Broker", "Freelance Writer", "Chief CEO",
      "Music Producer", "Fashion Stylist", "Legal Consultant", "Fitness Coach", "Travel Blogger",
      "Cybersecurity Specialist", "AI Research Lead", "HR Manager", "Social Media Coordinator", "UI/UX Designer",
      "Product Manager", "Event Organizer", "Data Scientist", "Sales Executive", "Content Creator"
    ];
    for (let i = 0; i < 25; i++) {
      list.push({
        id: `business-${i}`,
        name: bizNames[i],
        category: "business",
        theme: themesList[(i + 3) % themesList.length],
        border: bordersList[i % bordersList.length],
        badge: i % 5 === 0 ? "vip" : "none",
        fields: {
          company: i % 2 === 0 ? "ABWcurious Pvt.Ltd" : "IntelliQR Global",
          name: `Shubham ${["Sharma", "Verma", "Joshi", "Patel", "Singh"][i % 5]}`,
          title: bizNames[i],
          phone: `+91 99303 38${i}04`,
          email: `info@${["abwcurious.com", "intelli-qr.com", "techlabs.co"][i % 3]}`
        }
      });
    }

    // 25 Ticket templates
    const ticketNames = [
      "Tech Summit 2026", "Rock Music Festival", "Stand-up Comedy Night", "VVIP Gala Night", "ViteConf Online",
      "Crypto Expo India", "Startup Pitch Fest", "E-sports Championship", "Indie Film Premiere", "Classical Concert",
      "Art Gallery Opening", "Food & Wine Tasting", "Business Leaders Meet", "Charity Auction Gala", "Dance Music Fest",
      "Theatre Play Pass", "Innovators Workshop", "TEDx Youth Event", "SaaS Growth Hackathon", "Gaming Arena Pass",
      "Design Thinking Seminar", "Web3 Networking Night", "Book Fair VIP Pass", "Fashion Week Ticket", "Product Launch Event"
    ];
    for (let i = 0; i < 25; i++) {
      list.push({
        id: `ticket-${i}`,
        name: ticketNames[i],
        category: "ticket",
        theme: themesList[(i + 6) % themesList.length],
        border: bordersList[i % bordersList.length],
        badge: i % 3 === 0 ? "vip" : "none",
        fields: {
          event: ticketNames[i],
          location: `${["ABWcurious Labs", "Nesco Center", "Convention Hall", "Rooftop Arena"][i % 4]}, Mumbai`,
          date: `June ${10 + i}, 2026`,
          time: `${i % 2 === 0 ? "10:00 AM" : "06:00 PM"} IST`,
          seat: `VIP-${["A", "B", "C", "D"][i % 4]}${i + 1}`,
          ticketNo: `TCK-${88293 + i * 27}`
        }
      });
    }

    // 25 Retail Tag templates
    const tagNames = [
      "Luxury Perfume Tag", "Handmade Soap Label", "Organic Honey Bottle", "Artisan Coffee Bag", "Premium Apparel Tag",
      "Designer Clothing", "Handmade Mug Tag", "Vintage Leather Wallet", "Gourmet Chocolates", "Scented Candle Label",
      "Craft Beer Tag", "Exclusive Shoes Box", "Natural Tea Pack", "Silver Jewellery Tag", "Organic Olive Oil",
      "Designer Handbag Tag", "Wooden Toys Label", "Baked Bread Tag", "Dry Fruits Jar", "Linen Shirt Label",
      "Home Decor Fragrance", "Artisan Cheese Label", "Bespoke Suit Tag", "Spices Blend Bottle", "Aura Skincare Label"
    ];
    for (let i = 0; i < 25; i++) {
      list.push({
        id: `tag-${i}`,
        name: tagNames[i],
        category: "tag",
        theme: themesList[(i + 9) % themesList.length],
        border: bordersList[i % bordersList.length],
        badge: i % 4 === 0 ? "official" : "none",
        fields: {
          product: tagNames[i],
          price: `$${(29.99 + i * 5).toFixed(2)}`,
          sku: `SKU-${tagNames[i].substring(0, 3).toUpperCase()}-${384 + i}`,
          footer: `100% ${["Organic", "Genuine", "Artisanal", "Bespoke"][i % 4]}`
        }
      });
    }

    return list;
  }, []);

  // UI Navigation / Tab State
  const [activeTab, setActiveTab] = useState<"catalog" | "customize">("catalog");

  // Template/Design State
  const [selectedTemplate, setSelectedTemplate] = useState<"wifi" | "business" | "ticket" | "tag">("wifi");
  const [zoom, setZoom] = useState(1);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [resolution, setResolution] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);

  // Template search/filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all");

  // Style Settings Override
  const [selectedTheme, setSelectedTheme] = useState<string>("default");
  const [selectedBorder, setSelectedBorder] = useState<string>("none");
  const [badgeOverlay, setBadgeOverlay] = useState<string>("none");

  // Editable fields bound to UI
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

  // Themes and Styles configuration
  const themes: DesignTheme[] = [
    { id: "default", name: "Classic White", className: "bg-white text-slate-800 border-slate-200/50" },
    { id: "dark", name: "Corporate Dark", className: "bg-[#0B1520] text-white border-slate-800" },
    { id: "spring", name: "Soft Spring", className: "bg-gradient-to-tr from-indigo-50 via-purple-50 to-pink-50 text-slate-800 border-indigo-100/50" },
    { id: "ocean", name: "Ocean Breeze", className: "bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-white border-sky-400/20" },
    { id: "sunset", name: "Sunset Haze", className: "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 text-white border-amber-400/20" },
    { id: "emerald", name: "Deep Emerald", className: "bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white border-emerald-700/20" },
    { id: "gold", name: "Golden Luxury", className: "bg-gradient-to-tr from-yellow-600 via-amber-700 to-stone-900 text-white border-yellow-500/20" },
    { id: "cyber", name: "Cyber Neon", className: "bg-gradient-to-br from-purple-900 via-violet-950 to-[#030C14] text-white border-fuchsia-500/20" },
    { id: "glass", name: "Glassmorphic Frost", className: "bg-white/60 backdrop-blur-xl border border-white/60 text-slate-800 shadow-sm" },
    { id: "foliage", name: "Indian Tea", className: "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 text-slate-800 border-teal-100/50" }
  ];

  const borders = [
    { id: "none", name: "Clean No Border", className: "border-none" },
    { id: "solid", name: "Sleek Accent Line", className: "border-2 border-indigo-500/55" },
    { id: "dotted", name: "Dot-Dash Outline", className: "border-4 border-dotted border-indigo-400/40" },
    { id: "double", name: "Thick Double Trim", className: "border-double border-4 border-slate-800/80" },
    { id: "brackets", name: "Vintage Corner Brackets", className: "relative border-none" }
  ];

  const badges = [
    { id: "none", name: "No Badge" },
    { id: "vip", name: "VIP Access", color: "bg-amber-500 text-slate-950" },
    { id: "wifi", name: "Scan to Connect", color: "bg-indigo-600 text-white" },
    { id: "official", name: "Official Product", color: "bg-emerald-600 text-white" },
    { id: "secure", name: "100% Secure Link", color: "bg-sky-600 text-white" }
  ];

  const getThemeClass = () => themes.find(t => t.id === selectedTheme) || themes[0];
  const getBorderClass = () => borders.find(b => b.id === selectedBorder) || borders[0];
  const getBadge = () => badges.find(b => b.id === badgeOverlay) || badges[0];

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.6));
  const handleResetZoom = () => setZoom(1);

  // Apply template layout and fields from visual catalog card selection
  const selectCatalogTemplate = (tpl: QRTemplate) => {
    setSelectedTemplate(tpl.category);
    setSelectedTheme(tpl.theme);
    setSelectedBorder(tpl.border);
    setSelectedBadgeOverlay(tpl.badge);

    // Apply specific fields
    if (tpl.category === "wifi") {
      setWifiData({
        title: tpl.fields.title || "",
        ssid: tpl.fields.ssid || "",
        password: tpl.fields.password || "",
        note: tpl.fields.note || ""
      });
    } else if (tpl.category === "business") {
      setBusinessData({
        company: tpl.fields.company || "",
        name: tpl.fields.name || "",
        title: tpl.fields.title || "",
        phone: tpl.fields.phone || "",
        email: tpl.fields.email || ""
      });
    } else if (tpl.category === "ticket") {
      setTicketData({
        event: tpl.fields.event || "",
        location: tpl.fields.location || "",
        date: tpl.fields.date || "",
        time: tpl.fields.time || "",
        seat: tpl.fields.seat || "",
        ticketNo: tpl.fields.ticketNo || ""
      });
    } else if (tpl.category === "tag") {
      setTagData({
        product: tpl.fields.product || "",
        price: tpl.fields.price || "",
        sku: tpl.fields.sku || "",
        footer: tpl.fields.footer || ""
      });
    }

    // Proactively switch tab to show customized inputs on smaller viewports
    setActiveTab("customize");
    toast.success(`Loaded style: ${tpl.name}`);
  };

  // Helper because typescript checks state matching keys strictly
  const setSelectedBadgeOverlay = (badge: string) => {
    setBadgeOverlay(badge);
  };

  // Filtered Templates selector (calculates dynamic catalog list)
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter(t => {
      const matchCat = selectedCategory === "all" || t.category === selectedCategory;
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.fields.ssid && t.fields.ssid.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.fields.product && t.fields.product.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (t.fields.event && t.fields.event.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allTemplates, selectedCategory, searchQuery]);

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
        <div className="max-w-[1550px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col lg:h-[calc(100vh-8rem)]">
          
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
                  <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  QR Template Compositor
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Browse 100+ premade visual cards, click to load layout presets, and download instantly.
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

          {/* Three-Column Professional Workspace Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
            
            {/* COLUMN 1: Workspace / Live Preview Canvas (Spans 5 cols) */}
            <div className="lg:col-span-5 bg-slate-100/50 border border-slate-200/40 rounded-[32px] overflow-hidden relative flex items-center justify-center p-6 min-h-[380px] lg:min-h-0 shadow-inner">
              
              {/* Canvas Board Area */}
              <div 
                className="transition-transform duration-200 ease-out origin-center flex items-center justify-center"
                style={{ transform: `scale(${zoom})` }}
              >
                {/* 1. WiFi Tent Card (Portrait / Foldable Stand) */}
                {selectedTemplate === "wifi" && (
                  <div 
                    ref={canvasRef}
                    className={`w-[310px] h-[440px] shadow-xl rounded-[28px] p-6 flex flex-col items-center justify-between relative overflow-hidden border ${getThemeClass().className} ${getBorderClass().id !== "brackets" ? getBorderClass().className : ""}`}
                  >
                    {/* Brackets Corner overlay */}
                    {getBorderClass().id === "brackets" && (
                      <>
                        <div className="absolute top-4 left-4 w-5 h-5 border-l-2 border-t-2 border-indigo-500/40 rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-5 h-5 border-r-2 border-t-2 border-indigo-500/40 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-5 h-5 border-l-2 border-b-2 border-indigo-500/40 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-5 h-5 border-r-2 border-b-2 border-indigo-500/40 rounded-br-lg" />
                      </>
                    )}

                    {/* Badge Overlay */}
                    {getBadge().id !== "none" && (
                      <div className={`absolute top-4 left-4 px-2.5 py-0.5 rounded-full text-[6px] font-bold uppercase tracking-wider ${getBadge().color}`}>
                        {getBadge().name}
                      </div>
                    )}

                    <div className="text-center mt-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-1.5">
                        <Wifi className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h2 className="text-xs font-bold tracking-wider uppercase">{wifiData.title}</h2>
                      <div className="w-10 h-0.5 bg-slate-200/50 mx-auto mt-1" />
                    </div>

                    {/* QR Embedding */}
                    <div className="p-3 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[20px] flex items-center justify-center relative">
                      <img 
                        src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                        alt="QR Code Embed"
                        className="w-32 h-32 object-contain"
                      />
                    </div>

                    <div className="w-full space-y-1.5 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-center">
                      <div>
                        <span className="text-[7px] font-bold opacity-60 uppercase tracking-widest block">Network SSID</span>
                        <span className="text-[11px] font-extrabold">{wifiData.ssid}</span>
                      </div>
                      <div className="w-full h-px bg-white/10" />
                      <div>
                        <span className="text-[7px] font-bold opacity-60 uppercase tracking-widest block">Password</span>
                        <span className="text-[11px] font-extrabold">{wifiData.password}</span>
                      </div>
                    </div>

                    <p className="text-[7px] opacity-60 font-semibold text-center max-w-[200px] mb-1">
                      {wifiData.note}
                    </p>
                  </div>
                )}

                {/* 2. Corporate Business Card (Landscape) */}
                {selectedTemplate === "business" && (
                  <div 
                    ref={canvasRef}
                    className={`w-[440px] h-[260px] shadow-xl rounded-[20px] p-6 flex items-center justify-between relative overflow-hidden border ${getThemeClass().className} ${getBorderClass().id !== "brackets" ? getBorderClass().className : ""}`}
                  >
                    {/* Brackets Corner overlay */}
                    {getBorderClass().id === "brackets" && (
                      <>
                        <div className="absolute top-4 left-4 w-5 h-5 border-l-2 border-t-2 border-indigo-500/40 rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-5 h-5 border-r-2 border-t-2 border-indigo-500/40 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-5 h-5 border-l-2 border-b-2 border-indigo-500/40 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-5 h-5 border-r-2 border-b-2 border-indigo-500/40 rounded-br-lg" />
                      </>
                    )}

                    {/* Badge Overlay */}
                    {getBadge().id !== "none" && (
                      <div className={`absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[6px] font-bold uppercase tracking-wider ${getBadge().color}`}>
                        {getBadge().name}
                      </div>
                    )}
                    
                    {/* Left Info block */}
                    <div className="flex flex-col justify-between h-full relative z-10 max-w-[230px]">
                      <div>
                        <span className="text-[8px] font-bold text-indigo-400 tracking-widest uppercase mb-1 block">
                          {businessData.company}
                        </span>
                        <h2 className="text-lg font-serif tracking-tight font-medium mb-0.5">{businessData.name}</h2>
                        <span className="text-[7px] font-bold opacity-60 tracking-wider uppercase block">{businessData.title}</span>
                      </div>

                      <div className="space-y-1 border-l border-indigo-500/30 pl-2.5">
                        <p className="text-[8px] font-semibold opacity-80">{businessData.phone}</p>
                        <p className="text-[8px] font-semibold opacity-80">{businessData.email}</p>
                      </div>
                    </div>

                    {/* Right QR block */}
                    <div className="flex flex-col items-center justify-center relative z-10 bg-white p-2.5 rounded-xl shadow-md border border-white/5">
                      <img 
                        src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                        alt="QR Code Embed"
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Event ticket / Pass (Horizontal) */}
                {selectedTemplate === "ticket" && (
                  <div 
                    ref={canvasRef}
                    className={`w-[460px] h-[190px] shadow-xl rounded-2xl flex overflow-hidden relative border ${getThemeClass().className} ${getBorderClass().id !== "brackets" ? getBorderClass().className : ""}`}
                  >
                    {/* Brackets Corner overlay */}
                    {getBorderClass().id === "brackets" && (
                      <>
                        <div className="absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 border-indigo-500/40 rounded-tl-lg" />
                        <div className="absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 border-indigo-500/40 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-indigo-500/40 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-indigo-500/40 rounded-br-lg" />
                      </>
                    )}

                    {/* Left main stub */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-[7px] font-bold text-indigo-500 uppercase tracking-widest mb-1.5">
                          ADMIT ONE
                        </span>
                        <h2 className="text-sm font-bold tracking-tight leading-tight">{ticketData.event}</h2>
                        <p className="text-[8px] opacity-60 font-semibold mt-0.5">{ticketData.location}</p>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 border-t border-white/10 pt-2">
                        <div>
                          <span className="text-[6px] font-bold opacity-50 uppercase tracking-widest block">Date</span>
                          <span className="text-[8px] font-extrabold">{ticketData.date}</span>
                        </div>
                        <div>
                          <span className="text-[6px] font-bold opacity-50 uppercase tracking-widest block">Time</span>
                          <span className="text-[8px] font-extrabold">{ticketData.time}</span>
                        </div>
                        <div>
                          <span className="text-[6px] font-bold opacity-50 uppercase tracking-widest block">Seat</span>
                          <span className="text-[8px] font-extrabold text-indigo-500">{ticketData.seat}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dotted border ticket stub separator */}
                    <div className="w-px h-full border-l border-dashed border-white/20 relative">
                      <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-slate-100 border border-slate-200/50" />
                      <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-100 border border-slate-200/50" />
                    </div>

                    {/* Right stub */}
                    <div className="w-[130px] bg-white/5 backdrop-blur-sm p-4 flex flex-col items-center justify-between text-center">
                      <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm mt-2">
                        <img 
                          src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                          alt="QR Code Embed"
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[6px] opacity-60 block tracking-widest mt-1">{ticketData.ticketNo}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Product Retail Tag */}
                {selectedTemplate === "tag" && (
                  <div 
                    ref={canvasRef}
                    className={`w-[260px] h-[410px] shadow-xl rounded-2xl p-5 flex flex-col items-center justify-between relative overflow-hidden border ${getThemeClass().className} ${getBorderClass().id !== "brackets" ? getBorderClass().className : ""}`}
                  >
                    {/* Brackets Corner overlay */}
                    {getBorderClass().id === "brackets" && (
                      <>
                        <div className="absolute top-6 left-4 w-4 h-4 border-l-2 border-t-2 border-indigo-500/40 rounded-tl-lg" />
                        <div className="absolute top-6 right-4 w-4 h-4 border-r-2 border-t-2 border-indigo-500/40 rounded-tr-lg" />
                        <div className="absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 border-indigo-500/40 rounded-bl-lg" />
                        <div className="absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 border-indigo-500/40 rounded-br-lg" />
                      </>
                    )}

                    {/* Decorative hole & string */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-200/50 shadow-inner flex items-center justify-center">
                        <div className="w-0.5 h-0.5 rounded-full bg-slate-300" />
                      </div>
                      <div className="w-0.5 h-2.5 bg-slate-300" />
                    </div>

                    <div className="text-center mt-6 w-full">
                      <span className="text-[7px] opacity-60 uppercase tracking-widest block mb-0.5">Product Label</span>
                      <h2 className="text-xs font-bold tracking-tight truncate px-2">{tagData.product}</h2>
                      <span className="text-[9px] opacity-40 block mt-0.5">{tagData.sku}</span>
                    </div>

                    {/* QR Code Container */}
                    <div className="my-2 bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-xl shadow-inner flex items-center justify-center">
                      <img 
                        src={activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR"} 
                        alt="QR Code Embed"
                        className="w-28 h-28 object-contain bg-white p-1.5 rounded-lg"
                      />
                    </div>

                    {/* Price and Details */}
                    <div className="text-center w-full mb-1">
                      <span className="text-[7px] opacity-60 uppercase tracking-widest block">Retail Price</span>
                      <div className="text-xl font-extrabold tracking-tight mt-0.5">{tagData.price}</div>
                      <div className="w-10 h-0.5 bg-slate-100/10 mx-auto my-1.5" />
                      <p className="text-[7px] font-bold uppercase tracking-widest opacity-60">{tagData.footer}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Canvas drag/move details hint at top */}
              <div className="absolute top-4 left-6 right-6 text-center select-none pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <Info className="w-3 h-3" />
                  Design workspace. Search templates or customize parameters on the right!
                </span>
              </div>
            </div>

            {/* Responsive Tab Bar on Medium/Mobile viewports */}
            <div className="lg:hidden flex border-b border-slate-200 mt-2">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "catalog" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"
                }`}
              >
                Browse 100 Templates
              </button>
              <button
                onClick={() => setActiveTab("customize")}
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === "customize" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"
                }`}
              >
                Customize Layout
              </button>
            </div>

            {/* COLUMN 2: Active Card Customizer & Stylist (Spans 3 cols) */}
            <div className={`lg:col-span-3 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 overflow-y-auto flex flex-col h-full gap-5 ${
              activeTab === "customize" ? "flex" : "hidden lg:flex"
            }`}>
              
              {/* Step A: Stylist Settings */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                  Style Overrides
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Color Theme</label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => setSelectedTheme(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-700 font-bold"
                    >
                      {themes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Border</label>
                    <select
                      value={selectedBorder}
                      onChange={(e) => setSelectedBorder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-700 font-bold"
                    >
                      {borders.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stamp Badge</label>
                    <select
                      value={badgeOverlay}
                      onChange={(e) => setBadgeOverlay(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200/60 bg-white text-xs focus:outline-none focus:border-indigo-500 text-slate-700 font-bold"
                    >
                      {badges.map((bg) => (
                        <option key={bg.id} value={bg.id}>{bg.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step B: Editable Fields */}
              <div className="flex-1 flex flex-col min-h-0 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Maximize className="w-3.5 h-3.5 text-slate-400" />
                  Customize Text
                </h3>

                <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                  {selectedTemplate === "wifi" && (
                    <>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">SSID Heading</label>
                        <input
                          type="text"
                          value={wifiData.title}
                          onChange={(e) => setWifiData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Network Name</label>
                        <input
                          type="text"
                          value={wifiData.ssid}
                          onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
                        <input
                          type="text"
                          value={wifiData.password}
                          onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Info / Welcome note</label>
                        <textarea
                          rows={3}
                          value={wifiData.note}
                          onChange={(e) => setWifiData(prev => ({ ...prev, note: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold resize-none"
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate === "business" && (
                    <>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company Name</label>
                        <input
                          type="text"
                          value={businessData.company}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input
                          type="text"
                          value={businessData.name}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Job Title</label>
                        <input
                          type="text"
                          value={businessData.title}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={businessData.phone}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="text"
                          value={businessData.email}
                          onChange={(e) => setBusinessData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                    </>
                  )}

                  {selectedTemplate === "ticket" && (
                    <>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Event Title</label>
                        <input
                          type="text"
                          value={ticketData.event}
                          onChange={(e) => setTicketData(prev => ({ ...prev, event: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Venue / Location</label>
                        <input
                          type="text"
                          value={ticketData.location}
                          onChange={(e) => setTicketData(prev => ({ ...prev, location: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</label>
                          <input
                            type="text"
                            value={ticketData.date}
                            onChange={(e) => setTicketData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time</label>
                          <input
                            type="text"
                            value={ticketData.time}
                            onChange={(e) => setTicketData(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seat Code</label>
                          <input
                            type="text"
                            value={ticketData.seat}
                            onChange={(e) => setTicketData(prev => ({ ...prev, seat: e.target.value }))}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Number</label>
                          <input
                            type="text"
                            value={ticketData.ticketNo}
                            onChange={(e) => setTicketData(prev => ({ ...prev, ticketNo: e.target.value }))}
                            className="w-full px-2 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedTemplate === "tag" && (
                    <>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Product Title</label>
                        <input
                          type="text"
                          value={tagData.product}
                          onChange={(e) => setTagData(prev => ({ ...prev, product: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price Tag</label>
                        <input
                          type="text"
                          value={tagData.price}
                          onChange={(e) => setTagData(prev => ({ ...prev, price: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">SKU / SKU code</label>
                        <input
                          type="text"
                          value={tagData.sku}
                          onChange={(e) => setTagData(prev => ({ ...prev, sku: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tag Footer Text</label>
                        <input
                          type="text"
                          value={tagData.footer}
                          onChange={(e) => setTagData(prev => ({ ...prev, footer: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200/65 bg-white text-xs text-slate-800 font-semibold"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Step C: Exporter formats */}
              <div className="border-t border-slate-100 pt-4">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {(["png", "jpg", "svg", "pdf"] as ExportFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setExportFormat(fmt)}
                        className={`flex-1 py-2 text-center rounded-xl text-[9px] font-extrabold uppercase tracking-wider border transition-all ${
                          exportFormat === fmt
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {fmt}
                      </button>
                    ))}
                  </div>

                  {exportFormat !== "pdf" && exportFormat !== "svg" && (
                    <div className="flex items-center justify-between bg-slate-50/60 border border-slate-100 px-3 py-2 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Resolution</span>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((res) => (
                          <button
                            key={res}
                            onClick={() => setResolution(res)}
                            className={`w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
                              resolution === res
                                ? "bg-slate-950 text-white"
                                : "bg-white text-slate-500 border border-slate-200/50 hover:bg-slate-100"
                            }`}
                          >
                            {res}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleDownload}
                    disabled={isExporting}
                    className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Generating Files...
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        Download Design
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

            {/* COLUMN 3: Browse 100 Templates Catalog (Spans 4 cols) */}
            <div className={`lg:col-span-4 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-6 overflow-hidden flex flex-col h-full gap-4 ${
              activeTab === "catalog" ? "flex" : "hidden lg:flex"
            }`}>
              
              {/* Category Search & Filter */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  Browse 100 Templates
                </h3>
                
                {/* Search Inputs */}
                <div className="relative mb-3 bg-white border border-slate-200/60 rounded-2xl px-3 py-2 flex items-center shadow-sm">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search card names or parameters..."
                    className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full text-slate-800 font-semibold"
                  />
                </div>

                {/* Category Filters Pill Box */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {[
                    { id: "all", label: "All Templates" },
                    { id: "wifi", label: "WiFi" },
                    { id: "business", label: "Business" },
                    { id: "ticket", label: "Tickets" },
                    { id: "tag", label: "Product Tags" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id as TemplateCategory)}
                      className={`px-3 py-1.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap border transition-all ${
                        selectedCategory === cat.id
                          ? "bg-slate-900 border-slate-900 text-white"
                          : "bg-white border-slate-200/60 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable Templates Grid List */}
              <div className="flex-1 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <AnimatePresence>
                    {filteredTemplates.map((tpl) => (
                      <motion.button
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={tpl.id}
                        onClick={() => selectCatalogTemplate(tpl)}
                        className={`p-3 rounded-2xl text-left border bg-white hover:border-slate-300 transition-all flex flex-col gap-2 relative overflow-hidden group shadow-sm ${
                          selectedTemplate === tpl.category && selectedTheme === tpl.theme && selectedBorder === tpl.border
                            ? "ring-2 ring-indigo-500 border-transparent bg-indigo-50/10"
                            : ""
                        }`}
                      >
                        {/* Little thumbnail badge style indicator */}
                        <div className="flex items-center justify-between">
                          <span className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            {tpl.category === "wifi" && <Wifi className="w-3 h-3" />}
                            {tpl.category === "business" && <Briefcase className="w-3 h-3" />}
                            {tpl.category === "ticket" && <Ticket className="w-3 h-3" />}
                            {tpl.category === "tag" && <Tag className="w-3 h-3" />}
                          </span>
                          <span className="text-[7px] font-bold text-slate-400 uppercase bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
                            {tpl.theme}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-[10px] font-bold text-slate-800 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors truncate">
                            {tpl.name}
                          </h4>
                          <span className="text-[8px] font-semibold text-slate-400 tracking-wider uppercase">
                            {tpl.category}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>

                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400 font-bold">No templates found matching query.</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
