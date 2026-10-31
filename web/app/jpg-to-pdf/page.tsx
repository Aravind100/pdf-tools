
import type { Metadata } from "next";
import ImagesToPdfTool from "../images-to-pdf/ImagesToPdfTool";

export const metadata: Metadata = {
  title: "JPG to PDF Converter Free Online",
  description:
    "Convert JPG and JPEG images to PDF online for free. Upload multiple photos, arrange their order and combine them into one PDF document.",
  alternates: {
    canonical: "/jpg-to-pdf",
  },
  openGraph: {
    title: "JPG to PDF Converter | Your PDF Tools",
    description:
      "Convert JPG photos into a PDF online. Combine multiple images, arrange pages and download one PDF.",
    url: "https://your-pdf-tools.vercel.app/jpg-to-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

export default function JpgToPdfPage() {
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
            Free Online JPG Converter
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            Convert JPG to PDF Online for Free
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Convert your JPG and JPEG photos into PDF documents in a few
            simple steps. Upload one or multiple images, preview your
            photos, arrange their order and download a combined PDF.
          </p>
        </div>
      </section>

      <ImagesToPdfTool />

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="text-2xl font-black text-slate-900">
          How to Convert JPG to PDF
        </h2>

        <ol className="mt-5 list-decimal space-y-3 pl-6 leading-7 text-slate-600">
          <li>Select one or multiple JPG or JPEG images.</li>
          <li>Preview your selected photos.</li>
          <li>Arrange the images in your preferred order.</li>
          <li>Click Convert to PDF.</li>
          <li>Download your combined PDF document.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          JPG to PDF Converter Features
        </h2>

        <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600">
          <li>Convert JPG and JPEG images into PDF pages.</li>
          <li>Combine multiple photos into one PDF document.</li>
          <li>Arrange, preview and remove images before conversion.</li>
          <li>Support for portrait and landscape photos.</li>
          <li>One image per PDF page.</li>
          <li>No account required for basic conversion.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-bold">
              How can I convert JPG to PDF online?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Upload your JPG images, arrange their order and click
              Convert to PDF. Your PDF will be downloaded to your device.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Can I convert multiple JPG images into one PDF?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. You can select multiple JPG images and combine them
              into one PDF document.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Can I change the order of JPG images?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Use the up and down controls to arrange your images
              before conversion.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Does the converter support landscape and portrait photos?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Both orientations can be included in the same PDF.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Is the JPG to PDF converter free?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Basic JPG to PDF conversion is available without creating
              an account.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Explore More PDF Tools</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-red-600">
            <a href="/">All PDF Tools</a>
            <a href="/images-to-pdf">Multiple Images to PDF</a>
            <a href="/png-to-pdf">PNG to PDF</a>
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
