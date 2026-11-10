export interface Heading {
  depth: number;
  slug: string;
  text: string;
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&nbsp;': ' ',
};

export function decodeEntities(text: string): string {
  return text
    .replace(/&(amp|lt|gt|quot|nbsp|#39|#x27);/g, (m) => ENTITIES[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export function excerpt(html: string, length = 180): string {
  // Skip images/captions and headings so the excerpt starts at real prose.
  const prose = html
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/gi, ' ');
  const text = (stripHtml(prose) || stripHtml(html)).replace(/^by\s+\S+\s+\S+\s+/i, ''); // Medium byline
  if (text.length <= length) return text;
  return `${text.slice(0, length).replace(/\s+\S*$/, '')}…`;
}

export function readingMinutes(html: string): number {
  const words = stripHtml(html).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Gives every heading a stable id (so the table of contents can link to it)
 * and returns the list of headings found.
 */
export function withHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();

  const out = html.replace(
    /<h([1-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string | undefined, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return match;

      let attributes = attrs ?? '';
      let id = /\sid="([^"]+)"/i.exec(attributes)?.[1];

      if (!id) {
        const base = slugify(text) || 'section';
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        id = count ? `${base}-${count}` : base;
        attributes = `${attributes} id="${id}"`;
      }

      headings.push({ depth: Number(level), slug: id, text });
      return `<h${level}${attributes}>${inner}</h${level}>`;
    },
  );

  return { html: out, headings };
}

/** Rewrites relative links/images in a rendered README so they point to GitHub. */
export function absolutizeGithubUrls(html: string, repo: string, branch: string): string {
  const isRelative = (url: string) => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:)/i.test(url);
  const clean = (url: string) => url.replace(/^\.?\//, '');

  return html
    .replace(/(<img[^>]*\ssrc=")([^"]+)(")/gi, (m, pre: string, url: string, post: string) =>
      isRelative(url) ? `${pre}https://raw.githubusercontent.com/${repo}/${branch}/${clean(url)}${post}` : m,
    )
    .replace(/(<a[^>]*\shref=")([^"]+)(")/gi, (m, pre: string, url: string, post: string) =>
      isRelative(url) ? `${pre}https://github.com/${repo}/blob/${branch}/${clean(url)}${post}` : m,
    );
}
