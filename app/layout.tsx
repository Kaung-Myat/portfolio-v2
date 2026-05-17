import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaung Mrat Thu — Flutter Developer",
  description:
    "Flutter Developer & Computer Science Student building thoughtful mobile experiences at Brainwave Data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        {children}
         <Analytics />
      </body>
    </html>
  );
}
