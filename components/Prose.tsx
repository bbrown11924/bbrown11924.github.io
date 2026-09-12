import { cn } from "@/lib/utils";

/**
 * Renders pre-converted Markdown HTML (from lib/content.ts) with sensible
 * typographic defaults. The HTML comes from our own /content files, not
 * user input, so dangerouslySetInnerHTML is safe here.
 */
export default function Prose({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-gray max-w-none",
        "prose-headings:font-semibold prose-a:text-current",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
