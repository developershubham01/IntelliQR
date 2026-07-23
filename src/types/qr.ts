export type QRType =
  | "website"
  | "text"
  | "email"
  | "phone"
  | "sms"
  | "whatsapp"
  | "wifi"
  | "vcard"
  | "maps"
  | "pdf"
  | "image"
  | "video"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "youtube"
  | "twitter"
  | "telegram"
  | "spotify"
  | "paypal"
  | "upi"
  | "appstore"
  | "playstore"
  | "event"
  | "calendar";

export interface QRTypeConfig {
  type: QRType;
  label: string;
  icon: string;
  category: string;
  fields: QRField[];
}

export interface QRField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "password";
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export interface QRData {
  [key: string]: string;
}

export interface QRStyle {
  foregroundColor: string;
  backgroundColor: string;
  dotStyle: "square" | "rounded" | "dots" | "classy" | "classy-rounded";
  eyeStyle: "square" | "circle" | "ring";
  cornerRadius: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  logoUrl?: string;
  transparentBackground: boolean;
  padding: number;
  size: number;
  gradient?: {
    enabled: boolean;
    type: "linear" | "radial";
    color1: string;
    color2: string;
    rotation: number;
  };
  frame?: {
    enabled: boolean;
    style: string;
    text: string;
    color: string;
  };
}

