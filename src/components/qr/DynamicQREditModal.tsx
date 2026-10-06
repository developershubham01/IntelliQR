import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import { Globe, Loader2, CheckCircle2, ShieldCheck, Copy, Check } from "lucide-react";

interface DynamicQREditModalProps {
  qr: {
    id: number;
    name: string;
    shortId?: string | null;
    destinationUrl?: string | null;
    content?: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newDestination: string) => void;
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
  const [destination, setDestination] = useState(qr.destinationUrl || qr.content || "");
  const [copied, setCopied] = useState(false);
  const utils = trpc.useUtils();

  const updateMutation = trpc.qr.updateDestination.useMutation({
    onSuccess: (data) => {
      toast.success(
        "Destination updated successfully. Your existing QR code will now redirect to the new destination.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    });
  };

  const shortUrl = qr.shortId ? `${window.location.origin}/q/${qr.shortId}` : "";

  return (
    <>
      <DialogHeader className="text-left space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200/50">
            Dynamic QR
          </span>
          <span className="text-xs text-slate-400 font-semibold truncate max-w-[200px]">
            {qr.name}
          </span>
        </div>
        <DialogTitle className="text-xl font-serif font-bold text-slate-900 tracking-tight">
          Edit Destination URL
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed">
          Change where this QR code redirects in real-time. The printed QR image and permanent short link will remain exactly the same.
        </DialogDescription>
      </DialogHeader>

      {/* Permanent Short URL Info */}
      <div className="mt-2 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Permanent QR Link</div>
          <div className="text-xs font-mono font-semibold text-slate-700 truncate">{shortUrl}</div>
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="p-2 rounded-xl bg-white border border-slate-200/70 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-sm flex-shrink-0"
          title="Copy permanent link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Current Destination vs New */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
            Current Destination
          </label>
          <div className="px-3.5 py-2 rounded-xl bg-slate-100/60 border border-slate-200/50 text-xs font-medium text-slate-500 truncate">
            {qr.destinationUrl || qr.content || "None"}
          </div>
        </div>

        <div>
          <label htmlFor="newDestination" className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
            New Destination URL <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="newDestination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="https://yourwebsite.com/new-page"
              required
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Only secure http:// and https:// destinations are accepted.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </>
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
      <DialogContent key={qr.id} className="sm:max-w-[500px] p-6 rounded-[28px] border-slate-100 bg-white/95 backdrop-blur-xl shadow-2xl">
        <EditModalBody qr={qr} onClose={onClose} onSuccess={onSuccess} />
      </DialogContent>
    </Dialog>
  );
}
