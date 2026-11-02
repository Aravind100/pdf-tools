
import type { Metadata } from "next";
import Link from "next/link";
import SplitPdfTool from "./SplitPdfTool";

export const metadata: Metadata = {
  title: "Split PDF Online Free – Extract Pages & Split PDF Files",
  description:
    "Split PDF files online for free. Extract selected pages, split PDFs by page ranges, or separate every page into individual PDF files. Download results in a ZIP file.",
  alternates: {
    canonical: "https://your-pdf-tools.vercel.app/split-pdf",
  },
  openGraph: {
    title: "Split PDF Online Free | Your PDF Tools",
    description:
      "Easily extract PDF pages or split a PDF into multiple files online.",
    url: "https://your-pdf-tools.vercel.app/split-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

const faqs = [
  {
    question: "How can I split a PDF online?",
    answer:
      "Upload your PDF, select your preferred splitting method, and process the file. Your resulting PDF files will be provided in a ZIP download.",
  },
  {
    question: "Can I extract selected pages from a PDF?",
    answer:
      "Yes. Choose the extract pages option and enter the page numbers you want, separated by commas.",
  },
  {
    question: "Can I split a PDF using page ranges?",
    answer:
      "Yes. Enter page numbers or ranges separated by commas. For example, 1-3,4-6,7-10.",
  },
  {
    question: "Can I split every page into a separate PDF?",
    answer:
      "Yes. Select the split every page option. Each page will be saved as an individual PDF inside a ZIP file.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "The maximum supported upload size is 100 MB. The tool supports up to 100 output PDF files per request.",
  },
  {
    question: "Can I split password-protected PDFs?",
    answer:
      "Password-protected or encrypted PDFs are not currently supported.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function SplitPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">Split PDF</span>
        </nav>

        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Split PDF Online – Extract PDF Pages Easily
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Separate your PDF documents in seconds. Extract selected pages,
            split by page ranges, or turn every page into an individual PDF.
            Simple, fast and free to use.
          </p>
        </section>

        <SplitPdfTool />

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900">
            How to Split a PDF Online
          </h2>
          <ol className="mt-5 list-decimal space-y-3 pl-6 text-slate-600">
            <li>Upload the PDF file you want to split.</li>
            <li>
              Choose whether to extract selected pages, split by page ranges,
              or separate every page.
            </li>
            <li>
              Enter the required page numbers or ranges, if applicable.
            </li>
            <li>Click the split button to process your PDF.</li>
            <li>Download your resulting PDF files in a ZIP folder.</li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-5 space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-slate-200 pb-5"
              >
                <h3 className="font-semibold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 leading-7 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Explore More PDF Tools
          </h2>
          <p className="mt-2 text-slate-600">
            Explore other useful tools from Your PDF Tools.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium">
            <Link href="/merge-pdf" className="text-blue-600 hover:underline">
              Merge PDF
            </Link>
            <Link href="/compress-pdf" className="text-blue-600 hover:underline">
              Compress PDF
            </Link>
            <Link href="/edit-pdf" className="text-blue-600 hover:underline">
              Edit PDF
            </Link>
            <Link href="/word-to-pdf" className="text-blue-600 hover:underline">
              Word to PDF
            </Link>
            <Link href="/jpg-to-pdf" className="text-blue-600 hover:underline">
              JPG to PDF
            </Link>
            <Link href="/png-to-pdf" className="text-blue-600 hover:underline">
              PNG to PDF
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