export interface QRCodeItem {
  id: string;
  name: string;
  type: QRType;
  content: string;
  data: QRData;
  style: QRStyle;
  imageUrl: string;
  svgContent?: string;
  isFavorite: boolean;
  isDynamic: boolean;
  shortId?: string;
  scanCount: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExportConfig {
  format: "png" | "svg" | "jpg" | "webp" | "pdf";
  size: number;
}

export const QR_TYPES: QRTypeConfig[] = [
  {
    type: "website",
    label: "Website URL",
    icon: "Globe",
    category: "Popular",
    fields: [
      { name: "url", label: "Website URL", type: "text", placeholder: "https://example.com", required: true },
    ],
  },
  {
    type: "text",
    label: "Plain Text",
    icon: "Type",
    category: "Popular",
    fields: [
      { name: "text", label: "Text Content", type: "textarea", placeholder: "Enter your text...", required: true },
    ],
  },
  {
    type: "email",
    label: "Email",
    icon: "Mail",
    category: "Popular",
    fields: [
      { name: "to", label: "To", type: "email", placeholder: "recipient@example.com", required: true },
      { name: "subject", label: "Subject", type: "text", placeholder: "Email subject" },
      { name: "body", label: "Message", type: "textarea", placeholder: "Email body..." },
    ],
  },
  {
    type: "phone",
    label: "Phone",
    icon: "Phone",
    category: "Popular",
    fields: [
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1234567890", required: true },
    ],
  },
  {
    type: "sms",
    label: "SMS",
    icon: "MessageSquare",
    category: "Popular",
    fields: [
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1234567890", required: true },
      { name: "message", label: "Message", type: "textarea", placeholder: "Your message..." },
    ],
  },
  {
    type: "whatsapp",
    label: "WhatsApp",
    icon: "MessageCircle",
    category: "Social",
    fields: [
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1234567890", required: true },
      { name: "message", label: "Message", type: "textarea", placeholder: "Your message..." },
    ],
  },
  {
    type: "wifi",
    label: "WiFi",
    icon: "Wifi",
    category: "Utility",
    fields: [
      { name: "ssid", label: "Network Name (SSID)", type: "text", placeholder: "MyWiFiNetwork", required: true },
      { name: "password", label: "Password", type: "password", placeholder: "WiFi password" },
      {
        name: "encryption",
        label: "Encryption",
        type: "select",
        options: [
          { value: "WPA", label: "WPA/WPA2" },
          { value: "WEP", label: "WEP" },
          { value: "nopass", label: "None" },
        ],
      },
      { name: "hidden", label: "Hidden Network", type: "select", options: [{ value: "false", label: "No" }, { value: "true", label: "Yes" }] },
    ],
  },
  {
    type: "vcard",
    label: "vCard",
    icon: "Contact",
    category: "Business",
    fields: [
      { name: "firstName", label: "First Name", type: "text", placeholder: "John", required: true },
      { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe", required: true },
      { name: "phone", label: "Phone", type: "tel", placeholder: "+1234567890" },
      { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
      { name: "organization", label: "Organization", type: "text", placeholder: "Company Name" },
      { name: "title", label: "Job Title", type: "text", placeholder: "Software Engineer" },
      { name: "website", label: "Website", type: "text", placeholder: "https://example.com" },
      { name: "address", label: "Address", type: "textarea", placeholder: "123 Main St, City, Country" },
    ],
  },
  {
    type: "maps",
    label: "Google Maps",
    icon: "MapPin",
    category: "Location",
    fields: [
      { name: "query", label: "Location", type: "text", placeholder: "Search for a place...", required: true },
    ],
  },
  {
    type: "pdf",
    label: "PDF Link",
    icon: "FileText",
    category: "Media",
    fields: [
      { name: "url", label: "PDF URL", type: "text", placeholder: "https://example.com/document.pdf", required: true },
    ],
  },
  {
    type: "image",
    label: "Image Link",
    icon: "Image",
    category: "Media",
    fields: [
      { name: "url", label: "Image URL", type: "text", placeholder: "https://example.com/image.jpg", required: true },
    ],
  },
  {
    type: "video",
    label: "Video Link",
    icon: "Video",
    category: "Media",
    fields: [
      { name: "url", label: "Video URL", type: "text", placeholder: "https://youtube.com/watch?v=...", required: true },
    ],
  },
  {
    type: "instagram",
    label: "Instagram",
    icon: "Instagram",
    category: "Social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username (without @)", required: true },
    ],
  },
  {
    type: "facebook",
    label: "Facebook",
    icon: "Facebook",
    category: "Social",
    fields: [
      { name: "url", label: "Profile/Page URL", type: "text", placeholder: "https://facebook.com/...", required: true },
    ],
  },
  {
    type: "linkedin",
    label: "LinkedIn",
    icon: "Linkedin",
    category: "Social",
    fields: [
      { name: "url", label: "Profile URL", type: "text", placeholder: "https://linkedin.com/in/...", required: true },
    ],
  },
  {
    type: "youtube",
    label: "YouTube",
    icon: "Youtube",
    category: "Social",
    fields: [
      { name: "url", label: "Channel/Video URL", type: "text", placeholder: "https://youtube.com/...", required: true },
    ],
  },
  {
    type: "twitter",
    label: "Twitter/X",
    icon: "Twitter",
    category: "Social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username (without @)", required: true },
    ],
  },
  {
    type: "telegram",
    label: "Telegram",
    icon: "Send",
    category: "Social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username (without @)", required: true },
    ],
  },
  {
    type: "spotify",
    label: "Spotify",
    icon: "Music",
    category: "Media",
    fields: [
      { name: "url", label: "Spotify URL", type: "text", placeholder: "https://open.spotify.com/...", required: true },
    ],
  },
  {
    type: "paypal",
    label: "PayPal",
    icon: "CreditCard",
    category: "Payment",
    fields: [
      { name: "email", label: "PayPal Email", type: "email", placeholder: "your@email.com", required: true },
      { name: "amount", label: "Amount (optional)", type: "text", placeholder: "10.00" },
      { name: "currency", label: "Currency", type: "select", options: [{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }, { value: "GBP", label: "GBP" }] },
    ],
  },
  {
    type: "upi",
    label: "UPI Payment",
    icon: "IndianRupee",
    category: "Payment",
    fields: [
      { name: "vpa", label: "UPI ID", type: "text", placeholder: "name@upi", required: true },
      { name: "name", label: "Payee Name", type: "text", placeholder: "Your Name" },
      { name: "amount", label: "Amount (optional)", type: "text", placeholder: "100" },
      { name: "note", label: "Note (optional)", type: "text", placeholder: "Payment for..." },
    ],
  },
  {
    type: "appstore",
    label: "App Store",
    icon: "Smartphone",
    category: "App",
    fields: [
      { name: "appId", label: "App ID or URL", type: "text", placeholder: "https://apps.apple.com/app/...", required: true },
    ],
  },
  {
    type: "playstore",
    label: "Play Store",
    icon: "Play",
    category: "App",
    fields: [
      { name: "appId", label: "App ID or URL", type: "text", placeholder: "https://play.google.com/store/apps/...", required: true },
    ],
  },
  {
    type: "event",
    label: "Event",
    icon: "Calendar",
    category: "Business",
    fields: [
      { name: "title", label: "Event Title", type: "text", placeholder: "My Event", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Event venue" },
      { name: "startDate", label: "Start Date", type: "text", placeholder: "2026-06-30T10:00:00" },
      { name: "endDate", label: "End Date", type: "text", placeholder: "2026-06-30T12:00:00" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Event details..." },
    ],
  },
  {
    type: "calendar",
    label: "Calendar",
    icon: "CalendarDays",
    category: "Business",
    fields: [
      { name: "title", label: "Event Title", type: "text", placeholder: "Meeting", required: true },
      { name: "startDate", label: "Start", type: "text", placeholder: "2026-06-30T10:00:00", required: true },
      { name: "endDate", label: "End", type: "text", placeholder: "2026-06-30T11:00:00", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Conference Room A" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Meeting agenda..." },
    ],
  },
];

export const DEFAULT_QR_STYLE: QRStyle = {
  foregroundColor: "#FFFFFF",
  backgroundColor: "#030C14",
  dotStyle: "square",
  eyeStyle: "square",
  cornerRadius: 0,
  errorCorrectionLevel: "M",
  transparentBackground: false,
  padding: 4,
  size: 1024,
  gradient: {
    enabled: false,
    type: "linear",
    color1: "#00F0FF",
    color2: "#FF2BD6",
    rotation: 0,
  },
  frame: {
    enabled: false,
    style: "simple",
    text: "SCAN ME",
    color: "#00F0FF",
  },
};

export const PRESETS = [
  {
    name: "Minimal Dark",
    style: {
      ...DEFAULT_QR_STYLE,
      foregroundColor: "#FFFFFF",
      backgroundColor: "#030C14",
      dotStyle: "square" as const,
      eyeStyle: "square" as const,
      cornerRadius: 0,
    },
  },
  {
    name: "Neon Cyan",
    style: {
      ...DEFAULT_QR_STYLE,
      foregroundColor: "#00F0FF",
      backgroundColor: "#030C14",
      dotStyle: "rounded" as const,
      eyeStyle: "circle" as const,
      cornerRadius: 4,
      gradient: {
        enabled: true,
        type: "linear" as const,
        color1: "#00F0FF",
        color2: "#00A8B5",
        rotation: 45,
      },
    },
  },
  {
    name: "Tactical Grid",
    style: {
      ...DEFAULT_QR_STYLE,
      foregroundColor: "#D0FF59",
      backgroundColor: "#030C14",
      dotStyle: "dots" as const,
      eyeStyle: "ring" as const,
      cornerRadius: 2,
    },
  },
  {
    name: "Candy Pop",
    style: {
      ...DEFAULT_QR_STYLE,
      foregroundColor: "#FF2BD6",
      backgroundColor: "#030C14",
      dotStyle: "classy-rounded" as const,
      eyeStyle: "circle" as const,
      cornerRadius: 8,
      gradient: {
        enabled: true,
        type: "radial" as const,
        color1: "#FF2BD6",
        color2: "#FFD600",
        rotation: 0,
      },
    },
  },
];
