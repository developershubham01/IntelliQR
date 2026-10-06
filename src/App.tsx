import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import Chatbot from "./components/Chatbot";

// Lazy loaded pages for Code Splitting
const Home = lazy(() => import("./pages/Home"));
const Generator = lazy(() => import("./pages/Generator"));
const Features = lazy(() => import("./pages/Features"));
const Pricing = lazy(() => import("./pages/Pricing"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Templates = lazy(() => import("./pages/Templates"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
const DynamicQR = lazy(() => import("./pages/DynamicQR"));
const QRAnalytics = lazy(() => import("./pages/QRAnalytics"));
const QRTypes = lazy(() => import("./pages/QRTypes"));
const Solutions = lazy(() => import("./pages/Solutions"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Global fallback loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-8 h-8 text-accent animate-spin" />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="bottom-right" richColors />
      <Chatbot />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/qr-code-generator" element={<Generator />} />
          <Route path="/dynamic-qr-code" element={<DynamicQR />} />
          <Route path="/qr-code-analytics" element={<QRAnalytics />} />
          <Route path="/qr-code-tracking" element={<QRAnalytics />} />
          <Route path="/dynamic-qr-analytics" element={<QRAnalytics />} />
          <Route path="/qr-campaign-tracking" element={<QRAnalytics />} />
          <Route path="/qr-code-types" element={<QRTypes />} />
          <Route path="/qr-code-types/:typeSlug" element={<QRTypes />} />
          <Route path="/qr-code-generator/:typeSlug" element={<QRTypes />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:industrySlug" element={<Solutions />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/api-docs" element={<ApiDocs />} />
          <Route path="/qr-code-api" element={<ApiDocs />} />
          <Route path="/developers" element={<ApiDocs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
