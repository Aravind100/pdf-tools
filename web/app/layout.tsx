import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PDF Tools — Convert, Edit & Manage PDFs",
  description: "A simple online workspace to convert, edit and manage PDF documents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
