
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Barlow_Condensed, DM_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { QuoteProvider } from "@/components/quote/QuoteModal";
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
  title: "Activewear Custom | Custom Sportswear & Teamwear",
  description:
    "Custom activewear and teamwear designed for teams, brands, and businesses.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${dmSans.variable}`}>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-heading">Skip to content</a>
        <QuoteProvider>
          <Navbar />
          {children}
          <Footer />
        </QuoteProvider>
      </body>
    </html>
  );
}
