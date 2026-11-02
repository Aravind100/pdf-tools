
import type { Metadata } from "next";
import Link from "next/link";
import CompressPdfTool from "./CompressPdfTool";

export const metadata: Metadata = {
  title: "Compress PDF Online Free – Reduce PDF File Size",
  description:
    "Compress PDF files online for free. Optimize PDF content streams, compare original and processed file sizes, and download your PDF.",
  alternates: {
    canonical: "/compress-pdf",
  },
  openGraph: {
    title: "Compress PDF Online Free | Your PDF Tools",
    description:
      "Optimize PDF files online and download the processed document.",
    url: "https://your-pdf-tools.vercel.app/compress-pdf",
    type: "website",
  },
};

const faqs = [
  {
    question: "How can I compress a PDF online?",
    answer:
      "Upload your PDF, click Compress PDF, wait for processing, compare the file sizes and download the processed document.",
  },
  {
    question: "Is PDF compression free?",
    answer:
      "Yes. You can use the Compress PDF tool on Your PDF Tools without paying a fee.",
  },
  {
    question: "Will compression reduce image quality?",
    answer:
      "This version uses lossless PDF content-stream optimization and does not deliberately reduce image quality. The amount of file-size reduction depends on the PDF.",
  },
  {
    question: "Can I compress a password-protected PDF?",
    answer:
      "Password-protected PDFs are not supported. Unlock the PDF before uploading it.",
  },
  {
    question: "What is the maximum PDF upload size?",
    answer:
      "The maximum upload size is 100 MB.",
  },
];

export default function CompressPdfPage() {
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

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-600">
            Home
          </Link>
          {" / "}
          <span className="text-slate-800">Compress PDF</span>
        </nav>

        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Compress PDF Online Free
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Optimize your PDF document online. Upload a PDF,
            process it securely and download the resulting file.
            Compare the original and processed file sizes before
            downloading.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <CompressPdfTool />
        </div>

        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            How to Compress a PDF
          </h2>

          <ol className="mt-5 list-inside list-decimal space-y-3 text-slate-600">
            <li>Select a PDF file from your device.</li>
            <li>Click the Compress PDF button.</li>
            <li>Wait while the PDF is processed.</li>
            <li>Compare the original and processed file sizes.</li>
            <li>Download your processed PDF.</li>
          </ol>
        </section>

        <section className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            More Free PDF Tools
          </h2>

          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-red-600">
            <Link href="/edit-pdf">Edit PDF</Link>
            <Link href="/merge-pdf">Merge PDF</Link>
            <Link href="/word-to-pdf">Word to PDF</Link>
            <Link href="/jpg-to-pdf">JPG to PDF</Link>
            <Link href="/png-to-pdf">PNG to PDF</Link>
            <Link href="/images-to-pdf">Images to PDF</Link>
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>

          <div className="mt-5 space-y-5">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-bold text-slate-900">
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
