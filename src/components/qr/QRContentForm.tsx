import { QR_TYPES } from "@/types/qr";
import { useQRStore } from "@/store/qrStore";
import { Loader2, Sparkles, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function QRContentForm() {
  const { selectedType, formData, updateFormField, generateQR, isGenerating, isDynamic, setIsDynamic } = useQRStore();

  const qrType = QR_TYPES.find((t) => t.type === selectedType);
  if (!qrType) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-medium">{qrType.label} Details</h3>
        <span className="text-xs text-muted-foreground">{qrType.category}</span>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <Zap className="w-4 h-4 text-primary" />
            Dynamic QR Code
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dynamic QR codes let you change the destination URL later and track scan statistics without reprinting.
          </p>
        </div>
        <Switch
          checked={isDynamic}
          onCheckedChange={setIsDynamic}
          className="data-[state=checked]:bg-primary"
        />
      </div>

      <div className="space-y-3">
        {qrType.fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm text-muted-foreground mb-1.5">
              {field.label}
              {field.required && <span className="text-accent ml-1">*</span>}
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
                className="input-cyber w-full resize-none focus-visible:ring-primary"
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                value={(formData[field.name] as string) || ""}
                onChange={(e) => updateFormField(field.name, e.target.value)}
                required={field.required}
                aria-required={field.required}
                className="input-cyber w-full appearance-none cursor-pointer focus-visible:ring-primary"
              >
                <option value="" className="bg-background">
                  Select...
                </option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-background">
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={field.name}
                type={field.type}
                value={(formData[field.name] as string) || ""}
                onChange={(e) => updateFormField(field.name, e.target.value)}
                placeholder={field.placeholder}
                required={field.required}
                aria-required={field.required}
                className="input-cyber w-full focus-visible:ring-primary"
              />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={generateQR}
        disabled={isGenerating}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
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
