
"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Download,
  RefreshCw,
  Scissors,
  Files,
  Layers,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL ||
  "http://localhost:8000";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

type SplitMode = "extract" | "ranges" | "every_page";

const splitOptions = [
  {
    id: "extract" as const,
    title: "Extract Selected Pages",
    description: "Choose specific pages to create one PDF.",
    example: "Example: 1, 3, 5",
    icon: Scissors,
    selectedClass: "border-blue-500 bg-blue-50",
    iconClass: "text-blue-600",
  },
  {
    id: "ranges" as const,
    title: "Split by Page Ranges",
    description: "Create separate PDFs for each page range.",
    example: "Example: 1-5, 6-10",
    icon: Layers,
    selectedClass: "border-green-600 bg-green-50",
    iconClass: "text-green-600",
  },
  {
    id: "every_page" as const,
    title: "Split Every Page",
    description: "Create one separate PDF for every page.",
    example: "Example: 10 pages = 10 PDFs",
    icon: Files,
    selectedClass: "border-purple-500 bg-purple-50",
    iconClass: "text-purple-600",
  },
];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function SplitPdfTool() {
  const [file, setFile] = useState<File | null>(null);

  const [mode, setMode] = useState<SplitMode>("extract");

  const [pages, setPages] = useState("");
  const [ranges, setRanges] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const [result, setResult] = useState<{
    blob: Blob;
    originalSize: number;
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

  function validateSelection() {
    if (mode === "extract") {
      if (!pages.trim()) {
        return "Please enter the page numbers you want to extract.";
      }

      if (!/^\d+(\s*,\s*\d+)*$/.test(pages.trim())) {
        return "Enter page numbers separated by commas, such as 1, 3, 5.";
      }
    }

    if (mode === "ranges") {
      if (!ranges.trim()) {
        return "Please enter the page ranges.";
      }

      if (!/^\d+(-\d+)?(\s*,\s*\d+(-\d+)?)*$/.test(ranges.trim())) {
        return "Enter valid ranges such as 1-5, 6-10.";
      }
    }

    return "";
  }

  async function splitPdf() {
    if (!file) {
      setMessage("Please select a PDF file first.");
      return;
    }

    const validationError = validateSelection();

    if (validationError) {
      setMessage(validationError);
      return;
    }

    setBusy(true);
    setMessage("Uploading and splitting your PDF...");
    setResult(null);

    try {
      const form = new FormData();

      form.append("file", file);
      form.append("mode", mode);

      if (mode === "extract") {
        form.append("pages", pages);
      }

      if (mode === "ranges") {
        form.append("ranges", ranges);
      }

      const response = await fetch(
        `${API}/convert/split-pdf`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(
          data.detail || "PDF splitting failed. Please try again."
        );
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The server returned an empty ZIP file.");
      }

      setResult({
        blob,
        originalSize: file.size,
      });

      setMessage(
        "Success! Your PDF has been split. Download your ZIP file."
      );
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

  function downloadZip() {
    if (!result) return;

    const url = URL.createObjectURL(result.blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "split-pdf.zip";

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(
      () => URL.revokeObjectURL(url),
      1000
    );
  }

  function resetTool() {
    setFile(null);
    setPages("");
    setRanges("");
    setMode("extract");
    setResult(null);
    setMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const selectedOption = splitOptions.find(
    (option) => option.id === mode
  );

  return (
    <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-8">

      {/* Heading */}

      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <Scissors size={34} />
        </div>

        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900">
          Split PDF
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
          Separate your PDF pages easily. Extract selected pages,
          split by ranges or create individual PDFs for every page.
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

      {/* Split options */}

      {file && (
        <div className="mt-9">
          <h3 className="mb-5 text-xl font-black text-slate-900">
            Choose How to Split Your PDF
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {splitOptions.map((option) => {
              const selected = mode === option.id;
              const Icon = option.icon;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setMode(option.id);
                    setResult(null);
                    setMessage("");
                  }}
                  disabled={busy}
                  aria-pressed={selected}
                  className={`rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md disabled:opacity-50 ${
                    selected
                      ? option.selectedClass
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
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

                  <p className="mt-2 text-sm text-slate-600">
                    {option.description}
                  </p>

                  <p className="mt-3 text-xs font-semibold text-slate-500">
                    {option.example}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Page selection */}

      {file && mode === "extract" && (
        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <label
            htmlFor="extract-pages"
            className="block font-bold text-slate-900"
          >
            Enter page numbers
          </label>

          <p className="mt-2 text-sm text-slate-500">
            Separate page numbers with commas.
          </p>

          <input
            id="extract-pages"
            type="text"
            value={pages}
            onChange={(event) => {
              setPages(event.target.value);
              setResult(null);
              setMessage("");
            }}
            disabled={busy}
            placeholder="Example: 1, 3, 5"
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
        </div>
      )}

      {file && mode === "ranges" && (
        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <label
            htmlFor="split-ranges"
            className="block font-bold text-slate-900"
          >
            Enter page ranges
          </label>

          <p className="mt-2 text-sm text-slate-500">
            Each range creates a separate PDF file.
          </p>

          <input
            id="split-ranges"
            type="text"
            value={ranges}
            onChange={(event) => {
              setRanges(event.target.value);
              setResult(null);
              setMessage("");
            }}
            disabled={busy}
            placeholder="Example: 1-5, 6-10"
            className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
          />
        </div>
      )}

      {file && mode === "every_page" && (
        <div className="mt-7 rounded-2xl border border-purple-200 bg-purple-50 p-5">
          <div className="flex items-start gap-3">
            <Files size={26} className="shrink-0 text-purple-600" />

            <div>
              <p className="font-bold text-slate-900">
                Split every page into a separate PDF
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Every page will be saved as an individual PDF.
                All resulting PDFs will be packaged into one ZIP
                download. A maximum of 100 output PDFs is supported.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Split button */}

      {file && !result && (
        <button
          type="button"
          disabled={busy}
          onClick={splitPdf}
          className="mx-auto mt-9 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl bg-green-600 px-6 py-4 text-lg font-black text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {busy ? (
            <>
              <RefreshCw size={22} className="animate-spin" />
              Splitting PDF...
            </>
          ) : (
            <>
              <Scissors size={22} />
              Split PDF
            </>
          )}
        </button>
      )}

      {/* Status */}

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
              PDF Split Successfully
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {selectedOption?.title}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                Original PDF Size
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {formatSize(result.originalSize)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">
                ZIP Download Size
              </p>

              <p className="mt-2 text-2xl font-black text-green-700">
                {formatSize(result.blob.size)}
              </p>
            </div>
          </div>

          <p className="mt-5 rounded-xl bg-green-100 p-4 text-center text-sm font-medium text-green-800">
            Your split PDF files are ready inside the ZIP archive.
          </p>

          <button
            type="button"
            onClick={downloadZip}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-5 py-4 text-lg font-black text-white shadow-md hover:bg-green-700"
          >
            <Download size={22} />
            Download Split PDFs (ZIP)
          </button>

          <button
            type="button"
            onClick={resetTool}
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} className="mr-2 inline" />
            Split Another PDF
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
              Quick page extraction.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Files size={27} className="shrink-0 text-green-600" />
          <div>
            <p className="font-bold text-slate-900">ZIP Download</p>
            <p className="text-xs text-slate-500">
              All output files together.
            </p>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-5 text-slate-400">
        Maximum upload size: 100 MB. A maximum of 100 output PDFs
        is supported. Password-protected PDFs are not supported.
      </p>
    </div>
  );
}
