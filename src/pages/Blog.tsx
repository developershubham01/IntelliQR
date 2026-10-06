import { useState, useMemo } from "react";
import { Link } from "react-router";
import {
  BookOpen,
  ArrowRight,
  Search,
  Sparkles,
  Calendar,
  Clock,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { BLOG_ARTICLES, BLOG_TOPIC_IDEAS } from "@/data/blogArticles";

const CATEGORIES = [
  "All",
  "Dynamic QR",
  "Analytics",
  "Comparison",
  "Tutorials",
  "Industry Solutions",
  "Security",
  "Print Marketing",
  "Developer API",
  "Local SEO",
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const articlesList = useMemo(() => Object.values(BLOG_ARTICLES), []);

  const filteredArticles = useMemo(() => {
    return articlesList.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" ||
        article.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.metaDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articlesList, selectedCategory, searchQuery]);

  const filteredTopicIdeas = useMemo(() => {
    return BLOG_TOPIC_IDEAS.filter((topic) => {
      const matchesCategory =
        selectedCategory === "All" ||
        topic.cluster.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.targetKeyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "IntelliQR Knowledge Hub & Blog",
    description: "Authoritative guides, tutorials, and research on QR technology, dynamic redirection, analytics attribution, and enterprise marketing.",
    url: "https://intelli-qr.vercel.app/blog",
    publisher: {
      "@type": "Organization",
      name: "IntelliQR",
      logo: "https://intelli-qr.vercel.app/logo.png",
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground flex flex-col font-sans">
      <SEOHead
        title="QR Code Knowledge Hub & Blog – Dynamic QR, Analytics & Best Practices"
        description="Master QR code technology with in-depth guides on dynamic QR codes, real-time scan analytics, print marketing attribution, security best practices, and developer APIs."
        canonicalUrl="https://intelli-qr.vercel.app/blog"
        breadcrumbs={[{ name: "Blog & Knowledge Hub", url: "/blog" }]}
        structuredData={blogSchema}
      />

      <Header />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Breadcrumbs items={[{ name: "Blog & Knowledge Hub", url: "/blog" }]} />

          {/* Hero Section */}
          <section className="text-center max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              IntelliQR Knowledge Hub & Research
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-slate-900 tracking-tight leading-[1.1] mb-6">
              The Definitive Resource for Modern QR Code Technology
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto mb-8 font-normal">
              Explore step-by-step tutorials, technical deep dives, print attribution strategies, and industry case studies designed for marketers, developers, and business owners.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative mb-8">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, or keywords (e.g. dynamic qr, wifi, tracking)..."
                className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Featured Pillar Guides */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900">
                  Featured Pillar Guides
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Complete, peer-reviewed technical tutorials and comprehensive reference articles.
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {filteredArticles.length} In-Depth Guides
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.slug}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-900 shadow-sm">
                        {article.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 font-medium mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {article.publishedDate}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="text-lg font-serif font-bold text-slate-900 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">
                        <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                        {article.metaDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={article.author.avatar}
                        alt={article.author.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-[11px] font-medium text-slate-600">
                        {article.author.name}
                      </span>
                    </div>

                    <Link
                      to={`/blog/${article.slug}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                    >
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 100+ Topic Knowledge Directory */}
          <section className="mb-20">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm">
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Topical Authority Directory (100+ Topics)
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  Comprehensive QR Code Knowledge & Research Index
                </h2>
                <p className="text-sm text-slate-600 mt-2">
                  Browse our structured research catalog covering dynamic QR technology, scan attribution models, industry verticals, security compliance, and developer APIs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTopicIdeas.slice(0, 24).map((topic) => (
                  <div
                    key={topic.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200/80 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                          {topic.cluster}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {topic.searchIntent} Intent
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        {topic.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400 font-mono">
                        Key: {topic.targetKeyword}
                      </span>
                      <Link
                        to={topic.targetUrl}
                        className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                      >
                        Explore <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTopicIdeas.length > 24 && (
                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 font-medium mb-4">
                    Showing top 24 of {filteredTopicIdeas.length} topics matching your search.
                  </p>
                  <Link
                    to="/generator"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Create a QR Code Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Bottom Conversion Section */}
          <section className="bg-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4 tracking-tight">
                Put Knowledge into Action with IntelliQR
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mb-8 leading-relaxed">
                Start generating custom, editable, and trackable dynamic QR codes today with sub-10ms redirection and global edge delivery.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/generator"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs tracking-widest uppercase transition-all shadow-lg"
                >
                  Launch QR Generator
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/dynamic-qr-code"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 font-bold text-xs tracking-widest uppercase transition-all"
                >
                  Explore Dynamic QR
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
