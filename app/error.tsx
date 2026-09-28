"use client";

import { useEffect } from "react";
import { RouteState, StateLink } from "./components/RouteState";

export default function ErrorPage({
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
    <RouteState
      code="500"
      eyebrow="unexpected error"
      title="Something went off script."
      description="The page couldn’t finish loading. Try again first—if the problem continues, returning home is the safest route."
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
  );
}
