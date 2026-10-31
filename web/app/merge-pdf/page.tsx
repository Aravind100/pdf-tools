
import type { Metadata } from "next";
import MergePdfTool from "./MergePdfTool";

export const metadata: Metadata = {
  title: "Merge PDF Online Free – Combine Multiple PDF Files | PDF Tools",
  description:
    "Merge PDF files online for free. Combine multiple PDF documents into one file, rearrange their order and download your merged PDF. No account required.",
  alternates: {
    canonical: "https://your-pdf-tools.vercel.app/merge-pdf",
  },
  openGraph: {
    title: "Merge PDF Online Free | PDF Tools",
    description:
      "Combine multiple PDF files into one document online. Arrange files in your preferred order and download your merged PDF.",
    url: "https://your-pdf-tools.vercel.app/merge-pdf",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Merge PDF Online Free | PDF Tools",
    description:
      "Combine multiple PDF files into one document online. Arrange and download your merged PDF.",
  },
};

const faqs = [
  {
    question: "How can I merge multiple PDF files into one?",
    answer:
      "Select two or more PDF files using the upload area. Arrange them in your preferred order, click Merge PDF, and download the combined document.",
  },
  {
    question: "Can I change the order of PDF files before merging?",
    answer:
      "Yes. Use the up and down controls next to each selected file to arrange the documents in the order you want them to appear in the final PDF.",
  },
  {
    question: "Is this PDF merger free to use?",
    answer:
      "You can use the PDF merger without creating an account. Upload limits apply.",
  },
  {
    question: "Can I merge more than two PDF files?",
    answer:
      "Yes. You can select multiple PDF documents and combine them into a single PDF, subject to the upload limits.",
  },
  {
    question: "Are password-protected PDF files supported?",
    answer:
      "Password-protected PDFs are not currently supported. Unlock the PDF before uploading it for merging.",
  },
  {
    question: "Are my PDF files stored permanently?",
    answer:
      "Files are processed by the conversion service using temporary processing storage. Do not upload sensitive documents unless you are comfortable with the service's current privacy and security arrangements.",
  },
];

export default function MergePdfPage() {
  const structuredData = {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <main className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <a href="/" className="text-2xl font-black tracking-tight">
              PDF <span className="text-red-600">Tools</span>
            </a>

            <a
              href="/"
              className="text-sm font-semibold text-slate-600 hover:text-red-600"
            >
              All PDF Tools
            </a>
          </div>
        </header>

        {/* Hero section */}
        <section className="px-5 pb-10 pt-14 text-center">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-red-600">
              Free online PDF tool
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Merge PDF Files Online
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Combine multiple PDF files into one document in just a few
              steps. Arrange your files in the right order, merge them
              and download your combined PDF.
            </p>
          </div>
        </section>

        {/* PDF merger tool */}
        <section className="mx-auto max-w-3xl px-5 pb-14">
          <MergePdfTool />
        </section>

        {/* How to merge PDFs */}
        <section className="mx-auto max-w-4xl px-5 pb-14">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black">
              How to Combine PDF Files Online
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Use this online PDF merger to join multiple PDF documents
              into one file. You do not need to install additional
              software or create an account to get started.
            </p>

            <ol className="mt-6 space-y-5">
              <li>
                <h3 className="font-bold">
                  1. Select your PDF files
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Upload two or more PDF documents from your computer
                  or mobile device.
                </p>
              </li>

              <li>
                <h3 className="font-bold">
                  2. Arrange the file order
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Move files up or down to decide the order in which
                  their pages will appear in the merged document.
                </p>
              </li>

              <li>
                <h3 className="font-bold">
                  3. Merge and download
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Click the Merge PDF button. Your combined PDF will
                  be generated and downloaded to your device.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* Benefits */}
        <section className="mx-auto max-w-4xl px-5 pb-14">
          <h2 className="text-2xl font-black">
            Why Use Our Online PDF Merger?
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              [
                "Simple to use",
                "Combine PDF documents through a straightforward upload process.",
              ],
              [
                "Control document order",
                "Arrange files before merging so the final PDF follows your preferred sequence.",
              ],
              [
                "No account required",
                "Start merging PDFs without signing up for an account.",
              ],
              [
                "Works on different devices",
                "Use the tool from a supported desktop, laptop, tablet or mobile browser.",
              ],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-5"
              >
                <h3 className="font-bold">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ section */}
        <section className="mx-auto max-w-4xl px-5 pb-14">
          <h2 className="text-2xl font-black">
            Frequently Asked Questions About Merging PDFs
          </h2>

          <div className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-5">
                <h3 className="font-bold">{faq.question}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="mx-auto max-w-4xl px-5 pb-14">
          <div className="rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
            <h2 className="text-2xl font-black">
              Explore More PDF Tools
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Convert your documents and images into PDF files with
              our other online tools.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/word-to-pdf"
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                Word to PDF
              </a>

              <a
                href="/images-to-pdf"
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                Images to PDF
              </a>

              <a
                href="/jpg-to-pdf"
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                JPG to PDF
              </a>

              <a
                href="/png-to-pdf"
                className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-100"
              >
                PNG to PDF
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white px-5 py-7 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PDF Tools. All rights reserved.
        </footer>
      </main>
    </>
  );
}
