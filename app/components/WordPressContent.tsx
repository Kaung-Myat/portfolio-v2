import type { TocHeading } from "@/src/lib/content";

function slugifyHeading(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/&[^;]+;/g, " ")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

export function prepareWordPressContent(contentHtml: string): {
  html: string;
  headings: TocHeading[];
} {
  const headings: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  const html = contentHtml.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (
      headingHtml,
      levelValue: string,
      attributes: string,
      innerHtml: string,
    ) => {
      const level = Number(levelValue);
      const text = innerHtml.replace(/<[^>]*>/g, "").trim();
      const existingId = attributes.match(/\sid=["']([^"']+)["']/i)?.[1];
      const baseId =
        existingId || slugifyHeading(text) || `section-${headings.length + 1}`;
      const occurrence = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, occurrence + 1);
      const id = occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`;

      headings.push({ id, text, level });

      if (existingId && id === existingId) return headingHtml;
      const attributesWithoutId = attributes.replace(
        /\s+id=["'][^"']+["']/i,
        "",
      );
      return `<h${levelValue}${attributesWithoutId} id="${id}">${innerHtml}</h${levelValue}>`;
    },
  );

  return { html, headings };
}

export default function WordPressContent({ html }: { html: string }) {
  return (
    <div
      className="wordpress-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
