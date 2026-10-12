import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, Ticket,
  Loader2, XCircle
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function TicketVerifyPage() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const [ticketInput, setTicketInput] = useState(initialCode);
  const [queriedCode, setQueriedCode] = useState(initialCode);
  const { isAuthenticated } = useAuth();

  // Verification Query
  const { data: verificationResult, isLoading, refetch } = trpc.ticket.verify.useQuery(
    { ticketCode: queriedCode },
    { enabled: !!queriedCode }
  );

  // Check-In Mutation
  const checkInMutation = trpc.ticket.checkIn.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.warning(data.message);
      }
      refetch();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to check in ticket.");
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketInput.trim()) return;
    setQueriedCode(ticketInput.trim());
  };

  const handlePerformCheckIn = () => {
    if (!queriedCode) return;
    checkInMutation.mutate({ ticketCode: queriedCode });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <SEOHead
        title="Event Ticket & Badge Verification Portal – IntelliQR"
        description="Verify event ticket barcodes, prevent duplicate entry scans, and record attendee check-in times securely."
        canonicalUrl="https://intelli-qr.vercel.app/ticket/verify"
      />

      <Header />

      <main className="flex-1 pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          {/* Header Card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Gate Staff Admission System
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-2">
              Event Ticket Verification
            </h1>
            <p className="text-sm text-slate-600">
              Enter or scan the attendee ticket code to verify authenticity and prevent duplicate admissions.
            </p>
          </div>

          {/* Search / Scan Input Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value.toUpperCase())}
                placeholder="Enter Ticket Code (e.g. TKT-TECHX-9942)"
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </button>
            </form>
          </div>

          {/* Verification Status Card */}
          {queriedCode && verificationResult && (
            <div className={`rounded-3xl p-6 border shadow-sm space-y-5 transition-all ${
              verificationResult.valid
                ? "bg-emerald-50/40 border-emerald-200/80"
                : verificationResult.status === "already_used"
                ? "bg-amber-50/40 border-amber-200/80"
                : "bg-rose-50/40 border-rose-200/80"
            }`}>
              {/* Badge State */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  verificationResult.valid
                    ? "bg-emerald-100 text-emerald-800"
                    : verificationResult.status === "already_used"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {verificationResult.valid && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {verificationResult.status === "already_used" && <AlertTriangle className="w-3.5 h-3.5" />}
                  {verificationResult.status === "not_found" && <XCircle className="w-3.5 h-3.5" />}
                  {verificationResult.valid
                    ? "Valid for Admission"
                    : verificationResult.status === "already_used"
                    ? "Duplicate Scan Warning"
                    : "Invalid Ticket"}
                </span>

                <span className="font-mono text-xs font-bold text-slate-500">
                  {queriedCode}
                </span>
              </div>

              {/* Message */}
              <p className={`text-sm font-semibold ${
                verificationResult.valid ? "text-emerald-900" : verificationResult.status === "already_used" ? "text-amber-900" : "text-rose-900"
              }`}>
                {verificationResult.message}
              </p>

              {/* Ticket Details if available */}
              {verificationResult.ticket && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200/60 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Event</span>
                    <strong className="text-slate-900 text-right">{verificationResult.ticket.eventName}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Attendee</span>
                    <strong className="text-slate-900">{verificationResult.ticket.attendeeName}</strong>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Pass Tier</span>
                    <span className="font-bold text-indigo-600">{verificationResult.ticket.ticketType}</span>
                  </div>
                  {verificationResult.ticket.checkedInAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Check-in Timestamp</span>
                      <span className="text-slate-700 font-mono">
                        {new Date(verificationResult.ticket.checkedInAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Admission Action Buttons */}
              {verificationResult.valid && isAuthenticated && (
                <button
                  onClick={handlePerformCheckIn}
                  disabled={checkInMutation.isPending}
                  className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  {checkInMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Confirm & Check In Attendee
                    </>
                  )}
                </button>
              )}

              {verificationResult.valid && !isAuthenticated && (
                <p className="text-[11px] text-slate-500 text-center">
                  To record check-ins as an event organizer, please <Link to="/login" className="text-indigo-600 font-bold underline">log in</Link>.
                </p>
              )}
            </div>
          )}

          {/* Quick Info Box */}
          <div className="mt-8 bg-white/60 backdrop-blur-md rounded-2xl p-5 border border-slate-200/60 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-indigo-600" />
              Cryptographic Ticket Verification Rules
            </div>
            <ul className="space-y-1 list-disc list-inside text-slate-500">
              <li>Each attendee ticket features a unique non-guessable alphanumeric identifier.</li>
              <li>When scanned at entry gates, check-in timestamps are atomically committed.</li>
              <li>Duplicate scans are immediately flagged with audio/visual warnings to stop pass sharing.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
