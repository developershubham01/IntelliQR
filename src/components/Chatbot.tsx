import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  links?: { label: string; to: string }[];
}

const KNOWLEDGE_BASE = [
  {
    keywords: ["generate", "create", "make", "how to generate", "how to create", "new qr"],
    title: "How to Generate a QR Code",
    content: "To generate a QR code on IntelliQR, follow these simple steps:\n1. Click the **'Start Generating'** button on the home page or navigate to the **Generator** page.\n2. In the **Content** tab on the right, select your desired QR type (e.g., Website URL, WiFi, vCard, etc.) and enter the required details.\n3. Switch to the **Design** tab to customize colors, gradients, frames, eye shapes, and embed your brand logo.\n4. Head to the **Export** tab to select your file format (PNG, SVG, JPG, WEBP, PDF) and resolution size (256px to 2048px).\n5. Click **Download** or **Print** to save your customized QR code.",
    links: [{ label: "Go to Generator", to: "/generator" }]
  },
  {
    keywords: ["dynamic", "static", "difference", "redirection", "edit url", "change link"],
    title: "Dynamic vs. Static QR Codes",
    content: "IntelliQR supports both static and dynamic QR codes:\n- **Dynamic QR Codes (Recommended):** These codes redirect scans through our secure server. You can change the destination URL anytime without reprinting the physical code. They also track scan analytics (scan counts, times, and locations).\n- **Static QR Codes:** The content is encoded directly into the QR code graphic itself. They cannot be edited or tracked, but they will work forever since they don't depend on a server redirect.",
    links: [{ label: "Learn More on Generator", to: "/generator" }]
  },
  {
    keywords: ["custom", "design", "logo", "color", "gradient", "frame", "style", "customize", "looks"],
    title: "QR Code Customization",
    content: "You can fully customize your QR code designs to fit your brand identity:\n- **Colors:** Use single colors or horizontal/radial gradients.\n- **Logo:** Upload a JPG/PNG logo to center it in the QR code. The app automatically increases error correction to prevent scanning issues.\n- **Shapes:** Customize dot patterns (square, rounded, classy, smooth) and eye designs (square, circle, ring).\n- **Frames:** Add call-to-action frames (e.g., 'SCAN ME') with custom colors and labels.",
    links: [{ label: "Start Customizing", to: "/generator" }]
  },
  {
    keywords: ["api", "developer", "endpoint", "curl", "javascript", "python", "documentation", "integration"],
    title: "Developer API Integration",
    content: "IntelliQR offers a fast REST API for bulk creation:\n- **Endpoint:** `POST /api/trpc/qr.generate`\n- **Authentication:** Bearer token in the `Authorization` header (`Authorization: Bearer YOUR_API_KEY`).\n- **Payload:** Accepts `type`, `content`, and detailed `style` parameters (colors, error correction levels, etc.).\n- Python, JavaScript, and cURL examples are available in our developer documentation.",
    links: [{ label: "View API Docs", to: "/api-docs" }]
  },
  {
    keywords: ["analytics", "tracking", "scans", "clicks", "metrics", "monitor", "data", "dashboard"],
    title: "Scan Analytics & Tracking",
    content: "If you generate a **Dynamic QR Code**, you get access to rich scan tracking:\n- **Real-time Metrics:** Monitor scan counts and performance metrics instantly.\n- **Performance Dashboard:** View analytics charts to understand user engagement.\n- **SLA & Speed:** Redirection tracking completes in under 50ms with 99.9% uptime guarantees.",
    links: [{ label: "View Pricing Details", to: "/pricing" }]
  },
  {
    keywords: ["price", "cost", "free", "pricing", "plans", "subscription", "business", "pro", "enterprise"],
    title: "Pricing & Subscription Plans",
    content: "We offer plans for everyone:\n- **Free Plan:** Unlimited static QR codes, basic customization, PNG/JPG exports, and up to 10 history items.\n- **Pro Plan ($9/mo):** Advanced customization, SVG/PDF vectors, logo embedding, gradients, and unlimited history.\n- **Business Plan ($29/mo):** Team seats, custom domains, white-labeled exports, and API access.",
    links: [{ label: "View Pricing Page", to: "/pricing" }]
  }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hi there! 👋 I am the **IntelliQR Assistant**, a client-side AI trained to help you build, design, and manage QR codes on our platform.\n\nHow can I assist you today?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSearch = (query: string): { content: string; links?: { label: string; to: string }[] } => {
    const cleanQuery = query.toLowerCase();
    let bestMatch = null;
    let maxMatches = 0;

    for (const doc of KNOWLEDGE_BASE) {
      let matches = 0;
      for (const keyword of doc.keywords) {
        if (cleanQuery.includes(keyword)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = doc;
      }
    }

    if (bestMatch && maxMatches > 0) {
      return {
        content: `### ${bestMatch.title}\n\n${bestMatch.content}`,
        links: bestMatch.links
      };
    }

    return {
      content: "I couldn't find a direct match for that. 😕\n\nTry asking about:\n- **How to generate** a QR code\n- The difference between **dynamic and static** codes\n- **Customizing** styles and embedding logos\n- Integrating with our **Developer API**\n- Tracking scan **analytics**\n- Our **pricing** plans",
      links: [
        { label: "Explore Features", to: "/features" },
        { label: "Check Pricing", to: "/pricing" }
      ]
    };
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = handleSearch(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: response.content,
        links: response.links
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleChipClick = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="w-[360px] sm:w-[400px] h-[550px] bg-white border border-slate-100 rounded-[32px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden mb-4"
          >
            {/* Chat Header */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-[15px] tracking-tight">IntelliQR Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-300 font-semibold tracking-wider uppercase">Local RAG Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "user"
                        ? "bg-slate-900 text-white"
                        : "bg-indigo-50 text-indigo-600 border border-indigo-100"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-2">
                    <div
                      className={`rounded-2xl px-4 py-3 text-[14px] leading-[1.6] whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-slate-900 text-white rounded-tr-sm"
                          : "bg-white border border-slate-100/80 text-slate-700 rounded-tl-sm shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
                      }`}
                    >
                      {/* Bold Text formatting helper */}
                      {msg.text.split("\n").map((line, idx) => {
                        // Very simple markdown formatting helper
                        let formattedLine = line;
                        const boldRegex = /\*\*(.*?)\*\*/g;
                        const parts = [];
                        let lastIndex = 0;
                        let match;
                        
                        while ((match = boldRegex.exec(line)) !== null) {
                          if (match.index > lastIndex) {
                            parts.push(line.substring(lastIndex, match.index));
                          }
                          parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[1]}</strong>);
                          lastIndex = boldRegex.lastIndex;
                        }
                        
                        if (lastIndex < line.length) {
                          parts.push(line.substring(lastIndex));
                        }

                        return (
                          <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                            {parts.length > 0 ? parts : formattedLine}
                          </p>
                        );
                      })}
                    </div>

                    {msg.links && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {msg.links.map((link, lIdx) => (
                          <Link
                            key={lIdx}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors shadow-sm"
                          >
                            {link.label}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 mr-auto max-w-[85%]">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-100/80 rounded-2xl rounded-tl-sm px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestions (when history is small or input is empty) */}
            {messages.length === 1 && !isTyping && (
              <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-wrap gap-2">
                {[
                  "How to generate a QR?",
                  "What is dynamic QR?",
                  "API documentation help",
                  "Tell me about pricing"
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    className="text-[12px] font-medium text-slate-500 hover:text-slate-800 bg-white border border-slate-200/60 rounded-full px-3 py-1.5 hover:border-slate-300 transition-colors shadow-[0_2px_6px_rgba(0,0,0,0.01)]"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200/60 text-sm focus:outline-none focus:border-indigo-500 bg-slate-50/50 text-slate-800 font-medium placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 transition-colors disabled:opacity-40 flex items-center justify-center shadow-md shadow-slate-950/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center shadow-lg transition-all hover:scale-105"
        title="Help Chatbot"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-slate-900 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}
