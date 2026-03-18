import React, { useState, useCallback, useMemo } from "react";
import { ToolType } from "../types";
import { TOOLS } from "../constants";
import {
  ArrowLeft,
  FileUp,
  Loader2,
  AlertCircle,
  FileText,
  X,
} from "lucide-react";

import { fileToBase64 } from "../services/fileUtils";
import { processDocument } from "../services/geminiService";
import {
  mergePdfs,
  splitPdfToZip,
  getPdfPageCount,
  parsePageRange,
} from "../services/pdfService";
import { ResultDisplay } from "./ResultDisplay";
import { geminiErrorMap } from "../geminiErrorMap";

interface ConverterProps {
  toolType: ToolType;
  onBack: () => void;
  user?: any;
}

export const Converter: React.FC<ConverterProps> = ({ toolType, onBack }) => {
  /* ---------------- STATE ---------------- */

  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [binaryUrl, setBinaryUrl] = useState<string | null>(null);
  const [error, setError] = useState<{
    title: string;
    message: string;
    action?: string;
  } | null>(null);
  const [splitRange, setSplitRange] = useState("");
  const [totalPages, setTotalPages] = useState(0);

  /* ---------------- TOOL ---------------- */

  const tool = TOOLS.find((t) => t.id === toolType);
  if (!tool) return null;

  const ToolIcon = tool.icon;
  const toolBg = tool.color ?? "bg-rose-600";
  const toolText = toolBg.replace("bg-", "text-");

  const isMerge = toolType === ToolType.MERGE_PDF;
  const isSplit = toolType === ToolType.SPLIT_PDF;

  /* ---------------- SPLIT PREVIEW ---------------- */

  const selectedPages = useMemo(() => {
    if (!isSplit || !totalPages) return [];
    return parsePageRange(splitRange, totalPages);
  }, [splitRange, totalPages, isSplit]);

  /* ---------------- FILE HANDLING ---------------- */

  const handleFiles = useCallback(
    async (incoming: File[]) => {
      const pdfs = incoming.filter(
        (f) => f.type === "application/pdf"
      );

      if (!pdfs.length) {
        setError({
          title: "Invalid file",
          message: "Please upload a valid PDF file.",
        });
        return;
      }

      setError(null);
      setResult(null);
      setBinaryUrl(null);

      if (isMerge) {
        setFiles((prev) => [...prev, ...pdfs]);
      } else {
        setFiles([pdfs[0]]);

        if (isSplit) {
          const count = await getPdfPageCount(pdfs[0]);
          setTotalPages(count);
        }
      }
    },
    [isMerge, isSplit]
  );

  /* ---------------- DROP ---------------- */

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  /* ---------------- PROCESS ---------------- */

  const handleProcess = async () => {
    if (!files.length) return;

    setIsProcessing(true);
    setError(null);

    try {
      /* ----- MERGE PDFs ----- */
      if (isMerge) {
        const bytes = await mergePdfs(files);
        const safeBytes = bytes.slice();
        const blob = new Blob([safeBytes], {
          type: "application/pdf",
        });

        setBinaryUrl(URL.createObjectURL(blob));
        setResult("PDFs merged successfully.");
        return;
      }

      /* ----- SPLIT → ZIP ----- */
      if (isSplit) {
        if (!splitRange.trim()) {
          throw {
            error: { code: "INVALID_RANGE" }
          };
        }

        const zipBlob = await splitPdfToZip(files[0], splitRange);
        const url = URL.createObjectURL(zipBlob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "split-pages.zip";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setResult("PDF split into multiple files.");
        return;
      }

      /* ----- AI TOOLS ----- */
      const base64 = await fileToBase64(files[0]);
      const output = await processDocument(
        base64,
        files[0].type,
        toolType
      );

      setResult(output);
    } catch (err: any) {
      console.error("Converter error:", err);

      const code =
        err?.error?.code ||
        err?.response?.data?.error?.code ||
        "DEFAULT";

      const uiError =
        geminiErrorMap[code] || geminiErrorMap.DEFAULT;

      setError({
        title: uiError.title,
        message: uiError.message,
        action: uiError.action,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      {/* BACK */}
      <button
        onClick={onBack}
        className="flex items-center text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to tools
      </button>

      {/* HEADER */}
      <div className="text-center mb-10">
        <div className={`inline-flex p-5 rounded-3xl ${toolBg} bg-opacity-10`}>
          <ToolIcon className={`w-12 h-12 ${toolText}`} />
        </div>
        <h1 className="text-4xl font-extrabold mt-4">{tool.title}</h1>
        <p className="text-slate-600 mt-2">{tool.description}</p>
      </div>

      {/* CONTENT */}
      {!result ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-2xl p-10 text-center ${
            isDragging
              ? "border-rose-500 bg-rose-50"
              : "border-slate-200"
          }`}
        >
          {!files.length ? (
            <>
              <input
                type="file"
                accept=".pdf"
                multiple={isMerge}
                onChange={(e) =>
                  e.target.files &&
                  handleFiles(Array.from(e.target.files))
                }
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer inline-flex flex-col items-center"
              >
                <FileUp className="w-10 h-10 text-rose-600 mb-3" />
                <span className="font-semibold">
                  Click or drop PDF{isMerge ? "s" : ""}
                </span>
              </label>
            </>
          ) : (
            <>
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-slate-50 p-3 rounded-lg mb-2"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-rose-500" />
                    <span className="text-sm">{f.name}</span>
                  </div>
                  <button onClick={() => setFiles([])}>
                    <X className="w-4 h-4 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
              ))}

              {isSplit && (
                <input
                  type="text"
                  placeholder="e.g. 1-3,5"
                  value={splitRange}
                  onChange={(e) => setSplitRange(e.target.value)}
                  className="w-full mt-4 px-4 py-3 border rounded-lg"
                />
              )}

              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="mt-6 w-full bg-slate-900 text-white py-4 rounded-xl font-bold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="inline w-5 h-5 mr-2 animate-spin" />
                    Processing…
                  </>
                ) : isMerge ? (
                  "Merge PDFs"
                ) : isSplit ? (
                  "Split PDF"
                ) : (
                  "Convert"
                )}
              </button>

              {error && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-700">
                        {error.title}
                      </h3>
                      <p className="mt-1 text-red-600">
                        {error.message}
                      </p>
                      {error.action && (
                        <p className="mt-2 text-sm text-red-500">
                          💡 {error.action}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <ResultDisplay
          content={result}
          blobUrl={binaryUrl}
          toolType={toolType}
          onReset={() => {
            setResult(null);
            setBinaryUrl(null);
            setFiles([]);
            setSplitRange("");
            setTotalPages(0);
          }}
        />
      )}
    </div>
  );
};
