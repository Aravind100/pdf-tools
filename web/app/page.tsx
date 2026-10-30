
"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText, FileImage, FilePenLine, Files, Scissors, FileDown, ShieldCheck,
  Image as ImageIcon, Menu, X, UploadCloud, ArrowRight, CheckCircle2,
  Trash2, ArrowUp, ArrowDown
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_CONVERTER_API_URL || "http://localhost:8000";

const tools = [
  { title: "Word to PDF", desc: "Convert DOCX documents into PDF files.", icon: FileText, kind: "docx", color: "red" },
  { title: "JPG to PDF", desc: "Convert one or multiple JPG images into one PDF.", icon: FileImage, kind: "image", color: "blue" },
  { title: "PNG to PDF", desc: "Convert one or multiple PNG images into one PDF.", icon: ImageIcon, kind: "image", color: "green" },
  { title: "Edit PDF", desc: "Edit document content and annotations.", icon: FilePenLine, kind: "editor", color: "purple" },
  { title: "Merge PDF", desc: "Combine multiple PDF documents.", icon: Files, kind: "planned", color: "orange" },
  { title: "Split PDF", desc: "Extract pages or split a document.", icon: Scissors, kind: "planned", color: "teal" },
  { title: "Compress PDF", desc: "Reduce PDF file size.", icon: FileDown, kind: "planned", color: "pink" },
  { title: "Protect PDF", desc: "Add password protection to PDFs.", icon: ShieldCheck, kind: "planned", color: "indigo" },
];

