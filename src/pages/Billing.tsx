import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { toast } from "sonner";
import {
  CreditCard,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Receipt,
  Layers,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Billing() {
  const { isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });

  const utils = trpc.useUtils();
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  // Queries
  const { data: subData } = trpc.billing.getMySubscription.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: paymentsData, isLoading: paymentsLoading } = trpc.billing.getMyPayments.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: qrData } = trpc.qr.list.useQuery(
    { limit: 100, type: "dynamic" },
    { enabled: isAuthenticated }
  );

  // Mutation
  const cancelMutation = trpc.billing.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription will cancel at the end of the current billing cycle.");
      setCancelModalOpen(false);
      utils.billing.getMySubscription.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to cancel subscription.");
    },
  });

  const activeTier = subData?.tier || "free";
  const planName = subData?.plan?.name || (activeTier === "free" ? "Free Tier" : "Pro Plan");
  const expiresAt = subData?.expiresAt ? new Date(subData.expiresAt).toLocaleDateString() : "Never";
  const dynamicCount = qrData?.total ?? 0;
  const maxDynamic = subData?.limits?.maxDynamicQRs ?? 3;
  const isCancelled = subData?.subscription?.cancelAtPeriodEnd;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SEOHead
        title="Billing & Subscription Management – IntelliQR"
        description="View your active subscription, payment transaction history, and feature usage limits."
        canonicalUrl="https://intelli-qr.vercel.app/billing"
      />

      <Header />

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[28px] p-6 bg-white">
          <DialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold font-serif text-slate-900">
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 leading-relaxed">
              Your subscription will remain active until{" "}
              <strong className="text-slate-800">{expiresAt}</strong>. After this date, you will
              revert to the Free tier. Your existing QR codes will never be deleted, but editing dynamic
              routes beyond 3 codes will be locked.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Keep Subscription
            </button>
            <button
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-2"
            >
              {cancelMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Confirm Cancellation
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1 bg-[#FAFAFA] pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Title & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mb-1">
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-900 font-bold">Billing & Subscription</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                Billing & Plan Settings
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/pricing"
                className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-indigo-600/10"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Browse All Plans
              </Link>
            </div>
          </div>

          {/* Plan Overview & Quota Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Active Subscription Details (8 Cols) */}
            <div className="lg:col-span-8 bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">
                    Current Active Tier
                  </span>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold font-serif text-slate-900">{planName}</h2>
                    <span
                      className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${
                        subData?.status === "active" && !isCancelled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isCancelled
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {isCancelled ? "Cancels at period end" : subData?.status || "Active"}
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                    {activeTier === "free" ? "Plan Status" : "Active Until"}
                  </span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {expiresAt}
                  </span>
                </div>
              </div>

              {/* Quotas & Entitlements Progress Bars */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Feature Quotas & Entitlements
                </h3>

                {/* Dynamic QR Usage */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">Dynamic QR Codes Created</span>
                    <span className="font-extrabold text-slate-900">
                      {dynamicCount} / {maxDynamic >= 500 ? "Unlimited" : maxDynamic}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dynamicCount >= maxDynamic ? "bg-rose-500" : "bg-indigo-600"
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((dynamicCount / maxDynamic) * 100))}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Scans & Retention */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Analytics Retention
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {subData?.limits?.analyticsRetentionDays || 7} Days Retention
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Vector Formats
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {subData?.limits?.exportFormats?.join(", ").toUpperCase() || "PNG, JPG"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                {activeTier !== "free" && !isCancelled && (
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline"
                  >
                    Cancel Subscription
                  </button>
                )}

                <Link
                  to="/pricing"
                  className="px-6 py-3 rounded-full bg-[#2A2C3C] hover:bg-slate-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ml-auto"
                >
                  {activeTier === "free" ? "Upgrade Plan" : "Change Plan"}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Payment Gateway Trust Card (4 Cols) */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Razorpay Secured</h3>
                  <span className="text-[10px] text-slate-500 font-semibold">256-bit PCI-DSS Compliant</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Payments are processed via Razorpay with support for UPI, Google Pay, PhonePe, credit & debit cards, and NetBanking.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Instant automated activation</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Cryptographic signature verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>QR codes remain safe forever</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-[11px] text-indigo-900 font-medium">
                Tax invoices with GST details are available upon request for business accounts.
              </div>
            </div>

          </div>

          {/* Payment Transaction History Table */}
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-900 tracking-tight">
                  Payment History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your past transactions and order references
                </p>
              </div>
              <Receipt className="w-5 h-5 text-slate-400" />
            </div>

            {paymentsLoading ? (
              <div className="py-12 flex justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : !paymentsData || paymentsData.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                No payment transactions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Payment ID</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {paymentsData.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 text-slate-600">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-700 text-[11px]">
                          {p.razorpayOrderId}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                          {p.razorpayPaymentId || "—"}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          ₹{(p.amount / 100).toLocaleString()} {p.currency}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              p.status === "captured"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : p.status === "pending"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {p.status === "captured" && <CheckCircle2 className="w-3 h-3" />}
                            {p.status === "failed" && <XCircle className="w-3 h-3" />}
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
