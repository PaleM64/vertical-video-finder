import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vertical Video Finder - Pencari Video Vertikal untuk Shorts & Reels",
  description: "Temukan dan kelola video vertikal (9:16) untuk konten Shorts dan Reels Anda. Cari di YouTube, TikTok, Pexels, dan Pixabay dengan filter canggih.",
  keywords: ["video vertikal", "shorts", "reels", "9:16", "youtube", "tiktok", "pexels", "pixabay", "indonesia"],
  authors: [{ name: "Vertical Video Finder" }],
  openGraph: {
    title: "Vertical Video Finder - Pencari Video Vertikal",
    description: "Temukan video vertikal untuk konten Shorts dan Reels Anda",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vertical Video Finder - Pencari Video Vertikal",
    description: "Temukan video vertikal untuk konten Shorts dan Reels Anda",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}