import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import AskChat from "@/app/components/AskChat";
import { createPageMetadata } from "@/src/lib/site";

export const metadata = createPageMetadata({
  title: "Ask AI",
  description:
    "Chat with an AI assistant that answers questions about Kaung Mrat Thu.",
  path: "/ask",
});

export default function AskPage() {
  return (
    <main className="mobile-fullscreen-page page-gutter flex min-h-[100dvh] w-full flex-1 flex-col pb-4 pt-24 sm:pt-28">
      <Link
        href="/"
        aria-label="Back to portfolio home"
        title="Back to portfolio"
        className="fixed right-4 top-4 z-[70] inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface/95 text-foreground shadow-lg backdrop-blur-xl transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden print:hidden"
      >
        <LuArrowLeft aria-hidden="true" size={18} strokeWidth={1.8} />
      </Link>

      <div className="mx-auto w-full max-w-3xl flex flex-1 flex-col">
        <header className="mb-7 sm:mb-9">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            {"// ask ai"}
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            Ask about my work.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            A portfolio-aware assistant for quick answers about my experience,
            projects, and availability.
          </p>
        </header>
        <AskChat />
      </div>
    </main>
  );
}
