"use client";

import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import {
  LuArrowUpRight,
  LuRotateCcw,
  LuSend,
  LuSparkles,
  LuSquare,
} from "react-icons/lu";
import type { ChatMessage } from "@/src/types";

const MAX_INPUT_LENGTH = 500;
const SUGGESTIONS = [
  "Which project best shows his Flutter experience?",
  "What open-source tools has he published?",
  "Is he available for work or collaboration?",
];

function AssistantMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      skipHtml
      components={{
        h1: ({ children: heading }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0 sm:text-lg">
            {heading}
          </h3>
        ),
        h2: ({ children: heading }) => (
          <h3 className="mb-2 mt-4 text-base font-semibold first:mt-0 sm:text-lg">
            {heading}
          </h3>
        ),
        h3: ({ children: heading }) => (
          <h3 className="mb-2 mt-4 font-semibold first:mt-0">{heading}</h3>
        ),
        p: ({ children: paragraph }) => (
          <p className="mb-3 last:mb-0">{paragraph}</p>
        ),
        ul: ({ children: list }) => (
          <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-accent">
            {list}
          </ul>
        ),
        ol: ({ children: list }) => (
          <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:font-mono marker:text-xs marker:text-accent">
            {list}
          </ol>
        ),
        li: ({ children: item }) => <li className="pl-1">{item}</li>,
        strong: ({ children: strong }) => (
          <strong className="font-semibold text-foreground">{strong}</strong>
        ),
        em: ({ children: emphasis }) => (
          <em className="text-muted">{emphasis}</em>
        ),
        a: ({ href, children: link }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {link}
          </a>
        ),
        blockquote: ({ children: quote }) => (
          <blockquote className="my-3 border-l-2 border-accent/60 pl-4 text-muted">
            {quote}
          </blockquote>
        ),
        code: ({ children: code }) => (
          <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-[0.9em] text-accent">
            {code}
          </code>
        ),
        pre: ({ children: codeBlock }) => (
          <pre className="my-3 overflow-x-auto rounded-xl border border-border bg-foreground/[0.03] p-3 font-mono text-xs leading-6">
            {codeBlock}
          </pre>
        ),
        hr: () => <hr className="my-4 border-border" />,
        img: () => null,
      }}
    >
      {children}
    </Markdown>
  );
}

