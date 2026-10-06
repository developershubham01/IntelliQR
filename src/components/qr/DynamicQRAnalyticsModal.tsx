import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Activity, 
  Users, 
  Calendar, 
  Smartphone, 
  Globe2, 
  Compass, 
  Monitor, 
  Loader2, 
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface DynamicQRAnalyticsModalProps {
  qrId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

type RangeOption = "today" | "7d" | "30d" | "90d" | "all";

const COLORS = ["#6366f1", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#64748b"];

export default function DynamicQRAnalyticsModal({
  qrId,
  isOpen,
  onClose,
}: DynamicQRAnalyticsModalProps) {
  const [range, setRange] = useState<RangeOption>("30d");

  const { data, isLoading, refetch, isFetching } = trpc.qr.analytics.useQuery(
    { id: qrId!, range },
    { enabled: !!qrId && isOpen }
  );

  if (!qrId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-[32px] border-slate-100 bg-white/95 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="text-left space-y-2 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200/50">
                Analytics
              </span>
              <span className="text-xs font-bold text-slate-700 truncate max-w-[220px]">
                {data?.qr?.name || "Dynamic QR"}
              </span>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
              {(["today", "7d", "30d", "90d", "all"] as RangeOption[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all uppercase tracking-wider ${
                    range === r
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {r === "all" ? "All Time" : r}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <DialogTitle className="text-2xl font-serif font-bold text-slate-900 tracking-tight">
              Scan Performance & Visitor Insights
            </DialogTitle>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
              title="Refresh Analytics"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-indigo-600" : ""}`} />
            </button>
          </div>

          {data?.qr && (
            <DialogDescription className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-3">
              <span>
                Permanent Link:{" "}
                <a
                  href={`/q/${data.qr.shortId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-indigo-600 hover:underline inline-flex items-center gap-0.5"
                >
                  /q/{data.qr.shortId}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </span>
              <span>•</span>
              <span className="truncate max-w-sm">
                Destination: <span className="text-slate-700 font-semibold">{data.qr.destinationUrl}</span>
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-slate-900" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              Compiling scan metrics...
            </p>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/60">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  Total Scans
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {data?.totalScans.toLocaleString() || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-50/50 border border-cyan-100/60">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-700 uppercase tracking-wider mb-1">
                  <Users className="w-3.5 h-3.5" />
                  Unique Scans
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {data?.uniqueScans.toLocaleString() || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/60">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Today
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {data?.todayScans.toLocaleString() || 0}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100/60">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  This Week
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {data?.weekScans.toLocaleString() || 0}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  This Month
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {data?.monthScans.toLocaleString() || 0}
                </div>
              </div>
            </div>

            {/* Scans Over Time Chart */}
            <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  Scans Over Time
                </h4>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {data?.scansOverTime.length || 0} recorded intervals
                </span>
              </div>

              <div className="h-[220px] w-full">
                {data?.scansOverTime && data.scansOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.scansOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="scansGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 10, fill: "#94a3b8" }} 
                        axisLine={false} 
                        tickLine={false}
                      />
                      <YAxis 
                        allowDecimals={false} 
                        tick={{ fontSize: 10, fill: "#94a3b8" }} 
                        axisLine={false} 
                        tickLine={false} 
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderRadius: "12px",
                          border: "none",
                          color: "#fff",
                          fontSize: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#scansGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
                    No scans recorded in this timeframe yet.
                  </div>
                )}
              </div>
            </div>

            {/* Breakdown Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Device Distribution */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  Device Distribution
                </h4>
                {data?.deviceDistribution && data.deviceDistribution.length > 0 ? (
                  <div className="space-y-2.5">
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
              <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-500" />
                  Top Browsers
                </h4>
                {data?.browserDistribution && data.browserDistribution.length > 0 ? (
                  <div className="space-y-2.5">
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

              {/* Operating System */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-purple-500" />
                  Operating Systems
                </h4>
                {data?.osDistribution && data.osDistribution.length > 0 ? (
                  <div className="space-y-2.5">
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

              {/* Top Referrers & Countries */}
              <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-amber-500" />
                  Traffic Sources & Locations
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Top Sources
                    </div>
                    {data?.referrerDistribution && data.referrerDistribution.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {data.referrerDistribution.map((r) => (
                          <span
                            key={r.name}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-700 flex items-center gap-1.5"
                          >
                            <span>{r.name}</span>
                            <span className="font-bold text-slate-400">({r.count})</span>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium">Direct / Camera scans</p>
                    )}
                  </div>

                  {data?.countryDistribution && data.countryDistribution.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Top Countries
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {data.countryDistribution.map((c) => (
                          <span
                            key={c.name}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-semibold flex items-center gap-1.5"
                          >
                            <span>{c.name}</span>
                            <span className="font-bold text-indigo-400">({c.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
