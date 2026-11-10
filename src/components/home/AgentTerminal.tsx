'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type Kind = 'ctx' | 'tool' | 'ok' | 'warn' | 'gate';

interface Step {
  kind: Kind;
  label: string;
  text: string;
}

interface Session {
  name: string;
  prompt: string;
  steps: Step[];
}

const SESSIONS: Session[] = [
  {
    name: 'billing-api',
    prompt: 'add retry with backoff to the webhook consumer',
    steps: [
      { kind: 'ctx', label: 'context', text: 'wiki/billing · 18 pages · 3 ADRs' },
      { kind: 'ctx', label: 'plan', text: '3 steps · 4 files · approved by human' },
      { kind: 'tool', label: 'grep', text: '"IWebhookConsumer" → 6 hits' },
      { kind: 'tool', label: 'edit', text: 'src/Billing/WebhookConsumer.cs' },
      { kind: 'tool', label: 'bash', text: 'dotnet test Billing.Tests' },
      { kind: 'ok', label: 'tests', text: '142 passed · 0 failed · 8.4s' },
      { kind: 'gate', label: 'review', text: 'diff +96 −21 · waiting for human approval' },
    ],
  },
  {
    name: 'kb-sync',
    prompt: '/kb-sync --since last-release',
    steps: [
      { kind: 'ctx', label: 'fetch', text: 'docs site · 64 pages' },
      { kind: 'ctx', label: 'diff', text: '5 changed · 1 new release note' },
      { kind: 'tool', label: 'write', text: 'wiki/releases/latest.md' },
      { kind: 'tool', label: 'write', text: 'wiki/breaking-changes.md' },
      { kind: 'warn', label: 'flag', text: 'docs vs code disagree on auth timeout' },
      { kind: 'ok', label: 'index', text: 'index + log updated' },
      { kind: 'gate', label: 'handoff', text: '1 contradiction needs a human decision' },
    ],
  },
  {
    name: 'off-duty',
    prompt: 'what should I watch this season?',
    steps: [
      { kind: 'tool', label: 'mcp', text: 'myanimelist.get_anime_list → 480+ completed' },
      { kind: 'tool', label: 'mcp', text: 'myanimelist.get_seasonal_anime(fall)' },
      { kind: 'ctx', label: 'think', text: 'scoring against taste profile…' },
      { kind: 'ok', label: 'picks', text: '5 shows · isekai ×2 · romcom ×2 · shounen ×1' },
      { kind: 'gate', label: 'done', text: 'watchlist drafted · final call is mine' },
    ],
  },
];

const KIND_STYLE: Record<Kind, { glyph: string; className: string }> = {
  ctx: { glyph: '◇', className: 'text-neon' },
  tool: { glyph: '⚙', className: 'text-plasma' },
  ok: { glyph: '✓', className: 'text-signal' },
  warn: { glyph: '!', className: 'text-amber-300' },
  gate: { glyph: '◆', className: 'text-flux' },
};

const SPINNER = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export default function AgentTerminal() {
  const [session, setSession] = useState(0);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const [spin, setSpin] = useState(0);
  const [reduced, setReduced] = useState(false);

  const current = SESSIONS[session];
  const typing = typed < current.prompt.length;
  const running = !typing && shown < current.steps.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
  }, []);

  // Timeline for the current session.
  useEffect(() => {
    if (reduced) {
      setTyped(SESSIONS[session].prompt.length);
      setShown(SESSIONS[session].steps.length);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(setTimeout(() => !cancelled && fn(), ms));

    const { prompt, steps } = SESSIONS[session];
    setTyped(0);
    setShown(0);

    let t = 500;
    for (let i = 1; i <= prompt.length; i++) {
      t += 26 + Math.random() * 40;
      at(t, () => setTyped(i));
    }
    t += 450;
    steps.forEach((_, i) => {
      t += 380 + Math.random() * 520;
      at(t, () => setShown(i + 1));
    });
    t += 4200;
    at(t, () => setSession((s) => (s + 1) % SESSIONS.length));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [session, reduced]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSpin((s) => (s + 1) % SPINNER.length), 80);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="panel hud relative overflow-hidden shadow-[0_30px_120px_-40px_rgba(34,211,238,0.45)]">
      <span className="hud-corners" aria-hidden="true" />

      {/* title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-line/[0.08] px-4 py-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-[3px] bg-line/15" />
          <span className="size-2.5 rounded-[3px] bg-line/15" />
          <span className="size-2.5 rounded-[3px] bg-neon/60" />
        </div>
        <p className="truncate font-mono text-[11px] text-muted">
          agent://session/<span className="text-fg/80">{current.name}</span>
        </p>
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-signal">
          <span className="status-dot" /> live
        </p>
      </div>

      {/* body */}
      <div
        className="scanlines relative h-[300px] px-4 py-4 font-mono text-[12.5px] leading-6 sm:h-[312px] sm:px-5"
        role="img"
        aria-label={`Animated example of an AI agent session: ${current.prompt}`}
      >
        <p className="text-white">
          <span className="text-neon">❯</span> agent{' '}
          <span className="text-fg/90">&quot;{current.prompt.slice(0, typed)}</span>
          {!typing && <span className="text-fg/90">&quot;</span>}
          {typing && <span className="caret" />}
        </p>

        <ul className="mt-2 space-y-0.5">
          {current.steps.slice(0, shown).map((step, i) => {
            const style = KIND_STYLE[step.kind];
            return (
              <li key={`${session}-${i}`} className="rise flex min-w-0 gap-3" style={{ animationDuration: '0.35s' }}>
                <span className={cn('w-[5.5rem] shrink-0', style.className)}>
                  {style.glyph} {step.label}
                </span>
                <span className={cn('min-w-0 truncate', step.kind === 'gate' ? 'text-white' : 'text-fg/65')}>
                  {step.text}
                </span>
              </li>
            );
          })}
          {running && (
            <li className="flex gap-3 text-muted">
              <span className="w-[5.5rem] shrink-0 text-neon">{SPINNER[spin]} working</span>
            </li>
          )}
        </ul>

        {!typing && !running && (
          <p className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white sm:left-5">
            <span className="text-neon">❯</span>
            <span className="caret" />
          </p>
        )}
      </div>

      {/* status bar */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line/[0.08] bg-ink/40 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        <span>
          mode <span className="text-neon">plan → act</span>
        </span>
        <span>
          approvals <span className="text-flux">required</span>
        </span>
        <span className="max-sm:hidden">
          session {session + 1}/{SESSIONS.length}
        </span>
      </div>
    </div>
  );
}
