
import type { Metadata } from "next";
import ImagesToPdfTool from "./ImagesToPdfTool";



export const metadata: Metadata = {
  title: "Multiple Images to PDF Converter Free Online",
  description:
    "Convert multiple JPG and PNG images into one PDF online for free. Upload up to 100 images, arrange their order and download a single PDF.",
  alternates: {
    canonical: "/images-to-pdf",
  },
  openGraph: {
    title: "Multiple Images to PDF Converter | Your PDF Tools",
    description:
      "Combine multiple JPG and PNG images into one PDF. Arrange image order and download your PDF online.",
    url: "https://your-pdf-tools.vercel.app/images-to-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

export default function ImagesToPdfPage() {
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
            Free Online PDF Converter
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            Convert Multiple Images into One PDF Online
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Combine multiple JPG and PNG images into a single PDF document.
            Upload your pictures, arrange their order and download one PDF.
            Each image becomes a separate page, with portrait and landscape
            orientations supported.
          </p>
        </div>
      </section>

      <ImagesToPdfTool />

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="text-2xl font-black text-slate-900">
          How to Convert Multiple Images to PDF
        </h2>

        <ol className="mt-5 list-decimal space-y-3 pl-6 leading-7 text-slate-600">
          <li>Select multiple JPG, JPEG or PNG images from your device.</li>
          <li>Preview the images and arrange them in your preferred order.</li>
          <li>Remove any image you do not want in the PDF.</li>
          <li>Click the combine button to create your PDF document.</li>
          <li>Download your combined PDF file.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          Features of Our Multiple Images to PDF Converter
        </h2>

        <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600">
          <li>Combine multiple images into one PDF document.</li>
          <li>Supports JPG, JPEG and PNG image formats.</li>
          <li>Supports portrait and landscape images in the same PDF.</li>
          <li>Preview, remove and reorder images before conversion.</li>
          <li>One image per PDF page.</li>
          <li>No account required for basic conversion.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-bold text-slate-900">
              Can I combine multiple images into one PDF?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Select multiple supported images and our converter
              combines them into one PDF file, with each image on a separate page.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Can I mix portrait and landscape images?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Portrait and landscape images can be included in the same
              PDF while preserving their individual proportions.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Can I change the order of images?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. Use the up and down controls to arrange the images before
              creating your PDF.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Which image formats are supported?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              JPG, JPEG and PNG images are supported.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              Is this image-to-PDF converter free?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Basic conversion is available without creating an account.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">
            Explore More PDF Tools
          </h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-red-600">
            <a href="/#tools">All PDF Tools</a>
            <a href="/#tools">JPG to PDF</a>
            <a href="/#tools">PNG to PDF</a>
            <a href="/#tools">Word to PDF</a>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Your PDF Tools. All rights reserved.
      </footer>
    </main>
  );
}
