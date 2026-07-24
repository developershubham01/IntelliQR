import { useState } from "react";
import { QR_TYPES } from "@/types/qr";
import { useQRStore } from "@/store/qrStore";
import {
  Globe, Type, Mail, Phone, MessageSquare, Wifi, Contact,
  MapPin, FileText, Image, Video, Instagram, Facebook,
  Linkedin, Youtube, Twitter, Send, Music, CreditCard,
  IndianRupee, Smartphone, Play, Calendar, CalendarDays,
  Search, ChevronDown,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Globe, Type, Mail, Phone, MessageSquare, Wifi, Contact,
  MapPin, FileText, Image, Video, Instagram, Facebook,
  Linkedin, Youtube, Twitter, Send, Music, CreditCard,
  IndianRupee, Smartphone, Play, Calendar, CalendarDays,
};

const categories = [...new Set(QR_TYPES.map((t) => t.category))];

export default function QRTypeSelector() {
  const { selectedType, setSelectedType } = useQRStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("Popular");

  const filtered = searchQuery
    ? QR_TYPES.filter(
        (t) =>
          t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : QR_TYPES;

  const grouped = categories.reduce(
    (acc, cat) => {
      const items = filtered.filter((t) => t.category === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    },
    {} as Record<string, typeof QR_TYPES>
  );

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search QR types..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200/60 bg-white/50 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="space-y-1.5 max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
        {Object.entries(grouped).map(([category, types]) => (
          <div key={category} className="space-y-1">
            <button
              onClick={() =>
                setExpandedCategory(expandedCategory === category ? null : category)
              }
              className="flex items-center justify-between w-full px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors"
            >
              {category}
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  expandedCategory === category ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategory === category && (
              <div className="space-y-1">
                {types.map((qrType) => {
                  const Icon = iconMap[qrType.icon] || Globe;
                  const isActive = selectedType === qrType.type;

                  return (
                    <button
                      key={qrType.type}
                      onClick={() => setSelectedType(qrType.type)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                        isActive
                          ? "bg-slate-900 text-white shadow-[0_8px_20px_rgba(15,23,42,0.15)] border-slate-900"
                          : "text-slate-500 hover:text-slate-800 hover:bg-white border-slate-200/30 hover:border-slate-200/60 shadow-sm"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{qrType.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-lg shadow-indigo-400/50" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
