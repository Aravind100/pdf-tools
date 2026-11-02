
"use client";

import { useRef, useState } from "react";
import { FileLock, FileText, ShieldCheck, Upload, X, Eye, EyeOff, Download } from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL || "http://localhost:8000";

const MAX_FILE_SIZE = 100 * 1024 * 1024;

export default function ProtectPdfTool() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  function selectFile(selectedFile?: File) {
    if (!selectedFile) return;

    setError("");
    setSuccess(false);
    setDownloadUrl("");

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must not exceed 100 MB.");
      return;
    }

    setFile(selectedFile);
  }

  function removeFile() {
    setFile(null);
    setError("");
    setSuccess(false);
    setDownloadUrl("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function protectPdf() {
    setError("");
    setSuccess(false);

    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password.length > 128) {
      setError("Password must not exceed 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const response = await fetch(`${API}/convert/protect-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let message = "Unable to protect PDF. Please try again.";

        try {
          const data = await response.json();
          message = data.detail || message;
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
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
        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600">
          <FileLock size={27} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Protect Your PDF
          </h2>
          <p className="text-sm text-slate-500">
            Add a password to secure your PDF document.
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
          className="flex min-h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-4 text-center transition hover:border-blue-400 hover:bg-blue-50"
        >
          <Upload size={36} className="mb-3 text-blue-600" />
          <span className="font-semibold text-slate-800">
            Choose PDF file or drag it here
          </span>
          <span className="mt-2 text-sm text-slate-500">
            PDF files only · Maximum 100 MB
          </span>
        </button>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="shrink-0 text-red-500" size={30} />
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
            aria-label="Remove PDF"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />

      <div className="mt-7 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Create Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password (minimum 6 characters)"
              maxLength={128}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter your password"
            maxLength={128}
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && downloadUrl && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 font-semibold text-green-800">
            <ShieldCheck size={21} />
            PDF protected successfully!
          </div>
          <a
            href={downloadUrl}
            download="protected.pdf"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
          >
            <Download size={19} />
            Download Protected PDF
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={protectPdf}
        disabled={!file || loading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileLock size={20} />
        {loading ? "Protecting PDF..." : "Protect PDF"}
      </button>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-green-600" size={21} />
        <p className="text-xs leading-5 text-slate-600">
          Your PDF is encrypted with AES-256 password protection. Your
          password is used to process the file and is not stored by this
          endpoint. Keep your password safe because it cannot be recovered
          if lost.
        </p>
      </div>
    </section>
  );
}
