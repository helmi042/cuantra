import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "CUANTRA Personal Finance",
  description: "Kelola keuangan pribadi dengan CUANTRA.",
  metadataBase: new URL("https://example.com")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className="bg-slate-50 text-slate-900">
      <body>{children}</body>
    </html>
  );
}
