import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Privacy Leak Detector",
  description: "Upload an APK and discover sensitive permissions, potential privacy concerns, and the evidence behind each finding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-slate-100 antialiased`}>{children}</body>
    </html>
  );
}
