import type { Heading } from '@/lib/html';
import { cn } from '@/lib/utils';

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;
  const top = Math.min(...headings.map((h) => h.depth));
  const items = headings.filter((h) => h.depth <= top + 1);

  return (
    <nav aria-label="Table of contents" className="panel p-5">
      <p className="kicker text-muted">On this page</p>
      <ol className="mt-4 space-y-2 border-l border-line/[0.08]">
        {items.map((h) => (
          <li key={h.slug}>
            <a
              href={`#${h.slug}`}
              className={cn(
                '-ml-px block border-l border-transparent py-0.5 text-sm leading-snug text-fg/55 transition-colors hover:border-neon hover:text-white',
                h.depth === top ? 'pl-4' : 'pl-7 text-[13px]',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
