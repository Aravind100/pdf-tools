
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://your-pdf-tools.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Free Online PDF Tools – Convert, Merge & Manage PDFs",
    template: "%s | Your PDF Tools",
  },

  description:
    "Use free online PDF tools to convert Word to PDF, JPG to PDF and PNG to PDF, and merge multiple PDF files into one document. Easy PDF tools for desktop and mobile.",

  applicationName: "Your PDF Tools",

  keywords: [
    "free PDF tools",
    "PDF converter online",
    "Word to PDF",
    "JPG to PDF",
    "PNG to PDF",
    "Merge PDF",
    "Combine PDF files",
    "Online PDF tools",
  ],

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "WFPTfyeMakHgyCXNIavAZ-ebN-KXLvPKeU7HAT0xLpA",
  },

  openGraph: {
    title:
      "Free Online PDF Tools – Convert, Merge & Manage PDFs",
    description:
      "Convert Word, JPG and PNG files to PDF and combine multiple PDF documents online with easy-to-use tools.",
    url: siteUrl,
    siteName: "Your PDF Tools",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Free Online PDF Tools – Convert, Merge & Manage PDFs",
    description:
      "Convert Word, JPG and PNG files to PDF. Merge multiple PDF files online for free.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