export default function AskChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  function resizeComposer() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
  }

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy || trimmed.length > MAX_INPUT_LENGTH) return;

    const previousMessages = messages;
    const history: ChatMessage[] = [
      ...previousMessages,
      { role: "user", content: trimmed },
    ];
    const controller = new AbortController();
    let receivedContent = false;

    abortRef.current = controller;
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setBusy(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-12) }),
      });

      if (!response.ok || !response.body) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "The AI assistant is unavailable.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;

        receivedContent = true;
        setMessages((current) =>
          current.map((message, index) =>
            index === current.length - 1
              ? { ...message, content: message.content + chunk }
              : message,
          ),
        );
      }
    } catch (caught) {
      if (controller.signal.aborted) {
        if (!receivedContent) setMessages(history);
      } else {
        if (!receivedContent) {
          setMessages(previousMessages);
          setInput(trimmed);
        }
        setError(
          caught instanceof Error
            ? caught.message
            : "The AI assistant is unavailable. Please try again.",
        );
      }
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  }

  function clearConversation() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    setError(null);
    textareaRef.current?.focus();
  }

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-1 flex-col pb-40 md:pb-28">
      {showWelcome ? (
        <section aria-labelledby="ask-intro" className="border-y border-border">
          <div className="grid gap-5 py-7 sm:grid-cols-[9rem_1fr] sm:gap-8 sm:py-9">
            <div className="flex items-center gap-2 self-start font-mono text-xs text-accent">
              <LuSparkles aria-hidden="true" size={15} />
              Portfolio guide
            </div>
            <div>
              <h2 id="ask-intro" className="text-lg font-medium text-foreground">
                Start with what you want to know.
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                Get a concise answer grounded in the projects, experience, and
                details published on this portfolio.
              </p>
            </div>
          </div>

          <ul className="border-t border-border">
            {SUGGESTIONS.map((suggestion, index) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => ask(suggestion)}
                  disabled={busy}
                  data-analytics-event="ask_suggestion"
                  data-analytics-label={suggestion}
                  className="group grid min-h-16 w-full grid-cols-[2rem_1fr_auto] items-center gap-3 border-b border-border py-3 text-left transition-colors last:border-b-0 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent disabled:opacity-50"
                >
                  <span className="font-mono text-[10px] text-muted/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-foreground transition-colors group-hover:text-accent sm:text-base">
                    {suggestion}
                  </span>
                  <LuArrowUpRight
                    aria-hidden="true"
                    className="text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    size={16}
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section aria-label="Conversation" className="border-t border-border">
          <ol>
            {messages.map((message, index) => {
              const pending =
                message.role === "assistant" &&
                !message.content &&
                busy &&
                index === messages.length - 1;

              return (
                <li
                  key={`${message.role}-${index}`}
                  className="grid grid-cols-[3.25rem_1fr] gap-3 border-b border-border py-5 sm:grid-cols-[5.5rem_1fr] sm:gap-6 sm:py-6"
                >
                  <span
                    className={`pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
                      message.role === "assistant" ? "text-accent" : "text-muted"
                    }`}
                  >
                    {message.role === "assistant" ? "AI" : "You"}
                  </span>
                  <div className="max-w-2xl [overflow-wrap:anywhere] text-sm leading-7 text-foreground sm:text-base">
                    {pending ? (
                      <span className="inline-flex items-center gap-2 text-muted">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                        </span>
                        Reading the portfolio…
                      </span>
                    ) : message.role === "assistant" ? (
                      <AssistantMarkdown>{message.content}</AssistantMarkdown>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {!busy && (
            <button
              type="button"
              onClick={clearConversation}
              className="mt-4 inline-flex min-h-10 items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <LuRotateCcw aria-hidden="true" size={14} />
              New conversation
            </button>
          )}
        </section>
      )}

      <div ref={endRef} />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
        className="mobile-chat-composer pointer-events-none fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-background via-background/95 to-transparent pt-10"
      >
        <div className="page-gutter pointer-events-auto mx-auto w-full max-w-3xl pb-3">
          {error && (
            <div
              role="alert"
              className="mb-2 flex items-center justify-between gap-3 border-l-2 border-accent px-3 py-1.5 text-xs text-muted"
            >
              <span>{error}</span>
              <button
                type="button"
                onClick={() => ask(input)}
                disabled={!input.trim() || busy}
                className="shrink-0 font-medium text-foreground underline decoration-border underline-offset-4 hover:text-accent disabled:opacity-50"
              >
                Retry
              </button>
            </div>
          )}

          <div className="flex min-w-0 items-end gap-2 rounded-2xl border border-border bg-surface/95 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-colors focus-within:border-accent">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              maxLength={MAX_INPUT_LENGTH}
              onChange={(event) => {
                setInput(event.target.value);
                setError(null);
                resizeComposer();
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  ask(input);
                }
              }}
              placeholder="Ask about projects, experience, or availability…"
              aria-label="Message"
              aria-describedby="ask-ai-note"
              disabled={busy}
              className="min-h-10 min-w-0 flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 text-foreground placeholder:text-muted focus:outline-none disabled:opacity-60"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                aria-label="Stop response"
                title="Stop response"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground text-background transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <LuSquare aria-hidden="true" size={14} fill="currentColor" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                title="Send message"
                data-analytics-event="ask_submit"
                data-analytics-label="custom question"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <LuSend aria-hidden="true" size={16} />
              </button>
            )}
          </div>

          <div
            id="ask-ai-note"
            className="mt-2 flex items-center justify-between gap-3 font-mono text-[10px] text-muted/70"
          >
            <span>Gemini 2.5 Flash · via OpenRouter · responses may be imperfect</span>
            {input.length >= 400 && (
              <span aria-live="polite">
                {input.length}/{MAX_INPUT_LENGTH}
              </span>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
