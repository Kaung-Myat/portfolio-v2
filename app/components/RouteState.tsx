import Link from "next/link";
import type { ReactNode } from "react";

export function RouteState({
  code,
  eyebrow,
  title,
  description,
  children,
}: {
  code: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <main className="page-gutter flex min-h-[calc(100dvh-5rem)] w-full flex-1 items-center py-24 sm:py-28">
      <section className="relative mx-auto w-full max-w-3xl overflow-hidden border-y border-border py-10 sm:py-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-10 select-none font-mono text-[7rem] font-semibold leading-none text-accent/8 sm:right-4 sm:text-[10rem]"
        >
          {code}
        </span>

        <div className="relative max-w-xl">
          <p className="font-mono text-xs text-accent sm:text-sm">
            {`// ${eyebrow}`}
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Error {code}
          </p>
          <h1 className="mt-3 text-[1.9rem] font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted sm:text-base">
            {description}
          </p>

          {children && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {children}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export function StateLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        primary
          ? "bg-accent text-background hover:bg-accent/90"
          : "border border-border text-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </Link>
  );
}
