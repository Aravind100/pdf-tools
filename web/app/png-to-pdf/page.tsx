
import type { Metadata } from "next";
import ImagesToPdfTool from "../images-to-pdf/ImagesToPdfTool";

export const metadata: Metadata = {
  title: "PNG to PDF Converter Free Online",
  description:
    "Convert PNG images to PDF online for free. Combine multiple PNG images into one PDF, arrange pages and download your document.",
  alternates: {
    canonical: "/png-to-pdf",
  },
  openGraph: {
    title: "PNG to PDF Converter | Your PDF Tools",
    description:
      "Convert PNG images into PDF documents online. Combine multiple images and arrange their page order.",
    url: "https://your-pdf-tools.vercel.app/png-to-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

export default function PngToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-2xl font-black">
            PDF <span className="text-red-600">Tools</span>
          </a>
          <a href="/" className="text-sm font-semibold text-red-600">
            All PDF Tools →
          </a>
        </div>
      </header>

      <section className="px-5 py-12 text-center sm:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="font-bold uppercase tracking-widest text-red-600">
            Free Online PNG Converter
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            Convert PNG to PDF Online for Free
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Convert PNG images into PDF documents easily. Upload one or
            multiple PNG files, arrange their order and download a
            combined PDF. Each image becomes a separate PDF page.
          </p>
        </div>
      </section>

      <ImagesToPdfTool />

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="text-2xl font-black text-slate-900">
          How to Convert PNG to PDF
        </h2>

        <ol className="mt-5 list-decimal space-y-3 pl-6 leading-7 text-slate-600">
          <li>Select one or multiple PNG images from your device.</li>
          <li>Preview your selected images.</li>
          <li>Arrange their order before conversion.</li>
          <li>Click Convert to PDF.</li>
          <li>Download your combined PDF document.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          PNG to PDF Converter Features
        </h2>

        <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600">
          <li>Convert PNG images into PDF pages.</li>
          <li>Combine multiple PNG images into one PDF.</li>
          <li>Preview, remove and reorder images.</li>
          <li>Support for portrait and landscape images.</li>
          <li>Transparent PNG backgrounds are placed on white backgrounds.</li>
          <li>No account required for basic conversion.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-bold">
              How do I convert PNG to PDF?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Upload your PNG image, arrange its position if required,
              and click Convert to PDF to download the result.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Can I combine multiple PNG images into one PDF?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Select multiple PNG images and combine them into
              a single PDF document.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Does PNG transparency remain in the PDF?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Transparent areas are placed on a white background
              during conversion.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Can I arrange the PNG image order?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Use the up and down controls before converting.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Is PNG to PDF conversion free?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Basic conversion is available without creating an account.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Explore More PDF Tools</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-red-600">
            <a href="/">All PDF Tools</a>
            <a href="/images-to-pdf">Multiple Images to PDF</a>
            <a href="/jpg-to-pdf">JPG to PDF</a>
            <a href="/word-to-pdf">Word to PDF</a>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Your PDF Tools. All rights reserved.
      </footer>
    </main>
  );
}
