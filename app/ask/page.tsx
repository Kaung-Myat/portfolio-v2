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
    <main className="page-gutter flex w-full flex-1 flex-col pb-4 pt-24 sm:pt-24">
      <div className="mx-auto w-full max-w-3xl flex flex-1 flex-col">
        <header className="mb-6">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            {"// ask ai"}
          </p>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-4xl">
            Ask anything about Kaung Mrat Thu
          </h1>
        </header>
        <AskChat />
      </div>
    </main>
  );
}
