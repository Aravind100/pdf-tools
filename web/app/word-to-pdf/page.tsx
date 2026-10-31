
import type { Metadata } from "next";
import WordToPdfTool from "./WordToPdfTool";

export const metadata: Metadata = {
  title: "Word to PDF Converter Free Online | DOCX to PDF",
  description:
    "Convert Word DOCX documents to PDF online. Upload your Word file and download a PDF while preserving document formatting.",
  alternates: {
    canonical: "/word-to-pdf",
  },
  openGraph: {
    title: "Word to PDF Converter | Your PDF Tools",
    description:
      "Convert Word DOCX documents into PDF files online with our easy-to-use converter.",
    url: "https://your-pdf-tools.vercel.app/word-to-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

export default function WordToPdfPage() {
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
            Free Online Word Converter
          </p>

          <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 sm:text-5xl">
            Convert Word to PDF Online
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600">
            Convert Microsoft Word DOCX documents into PDF files online.
            Upload your Word document and download a PDF that retains
            your document's layout and formatting as closely as possible.
          </p>
        </div>
      </section>

      <WordToPdfTool />

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="text-2xl font-black text-slate-900">
          How to Convert Word to PDF
        </h2>

        <ol className="mt-5 list-decimal space-y-3 pl-6 leading-7 text-slate-600">
          <li>Select your Word DOCX document.</li>
          <li>Upload the document to the converter.</li>
          <li>Click Convert to PDF.</li>
          <li>Wait for the conversion to complete.</li>
          <li>Download your converted PDF document.</li>
        </ol>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          Word to PDF Converter Features
        </h2>

        <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600">
          <li>Convert DOCX Word documents into PDF.</li>
          <li>Simple online document conversion.</li>
          <li>Supports documents containing Gujarati Unicode text.</li>
          <li>Temporary server-side processing.</li>
          <li>No account required for basic conversion.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-black text-slate-900">
          Frequently Asked Questions
        </h2>

        <div className="mt-5 space-y-5">
          <div>
            <h3 className="font-bold">
              How can I convert Word to PDF online?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Upload your DOCX document, click Convert to PDF and
              download the converted document.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Which Word file format is supported?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              This converter currently supports Microsoft Word DOCX files.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Can I convert Gujarati Word documents to PDF?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              Yes. The conversion service has been configured with
              Gujarati font compatibility. Results can depend on the
              fonts and formatting used in the original document.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Will my Word document formatting be preserved?
            </h3>
            <p className="mt-2 leading-7 text-slate-600">
              The converter uses LibreOffice to convert documents.
              Complex layouts and fonts should be checked after conversion.
            </p>
          </div>

          <div>
            <h3 className="font-bold">
              Is Word to PDF conversion free?
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
            <a href="/png-to-pdf">PNG to PDF</a>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Your PDF Tools. All rights reserved.
      </footer>
    </main>
  );
}
