import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AnalyticsProvider from "./components/AnalyticsProvider";
import JsonLd from "./components/JsonLd";
import Navbar from "./components/Navbar";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { profile } from "@/src/data/profile";
import { getSiteUrl, siteDescription, siteName } from "@/src/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem("portfolio-theme");
      if (theme === "light" || theme === "dark") {
        document.documentElement.setAttribute("data-theme", theme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    } catch (_) {}
  })();
`;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: siteName,
    template: "%s · Kaung Mrat Thu",
  },
  description: siteDescription,
  applicationName: "Kaung Mrat Thu Portfolio",
  authors: [{ name: profile.name, url: getSiteUrl() }],
  creator: profile.name,
  keywords: [
    "Kaung Mrat Thu",
    "Flutter developer",
    "Dart developer",
    "mobile developer",
    "Myanmar developer",
    "open source",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Kaung Mrat Thu",
    title: siteName,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${getSiteUrl()}/#person`,
        name: profile.name,
        url: getSiteUrl(),
        jobTitle: "Flutter Developer",
        worksFor: {
          "@type": "Organization",
          name: profile.company,
        },
        sameAs: profile.socials.map((social) => social.href),
        knowsAbout: profile.stack,
      },
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl()}/#website`,
        url: getSiteUrl(),
        name: "Kaung Mrat Thu Portfolio",
        description: siteDescription,
        author: { "@id": `${getSiteUrl()}/#person` },
        inLanguage: "en",
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={structuredData} />
        <ThemeSwitcher />
        <Navbar />
        {children}
        <AnalyticsProvider />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
