import { useState } from "react";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Copy, Check, Code2, Terminal, Globe, Key } from "lucide-react";

const endpoints = [
  {
    method: "POST",
    path: "/api/trpc/qr.generate",
    description: "Generate a new QR code with specified content and style.",
    params: [
      { name: "type", type: "string", required: true, desc: "QR type (website, email, wifi, etc.)" },
      { name: "content", type: "string", required: true, desc: "QR code content/data" },
      { name: "style", type: "object", required: false, desc: "Style configuration object" },
    ],
    example: `{
  "type": "website",
  "content": "https://example.com",
  "style": {
    "foregroundColor": "#00F0FF",
    "backgroundColor": "#030C14",
    "errorCorrectionLevel": "H"
  }
}`,
    response: `{
  "result": {
    "data": {
      "id": "abc123",
      "imageUrl": "data:image/png;base64,...",
      "svgContent": "<svg>...</svg>",
      "createdAt": "2026-06-29T12:00:00Z"
    }
  }
}`,
  },
  {
    method: "GET",
    path: "/api/trpc/qr.list",
    description: "List all QR codes for the authenticated user.",
    params: [
      { name: "limit", type: "number", required: false, desc: "Number of results (default: 20)" },
      { name: "offset", type: "number", required: false, desc: "Pagination offset" },
    ],
    example: `// Query parameters
?limit=10&offset=0`,
    response: `{
  "result": {
    "data": {
      "items": [...],
      "total": 42
    }
  }
}`,
  },
  {
    method: "POST",
    path: "/api/trpc/qr.delete",
    description: "Delete a QR code by ID.",
    params: [
      { name: "id", type: "string", required: true, desc: "QR code ID" },
    ],
    example: `{
  "id": "abc123"
}`,
    response: `{
  "result": {
    "data": { "success": true }
  }
}`,
  },
];

const codeSamples = [
  {
    language: "JavaScript",
    code: `// Using fetch
const response = await fetch('/api/trpc/qr.generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    type: 'website',
    content: 'https://example.com',
    style: {
      foregroundColor: '#00F0FF',
      errorCorrectionLevel: 'H'
    }
  }),
});

const result = await response.json();
console.log(result.data.imageUrl);`,
  },
  {
    language: "Python",
    code: `import requests

response = requests.post(
    'https://intelliqr.pro/api/trpc/qr.generate',
    json={
        'type': 'website',
        'content': 'https://example.com',
        'style': {
            'foregroundColor': '#00F0FF',
            'errorCorrectionLevel': 'H'
        }
    },
    headers={'Authorization': 'Bearer YOUR_API_KEY'}
)

result = response.json()
print(result['result']['data']['imageUrl'])`,
  },
  {
    language: "cURL",
    code: `curl -X POST https://intelliqr.pro/api/trpc/qr.generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "type": "website",
    "content": "https://example.com",
    "style": {
      "foregroundColor": "#00F0FF",
      "errorCorrectionLevel": "H"
    }
  }'`,
  },
];

