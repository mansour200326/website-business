import type { Metadata, Viewport } from "next";
import { archivo, spaceMono } from "./fonts";
import { site } from "@/config/site";
import "./globals.css";

const title = site.studioName || site.meta.title;

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title,
  description: site.meta.description,
  openGraph: {
    type: "website",
    title,
    description: site.meta.description,
    url: site.meta.url,
    siteName: title,
    locale: "en_US",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Sites that ship in days — Independent Web Studio, Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.meta.description,
    images: ["/og.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: site.meta.themeColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Without JS the scroll-reveal elements would stay hidden — show them. */}
        <noscript>
          <style>{`.rv{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className={`${archivo.variable} ${spaceMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
