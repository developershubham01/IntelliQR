import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  QrCode,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { BLOG_ARTICLES } from "@/data/blogArticles";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const article = slug ? BLOG_ARTICLES[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-32 pb-24 px-4 text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              The requested article could not be located. It may have been relocated or updated.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Back to Blog & Knowledge Hub
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    image: article.featuredImage,
    datePublished: article.publishedDate,
    dateModified: article.updatedDate,
    author: {
      "@type": "Person",
      name: article.author.name,
      jobTitle: article.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "IntelliQR",
      logo: "https://intelli-qr.vercel.app/logo.png",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://intelli-qr.vercel.app/blog/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-foreground flex flex-col font-sans">
      <SEOHead
        title={article.metaTitle}
        description={article.metaDescription}
        canonicalUrl={`https://intelli-qr.vercel.app/blog/${article.slug}`}
        ogType="article"
        ogImage={article.featuredImage}
        breadcrumbs={[
          { name: "Blog", url: "/blog" },
          { name: article.title, url: `/blog/${article.slug}` },
        ]}
        faqs={article.faqs}
        structuredData={articleSchema}
      />

      <Header />

      <main className="flex-1 pt-32 pb-24">
        <article className="max-w-4xl mx-auto px-4 sm:px-6">
          <Breadcrumbs
            items={[
              { name: "Blog", url: "/blog" },
              { name: article.title, url: `/blog/${article.slug}` },
            ]}
          />

          {/* Article Header */}
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              {article.category}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-[1.15] mb-6">
              {article.title}
            </h1>

            {/* Author and Metadata */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">{article.author.name}</p>
                  <p className="text-[11px] text-slate-500">{article.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Updated {article.updatedDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {article.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-slate-100 shadow-sm">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* GEO / AEO Answer-First Definition Card */}
          <section className="bg-indigo-50/50 rounded-3xl p-6 sm:p-8 border border-indigo-100/80 mb-12">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-700">
                Direct Answer (GEO / AI Summary)
              </h2>
            </div>
            <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-normal">
              {article.directAnswer}
            </p>
          </section>

          {/* Key Takeaways */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm mb-12">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Key Takeaways
            </h2>
            <ul className="space-y-3">
              {article.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Intro Paragraph */}
          <div className="text-base sm:text-lg text-slate-700 leading-relaxed mb-12 font-normal">
            <p>{article.content.intro}</p>
          </div>

          {/* Article Main Sections */}
          <div className="space-y-12 mb-16">
            {article.content.sections.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                  {sec.heading}
                </h2>

                {sec.subheading && (
                  <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                    {sec.subheading}
                  </h3>
                )}

                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="text-slate-700 leading-relaxed text-base">
                    {p}
                  </p>
                ))}

                {sec.listItems && sec.listItems.length > 0 && (
                  <ul className="space-y-2.5 my-4 pl-2">
                    {sec.listItems.map((item, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Callout Box */}
                {sec.callout && (
                  <div className="my-6 p-6 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-950 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-amber-900 mb-1">
                        {sec.callout.title}
                      </h4>
                      <p className="text-xs text-amber-900/90 leading-relaxed">
                        {sec.callout.text}
                      </p>
                    </div>
                  </div>
                )}

                {/* Table */}
                {sec.table && (
                  <div className="overflow-x-auto my-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/75">
                          {sec.table.headers.map((h, hIdx) => (
                            <th key={hIdx} className="py-3 px-4 font-bold text-slate-700">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sec.table.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-3 px-4 ${
                                  cIdx === 0
                                    ? "font-semibold text-slate-900"
                                    : "text-slate-600 font-normal"
                                }`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Step-by-Step Guide Card */}
          {article.stepByStepGuide && (
            <section className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm mb-16">
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">
                {article.stepByStepGuide.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {article.stepByStepGuide.steps.map((st) => (
                  <div
                    key={st.stepNumber}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs mb-3">
                      0{st.stepNumber}
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 mb-1">{st.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{st.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQ Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {article.faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm sm:text-base">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Author Bio Box */}
          <section className="bg-slate-100/70 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 mb-16">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-20 h-20 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h3 className="font-bold text-base text-slate-900">{article.author.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                  Author & Software Architect
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {article.author.role}. Building high-performance QR infrastructure, dynamic link routers, and telemetry systems at IntelliQR Labs Inc.
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs font-bold text-indigo-600">
                <Link to="/about" className="hover:underline">
                  About IntelliQR
                </Link>
                <span>•</span>
                <Link to="/contact" className="hover:underline">
                  Contact Team
                </Link>
              </div>
            </div>
          </section>

          {/* Related Articles */}
          <section className="mb-16">
            <h2 className="text-xl font-serif font-bold text-slate-900 mb-6">
              Related Guides & Topics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {article.relatedTopics.map((rel, idx) => (
                <Link
                  key={idx}
                  to={`/blog/${rel.slug}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
                      {rel.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400 inline-flex items-center gap-1 mt-4">
                    Read article <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Inline CTA */}
          <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3 tracking-tight">
              Create Your Dynamic QR Code in Seconds
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              Experience the power of real-time destination updates and scan analytics with IntelliQR.
            </p>
            <Link
              to="/generator?mode=dynamic"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs tracking-widest uppercase transition-all shadow-md"
            >
              Start Generating Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
