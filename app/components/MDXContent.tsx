import { MDXRemote } from "next-mdx-remote/rsc";
import type { ComponentProps } from "react";

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const components = {
  h1: (props: ComponentProps<"h1">) => {
    const text = props.children?.toString() || "";
    const id = generateId(text);
    return (
      <h1
        id={id}
        className="mt-8 mb-4 text-xl font-semibold text-foreground tracking-tight sm:text-2xl"
        {...props}
      />
    );
  },
  h2: (props: ComponentProps<"h2">) => {
    const text = props.children?.toString() || "";
    const id = generateId(text);
    return (
      <h2
        id={id}
        className="mt-10 mb-3 scroll-mt-24 border-b-2 border-accent/60 pb-2 text-lg font-bold tracking-tight text-foreground sm:text-xl"
        {...props}
      />
    );
  },
  h3: (props: ComponentProps<"h3">) => {
    const text = props.children?.toString() || "";
    const id = generateId(text);
    return (
      <h3
        id={id}
        className="mt-8 mb-3 scroll-mt-24 text-base font-semibold tracking-tight text-foreground sm:text-lg"
        {...props}
      />
    );
  },
  p: (props: ComponentProps<"p">) => (
    <p className="my-4 text-[15px] leading-relaxed text-muted sm:text-base" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a
      className="text-accent hover:underline underline-offset-4"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul
      className="my-4 list-disc space-y-1.5 pl-5 text-[15px] text-muted marker:text-accent sm:pl-6 sm:text-base"
      {...props}
    />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol
      className="my-4 list-decimal space-y-1.5 pl-5 text-[15px] text-muted marker:text-accent sm:pl-6 sm:text-base"
      {...props}
    />
  ),
  li: (props: ComponentProps<"li">) => (
    <li className="leading-relaxed" {...props} />
  ),
  code: (props: ComponentProps<"code">) => {
    const isBlock =
      typeof props.className === "string" &&
      props.className.startsWith("language-");
    if (isBlock) {
      return <code className="font-mono text-sm text-foreground" {...props} />;
    }
    return (
      <code
        className="rounded bg-surface text-accent px-1.5 py-0.5 font-mono text-[0.9em]"
        {...props}
      />
    );
  },
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="my-5 overflow-x-auto rounded-lg border border-border bg-surface p-3 font-mono text-xs text-foreground sm:p-4 sm:text-sm"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="my-5 border-l-2 border-accent pl-4 text-muted italic"
      {...props}
    />
  ),
  hr: (props: ComponentProps<"hr">) => (
    <hr className="my-8 border-border" {...props} />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
};

export default function MDXContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
