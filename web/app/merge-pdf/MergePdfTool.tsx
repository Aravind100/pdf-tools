
"use client";

import { useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL ||
  "http://localhost:8000";

const MAX_FILES = 100;
const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

export default function MergePdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const incoming = Array.from(selectedFiles);
    const valid = incoming.filter(
      (file) => file.name.toLowerCase().endsWith(".pdf")
    );

    if (valid.length !== incoming.length) {
      setMessage("Only PDF files are supported.");
    } else {
      setMessage("");
    }

    setFiles((previous) => {
      const combined = [...previous, ...valid];

      if (combined.length > MAX_FILES) {
        setMessage(`You can upload a maximum of ${MAX_FILES} PDF files.`);
        return combined.slice(0, MAX_FILES);
      }

      const totalSize = combined.reduce(
        (sum, file) => sum + file.size,
        0
      );

      if (totalSize > MAX_TOTAL_BYTES) {
        setMessage("Total PDF size must not exceed 100 MB.");
        return previous;
      }

      return combined;
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeFile(index: number) {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
    setMessage("");
  }

  function moveFile(index: number, direction: number) {
    setFiles((previous) => {
      const updated = [...previous];
      const target = index + direction;

      if (target < 0 || target >= updated.length) {
        return previous;
      }

      [updated[index], updated[target]] = [
        updated[target],
        updated[index],
      ];

      return updated;
    });
  }

  async function mergeFiles() {
    if (files.length < 2) {
      setMessage("Please select at least two PDF files.");
      return;
    }

    setBusy(true);
    setMessage("Uploading and merging your PDF files...");

    try {
      const form = new FormData();

      files.forEach((file) => {
        form.append("files", file);
      });

      const response = await fetch(`${API}/convert/merge-pdf`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "PDF merging failed. Please try again."
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "merged.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setMessage("Success! Your merged PDF download has started.");
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

  const totalSize = files.reduce(
    (sum, file) => sum + file.size,
    0
  );

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600">
          <FileText size={30} />
        </div>

        <h2 className="mt-4 text-2xl font-black">
          Combine PDF Files
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Select at least two PDF files and arrange them in your preferred order.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={(event) => addFiles(event.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="mt-7 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center transition hover:border-red-400 hover:bg-red-50/30 disabled:opacity-50"
      >
        <UploadCloud size={38} className="text-red-600" />
        <span className="mt-3 font-bold">
          Choose PDF files
        </span>
        <span className="mt-1 text-sm text-slate-500">
          Select multiple PDF documents from your device
        </span>
      </button>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold">Selected PDF files</h3>
          <span className="text-sm text-slate-500">
            {files.length} / {MAX_FILES}
          </span>
        </div>

        {files.length > 0 ? (
          <div className="mt-3 space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-red-50 text-red-600">
                  <FileText size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                    {" · "}Position {index + 1}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    title="Move up"
                    disabled={busy || index === 0}
                    onClick={() => moveFile(index, -1)}
                    className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowUp size={17} />
                  </button>

                  <button
                    type="button"
                    title="Move down"
                    disabled={busy || index === files.length - 1}
                    onClick={() => moveFile(index, 1)}
                    className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <ArrowDown size={17} />
                  </button>
                </div>

                <button
                  type="button"
                  title="Remove file"
                  disabled={busy}
                  onClick={() => removeFile(index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
            No PDF files selected yet.
          </p>
        )}

        <p className="mt-3 text-xs text-slate-500">
          Maximum 100 PDF files and 100 MB total. Password-protected PDFs are not supported.
          Total selected: {(totalSize / (1024 * 1024)).toFixed(2)} MB.
        </p>
      </div>

      <button
        type="button"
        disabled={busy || files.length < 2}
        onClick={mergeFiles}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {busy ? (
          "Merging PDFs..."
        ) : (
          <>
            <Download size={18} />
            Merge {files.length} PDF Files
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
    </div>
  );
}
