import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GameMatch | ゲームの時間を、特別な体験に。",
  description:
    "一緒に遊ぶ。学ぶ。応援する。ゲームが得意な人と、遊びたい人をつなぐプラットフォーム。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={`${inter.variable} font-sans bg-white text-gray-900 antialiased`}>
        <Header />
        {children}
        <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} GameMatch
        </footer>
      </body>
    </html>
  );
}
