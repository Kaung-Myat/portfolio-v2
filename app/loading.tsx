function SkeletonLine({ className }: { className: string }) {
  return <div className={`rounded-sm bg-muted/15 ${className}`} />;
}

export default function Loading() {
  return (
    <main
      className="page-gutter flex w-full flex-1 flex-col pb-20 pt-24 sm:py-28"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading page</span>
      <div className="mx-auto w-full max-w-5xl animate-pulse motion-reduce:animate-none">
        <div className="max-w-2xl">
          <SkeletonLine className="h-3 w-32" />
          <SkeletonLine className="mt-5 h-9 w-4/5 max-w-md sm:h-11" />
          <SkeletonLine className="mt-4 h-4 w-full max-w-xl" />
          <SkeletonLine className="mt-2 h-4 w-3/4 max-w-md" />
        </div>

        <div className="mt-12 border-b border-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-6 border-t border-border py-8 md:grid-cols-12 md:items-center md:gap-10"
            >
              <div className="md:col-span-7">
                <SkeletonLine className="h-3 w-20" />
                <SkeletonLine className="mt-5 h-7 w-2/3" />
                <SkeletonLine className="mt-4 h-3 w-full" />
                <SkeletonLine className="mt-2 h-3 w-4/5" />
              </div>
              <div className="aspect-[16/9] rounded-lg bg-muted/10 md:col-span-5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
