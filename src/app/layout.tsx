import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarxCity - Xây dựng nền kinh tế định hướng XHCN",
  description: "Game mô phỏng kinh tế dựa trên Kinh tế chính trị Mác-Lênin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
        {children}
      </body>
    </html>
  );
}
