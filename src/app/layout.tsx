import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ProductScene — AI Product Photos in Seconds",
    template: "%s | ProductScene",
  },
  description:
    "Upload a plain product photo and generate stunning marketing scenes for Amazon, Etsy, Shopify & Instagram. AI-powered, product-faithful, ready in seconds.",
  keywords: [
    "AI product photo",
    "product photography",
    "Amazon product image",
    "Etsy listing photo",
    "AI background",
    "product scene generator",
  ],
  openGraph: {
    title: "ProductScene — AI Product Photos in Seconds",
    description:
      "Turn plain white-background product shots into scroll-stopping marketing images. 20+ scenes, 6 platform sizes, batch generation.",
    type: "website",
    url: "https://productscene.ai",
    siteName: "ProductScene",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductScene — AI Product Photos in Seconds",
    description:
      "Turn plain white-background product shots into scroll-stopping marketing images.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
