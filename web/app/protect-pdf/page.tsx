
import type { Metadata } from "next";
import Link from "next/link";
import ProtectPdfTool from "./ProtectPdfTool";

export const metadata: Metadata = {
  title: "Protect PDF with Password Online Free – AES-256 Encryption",
  description:
    "Protect PDF files online with AES-256 password encryption. Add a password to your PDF documents and download securely protected PDF files.",
  alternates: {
    canonical: "https://your-pdf-tools.vercel.app/protect-pdf",
  },
  openGraph: {
    title: "Protect PDF Online Free | Your PDF Tools",
    description:
      "Add password protection to your PDF documents using AES-256 encryption.",
    url: "https://your-pdf-tools.vercel.app/protect-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

const faqs = [
  {
    question: "How do I password-protect a PDF?",
    answer:
      "Upload your PDF, enter a password, confirm it and click Protect PDF. Download the resulting encrypted PDF file.",
  },
  {
    question: "What encryption does this PDF tool use?",
    answer:
      "The tool requests AES-256 encryption through its PDF processing backend.",
  },
  {
    question: "What is the minimum password length?",
    answer:
      "The password must contain at least 6 characters and cannot exceed 128 characters.",
  },
  {
    question: "Can I protect an already password-protected PDF?",
    answer:
      "No. You must first unlock the existing PDF before uploading it.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "The maximum supported PDF upload size is 100 MB.",
  },
  {
    question: "Can I recover my password if I forget it?",
    answer:
      "No. Your password is not stored by the protection endpoint. Keep it safely because it cannot be recovered if lost.",
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

export default function ProtectPdfPage() {
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
          <span className="text-slate-800">Protect PDF</span>
        </nav>

        <section className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Protect PDF Online with Password
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Secure your PDF documents by adding password protection.
            Encrypt your files using AES-256 and keep your important
            documents protected from unauthorized opening.
          </p>
        </section>

        <ProtectPdfTool />

        <section className="mx-auto mt-16 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900">
            How to Protect a PDF with a Password
          </h2>

          <ol className="mt-5 list-decimal space-y-3 pl-6 text-slate-600">
            <li>Upload the PDF document you want to protect.</li>
            <li>Create a password with at least 6 characters.</li>
            <li>Enter the same password in the confirmation field.</li>
            <li>Click the Protect PDF button.</li>
            <li>Download your password-protected PDF.</li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-2xl font-bold text-slate-900">
            Why Password-Protect Your PDF?
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Password protection adds a layer of security to PDF documents
            containing confidential or personal information. It helps
            prevent unauthorized users from opening the document without
            knowing the password. Share the password securely with
            authorized recipients.
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
            <Link href="/merge-pdf" className="text-blue-600 hover:underline">
              Merge PDF
            </Link>
            <Link href="/split-pdf" className="text-blue-600 hover:underline">
              Split PDF
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
          </div>
        </section>
      </div>
    </main>
  );
}
