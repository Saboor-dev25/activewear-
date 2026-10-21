
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { QuoteProvider } from "@/components/quote/QuoteModal";
import { ContentProvider } from "@/components/providers/ContentProvider";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: { default: "Activewear Custom | Custom Sportswear & Teamwear", template: "%s | Activewear Custom" },
  description:
    "Custom activewear and teamwear designed for teams, brands, and businesses.",
  openGraph: {
    title: "Activewear Custom | Custom Sportswear & Teamwear",
    description: "Custom activewear and teamwear designed for teams, brands, and businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${dmSans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Activewear Custom",
          description: "Custom activewear and teamwear designed for teams, brands, and businesses.",
          ...(process.env.NEXT_PUBLIC_SITE_URL ? { url: process.env.NEXT_PUBLIC_SITE_URL } : {}),
        }).replace(/</g, "\\u003c") }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-heading">Skip to content</a>
        <ContentProvider>
          <QuoteProvider>
            <SiteChrome>{children}</SiteChrome>
          </QuoteProvider>
        </ContentProvider>
      </body>
    </html>
  );
}
