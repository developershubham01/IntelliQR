import { QR_TYPES } from "@/types/qr";
import { useQRStore } from "@/store/qrStore";
import { Loader2, Sparkles, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";

export default function QRContentForm() {
  const { isAuthenticated } = useAuth();
  const { selectedType, formData, updateFormField, generateQR, isGenerating, isDynamic, setIsDynamic } = useQRStore();

  const qrType = QR_TYPES.find((t) => t.type === selectedType);
  if (!qrType) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{qrType.label} Details</h3>
        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/50 px-2.5 py-1 rounded-full uppercase tracking-wider">{qrType.category}</span>
      </div>

      <div className="bg-white/40 backdrop-blur-sm border border-slate-200/30 rounded-2xl p-4 flex items-start justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-700 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
            Dynamic QR Code
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
            Dynamic QR codes let you change the destination URL later and track scan statistics without reprinting.
          </p>
        </div>
        <Switch
          checked={isDynamic}
          onCheckedChange={setIsDynamic}
          className="data-[state=checked]:bg-slate-900"
        />
      </div>

      <div className="space-y-4">
        {qrType.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                value={(formData[field.name] as string) || ""}
                onChange={(e) => updateFormField(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                aria-required={field.required}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm resize-none"
              />
            ) : field.type === "select" ? (
              <div className="relative">
                <select
                  id={field.name}
                  value={(formData[field.name] as string) || ""}
                  onChange={(e) => updateFormField(field.name, e.target.value)}
                  required={field.required}
                  aria-required={field.required}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm appearance-none cursor-pointer"
                >
                  <option value="" className="bg-white">
                    Select...
                  </option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <input
                id={field.name}
                type={field.type}
                value={(formData[field.name] as string) || ""}
                onChange={(e) => updateFormField(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                aria-required={field.required}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={generateQR}
        disabled={isGenerating}
        className="w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-md shadow-slate-950/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate QR Code
          </>
        )}
      </button>
    </div>
  );
}
