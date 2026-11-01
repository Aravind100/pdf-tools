
"use client";

import { useEffect, useRef, useState } from "react";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  degrees,
} from "pdf-lib";

type PdfPage = {
  id: string;
  rotation: number;
};

type TextItem = {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
};

type ImageItem = {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  data: string;
};

type DrawingItem = {
  id: string;
  page: number;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  type: "draw" | "highlight";
};

export default function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pages, setPages] = useState<PdfPage[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [textItems, setTextItems] = useState<TextItem[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [drawingItems, setDrawingItems] = useState<DrawingItem[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#ffff00");
  const [drawingWidth, setDrawingWidth] = useState(12);
  const [textValue, setTextValue] = useState("Your text");
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState("#111827");
  const [tool, setTool] = useState<
  "select" | "text" | "image" | "draw" | "highlight"
>("select");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [pageOrder, setPageOrder] = useState<number[]>([]);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<any>(null);

  useEffect(() => {
    if (!pdfBytes) return;

    let cancelled = false;

    async function renderPdf() {
      try {
        setLoading(true);

        const pdfjs = await import("pdfjs-dist");

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.4.299/build/pdf.worker.min.mjs";

        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(pdfBytes!.slice(0)),
        });

        const pdf = await loadingTask.promise;

        if (cancelled) return;

        pdfRef.current = pdf;

        const images: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.25 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvas,
            canvasContext: context,
            viewport,
          } as any).promise;

          images.push(canvas.toDataURL("image/png"));
        }

        if (!cancelled) {
          setPageImages(images);
          setPages(
            images.map((_, i) => ({
              id: `${Date.now()}-${i}`,
              rotation: 0,
            }))
          );
          setPageOrder(images.map((_, i) => i));
          setSelectedPage(0);
        }
      } catch (error) {
        console.error(error);
        setMessage("Unable to display this PDF. Please try another file.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    renderPdf();

    return () => {
      cancelled = true;
    };
  }, [pdfBytes]);

  function uploadPdf(selectedFile?: File) {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setMessage("Maximum PDF size is 100 MB.");
      return;
    }

    setFile(selectedFile);
    setPdfBytes(null);
    setPageImages([]);
    setTextItems([]);
    setImageItems([]);
    setPages([]);
    setMessage("");

    selectedFile.arrayBuffer().then(setPdfBytes);
  }

  function addText(event: React.MouseEvent<HTMLDivElement>) {
    if (tool !== "text") return;

    const rect = event.currentTarget.getBoundingClientRect();

    const x = Math.max(0, event.clientX - rect.left);
    const y = Math.max(0, event.clientY - rect.top);

    setTextItems((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        page: selectedPage,
        x,
        y,
        text: textValue,
        size: fontSize,
        color: textColor,
      },
    ]);

    setTool("select");
  }

  async function addImage(selectedFile?: File) {
    if (!selectedFile || !pageImages[selectedPage]) return;

    if (!selectedFile.type.startsWith("image/")) {
      setMessage("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();

      image.onload = () => {
        const maxWidth = 180;
        const ratio = image.width / image.height;

        setImageItems((items) => [
          ...items,
          {
            id: crypto.randomUUID(),
            page: selectedPage,
            x: 40,
            y: 40,
            width: Math.min(maxWidth, image.width),
            height: Math.min(maxWidth, image.width) / ratio,
            data: reader.result as string,
          },
        ]);
      };

      image.src = reader.result as string;
    };

    reader.readAsDataURL(selectedFile);
  }

  function rotatePage(index: number) {
    setPages((old) =>
      old.map((page, i) =>
        i === index
          ? { ...page, rotation: (page.rotation + 90) % 360 }
          : page
      )
    );
  }

  function startDrawing(event: React.PointerEvent<SVGSVGElement>) {
  if (tool !== "draw" && tool !== "highlight") return;

  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 650;
  const y = ((event.clientY - rect.top) / rect.height) * (pageHeight || 920);

  event.currentTarget.setPointerCapture(event.pointerId);
  setIsDrawing(true);

  setDrawingItems((items) => [
    ...items,
    {
      id: crypto.randomUUID(),
      page: selectedPage,
      points: [{ x, y }],
      color: drawingColor,
      width: drawingWidth,
      type: tool,
    },
  ]);
}

function continueDrawing(event: React.PointerEvent<SVGSVGElement>) {
  if (!isDrawing) return;

  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 650;
  const y = ((event.clientY - rect.top) / rect.height) * (pageHeight || 920);

  setDrawingItems((items) =>
    items.map((item, index) =>
      index === items.length - 1 && item.page === selectedPage
        ? { ...item, points: [...item.points, { x, y }] }
        : item
    )
  );
}

function stopDrawing() {
  setIsDrawing(false);
}

  function deletePage(index: number) {
    if (pages.length <= 1) {
      setMessage("A PDF must contain at least one page.");
      return;
    }

    setPages((old) => old.filter((_, i) => i !== index));
    setPageOrder((old) => old.filter((_, i) => i !== index));
    setTextItems((old) => old.filter((item) => item.page !== index));
    setImageItems((old) => old.filter((item) => item.page !== index));
    setSelectedPage(0);
  }

  function duplicatePage(index: number) {
    setPages((old) => {
      const copy = [...old];
      copy.splice(index + 1, 0, {
        ...old[index],
        id: crypto.randomUUID(),
      });
      return copy;
    });

    setPageOrder((old) => {
      const copy = [...old];
      copy.splice(index + 1, 0, old[index]);
      return copy;
    });
  }

  function movePage(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= pages.length) return;

    setPages((old) => {
      const copy = [...old];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });

    setPageOrder((old) => {
      const copy = [...old];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });

    setSelectedPage(target);
  }

  async function downloadPdf() {
    if (!pdfBytes || pages.length === 0) return;

    try {
      setLoading(true);
      setMessage("Preparing your PDF...");

      const original = await PDFDocument.load(pdfBytes);
      const output = await PDFDocument.create();

      const embeddedPages = await output.copyPages(
        original,
        original.getPageIndices()
      );

      const font = await output.embedFont(StandardFonts.Helvetica);

      for (let i = 0; i < pages.length; i++) {
        const originalIndex = pageOrder[i];
        const sourcePage = embeddedPages[originalIndex];

        const page = output.addPage(sourcePage);

        if (pages[i].rotation) {
          page.setRotation(degrees(pages[i].rotation));
        }

        const { width, height } = page.getSize();

        for (const item of textItems.filter((t) => t.page === i)) {
          const scale = 1 / 1.25;
          const x = item.x * scale;
          const y = height - item.y * scale;

          const hex = item.color.replace("#", "");
          const color = rgb(
            parseInt(hex.slice(0, 2), 16) / 255,
            parseInt(hex.slice(2, 4), 16) / 255,
            parseInt(hex.slice(4, 6), 16) / 255
          );

          page.drawText(item.text, {
            x,
            y,
            size: item.size,
            font,
            color,
          });
        }

        for (const item of imageItems.filter((img) => img.page === i)) {
          const imageBytes = await fetch(item.data).then((r) =>
            r.arrayBuffer()
          );

          const embedded = item.data.startsWith("data:image/png")
            ? await output.embedPng(imageBytes)
            : await output.embedJpg(imageBytes);

          const scale = 1 / 1.25;

          page.drawImage(embedded, {
            x: item.x * scale,
            y: height - (item.y + item.height) * scale,
            width: item.width * scale,
            height: item.height * scale,
          });
        }
      }

      const bytes = await output.save();

      const blob = new Blob([bytes as BlobPart], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = "edited-document.pdf";
      link.click();

      URL.revokeObjectURL(url);

      setMessage("PDF downloaded successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Could not save this PDF. Please try another file.");
    } finally {
      setLoading(false);
    }
  }

  const currentPageImage = pageImages[pageOrder[selectedPage]];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            PDF Editor
          </h1>
          <p className="text-xs text-slate-500">
            Your PDF Tools · Edit documents online
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Upload PDF
          </button>

          <button
            onClick={downloadPdf}
            disabled={!file || loading}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-40"
          >
            Download PDF
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => uploadPdf(e.target.files?.[0])}
        />
      </header>

      <div className="grid min-h-[calc(100vh-75px)] grid-cols-1 lg:grid-cols-[230px_1fr_280px]">
        <aside className="border-r bg-white p-4">
          <h2 className="mb-3 font-semibold">Pages</h2>

          {pages.length === 0 && (
            <p className="text-sm text-slate-500">
              Upload a PDF to see its pages.
            </p>
          )}

          <div className="space-y-3">
            {pages.map((page, index) => (
              <button
                key={page.id}
                onClick={() => setSelectedPage(index)}
                className={`w-full rounded-lg border p-2 text-left ${
                  selectedPage === index
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span>Page {index + 1}</span>
                  <span>{page.rotation}°</span>
                </div>

                {pageImages[pageOrder[index]] && (
                  <img
                    src={pageImages[pageOrder[index]]}
                    alt={`Page ${index + 1}`}
                    className="mt-2 max-h-32 w-full object-contain"
                  />
                )}
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 p-5">
          {!file && (
            <div className="flex min-h-[65vh] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="mb-4 text-5xl">📄</div>
              <h2 className="text-xl font-bold">
                Start editing your PDF
              </h2>
              <p className="my-3 max-w-md text-sm text-slate-500">
                Upload a PDF to add text, images and signatures,
                organize pages and download your edited document.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white"
              >
                Select PDF
              </button>
            </div>
          )}

          {loading && (
            <p className="mb-3 text-center text-sm text-blue-700">
              Processing PDF...
            </p>
          )}

          {currentPageImage && (
            <div className="flex justify-center overflow-auto">
              <div
                className="relative inline-block bg-white shadow-xl"
                style={{
                  maxWidth: "100%",
                  transform: `rotate(${pages[selectedPage]?.rotation || 0}deg)`,
                  transformOrigin: "center center",
                }}
                onClick={addText}
              >
                <img
                  src={currentPageImage}
                  alt={`PDF page ${selectedPage + 1}`}
                  className="block max-w-full"
                  style={{ width: "650px" }}
                />

                <svg
  className="pointer-events-none absolute inset-0 h-full w-full"
  viewBox={`0 0 650 ${pageHeight || 920}`}
  preserveAspectRatio="none"
>
  {drawingItems
    .filter((item) => item.page === selectedPage)
    .map((item) => (
      <polyline
        key={item.id}
        points={item.points.map((p) => `${p.x},${p.y}`).join(" ")}
        fill="none"
        stroke={item.color}
        strokeWidth={item.width}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={item.type === "highlight" ? 0.35 : 1}
      />
    ))}
</svg>

             {textItems
  .filter((item) => item.page === selectedPage)
  .map((item) => (
    <div
      key={item.id}
      onPointerDown={(event) => {
        if (tool !== "select") return;

        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        setSelectedTextId(item.id);
      }}
      onPointerMove={(event) => {
        if (
          tool !== "select" ||
          selectedTextId !== item.id ||
          event.buttons !== 1
        ) {
          return;
        }

        setTextItems((items) =>
          items.map((textItem) =>
            textItem.id === item.id
              ? {
                  ...textItem,
                  x: Math.max(0, textItem.x + event.movementX),
                  y: Math.max(0, textItem.y + event.movementY),
                }
              : textItem
          )
        );
      }}
      className={`absolute whitespace-pre-wrap ${
        tool === "select" ? "cursor-move" : "pointer-events-none"
      } ${
        selectedTextId === item.id
          ? "outline outline-2 outline-blue-500 outline-dashed"
          : ""
      }`}
      style={{
        left: item.x,
        top: item.y,
        fontSize: item.size,
        color: item.color,
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {item.text}

      {tool === "select" && selectedTextId === item.id && (
        <>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation();

              setTextItems((items) =>
                items.filter((textItem) => textItem.id !== item.id)
              );

              setSelectedTextId(null);
            }}
            className="absolute -right-3 -top-3 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
          >
            ×
          </button>

          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              event.stopPropagation();

              if (event.buttons !== 1) return;

              setTextItems((items) =>
                items.map((textItem) =>
                  textItem.id === item.id
                    ? {
                        ...textItem,
                        size: Math.max(
                          6,
                          Math.min(
                            100,
                            textItem.size + event.movementX * 0.3
                          )
                        ),
                      }
                    : textItem
                )
              );
            }}
            className="absolute -bottom-2 -right-2 h-4 w-4 cursor-se-resize rounded-full border-2 border-white bg-blue-600"
            aria-label="Resize text"
          />
        </>
      )}
    </div>
  ))}
                {imageItems
                  .filter((item) => item.page === selectedPage)
                  .map((item) => (
                    <img
                      key={item.id}
                      src={item.data}
                      alt="Inserted image or signature"
                      className="absolute"
                      style={{
                        left: item.x,
                        top: item.y,
                        width: item.width,
                        height: item.height,
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {message && (
            <p className="mt-4 rounded-lg bg-blue-50 p-3 text-center text-sm text-blue-800">
              {message}
            </p>
          )}
        </main>

        <aside className="border-l bg-white p-5">
          <h2 className="mb-4 font-semibold">Editing tools</h2>

          <div className="space-y-3">
            <button
              onClick={() => setTool("select")}
              className={`w-full rounded-lg border p-3 text-left ${
                tool === "select" ? "border-blue-600 bg-blue-50" : ""
              }`}
            >
              ↖ Select
            </button>

            <button
              onClick={() => setTool("text")}
              className={`w-full rounded-lg border p-3 text-left ${
                tool === "text" ? "border-blue-600 bg-blue-50" : ""
              }`}
            >
              T Add text
            </button>

            <label className="block text-sm font-medium">
              Text content
              <input
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </label>

            <label className="block text-sm font-medium">
              Font size
              <input
                type="number"
                min="8"
                max="80"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border p-2"
              />
            </label>

            <label className="block text-sm font-medium">
              Text colour
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="mt-1 h-10 w-full"
              />
            </label>

            <button
              onClick={() => imageInputRef.current?.click()}
              className="w-full rounded-lg border p-3 text-left hover:bg-slate-50"
            >
              🖼 Add image / signature
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => addImage(e.target.files?.[0])}
            />

            <hr />

            <h3 className="font-medium">Page management</h3>

            <button
              disabled={!file}
              onClick={() => rotatePage(selectedPage)}
              className="w-full rounded-lg border p-3 text-left disabled:opacity-40"
            >
              ↻ Rotate page
            </button>

            <button
              disabled={!file}
              onClick={() => duplicatePage(selectedPage)}
              className="w-full rounded-lg border p-3 text-left disabled:opacity-40"
            >
              ▣ Duplicate page
            </button>

            <button
              disabled={!file}
              onClick={() => movePage(selectedPage, -1)}
              className="w-full rounded-lg border p-3 text-left disabled:opacity-40"
            >
              ↑ Move page up
            </button>

            <button
              disabled={!file}
              onClick={() => movePage(selectedPage, 1)}
              className="w-full rounded-lg border p-3 text-left disabled:opacity-40"
            >
              ↓ Move page down
            </button>

            <button
              disabled={!file}
              onClick={() => deletePage(selectedPage)}
              className="w-full rounded-lg border border-red-200 p-3 text-left text-red-700 disabled:opacity-40"
            >
              🗑 Delete page
            </button>
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Tip: Select Add text, then click on the PDF page
            to place your text. Inserted images and signatures
            are placed near the top-left of the page.
          </p>
        </aside>
      </div>
    </div>
  );
}


