import AskChat from "@/app/components/AskChat";

export const metadata = {
  title: "Ask AI · Kaung Mrat Thu",
  description:
    "Chat with an AI assistant that answers questions about Kaung Mrat Thu.",
};

export default function AskPage() {
  return (
    <main className="flex flex-1 w-full flex-col px-6 sm:px-10 md:px-16 pt-12 sm:pt-16">
      <div className="mx-auto w-full max-w-3xl flex flex-1 flex-col">
        <header className="mb-6">
          <p className="font-mono text-xs sm:text-sm text-accent mb-2">
            // ask ai
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Ask anything about Kaung Mrat Thu
          </h1>
        </header>
        <AskChat />
      </div>
    </main>
  );
}
