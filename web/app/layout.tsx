
import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://your-pdf-tools.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Free Online PDF Tools | Your PDF Tools",
    template: "%s | Your PDF Tools",
  },

  description:
    "Convert JPG, PNG images and Word documents to PDF online for free. Combine multiple images into one PDF, arrange pages and download your PDF easily.",

  applicationName: "Your PDF Tools",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Free Online PDF Tools | Your PDF Tools",
    description:
      "Convert images and Word documents to PDF online. Combine multiple images into one PDF with our easy-to-use PDF tools.",
    url: siteUrl,
    siteName: "Your PDF Tools",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Free Online PDF Tools | Your PDF Tools",
    description:
      "Convert JPG, PNG and Word documents to PDF online. Combine multiple images into one PDF easily.",
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
