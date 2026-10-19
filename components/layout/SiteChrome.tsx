"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export function SiteChrome({ children }: { children: ReactNode }) {
  return <Suspense fallback={<>{children}</>}><SiteChromeContent>{children}</SiteChromeContent></Suspense>;
}

function SiteChromeContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return <>
    {!isAdmin && <Navbar />}
    {children}
    {!isAdmin && <Footer />}
  </>;
}
