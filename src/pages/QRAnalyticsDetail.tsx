import { useState } from "react";
import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import DynamicQREditModal from "@/components/qr/DynamicQREditModal";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  Activity,
  Users,
  Calendar,
  Smartphone,
  Globe2,
  Compass,
  Monitor,
  Loader2,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  Zap,
  BarChart2,
  QrCode,
  MapPin,
  Clock,
} from "lucide-react";

type RangeOption = "today" | "7d" | "30d" | "90d" | "all";

const COLORS = ["#f97316", "#8b5cf6", "#06b6d4", "#10b981", "#ec4899", "#3b82f6", "#64748b"];

export default function QRAnalyticsDetail() {
  const { id } = useParams<{ id: string }>();
  const qrId = id ? parseInt(id, 10) : null;
  const [range, setRange] = useState<RangeOption>("30d");
  const [copied, setCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { user, isLoading: isAuthLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });

  const {
    data,
    isLoading: isDataLoading,
    refetch,
    isFetching,
    error,
  } = trpc.qr.analytics.useQuery(
    { id: qrId || 0, range },
    { enabled: !!qrId && !!user }
  );

  const shortUrl = data?.qr?.shortId
    ? `${window.location.origin}/q/${data.qr.shortId}`
    : "";

  const handleCopyLink = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Short URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!qrId || isNaN(qrId)) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans sarvam-gradient overflow-x-hidden">
        <Header />
        <main className="flex-1 pt-40 sm:pt-44 pb-24 flex items-center justify-center px-4">
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-8 max-w-md text-center shadow-xl">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Invalid QR Identifier</h2>
            <p className="text-sm text-slate-500 mb-6">No valid QR code was specified for this analytics report.</p>
            <Link to="/dashboard" className="btn-primary text-xs uppercase tracking-wider inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Return to Dashboard
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <SEOHead
        title={data?.qr ? `${data.qr.name} – QR Scan Analytics | IntelliQR` : "QR Code Scan Analytics | IntelliQR"}
        description="Detailed scan telemetry, real-time geolocation, device breakdown, and visitor insights for your dynamic QR campaign."
        canonicalUrl={`https://intelli-qr.vercel.app/dashboard/analytics/${qrId}`}
      />

      <Header />

      {/* Hero Section matching Home Page theme */}
      <section className="sarvam-gradient pt-36 sm:pt-40 lg:pt-44 pb-16 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back link & breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-sm text-xs font-bold uppercase tracking-wider transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dashboard
            </Link>

            <Breadcrumbs
              items={[
                { name: "Dashboard", url: "/dashboard" },
                { name: data?.qr?.name ? `${data.qr.name} Analytics` : "Analytics", url: `/dashboard/analytics/${qrId}` },
              ]}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/50 flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3 h-3 text-orange-600" />
                  Dynamic QR Analytics
                </span>

                {data?.qr?.status && (
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      data.qr.status === "paused"
                        ? "bg-amber-50 text-amber-700 border-amber-200/60"
                        : data.qr.status === "expired"
                        ? "bg-rose-50 text-rose-700 border-rose-200/60"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                    }`}
                  >
                    {data.qr.status}
                  </span>
                )}

                <span className="text-xs text-slate-400 font-semibold">
                  Campaign ID #{qrId}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] mb-2">
                {data?.qr?.name || "Scan Performance & Insights"}
              </h1>

              {data?.qr && (
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Short link:</span>
                    <a
                      href={`/q/${data.qr.shortId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-orange-600 hover:underline inline-flex items-center gap-0.5"
                    >
                      /q/{data.qr.shortId}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                  <span>•</span>
                  <span className="truncate max-w-md">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Destination:</span>{" "}
                    <span className="text-slate-800 font-semibold">{data.qr.destinationUrl}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Date Range Selector & Actions */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Range Pills */}
              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md p-1 rounded-full border border-white/80 shadow-sm">
                {(["today", "7d", "30d", "90d", "all"] as RangeOption[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all uppercase tracking-wider ${
                      range === r
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    {r === "all" ? "All Time" : r}
                  </button>
                ))}
              </div>

              {/* Edit Destination Button */}
              {data?.qr && (
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-700 hover:bg-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-600" />
                  Edit URL
                </button>
              )}

              {/* Refresh Button */}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 rounded-full bg-white/80 backdrop-blur-md border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition-all shadow-sm"
                title="Refresh Metrics"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-orange-600" : ""}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Analytics Content */}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {isDataLoading || isAuthLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Compiling scan telemetry & analytics...
              </p>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 text-center border border-rose-200 max-w-lg mx-auto shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to Load Analytics</h3>
              <p className="text-xs text-slate-500 mb-6">{error.message || "An error occurred fetching QR metrics."}</p>
              <Link to="/dashboard" className="btn-primary text-xs uppercase tracking-wider inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <>
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">
                    <Activity className="w-3.5 h-3.5" />
                    Total Scans
                  </div>
                  <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {data?.totalScans.toLocaleString() || 0}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Across all campaigns</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">
                    <Users className="w-3.5 h-3.5" />
                    Unique Scans
                  </div>
                  <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {data?.uniqueScans.toLocaleString() || 0}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Distinct visitors</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Today
                  </div>
                  <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {data?.todayScans.toLocaleString() || 0}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Last 24 hours</p>
                </div>

                <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-600 uppercase tracking-wider mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    This Week
                  </div>
                  <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {data?.weekScans.toLocaleString() || 0}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Past 7 days</p>
                </div>

                <div className="col-span-2 sm:col-span-1 p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 uppercase tracking-wider mb-1">
                    <BarChart2 className="w-3.5 h-3.5" />
                    This Month
                  </div>
                  <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">
                    {data?.monthScans.toLocaleString() || 0}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Current calendar month</p>
                </div>
              </div>

              {/* Scans Over Time Chart + QR Card Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart: 2 Columns */}
                <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        Scans Over Time
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Volume trends across the selected timeframe ({range.toUpperCase()})
                      </p>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {data?.scansOverTime.length || 0} intervals
                    </span>
                  </div>

                  <div className="h-[280px] sm:h-[320px] w-full">
                    {data?.scansOverTime && data.scansOverTime.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.scansOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="scansGradDetail" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 11, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#0f172a",
                              borderRadius: "14px",
                              border: "none",
                              color: "#fff",
                              fontSize: "12px",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#ea580c"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#scansGradDetail)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-slate-400 font-medium">
                        No scans recorded in this timeframe yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Quick Details Card: 1 Column */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-600" />
                      Campaign Asset
                    </h3>

                    {/* QR Preview Thumbnail */}
                    <div className="w-36 h-36 mx-auto rounded-2xl bg-white p-3 border border-slate-100 shadow-sm flex items-center justify-center mb-6 overflow-hidden">
                      {data?.qr?.imageUrl ? (
                        <img
                          src={data.qr.imageUrl}
                          alt={data.qr.name}
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : data?.qr?.svgContent ? (
                        <div
                          className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                          dangerouslySetInnerHTML={{ __html: data.qr.svgContent }}
                        />
                      ) : (
                        <QrCode className="w-20 h-20 text-slate-300" />
                      )}
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Short Redirect URL
                        </div>
                        <div className="flex items-center justify-between gap-2 font-mono font-semibold text-slate-800">
                          <span className="truncate">{shortUrl}</span>
                          <button
                            onClick={handleCopyLink}
                            className="p-1 hover:text-orange-600 transition-colors shrink-0"
                            title="Copy short link"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Current Destination
                        </div>
                        <div className="flex items-center justify-between gap-2 text-slate-800 font-medium">
                          <span className="truncate">{data?.qr?.destinationUrl}</span>
                          <a
                            href={data?.qr?.destinationUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:text-orange-600 transition-colors shrink-0"
                            title="Open link"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Change Destination URL
                    </button>
                  </div>
                </div>
              </div>

              {/* Breakdown Grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Device Distribution */}
                <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-500" />
                    Device Distribution
                  </h4>
                  {data?.deviceDistribution && data.deviceDistribution.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      {data.deviceDistribution.map((item, idx) => {
                        const pct = Math.round((item.count / (data.totalScans || 1)) * 100);
                        return (
                          <div key={item.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{item.name}</span>
                              <span>{item.count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">No device data yet</p>
                  )}
                </div>

                {/* Browser Distribution */}
                <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-500" />
                    Top Browsers
                  </h4>
                  {data?.browserDistribution && data.browserDistribution.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      {data.browserDistribution.map((item, idx) => {
                        const pct = Math.round((item.count / (data.totalScans || 1)) * 100);
                        return (
                          <div key={item.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{item.name}</span>
                              <span>{item.count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: COLORS[(idx + 2) % COLORS.length] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">No browser data yet</p>
                  )}
                </div>

                {/* Operating Systems */}
                <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-purple-500" />
                    Operating Systems
                  </h4>
                  {data?.osDistribution && data.osDistribution.length > 0 ? (
                    <div className="space-y-3 pt-1">
                      {data.osDistribution.map((item, idx) => {
                        const pct = Math.round((item.count / (data.totalScans || 1)) * 100);
                        return (
                          <div key={item.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-slate-700">
                              <span>{item.name}</span>
                              <span>{item.count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%`, backgroundColor: COLORS[(idx + 4) % COLORS.length] }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-6">No OS data yet</p>
                  )}
                </div>

                {/* Traffic Sources & Locations */}
                <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-amber-500" />
                    Top Locations
                  </h4>
                  <div className="space-y-3">
                    {data?.countryDistribution && data.countryDistribution.length > 0 ? (
                      <div className="space-y-2">
                        {data.countryDistribution.slice(0, 5).map((c) => (
                          <div key={c.name} className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-orange-500" />
                              {c.name}
                            </span>
                            <span className="font-bold text-slate-500">{c.count} scans</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-6">No location data yet</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Edit Destination Modal */}
      {data?.qr && (
        <DynamicQREditModal
          qr={data.qr}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      <Footer />
    </div>
  );
}
