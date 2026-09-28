import type { Metadata } from "next";

export const siteName = "Kaung Mrat Thu — Flutter Developer";
export const siteDescription =
  "Flutter Developer and Computer Science student building thoughtful mobile experiences, open-source tools, and developer products.";

export function getSiteUrl() {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL;

  if (!configuredUrl) return "http://localhost:3000";

  const withProtocol = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return withProtocol.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} · Kaung Mrat Thu`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: socialTitle,
      description,
      url: path,
      images: [
        {
          url: absoluteUrl("/opengraph-image"),
          width: 1200,
          height: 630,
          alt: "Kaung Mrat Thu — Flutter Developer",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [absoluteUrl("/twitter-image")],
    },
  };
}
