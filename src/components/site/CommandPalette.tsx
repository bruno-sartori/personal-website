'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SITE, SOCIALS } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Icon, type IconName } from '@/components/ui/Icon';

type Group = 'Navigate' | 'Projects' | 'Posts' | 'Actions' | 'Ask AI';

/** Commands are plain data; `run()` below decides what each action does. */
type Action =
  | { type: 'go'; href: string }
  | { type: 'open'; href: string }
  | { type: 'copy'; value: string }
  | { type: 'ask'; question: string };

interface Command {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  icon: IconName;
  keywords?: string;
  action: Action;
}

interface Props {
  posts: { slug: string; title: string }[];
  projects: { slug: string; name: string; description: string }[];
}

const GROUP_ORDER: Group[] = ['Navigate', 'Projects', 'Posts', 'Actions', 'Ask AI'];

const NAV_COMMANDS: Command[] = [
  { id: 'nav-home', group: 'Navigate', label: 'Home', icon: 'home', hint: '/', action: { type: 'go', href: '/' } },
  { id: 'nav-ai', group: 'Navigate', label: 'How I work with AI', icon: 'sparkles', hint: '/#ai', keywords: 'agents workflow claude mcp', action: { type: 'go', href: '/#ai' } },
  { id: 'nav-projects', group: 'Navigate', label: 'Projects', icon: 'folder', hint: '/projects', keywords: 'repos github code', action: { type: 'go', href: '/projects' } },
  { id: 'nav-blog', group: 'Navigate', label: 'Blog', icon: 'book', hint: '/blog', keywords: 'posts articles writing medium', action: { type: 'go', href: '/blog' } },
  { id: 'nav-contact', group: 'Navigate', label: 'Contact', icon: 'mail', hint: '/#contact', keywords: 'email hire talk', action: { type: 'go', href: '/#contact' } },
];

const ACTION_COMMANDS: Command[] = [
  { id: 'copy-email', group: 'Actions', label: 'Copy email address', hint: SITE.email, icon: 'copy', keywords: 'mail contact', action: { type: 'copy', value: SITE.email } },
  ...SOCIALS.map<Command>((s) => ({
    id: `social-${s.name}`,
    group: 'Actions',
    label: `Open ${s.name}`,
    hint: s.handle,
    icon: s.icon,
    action: { type: 'open', href: s.href },
  })),
];

export default function CommandPalette({ posts, projects }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(
    () => [
      ...NAV_COMMANDS,
      ...projects.map<Command>((p) => ({
        id: `project-${p.slug}`,
        group: 'Projects',
        label: p.name,
        hint: 'repo',
        icon: 'folder',
        keywords: p.description,
        action: { type: 'go', href: `/projects/${p.slug}` },
      })),
      ...posts.map<Command>((p) => ({
        id: `post-${p.slug}`,
        group: 'Posts',
        label: p.title,
        hint: 'post',
        icon: 'book',
        action: { type: 'go', href: `/blog/${p.slug}` },
      })),
      ...ACTION_COMMANDS,
    ],
    [posts, projects],
  );

  const results = useMemo(() => {
    const question = query.trim();
    const tokens = question.toLowerCase().split(/\s+/).filter(Boolean);

    // With an empty query, only show a short "recent" slice of posts and projects.
    const recent = new Set([
      ...posts.slice(0, 3).map((p) => `post-${p.slug}`),
      ...projects.slice(0, 4).map((p) => `project-${p.slug}`),
    ]);

    const matched = tokens.length
      ? commands.filter((c) => {
          const haystack = `${c.label} ${c.keywords ?? ''} ${c.group}`.toLowerCase();
          return tokens.every((t) => haystack.includes(t));
        })
      : commands.filter((c) => (c.group !== 'Posts' && c.group !== 'Projects') || recent.has(c.id));

    const ask: Command[] = question
      ? [
          {
            id: 'ask-claude',
            group: 'Ask AI',
            label: `Ask Claude: “${question}”`,
            hint: 'reads /llms.txt',
            icon: 'sparkles',
            action: { type: 'ask', question },
          },
        ]
      : [];

    const all = [...matched, ...ask];
    return GROUP_ORDER.flatMap((g) => all.filter((c) => c.group === g)).slice(0, 40);
  }, [commands, posts, projects, query]);

  // Open / close shortcuts: ⌘K / Ctrl+K toggles, "/" opens, plus the header button event.
  useEffect(() => {
    const show = () => {
      returnFocus.current = document.activeElement as HTMLElement | null;
      setQuery('');
      setActive(0);
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName));
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener('palette:open', show);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('palette:open', show);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // While open: focus the input, lock page scroll; on close, give focus back.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = returnFocus.current;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;

  const run = (cmd: Command) => {
    const { action } = cmd;
    switch (action.type) {
      case 'go':
        setOpen(false);
        router.push(action.href);
        break;
      case 'open':
        setOpen(false);
        window.open(action.href, '_blank', 'noopener,noreferrer');
        break;
      case 'copy':
        navigator.clipboard?.writeText(action.value).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        });
        break;
      case 'ask': {
        const prompt = `Read ${window.location.origin}/llms.txt and answer this question about ${SITE.name}: ${action.question}`;
        setOpen(false);
        window.open(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer');
        break;
      }
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[active]) run(results[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      e.preventDefault(); // keep focus inside the dialog
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-start justify-center bg-ink/70 px-4 pt-[12vh] backdrop-blur-md"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="palette-in panel hud w-full max-w-xl overflow-hidden shadow-[0_40px_120px_-30px_rgba(34,211,238,0.35)]"
      >
        <span className="hud-corners" aria-hidden="true" />
        <div className="flex items-center gap-3 border-b border-line/8 px-4">
          <span className="font-mono text-neon">❯</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Jump to a page, search, or ask a question…"
            className="h-14 w-full bg-transparent font-mono text-sm text-white placeholder:text-muted focus:outline-hidden"
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
            const header = index === 0 || results[index - 1].group !== cmd.group ? cmd.group : null;
            const isCopied = cmd.action.type === 'copy' && copied;
            return (
              <li key={cmd.id} role="presentation">
                {header && (
                  <p className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.2em] text-muted/80 uppercase">
                    {header}
                  </p>
                )}
                <div
                  id={`cmd-${cmd.id}`}
                  role="option"
                  aria-selected={index === active}
                  data-index={index}
                  onMouseMove={() => setActive(index)}
                  onClick={() => run(cmd)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    index === active ? 'bg-neon/9 text-white' : 'text-fg/75',
                    cmd.group === 'Ask AI' && 'text-plasma',
                  )}
                >
                  <Icon
                    name={isCopied ? 'check' : cmd.icon}
                    className={cn('size-4', index === active ? 'text-neon' : 'text-muted', isCopied && 'text-signal')}
                  />
                  <span className="min-w-0 flex-1 truncate">{isCopied ? 'Copied to clipboard' : cmd.label}</span>
                  {cmd.hint && <span className="shrink-0 font-mono text-[11px] text-muted">{cmd.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-4 border-t border-line/8 px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
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
