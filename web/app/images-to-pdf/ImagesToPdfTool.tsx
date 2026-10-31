
"use client";

import { useEffect, useRef, useState } from "react";
import {
  UploadCloud, Trash2, ArrowUp, ArrowDown, FileImage
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_CONVERTER_API_URL || "http://localhost:8000";

const MAX_IMAGES = 100;
const MAX_SIZE = 100 * 1024 * 1024;

export default function ImagesToPdfTool() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  function addImages(fileList: FileList | null) {
    if (!fileList) return;

    const selectedFiles = Array.from(fileList);
    const validFiles = selectedFiles.filter((file) =>
      [".jpg", ".jpeg", ".png"].includes(
        file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
      )
    );

    if (validFiles.length !== selectedFiles.length) {
      setMessage("Only JPG, JPEG and PNG images are supported.");
    } else {
      setMessage("");
    }

    setImages((previous) => {
      const combined = [...previous, ...validFiles];

      if (combined.length > MAX_IMAGES) {
        setMessage("Maximum 100 images allowed.");
        return combined.slice(0, MAX_IMAGES);
      }

      const totalSize = combined.reduce(
        (total, image) => total + image.size, 0
      );

      if (totalSize > MAX_SIZE) {
        setMessage("Total image size cannot exceed 100 MB.");
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

  async function convertImages() {
    if (!images.length || busy) return;

    setBusy(true);
    setMessage("Uploading images and creating your PDF...");

    try {
      const form = new FormData();

      images.forEach((image) => form.append("files", image));

      const response = await fetch(
        `${API}/convert/images-to-pdf`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.detail || "PDF conversion failed. Please try again."
        );
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "combined-images.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);

      setMessage("Success! Your combined PDF download has started.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-5 pb-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="flex items-center gap-3">
          <FileImage className="text-red-600" size={28}/>
          <div>
            <h2 className="text-xl font-black">Images to PDF Converter</h2>
            <p className="text-sm text-slate-500">
              Upload and combine your images.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          multiple
          className="hidden"
          onChange={(event) => addImages(event.target.files)}
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 flex w-full flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center hover:border-red-400 hover:bg-red-50/30"
        >
          <UploadCloud size={42} className="text-red-600"/>
          <span className="mt-3 font-bold">Choose multiple images</span>
          <span className="mt-2 text-sm text-slate-500">
            JPG, JPEG and PNG supported
          </span>
        </button>

        <div className="mt-5 flex justify-between text-sm">
          <span className="font-bold">Selected images</span>
          <span className="text-slate-500">
            {images.length} / {MAX_IMAGES}
          </span>
        </div>

        {previews.length > 0 ? (
          <div className="mt-3 space-y-3">
            {previews.map((preview, index) => (
              <div
                key={`${images[index].name}-${index}`}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
              >
                <img
                  src={preview}
                  alt={`Selected image ${index + 1}`}
                  className="h-16 w-16 rounded-lg border object-contain"
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {images[index].name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(images[index].size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  <p className="text-xs text-slate-500">
                    PDF page {index + 1}
                  </p>
                </div>

                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveImage(index, -1)}
                    className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move image up"
                  >
                    <ArrowUp size={17}/>
                  </button>

                  <button
                    type="button"
                    disabled={index === images.length - 1}
                    onClick={() => moveImage(index, 1)}
                    className="rounded p-1 hover:bg-slate-100 disabled:opacity-30"
                    aria-label="Move image down"
                  >
                    <ArrowDown size={17}/>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
            No images selected yet.
          </p>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Maximum 100 images and 100 MB total. Each image becomes one PDF page.
        </p>

        <button
          type="button"
          disabled={images.length === 0 || busy}
          onClick={convertImages}
          className="mt-5 w-full rounded-xl bg-red-600 px-5 py-4 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy ? "Creating PDF..." : `Convert ${images.length} Images to PDF`}
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
