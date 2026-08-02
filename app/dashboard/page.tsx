import type { Metadata } from "next";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard — Websmith",
  robots: { index: false, follow: false, nocache: true },
};

export default function DashboardPage() {
  return <Dashboard />;
}
