import { QR_TYPES } from "@/types/qr";
import { useQRStore } from "@/store/qrStore";
import { Loader2, Sparkles, Zap } from "lucide-react";
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

      {/* Static vs Dynamic QR Mode Selector */}
      <div className="space-y-3">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          QR Code Type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setIsDynamic(false)}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              !isDynamic
                ? "bg-white border-slate-900 shadow-sm ring-1 ring-slate-900"
                : "bg-white/60 border-slate-200/60 hover:bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${!isDynamic ? "border-slate-900" : "border-slate-300"}`}>
                {!isDynamic && <div className="w-2 h-2 rounded-full bg-slate-900" />}
              </div>
              <span className="text-xs font-bold text-slate-900">Static QR</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed pl-5">
              Direct destination. Fast, permanent, no tracking or updates.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setIsDynamic(true)}
            className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
              isDynamic
                ? "bg-indigo-50/40 border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                : "bg-white/60 border-slate-200/60 hover:bg-white text-slate-600"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isDynamic ? "border-indigo-600" : "border-slate-300"}`}>
                {isDynamic && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
              </div>
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                Dynamic QR
                <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed pl-5">
              Editable destination URL & real-time scan analytics.
            </p>
          </button>
        </div>

        {isDynamic && (
          <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Dynamic Campaign Features Enabled
              </span>
              {!isAuthenticated && (
                <span className="text-[9px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  Sign in required to save
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
              Encodes a permanent IntelliQR link (<span className="font-mono text-indigo-600 font-bold">/q/8Kx92LmP</span>). You can edit the destination URL anytime without reprinting.
            </p>

            <div className="pt-1">
              <label htmlFor="qrCustomName" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                QR Campaign Name (Optional)
              </label>
              <input
                id="qrCustomName"
                type="text"
                value={(formData["name"] as string) || ""}
                onChange={(e) => updateFormField("name", e.target.value)}
                placeholder="e.g. Restaurant Menu, Summer Campaign..."
                className="w-full px-3 py-1.5 rounded-xl border border-indigo-200/70 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>
          </div>
        )}
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
