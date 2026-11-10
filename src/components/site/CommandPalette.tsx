'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SITE, SOCIALS } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';

type Group = 'Navigate' | 'Projects' | 'Posts' | 'Actions' | 'Ask AI';

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: IconName;
  keywords?: string;
  run: () => void;
}

interface Props {
  posts: { slug: string; title: string }[];
  projects: { slug: string; name: string; description: string }[];
}

const GROUP_ORDER: Group[] = ['Navigate', 'Projects', 'Posts', 'Actions', 'Ask AI'];

export default function CommandPalette({ posts, projects }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    returnFocus.current?.focus?.();
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  const external = useCallback(
    (href: string) => {
      close();
      window.open(href, '_blank', 'noopener,noreferrer');
    },
    [close],
  );

  const baseCommands = useMemo<Command[]>(
    () => [
      { id: 'nav-home', group: 'Navigate', label: 'Home', icon: 'home', hint: '/', run: () => go('/') },
      { id: 'nav-ai', group: 'Navigate', label: 'How I work with AI', icon: 'sparkles', hint: '/#ai', keywords: 'agents workflow claude mcp', run: () => go('/#ai') },
      { id: 'nav-projects', group: 'Navigate', label: 'Projects', icon: 'folder', hint: '/projects', keywords: 'repos github code', run: () => go('/projects') },
      { id: 'nav-blog', group: 'Navigate', label: 'Blog', icon: 'book', hint: '/blog', keywords: 'posts articles writing medium', run: () => go('/blog') },
      { id: 'nav-contact', group: 'Navigate', label: 'Contact', icon: 'mail', hint: '/#contact', keywords: 'email hire talk', run: () => go('/#contact') },
      ...projects.map<Command>((p) => ({
        id: `project-${p.slug}`,
        group: 'Projects',
        label: p.name,
        hint: 'repo',
        icon: 'folder',
        keywords: p.description,
        run: () => go(`/projects/${p.slug}`),
      })),
      ...posts.map<Command>((p) => ({
        id: `post-${p.slug}`,
        group: 'Posts',
        label: p.title,
        hint: 'post',
        icon: 'book',
        run: () => go(`/blog/${p.slug}`),
      })),
      {
        id: 'copy-email',
        group: 'Actions',
        label: copied ? 'Copied to clipboard' : 'Copy email address',
        hint: SITE.email,
        icon: copied ? 'check' : 'copy',
        keywords: 'mail contact',
        run: () => {
          navigator.clipboard?.writeText(SITE.email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
          });
        },
      },
      ...SOCIALS.map<Command>((s) => ({
        id: `social-${s.name}`,
        group: 'Actions',
        label: `Open ${s.name}`,
        hint: s.handle,
        icon: s.icon,
        run: () => external(s.href),
      })),
    ],
    [copied, external, go, posts, projects],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    // With an empty query, only show a short "recent" slice of posts and projects.
    const recent = new Set([
      ...posts.slice(0, 3).map((p) => `post-${p.slug}`),
      ...projects.slice(0, 4).map((p) => `project-${p.slug}`),
    ]);
    const matched = tokens.length
      ? baseCommands.filter((c) => {
          const haystack = `${c.label} ${c.keywords ?? ''} ${c.group}`.toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        })
      : baseCommands.filter((c) => (c.group !== 'Posts' && c.group !== 'Projects') || recent.has(c.id));

    const ask: Command[] = q
      ? [
          {
            id: 'ask-claude',
            group: 'Ask AI',
            label: `Ask Claude: “${query.trim()}”`,
            hint: 'reads /llms.txt',
            icon: 'sparkles',
            run: () => {
              const prompt = `Read ${window.location.origin}/llms.txt and answer this question about Bruno Sartori: ${query.trim()}`;
              external(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`);
            },
          },
        ]
      : [];

    const all = [...matched, ...ask];
    return GROUP_ORDER.flatMap((g) => all.filter((c) => c.group === g)).slice(0, 40);
  }, [baseCommands, external, posts, projects, query]);

  // open / close shortcuts
  useEffect(() => {
    const onOpen = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName));
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) close();
        else onOpen();
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        onOpen();
      }
    };
    window.addEventListener('palette:open', onOpen);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('palette:open', onOpen);
      window.removeEventListener('keydown', onKey);
    };
  }, [close, open]);

  // focus + scroll lock
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[active]?.run();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  let lastGroup: Group | null = null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-in panel hud w-full max-w-xl overflow-hidden shadow-[0_40px_120px_-30px_rgba(34,211,238,0.35)]"
      >
        <span className="hud-corners" aria-hidden="true" />
        <div className="flex items-center gap-3 border-b border-line/[0.08] px-4">
          <span className="font-mono text-neon">❯</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
            placeholder="Jump to a page, search, or ask a question…"
            className="h-14 w-full bg-transparent font-mono text-sm text-white placeholder:text-muted focus:outline-none"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="rounded-md border border-line/10 px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
        </div>

        <ul id="palette-results" ref={listRef} role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-10 text-center font-mono text-xs text-muted">no signal. try another query</li>
          )}
          {results.map((cmd, index) => {
            const header = cmd.group !== lastGroup ? cmd.group : null;
            lastGroup = cmd.group;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <p className="px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/80">
                    {header}
                  </p>
                )}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={() => cmd.run()}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    index === active ? 'bg-neon/[0.09] text-white' : 'text-fg/75',
                    cmd.group === 'Ask AI' && 'text-plasma',
                  )}
                >
                  <Icon
                    name={cmd.icon}
                    className={cn('size-4', index === active ? 'text-neon' : 'text-muted')}
                  />
                  <span className="min-w-0 flex-1 truncate">{cmd.label}</span>
                  {cmd.hint && <span className="shrink-0 font-mono text-[11px] text-muted">{cmd.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-line/[0.08] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          <span className="flex items-center gap-3">
            <span>↑↓ move</span>
            <span>↵ open</span>
          </span>
          <span className="flex items-center gap-2">
            <Icon name="sparkles" className="size-3 text-plasma" /> type a question to ask AI
          </span>
        </div>
      </div>
    </div>
  );
}
