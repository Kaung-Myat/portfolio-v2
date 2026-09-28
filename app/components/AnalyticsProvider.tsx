"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { track } from "@vercel/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function AnalyticsProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || !window.gtag) return;
    window.gtag("config", measurementId, {
      page_path: pathname,
      send_page_view: true,
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest<HTMLElement>("[data-analytics-event]");
      if (!element) return;

      const eventName = element.dataset.analyticsEvent;
      if (!eventName) return;

      const label = element.dataset.analyticsLabel ?? element.textContent?.trim();
      const properties = {
        label: label?.slice(0, 120) ?? "unknown",
        path: window.location.pathname,
      };

      track(eventName, properties);
      window.gtag?.("event", eventName, properties);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
