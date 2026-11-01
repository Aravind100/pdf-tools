
import type { Metadata } from "next";
import Link from "next/link";
import PdfEditor from "./PdfEditor";

export const metadata: Metadata = {
  title: "Edit PDF Online Free – Add Text, Images & Signatures",
  description:
    "Edit PDF files online for free. Add text, images, signatures, drawings and highlights, and manage PDF pages. No software installation required.",
  alternates: {
    canonical: "/edit-pdf",
  },
  openGraph: {
    title: "Free Online PDF Editor | Your PDF Tools",
    description:
      "Add text, images, signatures and annotations to PDF files online. Organize and download your edited PDF.",
    url: "https://your-pdf-tools.vercel.app/edit-pdf",
    siteName: "Your PDF Tools",
    type: "website",
  },
};

const faqs = [
  {
    question: "How can I edit a PDF online?",
    answer:
      "Open the PDF Editor, upload your PDF, choose an available editing tool, make your changes and download the edited document.",
  },
  {
    question: "Can I add text to a PDF?",
    answer:
      "Yes. Use the Add Text tool to place additional text on your PDF page.",
  },
  {
    question: "Can I add a signature or image to a PDF?",
    answer:
      "Yes. Use the image and signature tool to insert an image or signature into your document.",
  },
  {
    question: "Can I highlight or draw on a PDF?",
    answer:
      "Yes. Use the available drawing and highlighting tools to mark up your PDF pages.",
  },
  {
    question: "Can I edit existing text inside a PDF?",
    answer:
      "The current editor supports adding new text and annotations. Directly changing existing PDF text while preserving its original formatting is not currently supported.",
  },
];

export default function EditPdfPage() {
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
    <>
      <main className="min-h-screen bg-slate-50">
        <PdfEditor />
      </main>

      <section className="bg-white px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-red-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-semibold text-slate-700">Edit PDF</span>
          </nav>

          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Edit PDF Online Free with Your PDF Tools
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            Need to make changes to a PDF document? Use our free online PDF
            editor to add text, insert images and signatures, draw on pages,
            highlight important information and manage your document pages.
            Work directly from your browser without installing desktop software.
          </p>

          <h3 className="mt-9 text-xl font-bold text-slate-900">
            What can you do with our PDF editor?
          </h3>

          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 text-slate-600">
            <li>Add additional text to PDF pages.</li>
            <li>Insert images and signature files.</li>
            <li>Draw and highlight important sections.</li>
            <li>Rotate and organize PDF pages using available page tools.</li>
            <li>Download your edited PDF document.</li>
          </ul>

          <h3 className="mt-9 text-xl font-bold text-slate-900">
            More free PDF tools
          </h3>

          <p className="mt-3 leading-7 text-slate-600">
            Looking for more document tools? Explore our other free PDF
            converters and document management tools.
          </p>

          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-semibold">
            <Link href="/" className="text-red-600 hover:underline">
              All PDF Tools – Home
            </Link>
            <Link href="/word-to-pdf" className="text-red-600 hover:underline">
              Word to PDF
            </Link>
            <Link href="/jpg-to-pdf" className="text-red-600 hover:underline">
              JPG to PDF
            </Link>
            <Link href="/png-to-pdf" className="text-red-600 hover:underline">
              PNG to PDF
            </Link>
            <Link href="/images-to-pdf" className="text-red-600 hover:underline">
              Images to PDF
            </Link>
            <Link href="/merge-pdf" className="text-red-600 hover:underline">
              Merge PDF
            </Link>
          </div>

          <h3 className="mt-12 text-2xl font-black text-slate-900">
            Frequently Asked Questions
          </h3>

          <div className="mt-5 space-y-5">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="border-b border-slate-200 pb-5"
              >
                <h4 className="font-bold text-slate-900">{faq.question}</h4>
                <p className="mt-2 leading-7 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-slate-50 p-6">
            <h3 className="text-xl font-bold text-slate-900">
              Explore all our PDF tools
            </h3>
            <p className="mt-2 text-slate-600">
              Visit the Your PDF Tools homepage to discover document
              conversion, image conversion and PDF management tools.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
            >
              Visit Homepage
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </>
  );
}
