import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DynamicQREditModal from "@/components/qr/DynamicQREditModal";
import DynamicQRAnalyticsModal from "@/components/qr/DynamicQRAnalyticsModal";
import { toast } from "sonner";
import {
  Zap,
  Activity,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Check,
  Edit3,
  BarChart2,
  PauseCircle,
  PlayCircle,
  Trash2,
  Download,
  AlertTriangle,
  Loader2,
  QrCode,
  Layers,
  Sparkles
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth({
    redirectOnUnauthenticated: true,
  });
  const utils = trpc.useUtils();

  // Filters & Search
  const [filterType, setFilterType] = useState<"all" | "dynamic" | "static">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "expired">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals state
  const [editQR, setEditQR] = useState<{
    id: number;
    name: string;
    shortId?: string | null;
    destinationUrl?: string | null;
    content?: string | null;
  } | null>(null);

  const [analyticsQRId, setAnalyticsQRId] = useState<number | null>(null);

  // Confirmation dialogs state
  const [statusActionQR, setStatusActionQR] = useState<{
    id: number;
    name: string;
    targetStatus: "active" | "paused";
  } | null>(null);

  const [deleteQR, setDeleteQR] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Queries
  const { data: qrData, isLoading: qrLoading } = trpc.qr.list.useQuery(
    {
      limit: 100,
      type: filterType,
      status: filterStatus,
      search: searchQuery || undefined,
    },
    { enabled: isAuthenticated }
  );

  const { data: statsData } = trpc.qr.stats.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Mutations
  const updateStatusMutation = trpc.qr.updateStatus.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.status === "paused"
          ? "Dynamic QR paused. Scans will now display a temporarily unavailable message."
          : "Dynamic QR resumed. Scans will redirect to your destination normally."
      );
      utils.qr.list.invalidate();
      setStatusActionQR(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update status.");
    },
  });

  const deleteMutation = trpc.qr.delete.useMutation({
    onSuccess: () => {
      toast.success("QR Code deleted successfully.");
      utils.qr.list.invalidate();
      utils.qr.stats.invalidate();
      setDeleteQR(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete QR Code.");
    },
  });

  const handleCopy = (shortId: string) => {
    const url = `${window.location.origin}/q/${shortId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shortId);
    toast.success("Permanent link copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (imageUrl: string | null, name: string) => {
    if (!imageUrl) {
      toast.error("No image available for download.");
      return;
    }
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `${name.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("QR Code downloaded!");
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-800" />
      </div>
    );
  }

  const items = qrData?.items || [];

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <Header />

      <main className="relative z-10 pt-28 pb-20 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Background mesh decoration */}
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[100px] top-12 left-1/4 -z-10 pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 via-sky-500/10 to-teal-500/10 rounded-full blur-[100px] bottom-12 right-1/4 -z-10 pointer-events-none" />

        {/* Hero Banner & Stats */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200/50 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  Management Hub
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {user?.name}'s Workspace
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                Dynamic QR Dashboard
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-1">
                Monitor real-time scan analytics and change destination URLs on the fly without reprinting.
              </p>
            </div>

            <Link
              to="/generator"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-widest uppercase shadow-lg shadow-slate-950/10 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              Create QR Code
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-3xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Scans</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {(statsData?.totalScans ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">Across all dynamic campaigns</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-3xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Dynamic QRs</span>
                <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <Zap className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {statsData?.totalDynamic ?? 0}
              </div>
              <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {statsData?.activeDynamic ?? 0} Active and routing
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-3xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Downloads</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {(statsData?.totalDownloads ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">High-res PNG & vector SVGs</div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-3xl p-5">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">All QR Codes</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {statsData?.totalGenerated ?? 0}
              </div>
              <div className="text-[11px] text-slate-400 font-semibold mt-1">Static and Dynamic</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] rounded-3xl p-4 sm:p-5 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Type Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterType === "all"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All QRs
              </button>
              <button
                onClick={() => setFilterType("dynamic")}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterType === "dynamic"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                Dynamic Only
              </button>
              <button
                onClick={() => setFilterType("static")}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filterType === "static"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Static Only
              </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:inline">
                Status:
              </span>
              {(["all", "active", "paused", "expired"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all capitalize whitespace-nowrap ${
                    filterStatus === st
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by QR name, destination URL, or short code (e.g. 8Kx92LmP)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200/70 bg-white/70 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* QR List Section */}
        {qrLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Loading QR campaign repository...
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_12px_40px_rgba(0,0,0,0.03)] rounded-[32px] p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center mx-auto text-indigo-600">
              <QrCode className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900">No QR Codes Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              {searchQuery
                ? `No QR codes matching "${searchQuery}". Try clearing your search.`
                : "You haven't created any dynamic QR codes yet. Create one now to start tracking scans and updating destinations in real-time."}
            </p>
            <Link
              to="/generator"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-widest uppercase shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              Create First Dynamic QR
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((qr) => {
              const shortUrl = qr.shortId ? `${window.location.origin}/q/${qr.shortId}` : "";
              const isDynamic = qr.isDynamic;
              const isPaused = qr.status === "paused";
              const isExpired = qr.status === "expired";

              return (
                <motion.div
                  key={qr.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.05)] rounded-[28px] p-5 sm:p-6 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      {/* Image Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm group relative">
                        {qr.imageUrl ? (
                          <img
                            src={qr.imageUrl}
                            alt={qr.name}
                            className="w-full h-full object-contain rounded-xl"
                          />
                        ) : (
                          <QrCode className="w-8 h-8 text-slate-300" />
                        )}
                      </div>

                      {/* Info Column */}
                      <div className="min-w-0 space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                            {qr.name}
                          </h3>

                          {/* Type Pill */}
                          {isDynamic ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200/50 flex items-center gap-1">
                              <Zap className="w-2.5 h-2.5" />
                              Dynamic
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/50">
                              Static
                            </span>
                          )}

                          {/* Status Pill */}
                          {isDynamic && (
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                isPaused
                                  ? "bg-amber-50 text-amber-700 border-amber-200/60"
                                  : isExpired
                                  ? "bg-rose-50 text-rose-700 border-rose-200/60"
                                  : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                              }`}
                            >
                              {qr.status}
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 capitalize font-medium">
                            • {qr.type}
                          </span>
                        </div>

                        {/* Permanent URL for dynamic QRs */}
                        {isDynamic && qr.shortId && (
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Permanent Short Link:
                            </span>
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-mono font-semibold text-slate-800 text-[11px]">
                              <span>{shortUrl}</span>
                              <button
                                onClick={() => handleCopy(qr.shortId!)}
                                className="p-0.5 hover:text-indigo-600 transition-colors"
                                title="Copy Short Link"
                              >
                                {copiedId === qr.shortId ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                              <a
                                href={`/q/${qr.shortId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-0.5 hover:text-indigo-600 transition-colors"
                                title="Open Link in New Tab"
                              >
                                <ExternalLink className="w-3 h-3 text-slate-400" />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Destination URL */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate max-w-lg">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
                            {isDynamic ? "Current Destination:" : "Content:"}
                          </span>
                          <span className="truncate font-semibold text-slate-700">
                            {qr.destinationUrl || qr.content}
                          </span>
                        </div>

                        {/* Metrics Bar */}
                        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-0.5">
                          {isDynamic && (
                            <span className="flex items-center gap-1 text-indigo-600 font-bold">
                              <Activity className="w-3.5 h-3.5" />
                              {(qr.scanCount || 0).toLocaleString()} scans
                            </span>
                          )}
                          <span className="text-slate-400 font-normal">
                            Created {new Date(qr.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                      {isDynamic && (
                        <>
                          <button
                            onClick={() => setEditQR(qr)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 text-slate-700 shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Destination
                          </button>

                          <button
                            onClick={() => setAnalyticsQRId(qr.id)}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-slate-200 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50/30 text-slate-700 shadow-sm transition-all flex items-center gap-1.5"
                          >
                            <BarChart2 className="w-3.5 h-3.5" />
                            Analytics
                          </button>

                          <button
                            onClick={() =>
                              setStatusActionQR({
                                id: qr.id,
                                name: qr.name,
                                targetStatus: isPaused ? "active" : "paused",
                              })
                            }
                            className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border shadow-sm transition-all flex items-center gap-1.5 ${
                              isPaused
                                ? "bg-amber-50/60 border-amber-200 text-amber-700 hover:bg-amber-100"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            {isPaused ? (
                              <>
                                <PlayCircle className="w-3.5 h-3.5" />
                                Resume
                              </>
                            ) : (
                              <>
                                <PauseCircle className="w-3.5 h-3.5" />
                                Pause
                              </>
                            )}
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handleDownload(qr.imageUrl, qr.name)}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                        title="Download QR"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeleteQR({ id: qr.id, name: qr.name })}
                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shadow-sm"
                        title="Delete QR"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Edit Destination Modal */}
      <DynamicQREditModal
        qr={editQR}
        isOpen={!!editQR}
        onClose={() => setEditQR(null)}
        onSuccess={() => utils.qr.list.invalidate()}
      />

      {/* Analytics Modal */}
      <DynamicQRAnalyticsModal
        qrId={analyticsQRId}
        isOpen={!!analyticsQRId}
        onClose={() => setAnalyticsQRId(null)}
      />

      {/* Confirm Pause / Resume Dialog */}
      <Dialog open={!!statusActionQR} onOpenChange={(o) => !o && setStatusActionQR(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 bg-white border-slate-100 shadow-2xl">
          <DialogHeader className="space-y-2 text-left">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-serif font-bold text-slate-900">
              {statusActionQR?.targetStatus === "paused"
                ? "Pause Dynamic QR Code?"
                : "Resume Dynamic QR Code?"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed">
              {statusActionQR?.targetStatus === "paused"
                ? `When paused, anyone scanning "${statusActionQR?.name}" will see a "Temporarily Unavailable" page instead of your destination. You can resume it anytime.`
                : `Resuming "${statusActionQR?.name}" will restore normal redirection to your configured destination.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setStatusActionQR(null)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (statusActionQR) {
                  updateStatusMutation.mutate({
                    id: statusActionQR.id,
                    status: statusActionQR.targetStatus,
                  });
                }
              }}
              disabled={updateStatusMutation.isPending}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-md ${
                statusActionQR?.targetStatus === "paused"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {updateStatusMutation.isPending ? "Updating..." : "Confirm"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!deleteQR} onOpenChange={(o) => !o && setDeleteQR(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 bg-white border-slate-100 shadow-2xl">
          <DialogHeader className="space-y-2 text-left">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 mb-1">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-serif font-bold text-slate-900">
              Delete QR Code?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed">
              Are you sure you want to delete "{deleteQR?.name}"? Any printed dynamic QR codes with this short link will stop working immediately and historical scan analytics will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <button
              onClick={() => setDeleteQR(null)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (deleteQR) {
                  deleteMutation.mutate({ id: deleteQR.id });
                }
              }}
              disabled={deleteMutation.isPending}
              className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/10"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permanently"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
