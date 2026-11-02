
"use client";

import { useRef, useState } from "react";
import { UploadCloud, FileText, Download, RefreshCw } from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL ||
  "http://localhost:8000";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
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
    setMessage("Uploading and optimizing your PDF...");

    try {
      const form = new FormData();
      form.append("file", file);

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
          data.detail || "PDF compression failed. Please try again."
        );
      }

      const blob = await response.blob();

      if (blob.size === 0) {
        throw new Error("The compression service returned an empty file.");
      }

      setResult({
        blob,
        originalSize: file.size,
        compressedSize: blob.size,
      });

      const difference = file.size - blob.size;

      if (difference > 0) {
        const percentage = (difference / file.size) * 100;
        setMessage(
          `Success! Your PDF is ${percentage.toFixed(1)}% smaller.`
        );
      } else if (difference === 0) {
        setMessage("PDF processed successfully. File size is unchanged.");
      } else {
        setMessage(
          "PDF processed successfully, but the optimized file is slightly larger. No size reduction was achieved."
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

    URL.revokeObjectURL(url);
  }

  function resetTool() {
    setFile(null);
    setResult(null);
    setMessage("");

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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <FileText size={30} />
        </div>

        <h2 className="mt-4 text-2xl font-black">
          Compress PDF File
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Optimize your PDF file and download the processed document.
        </p>
      </div>

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

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="mt-7 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-red-400 hover:bg-red-50/30 disabled:opacity-50"
      >
        <UploadCloud size={38} className="text-red-600" />

        <span className="mt-3 font-bold">
          Choose PDF file
        </span>

        <span className="mt-1 text-sm text-slate-500">
          Select one PDF from your device (maximum 100 MB)
        </span>
      </button>

      {file && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-slate-200 p-4">
          <FileText size={28} className="shrink-0 text-red-600" />

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              Original size: {formatSize(file.size)}
            </p>
          </div>

          <button
            type="button"
            onClick={resetTool}
            disabled={busy}
            className="text-sm font-semibold text-red-600"
          >
            Remove
          </button>
        </div>
      )}

      <button
        type="button"
        disabled={busy || !file}
        onClick={compressPdf}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {busy ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            Processing PDF...
          </>
        ) : (
          <>
            <FileText size={18} />
            Compress PDF
          </>
        )}
      </button>

      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700"
        >
          {message}
        </p>
      )}

      {result && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="font-black">Compression Results</h3>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">Original size</p>
              <p className="mt-1 font-bold">
                {formatSize(result.originalSize)}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3">
              <p className="text-xs text-slate-500">Processed size</p>
              <p className="mt-1 font-bold">
                {formatSize(result.compressedSize)}
              </p>
            </div>
          </div>

          {savedBytes > 0 && (
            <p className="mt-4 text-sm font-bold text-green-700">
              Space saved: {formatSize(savedBytes)} (
              {savedPercentage.toFixed(1)}%)
            </p>
          )}

          <button
            type="button"
            onClick={downloadPdf}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
          >
            <Download size={18} />
            Download Compressed PDF
          </button>

          <button
            type="button"
            onClick={resetTool}
            className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-white"
          >
            Compress Another PDF
          </button>
        </div>
      )}

      <p className="mt-5 text-center text-xs leading-5 text-slate-500">
        Maximum upload size: 100 MB. This tool performs lossless
        content-stream optimization. Image quality is not deliberately reduced.
        Password-protected PDFs are not supported.
      </p>
    </div>
  );
}
