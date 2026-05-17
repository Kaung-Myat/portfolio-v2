"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/src/types";

const SUGGESTIONS = [
  "What is his tech stack?",
  "What open source work has he done?",
  "Is he available for freelance?",
];

function BotIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="18" height="10" x="3" y="11" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" x2="8" y1="16" y2="16" />
      <line x1="16" x2="16" y1="16" y2="16" />
    </svg>
  );
}

export default function AskChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const history: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        const errText = await res
          .text()
          .catch(() => "Sorry — something went wrong. Please try again.");
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: errText } : m,
          ),
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? {
                ...m,
                content:
                  "Sorry — I couldn't reach the AI right now. Please try again in a moment.",
              }
            : m,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  const showSuggestions = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-border bg-[#1a1a1a] p-5 pb-8 mb-32"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <p className="text-base text-muted">
              Ask me anything about Kaung Mrat Thu.
            </p>
            <p className="font-mono text-xs text-muted/70">
              Pick a suggestion below or type your own question.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m, i) => {
              const isAssistantPending =
                m.role === "assistant" &&
                !m.content &&
                busy &&
                i === messages.length - 1;
              if (m.role === "user") {
                return (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-accent text-background px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </div>
                  </div>
                );
              }
              return (
                <div key={i} className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[85%]">
                    <span
                      className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
                      aria-hidden="true"
                    >
                      <BotIcon />
                    </span>
                    <div className="rounded-2xl rounded-tl-md bg-[#222] border border-border px-4 py-2.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                      {isAssistantPending ? (
                        <span className="inline-flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse" />
                          <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse [animation-delay:120ms]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse [animation-delay:240ms]" />
                        </span>
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur-md"
      >
        <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 md:px-16 py-3">
          {showSuggestions && (
            <ul className="mb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => ask(s)}
                    disabled={busy}
                    className="rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Kaung's projects, stack, or experience…"
              disabled={busy}
              className="flex-1 rounded-full bg-surface border border-border px-4 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="rounded-full bg-accent text-background px-5 py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
