import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prédisez et Gagnez — Ivory Coast vs Ecuador",
  description: "Predict the score and win a KFC voucher!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
