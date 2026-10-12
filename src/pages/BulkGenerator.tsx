import { useState, useRef } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import {
  Upload, FileSpreadsheet, Download, CheckCircle2,
  Loader2, FileArchive, Zap, Layers, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import QRCode from "qrcode";
import JSZip from "jszip";

interface ParsedRow {
  row: number;
  name: string;
  type: string;
  content: string;
  isDynamic: boolean;
  isValid: boolean;
  error?: string;
}

export default function BulkGenerator() {
  useAuth({
    redirectOnUnauthenticated: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    name: "",
    content: "",
    type: "",
    isDynamic: "",
  });

  const [batchName, setBatchName] = useState("Bulk Campaign");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<any[] | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const processBatchMutation = trpc.bulk.processBatch.useMutation();

  const handleDownloadSample = () => {
    const sampleCsv = `Name,Destination_URL,Type,Dynamic\nTable 1,https://mybistro.com/menu?table=1,restaurant_menu,true\nTable 2,https://mybistro.com/menu?table=2,restaurant_menu,true\nVilla Suite 304,https://resort.com/concierge,hotel_info,true\nListing Sunset Villa,https://realty.com/p/9941,real_estate,true\nVIP Pass Alex Vance,TKT-TECHX-001,event_ticket,false\nMember David Miller,MBR-IRON-5521,gym_membership,false\n`;
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "intelliqr-bulk-sample-template.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Sample CSV template downloaded!");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      toast.error("Please upload a valid .csv file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      toast.error("CSV must contain at least a header row and one data row.");
      return;
    }

    // Parse headers
    const rawHeaders = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    setHeaders(rawHeaders);

    // Auto-detect columns
    const autoName = rawHeaders.find((h) => /name|title|label/i.test(h)) || rawHeaders[0] || "";
    const autoContent = rawHeaders.find((h) => /url|link|content|destination|target/i.test(h)) || rawHeaders[1] || "";
    const autoType = rawHeaders.find((h) => /type|category/i.test(h)) || "";
    const autoDynamic = rawHeaders.find((h) => /dynamic|isdynamic/i.test(h)) || "";

    setColumnMapping({
      name: autoName,
      content: autoContent,
      type: autoType,
      isDynamic: autoDynamic,
    });

    buildRows(lines.slice(1), rawHeaders, {
      name: autoName,
      content: autoContent,
      type: autoType,
      isDynamic: autoDynamic,
    });
  };

  const buildRows = (
    dataLines: string[],
    headersList: string[],
    mapping: typeof columnMapping
  ) => {
    const nameIdx = headersList.indexOf(mapping.name);
    const contentIdx = headersList.indexOf(mapping.content);
    const typeIdx = headersList.indexOf(mapping.type);
    const dynamicIdx = headersList.indexOf(mapping.isDynamic);

    const rows: ParsedRow[] = [];

    dataLines.forEach((line, idx) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      const content = contentIdx !== -1 && cols[contentIdx] ? cols[contentIdx] : "";
      const name = nameIdx !== -1 && cols[nameIdx] ? cols[nameIdx] : `Row ${idx + 1}`;
      const type = typeIdx !== -1 && cols[typeIdx] ? cols[typeIdx] : "website";
      const isDynamicStr = dynamicIdx !== -1 && cols[dynamicIdx] ? cols[dynamicIdx].toLowerCase() : "true";
      const isDynamic = isDynamicStr === "true" || isDynamicStr === "1" || isDynamicStr === "yes";

      const isValid = content.length > 0;
      const error = !isValid ? "Destination URL or content is empty" : undefined;

      rows.push({
        row: idx + 1,
        name,
        type,
        content,
        isDynamic,
        isValid,
        error,
      });
    });

    setParsedRows(rows);
  };

  const handleStartGeneration = async () => {
    if (parsedRows.length === 0) {
      toast.error("No valid rows to generate.");
      return;
    }

    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      toast.error("All rows have validation errors. Please check your data.");
      return;
    }

    setIsProcessing(true);

    try {
      // Server-side batch processing
      const res = await processBatchMutation.mutateAsync({
        jobName: batchName,
        rows: validRows.map((r) => ({
          row: r.row,
          name: r.name,
          type: r.type,
          content: r.content,
          isDynamic: r.isDynamic,
        })),
      });

      setGeneratedResults(res.items);
      toast.success(`Successfully generated ${res.successCount} QR codes!`);
    } catch (err: any) {
      toast.error(err.message || "Bulk generation failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!generatedResults || generatedResults.length === 0) return;
    setIsZipping(true);
    toast.info("Generating high-resolution QR files and assembling ZIP...");

    try {
      const zip = new JSZip();
      const qrFolder = zip.folder("qr-codes");

      let csvMappingContent = "Row,Name,Type,ShortCode,EncodedContent,Status\n";

      for (let i = 0; i < generatedResults.length; i++) {
        const item = generatedResults[i];
        if (item.status === "success") {
          // Generate QR png dataUrl
          const dataUrl = await QRCode.toDataURL(item.content, {
            width: 1024,
            margin: 4,
            color: { dark: "#000000", light: "#FFFFFF" },
            errorCorrectionLevel: "M",
          });

          // Extract base64
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
          const fileName = `${String(item.row).padStart(3, "0")}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.png`;
          qrFolder?.file(fileName, base64Data, { base64: true });

          csvMappingContent += `${item.row},"${item.name}",${item.type},${item.shortId || "static"},"${item.content}",success\n`;
        } else {
          csvMappingContent += `${item.row},"${item.name}",${item.type},failed,"${item.content}",${item.error || "error"}\n`;
        }
      }

      zip.file("mapping-manifest.csv", csvMappingContent);

      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${batchName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-qr-bundle.zip`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("ZIP package downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to assemble ZIP bundle.");
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans sarvam-gradient overflow-x-hidden">
      <SEOHead
        title="Bulk QR Code Generator – Batch Process CSV with Dynamic URLs | IntelliQR"
        description="Upload CSV files to generate hundreds of dynamic or static QR codes at scale. Download as high-resolution ZIP with complete CSV URL mapping."
        canonicalUrl="https://intelli-qr.vercel.app/dashboard/bulk"
        breadcrumbs={[
          { name: "Dashboard", url: "/dashboard" },
          { name: "Bulk QR Generator", url: "/dashboard/bulk" },
        ]}
      />

      <Header />

      <main className="flex-1 pt-36 sm:pt-40 lg:pt-44 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <Breadcrumbs
            items={[
              { name: "Dashboard", url: "/dashboard" },
              { name: "Bulk QR Generator", url: "/dashboard/bulk" },
            ]}
          />

          {/* Header Card */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-xs font-bold text-indigo-700 uppercase tracking-widest mb-3">
                <Layers className="w-3.5 h-3.5" /> High-Throughput Batch Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
                Bulk QR Code Generator
              </h1>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                Upload CSV files to batch-produce hundreds of customized static or dynamic QR codes. Download high-resolution print vectors packaged into a single ZIP.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDownloadSample}
                className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-slate-900 shadow-sm flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Sample CSV
              </button>
              <Link
                to="/dashboard"
                className="px-4 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>

          {/* Upload & Setup Section */}
          {!generatedResults && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Upload Dropzone */}
              <div className="lg:col-span-5 space-y-6">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white rounded-3xl p-8 border-2 border-dashed border-slate-300 hover:border-indigo-500 cursor-pointer transition-all text-center space-y-4 shadow-sm hover:shadow-md group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block mb-1">
                      Upload your CSV file
                    </span>
                    <span className="text-xs text-slate-500">
                      Drag & drop or click to browse (.csv up to 5MB)
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Batch Config */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
                      Batch Name
                    </label>
                    <input
                      type="text"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="e.g. Summer Restaurant Menus"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  {headers.length > 0 && (
                    <div className="space-y-3 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                        Column Mapping
                      </span>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">Name Column</label>
                          <select
                            value={columnMapping.name}
                            onChange={(e) => setColumnMapping({ ...columnMapping, name: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-xs"
                          >
                            {headers.map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">Content/URL Column</label>
                          <select
                            value={columnMapping.content}
                            onChange={(e) => setColumnMapping({ ...columnMapping, content: e.target.value })}
                            className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-xs"
                          >
                            {headers.map((h) => (
                              <option key={h} value={h}>{h}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Rows Preview & Validation Table */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[400px]">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                      <span className="font-bold text-sm text-slate-900">
                        CSV Preview & Validation
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {parsedRows.length} rows loaded
                    </span>
                  </div>

                  {parsedRows.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs">
                      No CSV loaded yet. Upload a CSV file or download the sample template to get started.
                    </div>
                  ) : (
                    <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
                      {parsedRows.slice(0, 100).map((r) => (
                        <div
                          key={r.row}
                          className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                            r.isValid
                              ? "bg-slate-50/50 border-slate-200/70"
                              : "bg-rose-50/60 border-rose-200 text-rose-900"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono text-[10px] text-slate-500 font-bold shrink-0">
                              {r.row}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">{r.name}</span>
                              <span className="text-[11px] text-slate-500 font-mono truncate block max-w-xs">{r.content}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {r.isDynamic ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 flex items-center gap-0.5">
                                <Zap className="w-2.5 h-2.5" /> Dynamic
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                Static
                              </span>
                            )}

                            {r.isValid ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <span className="text-[10px] text-rose-600 font-bold">{r.error}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {parsedRows.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      Ready to generate <strong>{parsedRows.filter((r) => r.isValid).length}</strong> valid items.
                    </span>

                    <button
                      onClick={handleStartGeneration}
                      disabled={isProcessing}
                      className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing Batch...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Batch QR Codes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Summary & ZIP Download Screen */}
          {generatedResults && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md space-y-6 text-center max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                  Batch Generation Complete!
                </h2>
                <p className="text-sm text-slate-600">
                  Generated <strong>{generatedResults.filter((r) => r.status === "success").length}</strong> QR codes successfully and registered them in your account.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleDownloadZip}
                  disabled={isZipping}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
                >
                  {isZipping ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileArchive className="w-4 h-4" />
                  )}
                  Download ZIP (PNGs + Manifest CSV)
                </button>

                <button
                  onClick={() => {
                    setGeneratedResults(null);
                    setParsedRows([]);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
                >
                  Upload Another CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
