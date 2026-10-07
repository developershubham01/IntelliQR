import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  Globe,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Shuffle,
  Plus,
  Trash2,
} from "lucide-react";

interface DynamicQREditModalProps {
  qr: {
    id: number;
    name: string;
    shortId?: string | null;
    destinationUrl?: string | null;
    content?: string | null;
    data?: Record<string, unknown> | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newDestination: string) => void;
}

interface LBTarget {
  url: string;
  weight: number;
  label?: string;
}

function EditModalBody({
  qr,
  onClose,
  onSuccess,
}: {
  qr: NonNullable<DynamicQREditModalProps["qr"]>;
  onClose: () => void;
  onSuccess?: (newDestination: string) => void;
}) {
  const existingLB = (qr.data?.loadBalancer as { enabled?: boolean; targets?: LBTarget[] } | undefined);
  const [useLoadBalancer, setUseLoadBalancer] = useState(existingLB?.enabled || false);
  const [destination, setDestination] = useState(qr.destinationUrl || qr.content || "");
  const [lbTargets, setLbTargets] = useState<LBTarget[]>(
    existingLB?.targets && existingLB.targets.length > 0
      ? existingLB.targets
      : [
          { url: qr.destinationUrl || qr.content || "", weight: 50, label: "Variant A" },
          { url: "", weight: 50, label: "Variant B" },
        ]
  );
  const [copied, setCopied] = useState(false);
  const utils = trpc.useUtils();

  const updateMutation = trpc.qr.updateDestination.useMutation({
    onSuccess: (data) => {
      toast.success(
        useLoadBalancer
          ? "Traffic Load Balancer configured! Scans will now be split across your destinations."
          : "Destination updated successfully. Your QR code will redirect to the new destination.",
        { duration: 5000 }
      );
      utils.qr.list.invalidate();
      utils.qr.analytics.invalidate({ id: qr.id });
      onSuccess?.(data.destinationUrl);
      onClose();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update destination URL.");
    },
  });

  const handleCopyLink = () => {
    if (!qr.shortId) return;
    const shortUrl = `${window.location.origin}/q/${qr.shortId}`;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    toast.success("Short URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const addLBTarget = () => {
    if (lbTargets.length >= 5) {
      toast.error("Maximum 5 destinations allowed per QR load balancer.");
      return;
    }
    const nextLetter = String.fromCharCode(65 + lbTargets.length);
    setLbTargets([...lbTargets, { url: "", weight: 50, label: `Variant ${nextLetter}` }]);
  };

  const removeLBTarget = (index: number) => {
    if (lbTargets.length <= 2) {
      toast.error("Load balancer requires at least 2 destinations.");
      return;
    }
    setLbTargets(lbTargets.filter((_, i) => i !== index));
  };

  const updateLBTarget = (index: number, field: keyof LBTarget, val: string | number) => {
    const updated = [...lbTargets];
    updated[index] = { ...updated[index], [field]: val };
    setLbTargets(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (useLoadBalancer) {
      // Validate all load balancer targets
      const cleanTargets: LBTarget[] = [];
      for (let i = 0; i < lbTargets.length; i++) {
        let u = lbTargets[i].url.trim();
        if (!u) {
          toast.error(`Please provide a URL for Destination ${i + 1}.`);
          return;
        }
        if (!/^https?:\/\//i.test(u)) {
          u = `https://${u}`;
        }
        cleanTargets.push({
          url: u,
          weight: Math.max(1, Math.min(100, Number(lbTargets[i].weight) || 50)),
          label: lbTargets[i].label || `Variant ${i + 1}`,
        });
      }

      updateMutation.mutate({
        id: qr.id,
        destinationUrl: cleanTargets[0].url,
        loadBalancer: {
          enabled: true,
          targets: cleanTargets,
        },
      });
    } else {
      let trimmed = destination.trim();
      if (!trimmed) {
        toast.error("Destination URL cannot be empty.");
        return;
      }

      if (!/^https?:\/\//i.test(trimmed)) {
        trimmed = `https://${trimmed}`;
      }

      updateMutation.mutate({
        id: qr.id,
        destinationUrl: trimmed,
        loadBalancer: {
          enabled: false,
          targets: [],
        },
      });
    }
  };

  const shortUrl = qr.shortId ? `${window.location.origin}/q/${qr.shortId}` : "";

  return (
    <div className="flex flex-col gap-4 w-full min-w-0 overflow-hidden">
      {/* Dialog Header */}
      <DialogHeader className="text-left space-y-1.5 w-full min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200/50">
            Dynamic QR
          </span>
          <span className="text-xs text-slate-400 font-semibold truncate max-w-[220px]" title={qr.name}>
            {qr.name}
          </span>
        </div>
        <DialogTitle className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-tight">
          Routing & Load Balancer
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed">
          Configure single-target redirection or multi-destination traffic load balancing in real-time.
        </DialogDescription>
      </DialogHeader>

      {/* Permanent Short URL Box */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3 w-full min-w-0 overflow-hidden">
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Permanent QR Link</div>
          <div className="text-xs font-mono font-semibold text-slate-700 truncate select-all" title={shortUrl}>
            {shortUrl}
          </div>
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="p-2 rounded-xl bg-white border border-slate-200/70 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-sm shrink-0"
          title="Copy permanent link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setUseLoadBalancer(false)}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 ${
            !useLoadBalancer
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-500" />
          Single URL
        </button>
        <button
          type="button"
          onClick={() => setUseLoadBalancer(true)}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider flex items-center justify-center gap-1.5 ${
            useLoadBalancer
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Shuffle className="w-3.5 h-3.5 text-orange-500" />
          Load Balancer (A/B)
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full min-w-0 overflow-hidden">
        {!useLoadBalancer ? (
          <>
            {/* Single Destination Input */}
            <div className="w-full min-w-0 overflow-hidden">
              <label htmlFor="newDestination" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Destination URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative w-full min-w-0 overflow-hidden">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
                <input
                  id="newDestination"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="https://yourwebsite.com/landing-page"
                  required
                  className="w-full min-w-0 max-w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                />
              </div>
              <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                All scans will route to this URL.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Load Balancer Multi-Destination Inputs */}
            <div className="space-y-3 w-full min-w-0 overflow-hidden">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                  Traffic Split Destinations ({lbTargets.length})
                </label>
                <button
                  type="button"
                  onClick={addLBTarget}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  <Plus className="w-3 h-3" />
                  Add Link
                </button>
              </div>

              {lbTargets.map((target, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2 w-full min-w-0 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Destination {idx + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400">
                        Weight: {target.weight}%
                      </span>
                      {lbTargets.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeLBTarget(idx)}
                          className="p-1 hover:text-rose-600 text-slate-400 transition-colors"
                          title="Remove target"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative w-full min-w-0">
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={target.url}
                      onChange={(e) => updateLBTarget(idx, "url", e.target.value)}
                      placeholder={`https://example.com/split-${idx + 1}`}
                      required
                      className="w-full pl-8.5 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>
              ))}

              <p className="text-[10px] text-slate-400 leading-normal flex items-center gap-1">
                <Shuffle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                Scans will be dynamically distributed across these destinations in real-time.
              </p>
            </div>
          </>
        )}

        {/* Buttons / Actions */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Routing...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {useLoadBalancer ? "Save Load Balancer" : "Save Destination URL"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function DynamicQREditModal({
  qr,
  isOpen,
  onClose,
  onSuccess,
}: DynamicQREditModalProps) {
  if (!qr) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        key={qr.id}
        className="w-[calc(100%-2rem)] max-w-[520px] p-5 sm:p-7 rounded-[28px] border-slate-100 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <EditModalBody qr={qr} onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
