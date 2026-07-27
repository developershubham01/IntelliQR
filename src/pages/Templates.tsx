import { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { useQRStore } from "@/store/qrStore";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TEMPLATES_DATA } from "@/data/templates";
import type { QRTemplate } from "@/data/templates";
import { 
  Sparkles, ArrowLeft, Download, Wifi, Briefcase, Ticket, Tag, 
  ZoomIn, ZoomOut, RotateCcw, AlertCircle, Check, Loader2, Info,
  Palette, Search, Filter, Layers, Maximize, Heart, Eye, Star, 
  Share2, Grid, List, ChevronUp, X, CheckCircle, Smartphone, 
  Monitor, Globe, Mail, Phone, MessageSquare, BookOpen, 
  Stethoscope, Landmark, Play, Trophy, Dumbbell, Code, ShoppingBag, MapPin, HeartHandshake, HelpCircle, Lock
} from "lucide-react";
import { toPng, toJpeg, toSvg } from "html-to-image";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

type ExportFormat = "png" | "jpg" | "svg" | "pdf";

export default function Templates() {
  // Auth Gate - Redirect to /login if unauthenticated
  const { user, isLoading: isAuthLoading } = useAuth({ redirectOnUnauthenticated: true });
  
  const { currentQR, history } = useQRStore();
  const activeQR = currentQR || history[0];

  // Navigation states
  const [viewMode, setViewMode] = useState<"catalog" | "edit">("catalog");
  const [selectedTemplate, setSelectedTemplate] = useState<QRTemplate | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<QRTemplate | null>(null);
  
  // Customizer canvas states
  const [zoom, setZoom] = useState(1);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [resolution, setResolution] = useState<number>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  
  // Customizer styling overrides
  const [customTheme, setCustomTheme] = useState<string>("#4F46E5");
  const [customSecondaryTheme, setCustomSecondaryTheme] = useState<string>("#818CF8");
  const [customBorder, setCustomBorder] = useState<string>("none");
  const [customBadge, setCustomBadge] = useState<string>("none");

  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "free" | "premium">("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [colorFilter, setColorFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [isGridView, setIsGridView] = useState(true);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("intelliqr_favorite_templates");
    return saved ? JSON.parse(saved) : [];
  });

  // Preview Modal Device Frame state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");

  // Scroll to Top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Toggle Favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("intelliqr_favorite_templates", JSON.stringify(updated));
      toast.success(prev.includes(id) ? "Removed from Favorites" : "Added to Favorites");
      return updated;
    });
  };

  // Scroll visibility
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Launch Customizer View
  const startEditing = (tpl: QRTemplate) => {
    setSelectedTemplate(tpl);
    setEditedFields(tpl.fields);
    setCustomTheme(tpl.colors[0]);
    setCustomSecondaryTheme(tpl.colors[1] || tpl.colors[0]);
    setCustomBorder("none");
    setCustomBadge("none");
    setViewMode("edit");
    setPreviewTemplate(null); // Close modal if open
    setZoom(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success(`Loaded design template: ${tpl.name}`);
  };

  // Predefined color filters catalog
  const colorFilterOptions = [
    { value: "all", label: "Any Color", hex: "" },
    { value: "#D4AF37", label: "Gold", hex: "bg-[#D4AF37]" },
    { value: "#000000", label: "Black", hex: "bg-[#000000]" },
    { value: "#3B82F6", label: "Blue", hex: "bg-[#3B82F6]" },
    { value: "#2C6B2F", label: "Green", hex: "bg-[#2C6B2F]" },
    { value: "#FF3E3E", label: "Red", hex: "bg-[#FF3E3E]" },
    { value: "#EA580C", label: "Orange", hex: "bg-[#EA580C]" },
    { value: "#E1306C", label: "Pink", hex: "bg-[#E1306C]" }
  ];

  // List of all categories
  const categoriesList = [
    "all", "Restaurant", "Business", "Social Media", "Events", "Education", 
    "Healthcare", "Retail", "Real Estate", "Travel", "Finance", 
    "Personal", "Entertainment", "Fitness", "Technology", "Others"
  ];

  // Filters computed lists
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter((tpl) => {
      // Search
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const matchesCategory =
        selectedCategory === "all" ||
        tpl.category.toLowerCase() === selectedCategory.toLowerCase();

      // Price
      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "free" && !tpl.premium) ||
        (priceFilter === "premium" && tpl.premium);

      // Rating
      const matchesRating =
        ratingFilter === "all" ||
        tpl.rating >= parseFloat(ratingFilter);

      // Color matching
      const matchesColor =
        colorFilter === "all" ||
        tpl.colors.some(c => c.toLowerCase() === colorFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesColor;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.new === a.new ? b.downloads - a.downloads : (b.new ? 1 : -1);
      if (sortBy === "views") return b.views - a.views;
      return 0;
    });
  }, [searchQuery, selectedCategory, priceFilter, ratingFilter, colorFilter, sortBy]);

  // Zoom controls
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.4));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.6));
  const handleResetZoom = () => setZoom(1);

  // Image and PDF Export Engines
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const toastId = toast.loading("Processing high-res template frames...");

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

      const filename = `intelliqr-${selectedTemplate?.slug || "design"}-${Date.now()}`;

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
      toast.error("Failed to render and export file. Please try again.", { id: toastId });
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

  // Helper styles based on selectors
  const borderClasses: Record<string, string> = {
    none: "border-none",
    solid: "border-[6px] border-slate-900/10",
    dashed: "border-[4px] border-dashed border-indigo-500/50",
    gold: "border-[8px] border-double border-amber-500/80",
    modern: "border-[2px] border-slate-900/80 rounded-[32px]"
  };

  // Dynamic layout rendering components
  const renderTemplateLayout = (
    layoutType: string,
    fields: Record<string, string>,
    themeColor: string,
    secondaryColor: string,
    borderStyle: string,
    badgeStyle: string,
    isMini: boolean = false
  ) => {
    const qrEmbedUrl = activeQR?.imageUrl || "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=IntelliQR";

    return (
      <div 
        style={{ background: isMini ? `linear-gradient(135deg, ${themeColor}, ${secondaryColor})` : "white" }}
        className={`w-full h-full rounded-[24px] overflow-hidden shadow-md flex flex-col relative transition-all duration-200 border border-slate-100 ${
          isMini ? "text-white" : "text-slate-800"
        } ${borderClasses[borderStyle] || ""}`}
      >
        {/* Render Stamp badge overlay */}
        {badgeStyle !== "none" && !isMini && (
          <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 font-extrabold uppercase px-2.5 py-0.5 rounded-full text-[8px] tracking-wider z-20 shadow-sm">
            {badgeStyle}
          </div>
        )}

        {/* 1. RESTAURANT MENU */}
        {layoutType === "restaurant_menu" && (
          <div className="flex-1 p-5 flex flex-col justify-between h-full">
            <div className="text-center">
              <h3 className={`font-extrabold text-sm ${isMini ? "text-white" : "text-slate-900"}`}>{fields.title || "The Food Hub"}</h3>
              <p className="text-[9px] font-bold opacity-60 tracking-widest uppercase mt-0.5">{fields.subtitle || "FINE CUISINE"}</p>
              <div className="h-px bg-slate-200/50 w-12 mx-auto my-2" />
            </div>

            <div className="flex justify-center my-1.5">
              <div className="p-2 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100/60">
                <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-16 h-16" : "w-28 h-28"} object-contain`} />
              </div>
            </div>

            <div className="text-center space-y-1">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 font-extrabold text-[8px] uppercase tracking-wider">
                {fields.promo || "Order Specials"}
              </span>
              <p className="text-[8px] opacity-60 font-semibold">{fields.address || "12 Main St, City"}</p>
            </div>
          </div>
        )}

        {/* 2. BUSINESS CARD */}
        {layoutType === "business_card" && (
          <div className="flex-1 p-5 flex flex-row items-center justify-between h-full gap-3">
            <div className="flex-1 flex flex-col justify-between h-full text-left">
              <div>
                <span className="text-[7px] font-extrabold text-indigo-600 tracking-wider uppercase block mb-1">
                  {fields.company || "ABWcurious"}
                </span>
                <h3 className={`font-extrabold text-xs leading-snug ${isMini ? "text-white" : "text-slate-900"}`}>{fields.name || "Shubham Sharma"}</h3>
                <p className="text-[8px] opacity-60 font-semibold uppercase">{fields.title || "Founder & CEO"}</p>
              </div>

              <div className="space-y-0.5 border-l-2 border-indigo-500/40 pl-2 text-[8px] opacity-70 font-bold">
                <p>{fields.phone || "+91 99303 38504"}</p>
                <p className="truncate max-w-[130px]">{fields.email || "info@abwcurious.com"}</p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="p-2 bg-white rounded-xl shadow-md">
                <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-14 h-14" : "w-24 h-24"} object-contain`} />
              </div>
            </div>
          </div>
        )}

        {/* 3. EVENT TICKET */}
        {layoutType === "event_ticket" && (
          <div className="flex-1 flex flex-row h-full overflow-hidden">
            <div className="flex-1 p-4 flex flex-col justify-between text-left">
              <div>
                <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-600 text-[8px] font-extrabold rounded-full uppercase tracking-wider mb-1.5">
                  EVENT PASS
                </span>
                <h3 className={`font-bold text-xs tracking-tight leading-snug ${isMini ? "text-white" : "text-slate-900"}`}>{fields.name || "Music Festival"}</h3>
                <p className="text-[7px] opacity-50 font-semibold truncate max-w-[150px]">{fields.location || "Convention Center"}</p>
              </div>

              <div className="grid grid-cols-2 gap-1 border-t border-slate-100/50 pt-2 text-[7px] font-extrabold opacity-75">
                <div>
                  <span className="block opacity-50 text-[6px] uppercase">Date</span>
                  <span>{fields.date || "Dec 20, 2026"}</span>
                </div>
                <div>
                  <span className="block opacity-50 text-[6px] uppercase">Time</span>
                  <span>{fields.time || "7:00 PM"}</span>
                </div>
              </div>
            </div>

            {/* Dotted Separator */}
            <div className="w-px h-full border-l border-dashed border-slate-200 relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200/40" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-slate-50 border border-slate-200/40" />
            </div>

            <div className="w-[100px] bg-slate-50/50 p-3 flex flex-col items-center justify-between">
              <div className="p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm">
                <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-12 h-12" : "w-16 h-16"} object-contain`} />
              </div>
              <span className="text-[7px] font-mono tracking-widest uppercase text-slate-400 font-bold block">{fields.ticketNo || "TCK-883"}</span>
            </div>
          </div>
        )}

        {/* 4. PRODUCT PRICE TAG */}
        {layoutType === "product_tag" && (
          <div className="flex-1 p-5 flex flex-col items-center justify-between h-full">
            {/* String hole decoration */}
            <div className="w-3 h-3 rounded-full bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center mb-1">
              <div className="w-1 h-1 rounded-full bg-slate-300" />
            </div>

            <div className="text-center">
              <span className="text-[7px] opacity-40 font-bold tracking-widest uppercase block">Official Product</span>
              <h3 className={`font-extrabold text-xs tracking-tight ${isMini ? "text-white" : "text-slate-900"}`}>{fields.product || "Premium Leather Wallet"}</h3>
              <p className="text-[8px] opacity-40 block mt-0.5">{fields.sku || "SKU-902"}</p>
            </div>

            <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-50">
              <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-16 h-16" : "w-24 h-24"} object-contain`} />
            </div>

            <div className="text-center">
              <span className="text-[7px] opacity-50 uppercase tracking-widest font-bold block">Price</span>
              <div className={`font-extrabold text-lg tracking-tight ${isMini ? "text-white" : "text-slate-950"}`}>{fields.price || "$49.99"}</div>
              <p className="text-[7px] font-bold uppercase tracking-wider text-indigo-500/80 mt-0.5">{fields.footer || "100% genuine"}</p>
            </div>
          </div>
        )}

        {/* 5. WIFI CARD */}
        {layoutType === "wifi_card" && (
          <div className="flex-1 p-5 flex flex-col items-center justify-between h-full relative">
            <div className="text-center mt-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-1">
                <Wifi className="w-4 h-4 text-indigo-600" />
              </div>
              <h3 className={`font-extrabold text-xs tracking-wider uppercase ${isMini ? "text-white" : "text-slate-900"}`}>{fields.title || "Scan To Connect"}</h3>
              <div className="w-8 h-0.5 bg-slate-200/50 mx-auto mt-1" />
            </div>

            <div className="p-2.5 bg-white border border-slate-100/60 shadow-md rounded-2xl">
              <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-16 h-16" : "w-26 h-26"} object-contain`} />
            </div>

            <div className="w-full space-y-1 bg-slate-50/70 border border-slate-100 p-2.5 rounded-xl text-center text-[9px] font-bold">
              <div>
                <span className="text-[6px] opacity-40 uppercase block">WiFi SSID</span>
                <span className="text-slate-800">{fields.ssid || "IntelliQR_Guest"}</span>
              </div>
              <div className="h-px bg-slate-100 w-full" />
              <div>
                <span className="text-[6px] opacity-40 uppercase block">Password</span>
                <span className="text-slate-800">{fields.password || "password123"}</span>
              </div>
            </div>
          </div>
        )}

        {/* 6. SOCIAL PROFILE */}
        {layoutType === "social_profile" && (
          <div className="flex-1 p-4 flex flex-col justify-between h-full">
            <div className="text-center mt-1">
              <span className="inline-block px-2 py-0.5 bg-rose-500/15 text-rose-500 text-[8px] font-extrabold rounded-full uppercase tracking-wider mb-1.5">
                {fields.platform || "Instagram"}
              </span>
              <h3 className={`font-extrabold text-xs ${isMini ? "text-white" : "text-slate-900"}`}>{fields.handle || "@nomad_creator"}</h3>
              <p className="text-[8px] text-slate-400 font-bold">{fields.subscribers || "10K Followers"}</p>
            </div>

            <div className="flex justify-center my-1">
              <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-100">
                <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-16 h-16" : "w-22 h-22"} object-contain`} />
              </div>
            </div>

            <p className="text-[8px] opacity-60 text-center font-semibold leading-relaxed max-w-[180px] mx-auto">
              {fields.bio || "Sharing startup code updates and UI hacks!"}
            </p>
          </div>
        )}

        {/* 7. COUPON VOUCHER */}
        {layoutType === "coupon_pass" && (
          <div className="flex-1 p-5 flex flex-col items-center justify-between h-full border-4 border-double border-amber-500/20 rounded-[20px] m-1 bg-amber-500/[0.01]">
            <div className="text-center w-full">
              <span className="text-[8px] font-bold text-amber-600 uppercase tracking-widest block">{fields.store || "Mega Outlet"}</span>
              <h3 className={`font-black text-sm tracking-tight uppercase ${isMini ? "text-white" : "text-slate-900"}`}>{fields.discount || "50% Off Everything"}</h3>
            </div>

            <div className="p-2.5 bg-white border border-slate-100 shadow-md rounded-2xl">
              <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-16 h-16" : "w-24 h-24"} object-contain`} />
            </div>

            <div className="text-center w-full space-y-1">
              <div className="px-3 py-1 rounded bg-slate-900 text-white font-mono text-[9px] font-bold uppercase tracking-wider inline-block">
                {fields.couponCode || "VOUCHER-50"}
              </div>
              <p className="text-[7px] text-slate-400 font-bold">{fields.validity || "Expires soon"}</p>
            </div>
          </div>
        )}

        {/* 8. GENERAL CARD */}
        {(!layoutType || ["generic_card", "review_badge", "feedback_survey", "healthcare_appt", "education_course", "tech_software", "travel_guide", "finance_payment", "personal_portfolio", "entertainment_stream", "fitness_gym"].includes(layoutType)) && (
          <div className="flex-1 p-5 flex flex-col justify-between h-full">
            <div className="text-center">
              <h3 className={`font-black text-xs uppercase leading-snug tracking-tight ${isMini ? "text-white" : "text-slate-900"}`}>{fields.title || fields.merchant || fields.institution || fields.doctorName || fields.facility || fields.businessName || "Global Portal"}</h3>
              <p className="text-[8px] opacity-60 font-bold truncate max-w-[200px] mt-0.5">{fields.subtitle || fields.specialty || fields.course || fields.creator || "Scan to access details"}</p>
              <div className="h-px bg-slate-100 w-16 mx-auto my-2" />
            </div>

            <div className="flex justify-center">
              <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-100/60">
                <img src={qrEmbedUrl} alt="QR" className={`${isMini ? "w-16 h-16" : "w-24 h-24"} object-contain`} />
              </div>
            </div>

            <div className="text-center">
              <p className="text-[7px] opacity-50 font-bold max-w-[180px] mx-auto truncate">
                {fields.details || fields.note || fields.disclaimer || fields.timing || "Scan QR with smartphone camera"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Helper category icons map
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "restaurant": return <ShoppingBag className="w-3.5 h-3.5" />;
      case "business": return <Briefcase className="w-3.5 h-3.5" />;
      case "social media": return <Globe className="w-3.5 h-3.5" />;
      case "events": return <Ticket className="w-3.5 h-3.5" />;
      case "education": return <BookOpen className="w-3.5 h-3.5" />;
      case "healthcare": return <Stethoscope className="w-3.5 h-3.5" />;
      case "retail": return <Tag className="w-3.5 h-3.5" />;
      case "real estate": return <MapPin className="w-3.5 h-3.5" />;
      case "travel": return <Globe className="w-3.5 h-3.5" />;
      case "finance": return <Landmark className="w-3.5 h-3.5" />;
      case "personal": return <Briefcase className="w-3.5 h-3.5" />;
      case "entertainment": return <Play className="w-3.5 h-3.5" />;
      case "fitness": return <Dumbbell className="w-3.5 h-3.5" />;
      case "technology": return <Code className="w-3.5 h-3.5" />;
      default: return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // If Auth is resolving, render full-page loader matching Home page theme
  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
          <p className="text-slate-600 font-serif text-lg">Authenticating your access to IntelliQR Templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <Header />

      {/* Hero Section - Matching Home Page Sarvam Gradient & Fonts */}
      <section className="sarvam-gradient pt-32 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-sm font-medium text-slate-800 mb-8 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              200+ Premium QR Templates
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-[76px] leading-[1.1] tracking-tight mb-8 text-slate-900 font-serif"
            >
              Choose Your Perfect <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600">
                QR Design Template
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-slate-700/80 leading-relaxed mb-8 max-w-2xl mx-auto font-medium"
            >
              Explore 200 high-performance QR templates across 15 industries. Customize text, colors, frame borders, and stamps live.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Catalog & Customizer Section - Matching Home Page FAFAFA Section */}
      <section className="py-16 bg-[#FAFAFA] flex-1 flex flex-col">
        <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">

          {/* VIEW A: CATALOG VIEW */}
          {viewMode === "catalog" && (
            <div className="space-y-8">
              
              {/* Filter System Panel - Matching Home Card Styling */}
              <div className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                
                {/* Search, Sort and Layout Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Search Bar */}
                  <div className="md:col-span-6 relative bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-3 flex items-center focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-400 transition-all">
                    <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 200 templates by industry, tag, name..."
                      className="bg-transparent border-none outline-none focus:ring-0 text-xs w-full text-slate-800 font-semibold placeholder:text-slate-400"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="md:col-span-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-700 font-bold cursor-pointer"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="rating">Top Rated</option>
                      <option value="newest">Recently Added</option>
                      <option value="views">Most Viewed</option>
                    </select>
                  </div>

                  {/* Price Status Filter */}
                  <div className="md:col-span-2">
                    <select
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-slate-700 font-bold cursor-pointer"
                    >
                      <option value="all">All (Free & Pro)</option>
                      <option value="free">Free Templates</option>
                      <option value="premium">Premium Pro</option>
                    </select>
                  </div>

                  {/* Grid/List View toggle */}
                  <div className="md:col-span-1 flex justify-end gap-2">
                    <button
                      onClick={() => setIsGridView(true)}
                      className={`p-3 rounded-xl border transition-all ${
                        isGridView ? "bg-[#2A2C3C] border-[#2A2C3C] text-white" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                      }`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsGridView(false)}
                      className={`p-3 rounded-xl border transition-all ${
                        !isGridView ? "bg-[#2A2C3C] border-[#2A2C3C] text-white" : "bg-white border-slate-200 text-slate-400 hover:bg-slate-50"
                      }`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Categories Pills Swipe Bar */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Browse Industries (15 Categories)</span>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition-all flex items-center gap-2 ${
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? "bg-[#2A2C3C] border-[#2A2C3C] text-white shadow-md"
                            : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {cat !== "all" && getCategoryIcon(cat)}
                        {cat === "all" ? "All Categories" : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro filters (Rating, Color filter) */}
                <div className="flex flex-wrap gap-4 border-t border-slate-100 pt-4 items-center">
                  
                  {/* Colors Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Color Theme:</span>
                    <div className="flex gap-1 flex-wrap">
                      {colorFilterOptions.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => setColorFilter(c.value)}
                          className={`w-6 h-6 rounded-full border transition-all relative flex items-center justify-center ${
                            c.value === "all" 
                              ? "bg-slate-200 text-slate-700 text-[8px] font-bold border-slate-300" 
                              : `${c.hex} border-slate-200/50`
                          } ${colorFilter === c.value ? "ring-2 ring-slate-900 ring-offset-2 scale-110" : "hover:scale-105"}`}
                          title={c.label}
                        >
                          {colorFilter === c.value && (
                            <Check className={`w-3.5 h-3.5 ${c.value === "all" ? "text-slate-800" : "text-white"}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vertical separator */}
                  <div className="hidden sm:block w-px h-6 bg-slate-200" />

                  {/* Rating Filters */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rating:</span>
                    <div className="flex gap-1.5">
                      {[
                        { id: "all", label: "All Ratings" },
                        { id: "4.8", label: "4.8+ ★" },
                        { id: "4.5", label: "4.5+ ★" }
                      ].map((rat) => (
                        <button
                          key={rat.id}
                          onClick={() => setRatingFilter(rat.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                            ratingFilter === rat.id
                              ? "bg-slate-100 border-slate-300 text-slate-900"
                              : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}
                        >
                          {rat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* Search Count status bar */}
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Showing <span className="text-slate-900 font-extrabold">{filteredTemplates.length}</span> of 200 templates
                </span>
                {favorites.length > 0 && (
                  <span className="text-xs text-slate-400 font-bold">
                    Favorites Saved: <span className="text-rose-500 font-extrabold">{favorites.length}</span>
                  </span>
                )}
              </div>

              {/* Grid Templates Render */}
              <div className={isGridView ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" : "space-y-4"}>
                <AnimatePresence>
                  {filteredTemplates.map((tpl, index) => {
                    const isFav = favorites.includes(tpl.id);
                    const defaultColor = tpl.colors[0] || "#6366F1";
                    const secondaryColor = tpl.colors[1] || tpl.colors[0] || "#4F46E5";

                    if (isGridView) {
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.2) }}
                          key={tpl.id}
                          className="group bg-white border border-slate-100 rounded-[32px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 flex flex-col h-[410px] relative"
                        >
                          {/* Card upper - design preview display */}
                          <div className="h-[210px] bg-slate-50 rounded-2xl p-4 relative flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100/60">
                            {/* Decorative grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
                            
                            {/* Visual Card Canvas */}
                            <div className="w-[145px] h-[185px] transform group-hover:scale-[1.03] transition-all duration-300">
                              {renderTemplateLayout(tpl.layoutType, tpl.fields, defaultColor, secondaryColor, "none", "none", true)}
                            </div>

                            {/* Floating overlays: Favorite Toggle */}
                            <button
                              onClick={(e) => toggleFavorite(tpl.id, e)}
                              className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md bg-white/80 hover:bg-white border border-slate-100 text-rose-500 hover:scale-105 shadow-sm transition-all z-10"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-rose-500" : ""}`} />
                            </button>

                            {/* Pro/Free indicators */}
                            <div className="absolute top-3 left-3 flex gap-1 z-10 select-none">
                              {tpl.premium ? (
                                <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-extrabold uppercase text-[7px] tracking-wider shadow-sm">
                                  PRO
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold uppercase text-[7px] tracking-wider shadow-sm">
                                  FREE
                                </span>
                              )}
                              {tpl.new && (
                                <span className="px-2 py-0.5 rounded-full bg-orange-500 text-white font-extrabold uppercase text-[7px] tracking-wider shadow-sm">
                                  NEW
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Card lower details */}
                          <div className="flex-1 pt-4 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                  {getCategoryIcon(tpl.category)}
                                  {tpl.category}
                                </span>
                                <div className="flex items-center text-amber-500 gap-0.5 text-[10px] font-extrabold">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  {tpl.rating.toFixed(1)}
                                </div>
                              </div>

                              <h3 className="font-serif font-bold text-slate-900 text-[15px] tracking-tight leading-snug mt-1.5 group-hover:text-orange-600 transition-colors truncate">
                                {tpl.name}
                              </h3>
                              <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed mt-1">
                                {tpl.description}
                              </p>
                            </div>

                            {/* CTAs layout */}
                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                              <button
                                onClick={() => setPreviewTemplate(tpl)}
                                className="flex-1 py-2.5 text-center rounded-full text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Preview
                              </button>
                              <button
                                onClick={() => startEditing(tpl)}
                                className="flex-1 py-2.5 text-center rounded-full text-xs font-medium bg-[#2A2C3C] hover:bg-[#1A1C29] text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                Edit
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    } else {
                      // List View Row
                      return (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          key={tpl.id}
                          className="bg-white border border-slate-100 rounded-[28px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              style={{ background: `linear-gradient(135deg, ${defaultColor}, ${secondaryColor})` }}
                              className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-sm"
                            >
                              {getCategoryIcon(tpl.category)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-serif font-bold text-slate-900 text-base">{tpl.name}</h3>
                                <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                                  {tpl.category}
                                </span>
                                {tpl.premium && (
                                  <span className="text-[7px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white uppercase">
                                    PRO
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">{tpl.description}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 self-end sm:self-auto">
                            <div className="hidden md:flex flex-col text-right">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Rating</span>
                              <span className="text-xs text-slate-800 font-extrabold flex items-center justify-end gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                {tpl.rating}
                              </span>
                            </div>
                            <div className="hidden md:flex flex-col text-right">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Downloads</span>
                              <span className="text-xs text-slate-600 font-bold">{tpl.downloads.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => toggleFavorite(tpl.id, e)}
                                className={`p-2.5 rounded-full border transition-all ${
                                  isFav ? "bg-rose-50 border-rose-100 text-rose-500" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                }`}
                              >
                                <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500" : ""}`} />
                              </button>
                              <button
                                onClick={() => setPreviewTemplate(tpl)}
                                className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Preview
                              </button>
                              <button
                                onClick={() => startEditing(tpl)}
                                className="px-5 py-2.5 rounded-full bg-[#2A2C3C] hover:bg-[#1A1C29] text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                Edit Design
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }
                  })}
                </AnimatePresence>

                {filteredTemplates.length === 0 && (
                  <div className="col-span-full text-center py-20 bg-white border border-slate-100 rounded-[32px] p-6 space-y-3 shadow-sm">
                    <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="font-serif font-bold text-slate-900 text-xl">No templates found matching filters</h3>
                    <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                      Try resetting search keywords or category filters to explore all 200 presets.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setPriceFilter("all");
                        setColorFilter("all");
                        setRatingFilter("all");
                      }}
                      className="px-6 py-3 rounded-full bg-[#2A2C3C] text-white text-xs font-medium hover:bg-[#1A1C29] transition-all"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* VIEW B: INTERACTIVE CUSTOMIZER VIEW */}
          {viewMode === "edit" && selectedTemplate && (
            <div className="space-y-6">
              
              {/* Back Bar Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setViewMode("catalog")}
                    className="p-2.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 bg-white/50 shadow-sm transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Workspace Customizer</span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-none mt-0.5">
                      {selectedTemplate.name}
                    </h2>
                  </div>
                </div>

                {/* Canvas tools */}
                <div className="flex items-center gap-2 bg-white p-1 border border-slate-200/60 shadow-sm rounded-full">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-extrabold text-slate-600 px-2 min-w-[40px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <div className="w-px h-4 bg-slate-200 mx-1" />
                  <button
                    onClick={handleResetZoom}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-all"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* No QR Code Alert Banner */}
              {!activeQR && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-left">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-amber-800 font-bold text-xs uppercase">Using Demonstration Placeholder QR</h4>
                    <p className="text-amber-700/80 text-[11px] font-semibold mt-0.5 leading-relaxed">
                      No custom QR detected. You are viewing a demo barcode. Make a custom QR in the <Link to="/generator" className="underline font-extrabold">QR Generator dashboard</Link> to automatically embed your URL, details, or colors.
                    </p>
                  </div>
                </div>
              )}

              {/* Main Workspace split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Workspace preview board (left - 7 cols) */}
                <div className="lg:col-span-7 bg-slate-100 border border-slate-200/50 rounded-[36px] min-h-[480px] lg:min-h-[560px] flex items-center justify-center p-8 overflow-hidden relative shadow-inner">
                  {/* Digital Board decoration */}
                  <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                  {/* Scaled Composition viewport */}
                  <div
                    style={{ transform: `scale(${zoom})`, transformOrigin: "center center" }}
                    className="transition-transform duration-150 ease-out flex items-center justify-center"
                  >
                    {/* Render target inside card container box */}
                    <div 
                      ref={canvasRef}
                      className="w-[320px] h-[460px] rounded-[24px] bg-white flex-shrink-0 relative overflow-hidden"
                    >
                      {renderTemplateLayout(
                        selectedTemplate.layoutType, 
                        editedFields, 
                        customTheme, 
                        customSecondaryTheme, 
                        customBorder, 
                        customBadge
                      )}
                    </div>
                  </div>

                  {/* Helper tag instructions */}
                  <div className="absolute bottom-4 left-6 right-6 text-center select-none pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/5 text-[9px] font-extrabold text-slate-500 uppercase tracking-wider">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      Visual Board View. All edits below update the preview instantly.
                    </span>
                  </div>
                </div>

                {/* Right controls side panel (5 cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[32px] p-6 space-y-6 text-left shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  
                  {/* SECTION A: EDIT PREDEFINED FIELDS */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Maximize className="w-4 h-4 text-slate-400" />
                      Customize Information
                    </h3>
                    
                    <div className="space-y-3.5">
                      {Object.entries(editedFields).map(([key, val]) => (
                        <div key={key} className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                          </label>
                          {["bio", "details", "note", "instructions", "promo"].includes(key) ? (
                            <textarea
                              rows={3}
                              value={val}
                              onChange={(e) => setEditedFields(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-xs text-slate-800 font-semibold resize-none"
                            />
                          ) : (
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => setEditedFields(prev => ({ ...prev, [key]: e.target.value }))}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 text-xs text-slate-800 font-semibold"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SECTION B: STYLE MODIFIERS */}
                  <div className="space-y-4 border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-slate-400" />
                      Design Styling
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Theme Main Palette */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={customTheme}
                            onChange={(e) => setCustomTheme(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border-none overflow-hidden"
                          />
                          <input
                            type="text"
                            value={customTheme}
                            onChange={(e) => setCustomTheme(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl border border-slate-200 font-mono text-[10px] font-bold text-slate-600 text-center uppercase"
                          />
                        </div>
                      </div>

                      {/* Theme Secondary Palette */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={customSecondaryTheme}
                            onChange={(e) => setCustomSecondaryTheme(e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer border-none overflow-hidden"
                          />
                          <input
                            type="text"
                            value={customSecondaryTheme}
                            onChange={(e) => setCustomSecondaryTheme(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-xl border border-slate-200 font-mono text-[10px] font-bold text-slate-600 text-center uppercase"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Frame border */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Frame Border</label>
                        <select
                          value={customBorder}
                          onChange={(e) => setCustomBorder(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="none">No Border Frame</option>
                          <option value="solid">Thin Accent Line</option>
                          <option value="dashed">Dotted-Dashed</option>
                          <option value="gold">Luxury Gold Trim</option>
                          <option value="modern">Modern Rounded</option>
                        </select>
                      </div>

                      {/* Stamp Badge overlay */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Stamp</label>
                        <select
                          value={customBadge}
                          onChange={(e) => setCustomBadge(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="none">No Stamp Banner</option>
                          <option value="OFFICIAL">Official Product</option>
                          <option value="VIP ACCESS">VIP access</option>
                          <option value="SCAN CODE">Scan to Enter</option>
                          <option value="SECURE LINK">100% Secure</option>
                        </select>
                      </div>

                    </div>
                  </div>

                  {/* SECTION C: DOWNLOAD EXPORTS */}
                  <div className="space-y-4 border-t border-slate-100 pt-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Download className="w-4 h-4 text-slate-400" />
                      Export Options
                    </h3>
                    
                    {/* Format Toggle */}
                    <div className="flex gap-2">
                      {(["png", "jpg", "svg", "pdf"] as ExportFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setExportFormat(fmt)}
                          className={`flex-1 py-2.5 text-center rounded-full text-[10px] font-extrabold uppercase tracking-wider border transition-all ${
                            exportFormat === fmt
                              ? "bg-[#2A2C3C] border-[#2A2C3C] text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {fmt}
                        </button>
                      ))}
                    </div>

                    {/* Resolution slider */}
                    {exportFormat !== "pdf" && exportFormat !== "svg" && (
                      <div className="flex items-center justify-between bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl">
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolution Factor</span>
                          <span className="text-[8px] text-slate-400 font-semibold">Higher multiplier produces sharper output</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[1, 2, 3].map((res) => (
                            <button
                              key={res}
                              onClick={() => setResolution(res)}
                              className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${
                                resolution === res
                                  ? "bg-[#2A2C3C] text-white shadow-sm"
                                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
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
                      className="w-full py-4 rounded-full text-xs font-medium tracking-widest uppercase bg-[#2A2C3C] hover:bg-[#1A1C29] text-white transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          Rendering high-res canvas...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-amber-300" />
                          Download Design Files
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </section>

      {/* VIEW C: DETAILS PREVIEW MODAL */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreviewTemplate(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Body content card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-slate-100 rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl relative z-10 grid grid-cols-1 md:grid-cols-12 h-auto max-h-[90vh]"
            >
              
              {/* Left Column: Simulated mockup view selector (7 cols) */}
              <div className="md:col-span-7 bg-slate-100 p-6 flex flex-col justify-between items-center min-h-[360px] md:min-h-0 relative">
                
                {/* Mockup viewport header switches */}
                <div className="flex gap-2 bg-white/70 backdrop-blur-md border border-slate-200/50 p-1 rounded-full relative z-10 shadow-sm">
                  {[
                    { id: "desktop", label: "Desktop", icon: <Monitor className="w-3.5 h-3.5" /> },
                    { id: "tablet", label: "Tablet", icon: <Smartphone className="w-3.5 h-3.5 rotate-90" /> },
                    { id: "mobile", label: "Mobile", icon: <Smartphone className="w-3.5 h-3.5" /> }
                  ].map((dev) => (
                    <button
                      key={dev.id}
                      onClick={() => setPreviewDevice(dev.id as any)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                        previewDevice === dev.id
                          ? "bg-[#2A2C3C] text-white shadow-sm"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {dev.icon}
                      {dev.label}
                    </button>
                  ))}
                </div>

                {/* Visual device wrapper */}
                <div className="flex-1 flex items-center justify-center w-full py-6">
                  <motion.div
                    layout
                    style={{
                      width: previewDevice === "desktop" ? "240px" : (previewDevice === "tablet" ? "200px" : "160px"),
                      height: previewDevice === "desktop" ? "340px" : (previewDevice === "tablet" ? "290px" : "230px")
                    }}
                    className="bg-white rounded-[24px] shadow-2xl border-[6px] border-slate-900 overflow-hidden relative transition-all duration-300"
                  >
                    {/* Simulated camera dot inside mobile */}
                    {previewDevice === "mobile" && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-900 z-30" />
                    )}

                    {/* Rendering template */}
                    {renderTemplateLayout(
                      previewTemplate.layoutType,
                      previewTemplate.fields,
                      previewTemplate.colors[0],
                      previewTemplate.colors[1] || previewTemplate.colors[0],
                      "none",
                      "none",
                      previewDevice === "mobile"
                    )}
                  </motion.div>
                </div>

                {/* Close Button overlay */}
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Right Column: details text list (5 cols) */}
              <div className="md:col-span-5 p-8 flex flex-col justify-between text-left h-full border-t md:border-t-0 md:border-l border-slate-100 overflow-y-auto">
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-extrabold text-orange-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                      {getCategoryIcon(previewTemplate.category)}
                      {previewTemplate.category}
                    </span>
                    <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-snug">
                      {previewTemplate.name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {previewTemplate.description}
                    </p>
                  </div>

                  {/* Metrics Statistics */}
                  <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3.5 text-center text-slate-500 font-extrabold">
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase tracking-wider">Rating</span>
                      <span className="text-xs text-slate-800 flex items-center justify-center gap-0.5 mt-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        {previewTemplate.rating}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase tracking-wider">Downloads</span>
                      <span className="text-xs text-slate-800 mt-0.5 block">{previewTemplate.downloads.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 uppercase tracking-wider">Views</span>
                      <span className="text-xs text-slate-800 mt-0.5 block">{previewTemplate.views.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Colors used circular dots */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Palette Used</span>
                    <div className="flex gap-1.5">
                      {previewTemplate.colors.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full shadow-inner">
                          <div style={{ backgroundColor: c }} className="w-4 h-4 rounded-full border border-slate-200/50" />
                          <span className="font-mono text-[9px] font-bold text-slate-500 uppercase">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags list */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Associated Tags</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {previewTemplate.tags.map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer CTAs */}
                <div className="space-y-2 pt-6 border-t border-slate-100 mt-6 md:mt-0">
                  <button
                    onClick={() => startEditing(previewTemplate)}
                    className="w-full py-3.5 rounded-full bg-[#2A2C3C] hover:bg-[#1A1C29] text-white text-xs font-medium uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Apply Design Preset
                  </button>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="w-full py-3 rounded-full border border-slate-200 text-slate-600 text-xs font-medium uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center"
                  >
                    Back to Catalog
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Scroll to Top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#2A2C3C] hover:bg-[#1A1C29] text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center"
            title="Scroll to Top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
