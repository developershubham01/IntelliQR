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
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search QR types..."
          className="input-cyber w-full pl-9 pr-4 py-2.5 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="space-y-1 max-h-[300px] overflow-y-auto scrollbar-thin">
        {Object.entries(grouped).map(([category, types]) => (
          <div key={category}>
            <button
              onClick={() =>
                setExpandedCategory(expandedCategory === category ? null : category)
              }
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              {category}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  expandedCategory === category ? "rotate-180" : ""
                }`}
              />
            </button>

            {expandedCategory === category && (
              <div className="space-y-0.5">
                {types.map((qrType) => {
                  const Icon = iconMap[qrType.icon] || Globe;
                  const isActive = selectedType === qrType.type;

                  return (
                    <button
                      key={qrType.type}
                      onClick={() => setSelectedType(qrType.type)}
                      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all ${
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/30"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{qrType.label}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-lg shadow-accent/50" />
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
