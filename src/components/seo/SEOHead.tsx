import { useEffect } from "react";
import { useLocation } from "react-router";

export interface SEOHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  noindex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

const BASE_URL = "https://intelli-qr.vercel.app";
const DEFAULT_OG_IMAGE = `${BASE_URL}/logo.png`;

export default function SEOHead({
  title,
  description,
  canonicalUrl,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  breadcrumbs,
  faqs,
  structuredData,
}: SEOHeadProps) {
  const location = useLocation();
  const currentUrl = canonicalUrl || `${BASE_URL}${location.pathname === "/" ? "" : location.pathname}`;
  const fullTitle = title.includes("IntelliQR") ? title : `${title} | IntelliQR`;

  useEffect(() => {
    // 1. Title
    document.title = fullTitle;

    // Helper to set or update meta tag
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Helper to set canonical link
    const setCanonical = (href: string) => {
      let el = document.querySelector('link[rel="canonical"]');
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // 2. Standard Meta
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");

    // 3. Open Graph
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", "IntelliQR");

    // 4. Twitter Card
    setMeta("property", "twitter:card", "summary_large_image");
    setMeta("property", "twitter:title", fullTitle);
    setMeta("property", "twitter:description", description);
    setMeta("property", "twitter:image", ogImage);

    // 5. Canonical
    setCanonical(currentUrl);

    // 6. JSON-LD Structured Data
    const scriptId = "dynamic-json-ld";
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement("script");
      scriptEl.id = scriptId;
      scriptEl.type = "application/ld+json";
      document.head.appendChild(scriptEl);
    }

    const schemas: any[] = [];

    // Breadcrumb schema
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((crumb, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: crumb.name,
          item: crumb.url.startsWith("http") ? crumb.url : `${BASE_URL}${crumb.url}`,
        })),
      });
    }

    // FAQ schema
    if (faqs && faqs.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      });
    }

    // Custom structured data
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        schemas.push(...structuredData);
      } else {
        schemas.push(structuredData);
      }
    }

    if (schemas.length > 0) {
      scriptEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : { "@context": "https://schema.org", "@graph": schemas });
    } else {
      scriptEl.textContent = "";
    }

    // Cleanup
    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.textContent = "";
      }
    };
  }, [fullTitle, description, currentUrl, ogType, ogImage, noindex, breadcrumbs, faqs, structuredData]);

  return null;
}
