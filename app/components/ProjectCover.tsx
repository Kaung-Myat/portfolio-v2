import Image from "next/image";

export default function ProjectCover({
  title,
  cover,
  sizes,
}: {
  title: string;
  cover?: string;
  sizes: string;
}) {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface to-background">
      {cover ? (
        <Image
          src={cover}
          alt={`${title} project preview`}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center font-mono text-3xl font-semibold text-foreground/30">
          {title[0]}
        </span>
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-background/25 via-transparent to-accent/5"
      />
    </div>
  );
}
