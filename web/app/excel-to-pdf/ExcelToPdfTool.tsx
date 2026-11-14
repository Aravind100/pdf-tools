
"use client";

import { useRef, useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  X,
  Download,
  CheckCircle2,
  Loader2,
  FileText,
  ShieldCheck,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL || "http://localhost:8000";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function ExcelToPdfTool() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [success, setSuccess] = useState(false);

  function selectFile(selected?: File) {
    if (!selected) return;

    setError("");
    setSuccess(false);

    if (!/\.(xlsx|xls)$/i.test(selected.name)) {
      setError("Please select an Excel file (.xlsx or .xls).");
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 100 MB.");
      return;
    }

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl("");
    }

    setFile(selected);
  }

  function removeFile() {
    setFile(null);
    setError("");
    setSuccess(false);

    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl("");
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function convertToPdf() {
    if (!file) {
      setError("Please select an Excel file first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API}/convert/excel-to-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Excel conversion failed. Please try again.";

        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // Keep the default error.
        }

        throw new Error(message);
      }

      const blob = await response.blob();

      if (blob.size === 0 || blob.type !== "application/pdf") {
        throw new Error("The server returned an invalid PDF file.");
      }

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-7 flex items-center gap-3">
        <div className="rounded-2xl bg-green-50 p-3 text-green-700">
          <FileSpreadsheet size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Excel to PDF Converter
          </h2>
          <p className="text-sm text-slate-500">
            Convert Excel spreadsheets into PDF documents.
          </p>
        </div>
      </div>

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            selectFile(event.dataTransfer.files?.[0]);
          }}
          className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-green-200 bg-green-50/40 px-4 text-center transition hover:border-green-400 hover:bg-green-50"
        >
          <Upload size={38} className="mb-3 text-green-700" />
          <span className="font-semibold text-slate-800">
            Choose Excel file or drag it here
          </span>
          <span className="mt-2 text-sm text-slate-500">
            Supports XLSX and XLS · Maximum 100 MB
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileSpreadsheet
              size={32}
              className="shrink-0 text-green-700"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">
                {file.name}
              </p>
              <p className="text-sm text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            aria-label="Remove Excel file"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && downloadUrl && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 font-semibold text-green-800">
            <CheckCircle2 size={21} />
            Excel converted successfully!
          </div>
          <a
            href={downloadUrl}
            download="excel-converted.pdf"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            <Download size={19} />
            Download PDF
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={convertToPdf}
        disabled={!file || loading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Converting Excel to PDF...
          </>
        ) : (
          <>
            <FileText size={20} />
            Convert Excel to PDF
          </>
        )}
      </button>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <ShieldCheck
          className="mt-0.5 shrink-0 text-green-600"
          size={21}
        />
        <p className="text-xs leading-5 text-slate-600">
          Convert Excel workbooks into PDF files using LibreOffice Calc.
          Multiple worksheets can be included in the resulting document.
          Spreadsheet print settings may affect page layout.
        </p>
      </div>
    </section>
  );
}
