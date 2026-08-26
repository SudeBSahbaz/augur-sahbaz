import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A. Uğur Şahbaz",
  description: "Şekerleme Üretimi ve Teknik Operasyon Danışmanı",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}