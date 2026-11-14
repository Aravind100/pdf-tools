
import type { Metadata } from "next";
import Link from "next/link";
import ExcelToPdfTool from "./ExcelToPdfTool";

export const metadata: Metadata = {
  title: "Excel to PDF Converter Online Free – XLSX & XLS to PDF",
  description:
    "Convert Excel files to PDF online for free. Convert XLSX and XLS spreadsheets into PDF documents with multiple worksheets using Your PDF Tools.",
  alternates: {
    canonical: "https://your-pdf-tools.vercel.app/excel-to-pdf",
  },
  openGraph: {
    title: "Excel to PDF Converter Online Free | Your PDF Tools",
    description:
      "Convert Excel spreadsheets into PDF documents online. Supports XLSX and XLS files.",
    url: "https://your-pdf-tools.vercel.app/excel-to-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

const faqs = [
  {
    question: "How can I convert Excel to PDF online?",
    answer:
      "Upload your XLSX or XLS spreadsheet, click Convert Excel to PDF and download your converted document.",
  },
  {
    question: "Does this tool support XLSX and XLS files?",
    answer:
      "Yes. The converter supports modern XLSX workbooks and older XLS Excel files.",
  },
  {
    question: "Can I convert multiple Excel worksheets into one PDF?",
    answer:
      "Yes. The workbook's worksheets can be included in one PDF document. The final page layout depends on the spreadsheet's print settings.",
  },
  {
    question: "Will Excel formatting be preserved?",
    answer:
      "The converter uses LibreOffice Calc to preserve supported formatting, tables, borders, colours and spreadsheet content. Some formatting differences may occur.",
  },
  {
    question: "Can I convert large Excel files?",
    answer:
      "The maximum supported upload size is 100 MB. Processing time depends on workbook complexity and the number of worksheets.",
  },
  {
    question: "Is Excel to PDF conversion free?",
    answer:
      "Your PDF Tools provides this online conversion feature free of charge, subject to upload and processing limits.",
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

export default function ExcelToPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-green-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-800">Excel to PDF</span>
        </nav>

        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Excel to PDF Converter Online Free
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Convert Excel spreadsheets into PDF documents quickly and easily.
            Upload XLSX or XLS files and download your PDF without installing
            additional software.
          </p>
        </section>

        <ExcelToPdfTool />

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900">
            How to Convert Excel to PDF
          </h2>

          <ol className="mt-5 list-decimal space-y-3 pl-6 text-slate-600">
            <li>Choose your Excel file in XLSX or XLS format.</li>
            <li>Upload the workbook to the converter.</li>
            <li>Click Convert Excel to PDF.</li>
            <li>Wait for the conversion to complete.</li>
            <li>Download your converted PDF document.</li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900">
            Why Convert Excel to PDF?
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            PDF documents make it easier to share spreadsheets in a format
            suitable for viewing, printing and distribution. Excel to PDF
            conversion can help you share financial reports, business
            statements, invoices, data tables and other spreadsheet
            documents.
          </p>
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
                <p className="mt-2 leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Explore More PDF Tools
          </h2>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm font-medium">
            <Link href="/word-to-pdf" className="text-green-700 hover:underline">
              Word to PDF
            </Link>
            <Link href="/jpg-to-pdf" className="text-green-700 hover:underline">
              JPG to PDF
            </Link>
            <Link href="/png-to-pdf" className="text-green-700 hover:underline">
              PNG to PDF
            </Link>
            <Link href="/merge-pdf" className="text-green-700 hover:underline">
              Merge PDF
            </Link>
            <Link href="/compress-pdf" className="text-green-700 hover:underline">
              Compress PDF
            </Link>
            <Link href="/protect-pdf" className="text-green-700 hover:underline">
              Protect PDF
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
