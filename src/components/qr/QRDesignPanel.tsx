import { useQRStore } from "@/store/qrStore";
import { PRESETS, DEFAULT_QR_STYLE } from "@/types/qr";
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

  // Robust deep fallbacks for legacy/corrupted localStorage stores
  const foregroundColor = style?.foregroundColor || DEFAULT_QR_STYLE.foregroundColor;
  const backgroundColor = style?.backgroundColor || DEFAULT_QR_STYLE.backgroundColor;
  const dotStyle = style?.dotStyle || DEFAULT_QR_STYLE.dotStyle;
  const eyeStyle = style?.eyeStyle || DEFAULT_QR_STYLE.eyeStyle;
  const cornerRadius = style?.cornerRadius ?? DEFAULT_QR_STYLE.cornerRadius;
  const padding = style?.padding ?? DEFAULT_QR_STYLE.padding;
  const transparentBackground = style?.transparentBackground ?? DEFAULT_QR_STYLE.transparentBackground;
  const logoUrl = style?.logoUrl;

  const gradient = {
    enabled: style?.gradient?.enabled ?? DEFAULT_QR_STYLE.gradient?.enabled ?? false,
    type: style?.gradient?.type || DEFAULT_QR_STYLE.gradient?.type || "linear",
    color1: style?.gradient?.color1 || DEFAULT_QR_STYLE.gradient?.color1 || "#00F0FF",
    color2: style?.gradient?.color2 || DEFAULT_QR_STYLE.gradient?.color2 || "#FF2BD6",
    rotation: style?.gradient?.rotation ?? DEFAULT_QR_STYLE.gradient?.rotation ?? 0,
  };

  const frame = {
    enabled: style?.frame?.enabled ?? DEFAULT_QR_STYLE.frame?.enabled ?? false,
    style: style?.frame?.style || DEFAULT_QR_STYLE.frame?.style || "simple",
    text: style?.frame?.text || DEFAULT_QR_STYLE.frame?.text || "SCAN ME",
    color: style?.frame?.color || DEFAULT_QR_STYLE.frame?.color || "#00F0FF",
  };

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
    <div className="space-y-6">
      {/* Presets */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((preset, i) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(i)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/60 hover:bg-white text-slate-700 hover:text-slate-900 transition-all border border-slate-200/40 hover:border-slate-200 shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Palette className="w-4 h-4 text-slate-400" />
          Colors
        </label>
        <div className="grid grid-cols-2 gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Foreground</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => {
                  updateStyle({ foregroundColor: e.target.value });
                  setTimeout(() => generateQR(), 200);
                }}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200/50 bg-white p-1"
              />
              <span className="text-xs text-slate-600 font-mono font-bold uppercase">{foregroundColor}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => {
                  updateStyle({ backgroundColor: e.target.value });
                  setTimeout(() => generateQR(), 200);
                }}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200/50 bg-white p-1"
              />
              <span className="text-xs text-slate-600 font-mono font-bold uppercase">{backgroundColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient */}
      <div className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gradient</label>
          <button
            onClick={() => {
              updateStyle({
                gradient: { ...gradient, enabled: !gradient.enabled },
              });
              setTimeout(() => generateQR(), 100);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              gradient.enabled ? "bg-slate-900" : "bg-slate-200"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
                gradient.enabled ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {gradient.enabled && (
          <div className="space-y-3 animate-fade-in pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Color 1</label>
                <input
                  type="color"
                  value={gradient.color1}
                  onChange={(e) => {
                    updateStyle({
                      gradient: { ...gradient, color1: e.target.value },
                    });
                    setTimeout(() => generateQR(), 200);
                  }}
                  className="w-full h-9 rounded-xl cursor-pointer border border-slate-200/50 bg-white p-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Color 2</label>
                <input
                  type="color"
                  value={gradient.color2}
                  onChange={(e) => {
                    updateStyle({
                      gradient: { ...gradient, color2: e.target.value },
                    });
                    setTimeout(() => generateQR(), 200);
                  }}
                  className="w-full h-9 rounded-xl cursor-pointer border border-slate-200/50 bg-white p-1"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Type</label>
              <select
                value={gradient.type}
                onChange={(e) => {
                  updateStyle({
                    gradient: {
                      ...gradient,
                      type: e.target.value as "linear" | "radial",
                    },
                  });
                  setTimeout(() => generateQR(), 100);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
              >
                <option value="linear">Linear</option>
                <option value="radial">Radial</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Dot Style */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dot Style</label>
        <div className="grid grid-cols-5 gap-1.5">
          {dotStyles.map((ds) => {
            const isActive = dotStyle === ds.value;
            return (
              <button
                key={ds.value}
                onClick={() => {
                  updateStyle({ dotStyle: ds.value });
                  setTimeout(() => generateQR(), 100);
                }}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-950/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border-slate-200/20 hover:border-slate-200 shadow-sm"
                }`}
              >
                <ds.icon className="w-4 h-4" />
                <span className="truncate w-full text-center">{ds.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Eye Style */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Eye Style</label>
        <div className="grid grid-cols-3 gap-1.5">
          {eyeStyles.map((es) => {
            const isActive = eyeStyle === es.value;
            return (
              <button
                key={es.value}
                onClick={() => {
                  updateStyle({ eyeStyle: es.value });
                  setTimeout(() => generateQR(), 100);
                }}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-950/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white bg-white/40 border-slate-200/20 hover:border-slate-200 shadow-sm"
                }`}
              >
                <es.icon className="w-4 h-4" />
                <span className="truncate w-full text-center">{es.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Correction */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Error Correction</label>
        <select
          value={style?.errorCorrectionLevel || "M"}
          onChange={(e) => {
            updateStyle({ errorCorrectionLevel: e.target.value as "L" | "M" | "Q" | "H" });
            setTimeout(() => generateQR(), 100);
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
        >
          {errorLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      {/* Corner Radius */}
      <div className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Corner Radius</label>
          <span className="text-xs text-indigo-600 font-mono font-bold">{cornerRadius}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={12}
          value={cornerRadius}
          onChange={(e) => {
            updateStyle({ cornerRadius: parseInt(e.target.value) });
            setTimeout(() => generateQR(), 200);
          }}
          className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
        />
      </div>

      {/* Padding */}
      <div className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Padding</label>
          <span className="text-xs text-indigo-600 font-mono font-bold">{padding}</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={padding}
          onChange={(e) => {
            updateStyle({ padding: parseInt(e.target.value) });
            setTimeout(() => generateQR(), 200);
          }}
          className="w-full h-1 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-900"
        />
      </div>

      {/* Transparent Background */}
      <div className="flex items-center justify-between bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transparent BG</label>
        <button
          onClick={() => {
            updateStyle({ transparentBackground: !transparentBackground });
            setTimeout(() => generateQR(), 100);
          }}
          className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
            transparentBackground ? "bg-slate-900" : "bg-slate-200"
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
              transparentBackground ? "translate-x-5.5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Logo Upload */}
      <div className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <ImagePlus className="w-4 h-4 text-slate-400" />
          Logo
        </label>
        {logoUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-12 h-12 rounded-xl object-contain bg-white/90 border border-slate-200/40 p-1 shadow-sm"
            />
            <button
              onClick={() => {
                updateStyle({ logoUrl: undefined });
                setTimeout(() => generateQR(), 100);
              }}
              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors border border-red-500/20 bg-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3.5 rounded-full border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400 bg-white/50 hover:bg-white transition-all text-xs font-bold uppercase tracking-widest"
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
      <div className="space-y-3 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/30">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Frame</label>
          <button
            onClick={() => {
              updateStyle({
                frame: { ...frame, enabled: !frame.enabled },
              });
              setTimeout(() => generateQR(), 100);
            }}
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
              frame.enabled ? "bg-slate-900" : "bg-slate-200"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${
                frame.enabled ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {frame.enabled && (
          <div className="space-y-3 animate-fade-in pt-2">
            <input
              type="text"
              value={frame.text}
              onChange={(e) => {
                updateStyle({
                  frame: { ...frame, text: e.target.value },
                });
              }}
              placeholder="Frame text..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200/60 bg-white text-sm focus:outline-none focus:border-indigo-500 text-slate-800 font-semibold shadow-sm"
            />
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Color:</label>
              <input
                type="color"
                value={frame.color}
                onChange={(e) => {
                  updateStyle({
                    frame: { ...frame, color: e.target.value },
                  });
                }}
                className="w-8 h-8 rounded-xl cursor-pointer border border-slate-200/50 bg-white p-1"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
