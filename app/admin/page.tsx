import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
