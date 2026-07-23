import QRCode from "qrcode";
import type { QRData, QRStyle, QRType, ExportConfig } from "@/types/qr";

// Convert form data to QR content string based on type
export function generateQRContent(type: QRType, data: QRData): string {
  switch (type) {
    case "website":
      return data.url || "";

    case "text":
      return data.text || "";

    case "email": {
      const to = data.to || "";
      const subject = data.subject ? `?subject=${encodeURIComponent(data.subject)}` : "";
      const body = data.body ? `${subject ? "&" : "?"}body=${encodeURIComponent(data.body)}` : "";
      return `mailto:${to}${subject}${body}`;
    }

    case "phone":
      return `tel:${data.phone || ""}`;

    case "sms": {
      const phone = data.phone || "";
      const message = data.message ? `?body=${encodeURIComponent(data.message)}` : "";
      return `sms:${phone}${message}`;
    }

    case "whatsapp": {
      const waPhone = (data.phone || "").replace(/\D/g, "");
      const waMessage = data.message ? `?text=${encodeURIComponent(data.message)}` : "";
      return `https://wa.me/${waPhone}${waMessage}`;
    }

    case "wifi": {
      const ssid = data.ssid || "";
      const password = data.password || "";
      const encryption = data.encryption || "WPA";
      const hidden = data.hidden === "true";
      return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? "true" : "false"};;`;
    }

    case "vcard": {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${data.lastName || ""};${data.firstName || ""};;;`,
        `FN:${data.firstName || ""} ${data.lastName || ""}`,
      ];
      if (data.phone) lines.push(`TEL:${data.phone}`);
      if (data.email) lines.push(`EMAIL:${data.email}`);
      if (data.organization) lines.push(`ORG:${data.organization}`);
      if (data.title) lines.push(`TITLE:${data.title}`);
      if (data.website) lines.push(`URL:${data.website}`);
      if (data.address) lines.push(`ADR:;;${data.address};;;;`);
      lines.push("END:VCARD");
      return lines.join("\n");
    }

    case "maps":
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.query || "")}`;

    case "pdf":
    case "image":
    case "video":
    case "spotify":
      return data.url || "";

    case "instagram":
      return `https://instagram.com/${data.username || ""}`;

    case "facebook":
      return data.url || "";

    case "linkedin":
      return data.url || "";

    case "youtube":
      return data.url || "";

    case "twitter":
      return `https://x.com/${data.username || ""}`;

    case "telegram":
      return `https://t.me/${data.username || ""}`;

    case "paypal": {
      const ppEmail = data.email || "";
      const ppAmount = data.amount || "";
      const ppCurrency = data.currency || "USD";
      let ppUrl = `https://www.paypal.com/paypalme/${ppEmail}`;
      if (ppAmount) {
        ppUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(ppEmail)}&amount=${ppAmount}&currency_code=${ppCurrency}`;
      }
      return ppUrl;
    }

    case "upi": {
      const vpa = data.vpa || "";
      const name = data.name || "";
      const amount = data.amount || "";
      const note = data.note || "";
      let upiUrl = `upi://pay?pa=${encodeURIComponent(vpa)}`;
      if (name) upiUrl += `&pn=${encodeURIComponent(name)}`;
      if (amount) upiUrl += `&am=${amount}`;
      if (note) upiUrl += `&tn=${encodeURIComponent(note)}`;
      upiUrl += "&cu=INR";
      return upiUrl;
    }

    case "appstore":
      return data.appId || "";

    case "playstore":
      return data.appId || "";

    case "event":
    case "calendar": {
      const title = data.title || "";
      const location = data.location || "";
      const startDate = (data.startDate || "").replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const endDate = (data.endDate || "").replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const description = data.description || "";
      return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DTSTART:${startDate}`,
        `DTEND:${endDate}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");
    }

    default:
      return "";
  }
}

// Generate QR code as data URL
export async function generateQRCode(
  content: string,
  style: QRStyle
): Promise<{ dataUrl: string; svgContent: string }> {
  const opts: QRCode.QRCodeToDataURLOptions = {
    width: style.size,
    margin: style.padding,
    color: {
      dark: style.gradient?.enabled
        ? style.gradient.color1
        : style.foregroundColor,
      light: style.transparentBackground ? "#00000000" : style.backgroundColor,
    },
    errorCorrectionLevel: style.errorCorrectionLevel,
    type: "image/png",
  };

  const dataUrl = await QRCode.toDataURL(content, opts);

  const svgOpts: QRCode.QRCodeToStringOptions = {
    margin: style.padding,
    color: {
      dark: style.foregroundColor,
      light: style.transparentBackground ? "#00000000" : style.backgroundColor,
    },
    errorCorrectionLevel: style.errorCorrectionLevel,
    type: "svg",
  };

  const svgContent = await QRCode.toString(content, svgOpts);

  return { dataUrl, svgContent };
}

// Download QR code
export async function downloadQR(
  dataUrl: string,
  svgContent: string,
  exportConfig: ExportConfig,
  filename: string
): Promise<void> {
  const { format, size } = exportConfig;

  switch (format) {
    case "png":
    case "jpg":
    case "webp": {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        if (format === "jpg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, size, size);
        }
        ctx.drawImage(img, 0, 0, size, size);
        const mimeType = format === "jpg" ? "image/jpeg" : format === "webp" ? "image/webp" : "image/png";
        const link = document.createElement("a");
        link.download = `${filename}.${format}`;
        link.href = canvas.toDataURL(mimeType, 0.95);
        link.click();
      };
      img.src = dataUrl;
      break;
    }

    case "svg": {
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${filename}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      break;
    }

    case "pdf": {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [size, size],
      });
      pdf.addImage(dataUrl, "PNG", 0, 0, size, size);
      pdf.save(`${filename}.pdf`);
      break;
    }
  }
}

// Copy QR to clipboard
export async function copyQRToClipboard(dataUrl: string): Promise<boolean> {
  try {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({ [blob.type]: blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

// Print QR code
export function printQR(dataUrl: string): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head><title>Print QR Code</title></head>
      <body style="display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
        <img src="${dataUrl}" style="max-width:80%;max-height:80%;" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

// Generate a random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
