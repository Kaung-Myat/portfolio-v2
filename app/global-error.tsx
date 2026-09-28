"use client";

import { useEffect } from "react";
import { RouteState, StateLink } from "./components/RouteState";
import "./globals.css";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-full bg-background text-foreground">
        <title>Something went wrong · Kaung Mrat Thu</title>
        <RouteState
          code="500"
          eyebrow="site error"
          title="The site hit an unexpected error."
          description="A temporary problem prevented the site shell from loading. Retry the request or return to the homepage."
        >
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-background transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try again
          </button>
          <StateLink href="/">Back to home</StateLink>
        </RouteState>
      </body>
    </html>
  );
}
