
"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Download,
  RefreshCw,
  Leaf,
  Layers,
  Gauge,
  ShieldCheck,
  Zap,
  Infinity,
  X,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL ||
  "http://localhost:8000";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

type CompressionLevel = "high" | "recommended" | "maximum";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const compressionOptions = [
  {
    id: "high",
    title: "High Quality",
    description: "Less compression, better quality.",
    detail: "Best for documents requiring clear images.",
    icon: Leaf,
    selectedClass: "border-blue-500 bg-blue-50",
    iconClass: "text-blue-600",
  },
  {
    id: "recommended",
    title: "Recommended",
    description: "Balanced size and quality.",
    detail: "Suitable for everyday PDF documents.",
    icon: Layers,
    selectedClass: "border-green-600 bg-green-50",
    iconClass: "text-green-600",
  },
  {
    id: "maximum",
    title: "Maximum Compression",
    description: "Smaller file, potentially lower quality.",
    detail: "Best when reducing file size is the priority.",
    icon: Gauge,
    selectedClass: "border-purple-500 bg-purple-50",
    iconClass: "text-purple-600",
  },
] as const;

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);

  const [level, setLevel] =
    useState<CompressionLevel>("recommended");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [result, setResult] = useState<{
    blob: Blob;
    originalSize: number;
    compressedSize: number;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function selectFile(selected: File | null) {
    setResult(null);
    setMessage("");

    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setMessage("Please select a PDF file.");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      setMessage("PDF size must not exceed 100 MB.");
      return;
    }

    if (selected.size === 0) {
      setFile(null);
      setMessage("The selected PDF is empty.");
      return;
    }

    setFile(selected);
  }

  async function compressPdf() {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    setBusy(true);
    setMessage("Uploading and compressing your PDF...");
    setResult(null);

    try {
      const form = new FormData();

      form.append("file", file);
      form.append("level", level);

      const response = await fetch(
        `${API}/convert/compress-pdf`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail ||
            "PDF compression failed. Please try again."
        );
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error(
          "The compression service returned an empty file."
        );
      }

      setResult({
        blob,
        originalSize: file.size,
        compressedSize: blob.size,
      });

      const difference = file.size - blob.size;

      if (difference > 0) {
        const percentage =
          (difference / file.size) * 100;

        setMessage(
          `Success! Your PDF size was reduced by ${percentage.toFixed(1)}%.`
        );
      } else if (difference === 0) {
        setMessage(
          "PDF processed successfully. File size is unchanged."
        );
      } else {
        setMessage(
          "PDF processed successfully, but the resulting file is larger. No size reduction was achieved."
        );
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  function downloadPdf() {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "compressed.pdf";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function resetTool() {
    setFile(null);
    setResult(null);
    setMessage("");
    setLevel("recommended");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const savedBytes = result
    ? result.originalSize - result.compressedSize
    : 0;

  const savedPercentage =
    result && savedBytes > 0
      ? (savedBytes / result.originalSize) * 100
      : 0;

  const selectedOption = compressionOptions.find(
    (option) => option.id === level
  );

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">

      {/* Heading */}

      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <FileText size={34} />
        </div>

        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          Compress PDF
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Reduce your PDF file size and keep good quality.
          Choose a compression level that fits your needs.
        </p>
      </div>

      {/* File input */}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        disabled={busy}
        onChange={(event) =>
          selectFile(event.target.files?.[0] || null)
        }
      />

      {/* Upload section */}

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center transition hover:border-red-400 hover:bg-red-50/30 disabled:opacity-50"
        >
          <UploadCloud size={42} className="text-red-600" />

          <span className="mt-4 text-lg font-bold text-slate-900">
            Choose PDF File
          </span>

          <span className="mt-2 text-sm text-slate-500">
            Select a PDF from your device
          </span>

          <span className="mt-2 text-xs text-slate-400">
            Maximum file size: 100 MB
          </span>
        </button>
      ) : (
        <div className="flex flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <FileText size={30} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-slate-900">
              {file.name}
            </p>

            <p className="mt-1 text-sm text-slate-600">
              PDF Document · {formatSize(file.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-blue-50 disabled:opacity-50"
          >
            Change File
          </button>

          <button
            type="button"
            onClick={resetTool}
            disabled={busy}
            aria-label="Remove selected PDF"
            className="rounded-xl p-2 text-slate-500 hover:bg-white hover:text-red-600"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Compression options */}

      {file && (
        <div className="mt-9">
          <h3 className="mb-5 text-xl font-black text-slate-900">
            Select Compression Level
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {compressionOptions.map((option) => {
              const selected = level === option.id;
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setLevel(option.id);
                    setResult(null);
                    setMessage("");
                  }}
                  disabled={busy}
                  aria-pressed={selected}
                  className={`relative rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md disabled:opacity-50 ${
                    selected
                      ? option.selectedClass
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  {option.id === "recommended" && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-green-600 px-4 py-1 text-xs font-bold text-white shadow">
                      Popular
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <Icon
                      size={32}
                      className={option.iconClass}
                    />

                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        selected
                          ? "border-green-600 bg-green-600"
                          : "border-slate-400 bg-white"
                      }`}
                    >
                      {selected && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </div>

                  <h4 className="mt-4 text-base font-black text-slate-900">
                    {option.title}
                  </h4>

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {option.description}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {option.detail}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Compress button */}

      {file && !result && (
        <button
          type="button"
          disabled={busy}
          onClick={compressPdf}
          className="mx-auto mt-9 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {busy ? (
            <>
              <RefreshCw size={22} className="animate-spin" />
              Compressing PDF...
            </>
          ) : (
            <>
              <Download size={22} />
              Compress PDF
            </>
          )}
        </button>
      )}

      {/* Status message */}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm font-medium text-slate-700"
        >
          {message}
        </div>
      )}

      {/* Results */}

      {result && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50/60 p-5 sm:p-7">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
              <ShieldCheck size={32} />
            </div>

            <h3 className="mt-3 text-2xl font-black text-slate-900">
              PDF Processing Complete
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              Compression level: {selectedOption?.title}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Original File Size
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {formatSize(result.originalSize)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Processed File Size
              </p>

              <p className="mt-2 text-2xl font-black text-green-700">
                {formatSize(result.compressedSize)}
              </p>
            </div>
          </div>

          {savedBytes > 0 ? (
            <div className="mt-5 rounded-xl bg-green-100 p-5 text-center">
              <p className="text-sm font-semibold text-green-800">
                Space Saved
              </p>

              <p className="mt-1 text-3xl font-black text-green-800">
                {savedPercentage.toFixed(1)}%
              </p>

              <p className="mt-1 text-sm text-green-800">
                {formatSize(savedBytes)} smaller
              </p>
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-white p-4 text-center text-sm text-slate-600">
              {savedBytes === 0
                ? "The processed file size is unchanged."
                : "The processed file is larger. No size reduction was achieved."}
            </p>
          )}

          <button
            type="button"
            onClick={downloadPdf}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-5 py-4 text-lg font-black text-white shadow-md hover:bg-green-700"
          >
            <Download size={22} />
            Download Compressed PDF
          </button>

          <button
            type="button"
            onClick={resetTool}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} className="mr-2 inline" />
            Compress Another PDF
          </button>
        </div>
      )}

      {/* Trust information */}

      <div className="mt-9 grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <ShieldCheck size={27} className="shrink-0 text-green-600" />
          <div>
            <p className="font-bold text-slate-900">Secure</p>
            <p className="text-xs text-slate-500">
              Files processed temporarily.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Zap size={27} className="shrink-0 text-green-600" />
          <div>
            <p className="font-bold text-slate-900">Fast</p>
            <p className="text-xs text-slate-500">
              Optimized processing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Infinity size={27} className="shrink-0 text-green-600" />
          <div>
            <p className="font-bold text-slate-900">Free</p>
            <p className="text-xs text-slate-500">
              No registration required.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        Maximum upload size: 100 MB. Compression results depend
        on PDF content and selected compression level. Image
        quality may change with stronger compression.
        Password-protected PDFs are not supported.
      </p>
    </div>
  );
}
