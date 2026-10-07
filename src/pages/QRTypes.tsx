import { useState } from "react";
import { Link, useParams } from "react-router";
import { motion } from "framer-motion";
import {
  Wifi,
  MessageSquare,
  UserSquare2,
  FileText,
  MapPin,
  UtensilsCrossed,
  Share2,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Download,
  Calendar,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

interface TypeMetadata {
  slug: string;
  qrTypeKey: string;
  name: string;
  tagline: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  icon: any;
  definition: string;
  benefits: string[];
  howToSteps: string[];
  faqs: Array<{ question: string; answer: string }>;
}

const TYPE_DATA: Record<string, TypeMetadata> = {
  wifi: {
    slug: "wifi",
    qrTypeKey: "wifi",
    name: "WiFi QR Code",
    tagline: "Instant Passwordless Network Connection",
    h1: "Free WiFi QR Code Generator – Connect Without Typing Passwords",
    metaTitle: "WiFi QR Code Generator – Free & Instant WiFi Connection | IntelliQR",
    metaDescription: "Generate a custom WiFi QR code with your SSID and password. Guests scan to connect automatically on iOS and Android without typing long passwords.",
    icon: Wifi,
    definition: "A WiFi QR code encodes network credentials (SSID, encryption protocol like WPA2/WPA3, and password). When scanned with any smartphone camera, the operating system prompts the user to join the WiFi network automatically with zero manual typing.",
    benefits: [
      "Eliminates manual password entry errors for guests and customers",
      "Protects complex, highly secure passwords from being spoken out loud",
      "Compatible with all modern iOS and Android camera apps natively",
      "Perfect for cafes, hotels, Airbnb rentals, and corporate conference rooms",
    ],
    howToSteps: [
      "Enter your WiFi Network Name (SSID) exactly as broadcasted.",
      "Select your security encryption type (WPA/WPA2, WEP, or Open/None).",
      "Type the password and choose custom dot patterns or colors.",
      "Download print-ready vector SVG or PNG and place near reception or tables.",
    ],
    faqs: [
      {
        question: "Can someone steal my WiFi password from the QR code?",
        answer: "The QR code stores the credential text so the phone can connect. It is recommended to share a dedicated Guest Network QR code rather than your private admin network.",
      },
      {
        question: "Does scanning a WiFi QR code require an external app?",
        answer: "No. Both iPhone (iOS 11+) and Android (Android 9+) have native QR scanners built into their default camera apps that automatically prompt 'Join Network'.",
      },
    ],
  },
  whatsapp: {
    slug: "whatsapp",
    qrTypeKey: "whatsapp",
    name: "WhatsApp QR Code",
    tagline: "One-Tap Direct WhatsApp Chat with Prefilled Messages",
    h1: "WhatsApp QR Code Generator – Direct Click-to-Chat with Custom Text",
    metaTitle: "WhatsApp QR Code Generator – Click to Chat with Prefilled Message | IntelliQR",
    metaDescription: "Create a WhatsApp QR code with your phone number and prefilled greeting message. Enable instant lead capture and customer support on print collateral.",
    icon: MessageSquare,
    definition: "A WhatsApp QR code creates a direct wa.me link containing your international phone number and an optional prefilled message text. When scanned, it instantly launches WhatsApp with a draft chat ready to send in one tap.",
    benefits: [
      "No need for customers to manually save your business phone number to contacts",
      "Prefilled message templates standardize inquiry formats for sales and support",
      "Increases offline lead generation on flyers, trade show booths, and storefronts",
      "Direct integration with WhatsApp Business and customer service team inboxes",
    ],
    howToSteps: [
      "Enter your international phone number including country code (e.g. +1 or +91).",
      "Type an optional prefilled message (e.g., 'Hi IntelliQR, I would like a quote').",
      "Customize with WhatsApp brand green or your corporate palette.",
      "Export in high resolution and print on marketing materials.",
    ],
    faqs: [
      {
        question: "Do scanners have to save my phone number first?",
        answer: "No. The wa.me deep link bypasses the address book and opens a direct chat window immediately in WhatsApp.",
      },
      {
        question: "Can I use this for WhatsApp Business accounts?",
        answer: "Yes, it works identically for standard personal WhatsApp accounts and WhatsApp Business API accounts.",
      },
    ],
  },
  vcard: {
    slug: "vcard",
    qrTypeKey: "vcard",
    name: "vCard Digital Business Card",
    tagline: "Contactless Digital Business Cards",
    h1: "vCard QR Code Generator – Digital Business Cards Saved with One Scan",
    metaTitle: "vCard QR Code Generator – Create Digital Business Cards | IntelliQR",
    metaDescription: "Generate a vCard 3.0 QR code with your name, job title, phone, email, website, and address. Scanners can save your contact details directly to address book.",
    icon: UserSquare2,
    definition: "A vCard QR code contains structured electronic business card data adhering to RFC standard vCard specifications. Scanning the code prompts smartphones to import the full name, title, organization, phone numbers, email, and social links straight into their address book.",
    benefits: [
      "Zero typing required to save executive contacts at conferences",
      "Never run out of physical business cards; display on phone screen or badge",
      "Includes phone, email, office address, website, and LinkedIn URLs simultaneously",
      "Eco-friendly, modern networking alternative to discarded paper cards",
    ],
    howToSteps: [
      "Fill in your personal and professional details (Name, Company, Title, Phone, Email).",
      "Add website and address information for full context.",
      "Add your company logo into the center of the QR matrix.",
      "Download and place on printed business cards, badges, or email signatures.",
    ],
    faqs: [
      {
        question: "Does scanning a vCard QR code save directly to phone contacts?",
        answer: "Yes. Both iOS Contacts and Google Contacts recognize vCard syntax and offer a one-tap 'Add to Contacts' or 'Create New Contact' button.",
      },
      {
        question: "Can I make my vCard dynamic so details can be updated?",
        answer: "Yes. In IntelliQR, you can create a dynamic vCard landing page where contact information can be updated anytime even after handing out cards.",
      },
    ],
  },
  pdf: {
    slug: "pdf",
    qrTypeKey: "pdf",
    name: "PDF Document QR Code",
    tagline: "Scan to View & Download PDF Brochures and Catalogs",
    h1: "PDF QR Code Generator – Share Menus, Brochures, and Guides Instantly",
    metaTitle: "PDF QR Code Generator – Scan to Download PDF Documents | IntelliQR",
    metaDescription: "Convert PDF documents, catalogs, and brochures into scannable QR codes. Fast mobile preview and downloads for menus, manuals, and real estate flyers.",
    icon: FileText,
    definition: "A PDF QR code connects physical print media directly to a hosted PDF document. When customers scan the code, their mobile browser immediately opens the document for instant reading or offline saving.",
    benefits: [
      "Eliminates heavy printing and paper distribution costs for large catalogs",
      "Provide always-updated instruction manuals, warranties, and brochures",
      "Mobile-optimized viewing experience across all tablet and phone devices",
      "Track how many people downloaded or viewed the document using dynamic tracking",
    ],
    howToSteps: [
      "Paste your hosted PDF URL or document repository link.",
      "Style your QR code with document icons and branded border frames.",
      "Test scan to verify instant mobile PDF rendering.",
      "Print on packaging, equipment stickers, or exhibition displays.",
    ],
    faqs: [
      {
        question: "Can I replace the PDF document without changing the QR code?",
        answer: "Yes! By using a dynamic QR code in IntelliQR, you can update the PDF link anytime without altering the printed QR code.",
      },
      {
        question: "Does the PDF open automatically on mobile phones?",
        answer: "Yes. Safari on iOS and Chrome on Android will natively render the PDF document immediately upon scanning.",
      },
    ],
  },
  "google-maps": {
    slug: "google-maps",
    qrTypeKey: "maps",
    name: "Google Maps Location QR Code",
    tagline: "Instant Turn-by-Turn Driving & Walking Directions",
    h1: "Google Maps QR Code Generator – Direct Store & Event Navigation",
    metaTitle: "Google Maps QR Code Generator – One-Scan Location Directions | IntelliQR",
    metaDescription: "Generate a Google Maps QR code for your store, office, or event venue. Scanners open Google Maps or Apple Maps with turn-by-turn navigation.",
    icon: MapPin,
    definition: "A Google Maps QR code encodes geo-coordinates or Google Place URLs. When scanned, it automatically opens the smartphone's default map application with route guidance and turn-by-turn navigation to your exact doorstep.",
    benefits: [
      "Guarantees customers arrive at the exact store entrance without typing addresses",
      "Perfect for wedding invitations, event venues, pop-up stores, and billboards",
      "Bypasses typo-prone street names and complex postal codes",
      "Increases foot traffic conversion from local flyers and outdoor posters",
    ],
    howToSteps: [
      "Copy your Google Maps share link or coordinates from Google Maps.",
      "Paste the location URL into IntelliQR.",
      "Customize with a map pin icon or brand accent colors.",
      "Print on invitations, brochures, receipts, and storefront banners.",
    ],
    faqs: [
      {
        question: "Does it open Google Maps or Apple Maps?",
        answer: "On Android it opens Google Maps; on iOS it opens the Google Maps app if installed, or Apple Maps / Safari seamlessly.",
      },
    ],
  },
  menu: {
    slug: "menu",
    qrTypeKey: "website",
    name: "Restaurant Digital Menu QR Code",
    tagline: "Contactless Dining Menus for Tables & Bars",
    h1: "Restaurant Menu QR Code Generator – Touchless Dining & Table Ordering",
    metaTitle: "Restaurant Menu QR Code Generator – Digital Menus & Ordering | IntelliQR",
    metaDescription: "Create touchless digital menu QR codes for restaurants, cafes, and bars. Update menu items, prices, and daily specials in real time without reprinting paper menus.",
    icon: UtensilsCrossed,
    definition: "A Restaurant Menu QR code allows diners to scan a table sticker or tent card to immediately browse food and drink menus, view allergen details, or place orders from their own smartphone browsers.",
    benefits: [
      "Save thousands annually on menu reprinting when food prices change",
      "Hygienic, touchless dining experience preferred by modern customers",
      "Easily promote daily specials, seasonal beverages, and chef recommendations",
      "Speed up table turnaround times and reduce server wait bottlenecks",
    ],
    howToSteps: [
      "Provide the URL to your digital menu, online ordering page, or PDF menu.",
      "Enable dynamic QR tracking to analyze peak dining hours.",
      "Place on acrylic table stands, coasters, and bar mats.",
      "Update dishes and pricing anytime via the IntelliQR dashboard.",
    ],
    faqs: [
      {
        question: "Can I change prices without reprinting the table stickers?",
        answer: "Yes! Use our Dynamic QR feature to update menu URLs or document destinations instantly whenever your menu evolves.",
      },
    ],
  },
  "social-media": {
    slug: "social-media",
    qrTypeKey: "instagram",
    name: "Social Media Multi-Link QR Code",
    tagline: "Unify All Social Profiles & Link-in-Bio Behind One Code",
    h1: "Social Media QR Code Generator – Connect Instagram, TikTok, YouTube & Bio Links",
    metaTitle: "Social Media QR Code Generator – Connect All Social Profiles | IntelliQR",
    metaDescription: "Consolidate your Instagram, YouTube, TikTok, LinkedIn, and Facebook profiles behind a single branded QR code. Boost follower growth across all channels.",
    icon: Share2,
    definition: "A Social Media QR code connects physical merchandise and packaging to an all-in-one landing page displaying links to your brand's social media handles, podcasts, community channels, and influencer stores.",
    benefits: [
      "Promotes all social accounts simultaneously from packaging or print ads",
      "Increases cross-platform follower growth and social engagement",
      "Great for influencers, musicians, event hosts, and DTC e-commerce brands",
      "Measure which social channels receive the highest scan conversions",
    ],
    howToSteps: [
      "Enter your link-in-bio URL, Instagram profile, or unified social landing page.",
      "Customize with gradient colors and social channel icons.",
      "Export high-resolution assets for merchandise, apparel tags, or business cards.",
    ],
    faqs: [
      {
        question: "Can I track which social platforms generate the most scans?",
        answer: "Yes, by combining IntelliQR dynamic tracking with UTM tagged links on your social hub.",
      },
    ],
  },
  url: {
    slug: "url",
    qrTypeKey: "url",
    name: "URL QR Code",
    tagline: "Instant Link Routing to Any Web Address",
    h1: "URL QR Code Generator – Convert Any Web Link into a Scannable QR Code",
    metaTitle: "URL QR Code Generator – Create Custom Web Link QR Codes | IntelliQR",
    metaDescription: "Generate custom vector URL QR codes for any website or landing page. Support static direct links or editable dynamic redirects with real-time scan metrics.",
    icon: Globe,
    definition: "A URL QR code encodes an HTTP or HTTPS web address. When scanned by any smartphone camera, the browser immediately opens the destination page without manual typing.",
    benefits: [
      "Instantly connects print materials to online landing pages and campaigns",
      "Reduces manual typing errors for long and complex URLs",
      "Available as permanent static codes or editable dynamic codes",
      "Ideal for posters, flyers, packaging, magazine ads, and business cards",
    ],
    howToSteps: [
      "Paste your destination URL (including https://).",
      "Choose between static direct link or dynamic trackable redirect.",
      "Customize dot pattern, colors, border frame, and brand logo.",
      "Download print-ready SVG or PNG vector formats.",
    ],
    faqs: [
      {
        question: "Can I edit the destination URL after printing?",
        answer: "Yes, if you choose the Dynamic QR option in IntelliQR, you can update the destination link anytime without reprinting.",
      },
      {
        question: "Does the URL QR code expire?",
        answer: "Static URL codes never expire. Dynamic URL codes stay active indefinitely under active IntelliQR accounts.",
      },
    ],
  },
  website: {
    slug: "website",
    qrTypeKey: "website",
    name: "Website QR Code",
    tagline: "Drive Direct Offline Foot Traffic to Your Website",
    h1: "Website QR Code Generator – Connect Physical Audiences to Your Site",
    metaTitle: "Website QR Code Generator – Drive Real-World Traffic to Your Site | IntelliQR",
    metaDescription: "Create branded website QR codes with custom logos, frames, and analytics. Seamlessly transfer real-world foot traffic directly to your web presence.",
    icon: Globe,
    definition: "A Website QR code directs users straight to your brand's official homepage, portfolio, or web application with high reliability across all mobile devices.",
    benefits: [
      "Increases website visits directly from retail storefronts and billboards",
      "Enables UTM campaign tagging to track exact offline marketing ROI",
      "Supports center logo embedding and branded color palettes",
      "Compatible with all native iOS and Android camera apps",
    ],
    howToSteps: [
      "Enter your website address (e.g., https://yourbrand.com).",
      "Add UTM parameters for tracking in Google Analytics.",
      "Embed your brand logo in the center.",
      "Export in high resolution for commercial print production.",
    ],
    faqs: [
      {
        question: "How do I track website visits from the QR code?",
        answer: "You can use IntelliQR's built-in scan analytics or append UTM parameters to track sessions in Google Analytics 4.",
      },
    ],
  },
  email: {
    slug: "email",
    qrTypeKey: "email",
    name: "Email QR Code",
    tagline: "Pre-Populated Mailto Drafts with One Camera Scan",
    h1: "Email QR Code Generator – Instant Mailto Links with Subject & Body",
    metaTitle: "Email QR Code Generator – Scan to Send Email | IntelliQR",
    metaDescription: "Generate an email QR code that opens the user's default email client with your address, subject line, and pre-written message draft ready to send.",
    icon: Mail,
    definition: "An Email QR code uses the mailto: standard URI scheme. Scanning opens the device's default mail client (Gmail, Apple Mail, Outlook) with recipient, subject, and body text pre-filled.",
    benefits: [
      "Eliminates email address spelling errors in customer inquiries",
      "Standardizes customer service and quotation request formats",
      "Accelerates support requests on product packaging and appliance labels",
      "Works 100% offline without requiring internet connection to launch mail app",
    ],
    howToSteps: [
      "Enter the recipient email address.",
      "Enter an optional subject line (e.g., 'Product Inquiry').",
      "Write pre-filled body text for the draft.",
      "Download vector format and place on documentation or print ads.",
    ],
    faqs: [
      {
        question: "Does scanning automatically send the email?",
        answer: "No. For security and user privacy, it opens a draft in the user's email client, allowing them to review before pressing Send.",
      },
    ],
  },
  phone: {
    slug: "phone",
    qrTypeKey: "phone",
    name: "Phone Call QR Code",
    tagline: "One-Tap Direct Phone Dialing for Sales & Support",
    h1: "Phone QR Code Generator – Scan to Call Your Business Instantly",
    metaTitle: "Phone Call QR Code Generator – One-Tap Phone Dialing | IntelliQR",
    metaDescription: "Create a phone number QR code using the tel: protocol. When scanned, smartphones immediately open the phone dialer with your number ready to call.",
    icon: Phone,
    definition: "A Phone QR code encodes telephone numbers using the tel: URI protocol. Scanning it instantly prompts smartphones to dial your hotline or sales desk with zero manual entry.",
    benefits: [
      "Fastest path from printed billboard or emergency sticker to live phone call",
      "Eliminates misdialed numbers for customer service and emergency response",
      "Ideal for vehicle wraps, service vans, business cards, and real estate signs",
      "Compatible across all telecommunication providers globally",
    ],
    howToSteps: [
      "Enter the phone number including international country code (e.g., +1, +44, +91).",
      "Customize colors and add a phone callout badge.",
      "Test scan to verify immediate phone dialer prompt.",
      "Download high-res PNG or SVG for physical application.",
    ],
    faqs: [
      {
        question: "Do scanners need internet access to make the phone call?",
        answer: "No. The tel: protocol is handled entirely by the smartphone's local cellular phone dialer.",
      },
    ],
  },
  sms: {
    slug: "sms",
    qrTypeKey: "sms",
    name: "SMS QR Code",
    tagline: "Scan to Send Text Messages with Pre-Filled Content",
    h1: "SMS QR Code Generator – Direct Text Messaging for Leads & Opt-ins",
    metaTitle: "SMS QR Code Generator – Pre-Filled Text Messages | IntelliQR",
    metaDescription: "Generate SMS QR codes that launch smartphone messaging apps with pre-written text messages and destination numbers for automated opt-ins and leads.",
    icon: MessageCircle,
    definition: "An SMS QR code encodes a destination mobile number and a pre-written SMS body. Scanning opens the Messages app with the draft text ready to send.",
    benefits: [
      "Drives SMS marketing list subscriptions and discount code requests",
      "Streamlines text-to-win contests and interactive live polling",
      "Zero friction for mobile users; no manual typing of phone numbers",
      "Works natively on both iOS and Android default messaging apps",
    ],
    howToSteps: [
      "Enter the target phone number with country prefix.",
      "Enter the pre-written SMS message (e.g., 'JOIN VIP CLUB').",
      "Customize with brand styling.",
      "Print on promotional signage or retail checkout counters.",
    ],
    faqs: [
      {
        question: "Can I use SMS QR codes for opt-in marketing compliance?",
        answer: "Yes, by configuring pre-filled text that explicitly confirms opt-in terms for SMS marketing.",
      },
    ],
  },
  "app-store": {
    slug: "app-store",
    qrTypeKey: "app-store",
    name: "App Download QR Code",
    tagline: "Universal App Store & Google Play Store Smart Redirection",
    h1: "App Download QR Code Generator – One QR for iOS and Android",
    metaTitle: "App Download QR Code Generator – Smart App Store Routing | IntelliQR",
    metaDescription: "Create a single smart app download QR code that automatically detects the user's OS and routes iPhone users to the App Store and Android users to Google Play.",
    icon: Download,
    definition: "An App Download QR code is an intelligent dynamic QR code that inspects the scanner's user agent and redirects iOS users to Apple's App Store and Android users to Google Play Store from a single printed code.",
    benefits: [
      "One single QR code on packaging or billboards serves both iOS and Android users",
      "Prevents user drop-off caused by scanning the wrong platform QR code",
      "Tracks download conversion rates and platform market share in real time",
      "Supports fallback links for desktop or tablet browsers",
    ],
    howToSteps: [
      "Enter your Apple App Store URL and Google Play Store URL.",
      "Set an optional fallback web landing page for desktop scanners.",
      "Customize with mobile app badges and brand colors.",
      "Print on retail packaging, promotional flyers, and posters.",
    ],
    faqs: [
      {
        question: "How does it detect if the user has an iPhone or Android phone?",
        answer: "IntelliQR inspects the HTTP User-Agent header at redirect time and sends the user to the corresponding native app store in less than 10 milliseconds.",
      },
    ],
  },
  event: {
    slug: "event",
    qrTypeKey: "event",
    name: "Calendar Event QR Code",
    tagline: "One-Scan RSVP & Calendar Event Addition",
    h1: "Calendar Event QR Code Generator – Save Dates Directly to Calendars",
    metaTitle: "Event QR Code Generator – Save to Google & Apple Calendar | IntelliQR",
    metaDescription: "Generate an event QR code that lets attendees add conferences, webinars, weddings, and concerts directly into their Google Calendar or Apple Calendar with one scan.",
    icon: Calendar,
    definition: "A Calendar Event QR code encodes iCalendar (VCalendar) event data, including title, date, start time, end time, location, and description. Scanning immediately prompts users to add the event to their device calendar.",
    benefits: [
      "Dramatically boosts event attendance and reduces no-show rates",
      "Eliminates manual entry of event dates, times, and venue addresses",
      "Works for corporate conferences, concerts, weddings, and webinars",
      "Native calendar integration across iOS, Android, and Outlook",
    ],
    howToSteps: [
      "Enter event title, start and end date/time, and venue location.",
      "Add notes or ticket links in the description field.",
      "Customize with event branding and calendar icons.",
      "Print on invitations, conference posters, or digital tickets.",
    ],
    faqs: [
      {
        question: "Does scanning set an automatic reminder?",
        answer: "Yes, once imported into Apple Calendar or Google Calendar, default reminder notifications will fire as configured.",
      },
    ],
  },
  payment: {
    slug: "payment",
    qrTypeKey: "payment",
    name: "Payment & UPI QR Code",
    tagline: "Instant Contactless Payments & Digital Billing",
    h1: "Payment QR Code Generator – Accept Instant Payments & UPI Transfers",
    metaTitle: "Payment QR Code Generator – Accept Contactless Payments | IntelliQR",
    metaDescription: "Generate secure payment QR codes for PayPal, UPI (India), Venmo, or direct payment gateways. Enable contactless checkout at retail registers and invoices.",
    icon: CreditCard,
    definition: "A Payment QR code encodes payment destination details, such as UPI deep links (upi://pay), PayPal checkout links, or payment gateway invoices, facilitating contactless transactions directly on mobile payment apps.",
    benefits: [
      "Fast, touchless payment processing at checkout counters and restaurant tables",
      "Eliminates manual typing of merchant UPI IDs or payment links",
      "Increases invoice payment completion rates on printed bills",
      "Supports pre-set transaction amounts and payment notes",
    ],
    howToSteps: [
      "Select your payment system (UPI, PayPal, or invoice link).",
      "Enter payee address and optional pre-set invoice amount.",
      "Customize with payment security badges and clean styling.",
      "Display at billing counters or embed in invoices and receipts.",
    ],
    faqs: [
      {
        question: "Is financial payment data stored on IntelliQR servers?",
        answer: "No. The QR code directly triggers the scanner's authenticated banking or payment application (e.g., Google Pay, PhonePe, PayPal).",
      },
    ],
  },
};

export default function QRTypes() {
  const { typeSlug } = useParams<{ typeSlug?: string }>();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // If specific slug is requested and exists
  const activeType = typeSlug ? TYPE_DATA[typeSlug] : null;

  if (activeType) {
    const Icon = activeType.icon;
    return (
      <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
        <SEOHead
          title={activeType.metaTitle}
          description={activeType.metaDescription}
          canonicalUrl={`https://intelli-qr.vercel.app/qr-code-types/${activeType.slug}`}
          breadcrumbs={[
            { name: "QR Code Types", url: "/qr-code-types" },
            { name: activeType.name, url: `/qr-code-types/${activeType.slug}` },
          ]}
          faqs={activeType.faqs}
        />

        <Header />

        {/* Hero Section matching Home Page */}
        <section className="sarvam-gradient pt-36 sm:pt-40 lg:pt-44 pb-20 border-b border-border overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="flex justify-start max-w-4xl mx-auto mb-4">
              <Breadcrumbs
                items={[
                  { name: "QR Code Types", url: "/qr-code-types" },
                  { name: activeType.name, url: `/qr-code-types/${activeType.slug}` },
                ]}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
                <Icon className="w-3.5 h-3.5 text-orange-600" />
                {activeType.tagline}
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
                {activeType.h1}
              </h1>

              <p className="text-base sm:text-xl text-slate-700/80 leading-relaxed max-w-3xl mx-auto mb-10 font-medium">
                {activeType.metaDescription}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/generator?type=${activeType.qrTypeKey}`}
                  className="btn-primary text-base px-8 py-3.5 flex items-center justify-center gap-2 shadow-sm"
                >
                  Generate {activeType.name}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dynamic-qr-code"
                  className="btn-secondary text-base px-8 py-3.5 flex items-center justify-center gap-2"
                >
                  Make It Dynamic & Trackable
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        <main className="flex-1 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Answer-First Section */}
            <section className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-16">
              <div className="border-l-4 border-indigo-600 pl-6 mb-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">
                  Direct Overview (GEO Answer)
                </h2>
                <p className="text-2xl font-serif font-bold text-slate-900">
                  What is a {activeType.name}?
                </p>
              </div>
              <p className="text-slate-700 leading-relaxed text-base sm:text-lg mb-8">
                {activeType.definition}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                {activeType.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">{b}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* How to create */}
            <section className="mb-16">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Step-by-Step Guide
                </h2>
                <p className="text-3xl font-serif font-bold text-slate-900">
                  How to Create a {activeType.name} in 4 Easy Steps
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {activeType.howToSteps.map((step, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs mb-4">
                      0{idx + 1}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="max-w-4xl mx-auto mb-20">
              <div className="text-center mb-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-2xl font-serif font-bold text-slate-900">
                  {activeType.name} FAQs
                </p>
              </div>

              <div className="space-y-4">
                {activeType.faqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? "rotate-180 text-indigo-600" : ""
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-slate-900 text-white rounded-3xl p-10 text-center">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3">
                Create Your {activeType.name} Now
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6">
                Custom designs, high-resolution vector exports, and real-time tracking are ready in your browser.
              </p>
              <Link
                to={`/generator?type=${activeType.qrTypeKey}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs tracking-widest uppercase transition-all shadow-md"
              >
                Open QR Generator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Directory view: /qr-code-types
  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <SEOHead
        title="QR Code Types & Generator Directory – Explore 25+ QR Formats"
        description="Browse all supported QR code types on IntelliQR: WiFi, WhatsApp, vCard, PDF, Google Maps, Restaurant Menu, Social Media, and Dynamic QR codes."
        canonicalUrl="https://intelli-qr.vercel.app/qr-code-types"
        breadcrumbs={[{ name: "QR Code Types", url: "/qr-code-types" }]}
      />

      <Header />

      {/* Hero Section matching Home Page */}
      <section className="sarvam-gradient pt-36 sm:pt-40 lg:pt-44 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="flex justify-start max-w-4xl mx-auto mb-4">
            <Breadcrumbs items={[{ name: "QR Code Types", url: "/qr-code-types" }]} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm text-xs font-bold text-slate-800 uppercase tracking-widest mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              25+ Supported Formats
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Explore All QR Code Types, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600">
                built for every application.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-700/80 leading-relaxed max-w-2xl mx-auto font-medium">
              From passwordless WiFi and vCard digital business cards to interactive restaurant menus and PDF downloads, generate custom QR codes tailored to every business use case.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {Object.values(TYPE_DATA).map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.slug}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-serif font-bold text-slate-900 mb-2">
                      {type.name}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      {type.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Link
                      to={`/qr-code-types/${type.slug}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/generator?type=${type.qrTypeKey}`}
                      className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                    >
                      Create
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
