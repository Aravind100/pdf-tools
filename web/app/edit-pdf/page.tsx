
import type { Metadata } from "next";
import PdfEditor from "./PdfEditor";

export const metadata: Metadata = {
  title: "Edit PDF Online Free | Your PDF Tools",
  description:
    "Edit PDF files online. Add text, images, signatures, highlights and annotations. Manage and organize PDF pages easily.",
  alternates: {
    canonical: "/edit-pdf",
  },
};

export default function EditPdfPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PdfEditor />
    </main>
  );
}
