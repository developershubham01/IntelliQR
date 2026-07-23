import { useQRStore } from "@/store/qrStore";
import { PRESETS } from "@/types/qr";
import { Palette, Circle, Square, Dot, Hexagon, ImagePlus, X } from "lucide-react";
import { useRef } from "react";

const dotStyles = [
  { value: "square", label: "Square", icon: Square },
  { value: "rounded", label: "Rounded", icon: Hexagon },
  { value: "dots", label: "Dots", icon: Dot },
  { value: "classy", label: "Classy", icon: Square },
  { value: "classy-rounded", label: "Smooth", icon: Circle },
] as const;

const eyeStyles = [
  { value: "square", label: "Square", icon: Square },
  { value: "circle", label: "Circle", icon: Circle },
  { value: "ring", label: "Ring", icon: Circle },
] as const;

const errorLevels = [
  { value: "L", label: "Low (7%)" },
  { value: "M", label: "Medium (15%)" },
  { value: "Q", label: "Quartile (25%)" },
  { value: "H", label: "High (30%)" },
] as const;

export default function QRDesignPanel() {
  const { style, updateStyle, generateQR } = useQRStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateStyle({ logoUrl: result });
      setTimeout(() => generateQR(), 100);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (presetIndex: number) => {
    const preset = PRESETS[presetIndex];
    if (!preset) return;
    updateStyle(preset.style);
    setTimeout(() => generateQR(), 100);
  };

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset, i) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(i)}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all border border-border hover:border-accent/30"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Colors
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Foreground</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.foregroundColor}
                onChange={(e) => {
                  updateStyle({ foregroundColor: e.target.value });
                  setTimeout(() => generateQR(), 200);
                }}
                className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs text-muted-foreground font-mono">{style.foregroundColor}</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.backgroundColor}
                onChange={(e) => {
                  updateStyle({ backgroundColor: e.target.value });
                  setTimeout(() => generateQR(), 200);
                }}
                className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
              />
              <span className="text-xs text-muted-foreground font-mono">{style.backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Gradient</label>
          <button
            onClick={() => {
              updateStyle({
                gradient: { ...style.gradient!, enabled: !style.gradient?.enabled },
              });
              setTimeout(() => generateQR(), 100);
            }}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              style.gradient?.enabled ? "bg-accent" : "bg-secondary"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                style.gradient?.enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {style.gradient?.enabled && (
          <div className="space-y-2 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Color 1</label>
                <input
                  type="color"
                  value={style.gradient?.color1}
                  onChange={(e) => {
                    updateStyle({
                      gradient: { ...style.gradient!, color1: e.target.value },
                    });
                    setTimeout(() => generateQR(), 200);
                  }}
                  className="w-full h-8 rounded-lg cursor-pointer border-0"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Color 2</label>
                <input
                  type="color"
                  value={style.gradient?.color2}
                  onChange={(e) => {
                    updateStyle({
                      gradient: { ...style.gradient!, color2: e.target.value },
                    });
                    setTimeout(() => generateQR(), 200);
                  }}
                  className="w-full h-8 rounded-lg cursor-pointer border-0"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Type</label>
              <select
                value={style.gradient?.type}
                onChange={(e) => {
                  updateStyle({
                    gradient: {
                      ...style.gradient!,
                      type: e.target.value as "linear" | "radial",
                    },
                  });
                  setTimeout(() => generateQR(), 100);
                }}
                className="input-cyber w-full text-sm py-2"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Dot Style */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Dot Style</label>
        <div className="grid grid-cols-5 gap-1.5">
          {dotStyles.map((ds) => (
            <button
              key={ds.value}
              onClick={() => {
                updateStyle({ dotStyle: ds.value });
                setTimeout(() => generateQR(), 100);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                style.dotStyle === ds.value
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              }`}
            >
              <ds.icon className="w-4 h-4" />
              <span className="text-[10px]">{ds.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eye Style */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Eye Style</label>
        <div className="grid grid-cols-3 gap-1.5">
          {eyeStyles.map((es) => (
            <button
              key={es.value}
              onClick={() => {
                updateStyle({ eyeStyle: es.value });
                setTimeout(() => generateQR(), 100);
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-all ${
                style.eyeStyle === es.value
                  ? "bg-accent/15 text-accent border border-accent/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
              }`}
            >
              <es.icon className="w-4 h-4" />
              <span className="text-[10px]">{es.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Correction */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Error Correction</label>
        <select
          value={style.errorCorrectionLevel}
          onChange={(e) => {
            updateStyle({ errorCorrectionLevel: e.target.value as "L" | "M" | "Q" | "H" });
            setTimeout(() => generateQR(), 100);
          }}
          className="input-cyber w-full text-sm py-2.5"
        >
          {errorLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Corner Radius */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Corner Radius</label>
          <span className="text-xs text-accent font-mono">{style.cornerRadius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={12}
          value={style.cornerRadius}
          onChange={(e) => {
            updateStyle({ cornerRadius: parseInt(e.target.value) });
            setTimeout(() => generateQR(), 200);
          }}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Padding */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Padding</label>
          <span className="text-xs text-accent font-mono">{style.padding}</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={style.padding}
          onChange={(e) => {
            updateStyle({ padding: parseInt(e.target.value) });
            setTimeout(() => generateQR(), 200);
          }}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-accent"
        />
      </div>

      {/* Transparent Background */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-muted-foreground">Transparent BG</label>
        <button
          onClick={() => {
            updateStyle({ transparentBackground: !style.transparentBackground });
            setTimeout(() => generateQR(), 100);
          }}
          className={`w-10 h-5 rounded-full transition-colors relative ${
            style.transparentBackground ? "bg-accent" : "bg-secondary"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
              style.transparentBackground ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground flex items-center gap-2">
          <ImagePlus className="w-4 h-4" />
          Logo
        </label>
        {style.logoUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={style.logoUrl}
              alt="Logo"
              className="w-12 h-12 rounded-lg object-contain bg-[background]/50 p-1"
            />
            <button
              onClick={() => {
                updateStyle({ logoUrl: undefined });
                setTimeout(() => generateQR(), 100);
              }}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 rounded-lg border border-dashed border-accent/30 text-accent/70 hover:text-accent hover:border-accent/50 transition-all text-sm"
          >
            Upload Logo
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Frame */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-muted-foreground">Frame</label>
          <button
            onClick={() => {
              updateStyle({
                frame: { ...style.frame!, enabled: !style.frame?.enabled },
              });
              setTimeout(() => generateQR(), 100);
            }}
            className={`w-10 h-5 rounded-full transition-colors relative ${
              style.frame?.enabled ? "bg-accent" : "bg-secondary"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                style.frame?.enabled ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {style.frame?.enabled && (
          <div className="space-y-2 animate-fade-in">
            <input
              type="text"
              value={style.frame.text}
              onChange={(e) => {
                updateStyle({
                  frame: { ...style.frame!, text: e.target.value },
                });
              }}
              placeholder="Frame text..."
              className="input-cyber w-full text-sm py-2"
            />
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Color:</label>
              <input
                type="color"
                value={style.frame.color}
                onChange={(e) => {
                  updateStyle({
                    frame: { ...style.frame!, color: e.target.value },
                  });
                }}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