type ImagePreview = {
  file: File;
  url: string;
};

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<(typeof tools)[number] | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previews = images.map((image) => ({
      file: image,
      url: URL.createObjectURL(image),
    }));

    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [images]);

  async function convert() {
    if (!selected) return;

    if (selected.kind === "docx" && !file) return;
    if (selected.kind === "image" && images.length === 0) return;

    if (selected.kind === "planned" || selected.kind === "editor") {
      setMessage("This tool is planned for a future development phase.");
      return;
    }

    setBusy(true);
    setMessage("Uploading and converting your files…");

    try {
      const form = new FormData();
      let endpoint = "";
      let downloadName = "";

      if (selected.kind === "docx" && file) {
        form.append("file", file);
        endpoint = "/convert/docx-to-pdf";
        downloadName = `${file.name.replace(/\.[^.]+$/, "")}.pdf`;
      } else {
        images.forEach((image) => {
          form.append("files", image);
        });

        endpoint = "/convert/images-to-pdf";
        downloadName = "combined-images.pdf";
      }

      const response = await fetch(`${API}${endpoint}`, {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "Conversion failed. Please check your files and try again."
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setMessage("Conversion complete. Your PDF download has started.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function chooseTool(tool: (typeof tools)[number]) {
    setSelected(tool);
    setFile(null);
    setImages([]);
    setMessage("");

    if (tool.kind === "planned" || tool.kind === "editor") return;

    setTimeout(() => inputRef.current?.click(), 0);
  }

  function addImages(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    const allowed = newFiles.filter((item) =>
      [".jpg", ".jpeg", ".png"].includes(
        item.name.substring(item.name.lastIndexOf(".")).toLowerCase()
      )
    );

    if (allowed.length !== newFiles.length) {
      setMessage("Only JPG, JPEG and PNG images are supported.");
    } else {
      setMessage("");
    }

    setImages((previous) => {
      const combined = [...previous, ...allowed];

      if (combined.length > 30) {
        setMessage("You can upload a maximum of 30 images.");
        return combined.slice(0, 30);
      }

      const totalSize = combined.reduce((sum, item) => sum + item.size, 0);

      if (totalSize > 25 * 1024 * 1024) {
        setMessage("Total image size must not exceed 25 MB.");
        return previous;
      }

      return combined;
    });

    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(index: number) {
    setImages((previous) => previous.filter((_, i) => i !== index));
    setMessage("");
  }

  function moveImage(index: number, direction: number) {
    setImages((previous) => {
      const updated = [...previous];
      const target = index + direction;

      if (target < 0 || target >= updated.length) return previous;

      [updated[index], updated[target]] = [
        updated[target],
        updated[index],
      ];

      return updated;
    });
  }

  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#" className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-600 text-white">
              <FileText size={21}/>
            </span>
            PDF <span className="text-red-600">Tools</span>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <a href="#tools" className="hover:text-red-600">All PDF Tools</a>
            <a href="#how" className="hover:text-red-600">How it works</a>
            <a href="#privacy" className="hover:text-red-600">Privacy</a>
          </nav>

          <button className="md:hidden" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X/> : <Menu/>}
          </button>
        </div>

        {mobileOpen && (
          <nav className="grid gap-3 border-t px-5 py-4 text-sm md:hidden">
            <a onClick={() => setMobileOpen(false)} href="#tools">All PDF Tools</a>
            <a onClick={() => setMobileOpen(false)} href="#how">How it works</a>
            <a onClick={() => setMobileOpen(false)} href="#privacy">Privacy</a>
          </nav>
        )}
      </header>

      <section className="bg-white px-5 pb-14 pt-16 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-700">
            <CheckCircle2 size={14}/> Simple. Powerful. Online.
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl">
            All your PDF tools.<br/>
            <span className="text-red-600">One simple place.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
            Convert, edit and manage your documents with an easy online workspace.
            No account required for basic conversions.
          </p>

          <a href="#tools" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-red-200 transition hover:bg-red-700">
            Explore PDF Tools <ArrowRight size={18}/>
          </a>
        </div>
      </section>

      <section id="tools" className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">Our workspace</p>
            <h2 className="mt-2 text-3xl font-black">Choose a PDF tool</h2>
            <p className="mt-2 text-slate-500">Select a tool to get started.</p>
          </div>
          <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
            No daily conversion quota planned
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <button
                key={tool.title}
                onClick={() => chooseTool(tool)}
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-xl bg-${tool.color}-50 text-${tool.color}-600`}>
                  <Icon size={25}/>
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{tool.title}</h3>
                <p className="mt-2 min-h-10 text-sm leading-5 text-slate-500">{tool.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-red-600">
                  Open tool <ArrowRight size={15}/>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {selected && (
        <section className="mx-auto max-w-3xl px-5 pb-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-red-600">Selected tool</p>
                <h2 className="mt-1 text-2xl font-black">{selected.title}</h2>
              </div>

              <button
                onClick={() => {
                  setSelected(null);
                  setFile(null);
                  setImages([]);
                  setMessage("");
                }}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close"
              >
                <X/>
              </button>
            </div>

            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={selected.kind === "docx" ? ".docx" : selected.kind === "image" ? ".jpg,.jpeg,.png" : ".pdf"}
              multiple={selected.kind === "image"}
              onChange={(e) => {
                if (selected.kind === "image") {
                  addImages(e.target.files);
                } else {
                  setFile(e.target.files?.[0] || null);
                  setMessage("");
                }
              }}
            />

            {(selected.kind === "docx" || selected.kind === "image") ? (
              <>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="mt-6 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center hover:border-red-400 hover:bg-red-50/30"
                >
                  <UploadCloud size={38} className="text-red-600"/>

                  <span className="mt-3 font-bold">
                    {selected.kind === "image"
                      ? "Choose multiple images"
                      : file ? file.name : "Choose a Word document"}
                  </span>

                  <span className="mt-1 text-sm text-slate-500">
                    {selected.kind === "image"
                      ? "Select JPG or PNG images from your device"
                      : "or click to browse your device"}
                  </span>
                </button>

                {selected.kind === "image" && (
                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Selected images</h3>
                      <span className="text-sm text-slate-500">
                        {images.length} / 30 images
                      </span>
                    </div>

                    {imagePreviews.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={`${preview.file.name}-${index}`}
                            className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                          >
                            <img
                              src={preview.url}
                              alt={preview.file.name}
                              className="h-16 w-16 rounded-lg border object-contain"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold">
                                {preview.file.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(preview.file.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <p className="text-xs text-slate-500">
                                PDF page {index + 1}
                              </p>
                            </div>

                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                title="Move up"
                                disabled={index === 0}
                                onClick={() => moveImage(index, -1)}
                                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ArrowUp size={17}/>
                              </button>

                              <button
                                type="button"
                                title="Move down"
                                disabled={index === images.length - 1}
                                onClick={() => moveImage(index, 1)}
                                className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                              >
                                <ArrowDown size={17}/>
                              </button>
                            </div>

                            <button
                              type="button"
                              title="Remove image"
                              onClick={() => removeImage(index)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={18}/>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                        No images selected yet.
                      </p>
                    )}

                    <p className="mt-3 text-xs text-slate-500">
                      Maximum 30 images and 25 MB total. Each image will become a separate PDF page.
                    </p>
                  </div>
                )}

                <button
                  disabled={
                    busy ||
                    (selected.kind === "docx" ? !file : images.length === 0)
                  }
                  onClick={convert}
                  className="mt-5 w-full rounded-xl bg-red-600 px-5 py-3.5 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {busy
                    ? "Processing…"
                    : selected.kind === "image"
                    ? `Combine ${images.length} images into PDF`
                    : "Convert to PDF"}
                </button>
              </>
            ) : (
              <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                {selected.kind === "editor"
                  ? "The advanced PDF editor is planned for Phase 3. We will build text, image, font and layout editing with careful handling of document fidelity."
                  : "This tool will be added in a later development phase."}
              </p>
            )}

            {message && (
              <p role="status" className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
                {message}
              </p>
            )}
          </div>
        </section>
      )}

      <section id="how" className="border-y border-slate-200 bg-white px-5 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-black">Three simple steps</h2>

          <div className="mt-9 grid gap-8 text-center md:grid-cols-3">
            {[
              ["01", "Upload your files", "Choose a document or multiple images from your device."],
              ["02", "Let PDF Tools work", "The conversion service processes your files."],
              ["03", "Download your result", "Get your converted PDF file."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-600 text-lg font-black text-white">
                  {n}
                </span>
                <h3 className="mt-4 font-extrabold">{t}</h3>
                <p className="mt-2 text-sm text-slate-500">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="mx-auto max-w-5xl px-5 py-14 text-center">
        <ShieldCheck className="mx-auto text-green-600" size={36}/>
        <h2 className="mt-4 text-2xl font-black">Your documents deserve privacy</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          The production service will use temporary processing storage and automatic deletion.
          Avoid uploading sensitive documents until the production security controls have been configured and tested.
        </p>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} PDF Tools. All rights reserved.
      </footer>
    </main>
  );
}
