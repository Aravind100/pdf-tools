
"use client";

import { useRef, useState } from "react";
import { FileText, UploadCloud, Download } from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL || "http://localhost:8000";

const MAX_SIZE = 100 * 1024 * 1024;

export default function WordToPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function convert() {
    if (!file || busy) return;

    setBusy(true);
    setMessage("Uploading and converting your Word document...");

    try {
      const form = new FormData();
      form.append("file", file);

      const response = await fetch(`${API}/convert/docx-to-pdf`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "Conversion failed. Please try again."
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${file.name.replace(/\.docx$/i, "")}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setMessage("Success! Your PDF download has started.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  }

  function selectFile(selected: File | undefined) {
    setMessage("");

    if (!selected) {
      setFile(null);
      return;
    }

    if (!selected.name.toLowerCase().endsWith(".docx")) {
      setFile(null);
      setMessage("Please select a DOCX Word document.");
      return;
    }

    if (selected.size > MAX_SIZE) {
      setFile(null);
      setMessage("The maximum document size is 100 MB.");
      return;
    }

    setFile(selected);
  }

  return (
    <section className="mx-auto max-w-3xl px-5 pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex items-center gap-3">
          <FileText className="text-red-600" size={30}/>
          <div>
            <h2 className="text-xl font-black">Word to PDF Converter</h2>
            <p className="text-sm text-slate-500">
              Upload your DOCX document.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".docx"
          className="hidden"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center hover:border-red-400 hover:bg-red-50/30"
        >
          <UploadCloud size={42} className="text-red-600"/>
          <span className="mt-3 font-bold">
            Choose Word document
          </span>
          <span className="mt-2 text-sm text-slate-500">
            DOCX format supported
          </span>
        </button>

        {file && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 p-4">
            <FileText className="text-red-600" size={26}/>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{file.name}</p>
              <p className="text-xs text-slate-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setMessage("");
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="text-sm font-semibold text-red-600"
            >
              Remove
            </button>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Maximum upload size: 100 MB. DOCX files only.
        </p>

        <button
          type="button"
          disabled={!file || busy}
          onClick={convert}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Download size={18}/>
          {busy ? "Converting..." : "Convert Word to PDF"}
        </button>

        {message && (
          <p role="status" className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