function EndpointCard({ endpoint, index }: { endpoint: typeof endpoints[0]; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodClass =
    endpoint.method === "GET"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-blue-50 text-blue-700 border-blue-100";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white border border-slate-100/80 rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-wider ${methodClass}`}>
            {endpoint.method}
          </span>
          <code className="text-sm text-slate-800 font-mono bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
            {endpoint.path}
          </code>
        </div>
        <p className="text-slate-500 text-[15px] font-medium mb-6 leading-relaxed">{endpoint.description}</p>

        {/* Parameters */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Parameters
          </h4>
          <div className="space-y-2">
            {endpoint.params.map((param) => (
              <div
                key={param.name}
                className="flex items-center gap-3 text-sm"
              >
                <code className="text-indigo-600 bg-indigo-50/50 border border-indigo-100/40 px-2 py-0.5 rounded font-mono text-xs font-semibold min-w-[90px] text-center">
                  {param.name}
                </code>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{param.type}</span>
                {param.required && (
                  <span className="text-rose-500 text-xs font-semibold">required</span>
                )}
                <span className="text-slate-500 font-medium text-xs">{param.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Request Example */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Request Body
            </h4>
            <button
              onClick={() => handleCopy(endpoint.example)}
              className="text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg border border-slate-100 bg-slate-50"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <pre className="bg-[#1E2235] rounded-2xl p-4 text-xs text-slate-200 overflow-x-auto font-mono shadow-inner leading-relaxed">
            {endpoint.example}
          </pre>
        </div>

        {/* Response Example */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Response Body
          </h4>
          <pre className="bg-[#1E2235] rounded-2xl p-4 text-xs text-slate-200 overflow-x-auto font-mono shadow-inner leading-relaxed">
            {endpoint.response}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}

export default function ApiDocs() {
  const [activeLang, setActiveLang] = useState(0);

  return (
    <div className="min-h-screen bg-background text-foreground relative font-sans">
      <Header />

      {/* Hero Section */}
      <section className="sarvam-gradient pt-32 pb-20 border-b border-border overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/40 text-[13px] font-medium text-slate-800 mb-6 shadow-sm">
              <Code2 className="w-4 h-4 text-indigo-600" />
              REST API
            </div>
            <h1 className="text-5xl sm:text-6xl font-serif text-slate-900 mb-6 tracking-tight">
              API Documentation
            </h1>
            <p className="text-slate-700/80 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Integrate IntelliQR into your workflow with our simple, robust REST API.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 py-24 bg-[#FAFAFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {[
              { icon: Key, title: "Get API Key", desc: "Sign up and generate your secure API key from the dashboard." },
              { icon: Globe, title: "Make Requests", desc: "Send HTTP requests to our endpoints with your key." },
              { icon: Terminal, title: "Receive QR Codes", desc: "Get back high-quality QR code images instantly." },
            ].map((step) => (
              <div key={step.title} className="bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-5 h-5 text-slate-500" />
                </div>
                <h3 className="font-bold text-slate-800 text-[16px] mb-2">{step.title}</h3>
                <p className="text-slate-400 text-xs font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 mb-16 shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2.5 text-slate-900">
              <Key className="w-5 h-5 text-slate-500" />
              Authentication
            </h2>
            <p className="text-slate-500 font-medium text-[15px] leading-relaxed mb-4">
              All API requests require authentication. Include your API key in the Authorization header:
            </p>
            <pre className="bg-[#1E2235] rounded-2xl p-4 text-sm text-slate-200 font-mono shadow-inner overflow-x-auto leading-relaxed">
              Authorization: Bearer YOUR_API_KEY
            </pre>
          </motion.div>

          {/* Endpoints */}
          <div className="mb-16">
            <h2 className="text-2xl font-serif text-slate-900 tracking-tight mb-8">Endpoints</h2>
            <div className="space-y-8">
              {endpoints.map((endpoint, i) => (
                <EndpointCard key={endpoint.path} endpoint={endpoint} index={i} />
              ))}
            </div>
          </div>

          {/* Code Samples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-serif text-slate-900 tracking-tight mb-8">Code Samples</h2>
            <div className="bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              {/* Lang Tabs */}
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                {codeSamples.map((sample, i) => (
                  <button
                    key={sample.language}
                    onClick={() => setActiveLang(i)}
                    className={`px-6 py-4 text-sm font-semibold transition-all ${
                      activeLang === i
                        ? "text-slate-800 border-b-2 border-slate-800 bg-white"
                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                    }`}
                  >
                    {sample.language}
                  </button>
                ))}
              </div>

              {/* Code */}
              <div className="p-6 bg-[#1E2235]">
                <pre className="text-xs text-slate-200 overflow-x-auto font-mono leading-relaxed shadow-inner">
                  {codeSamples[activeLang].code}
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
