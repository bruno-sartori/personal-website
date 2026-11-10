'use client';

import { Icon } from '@/components/ui/Icon';

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-neon"
    >
      <Icon name="arrowUp" className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
      back to top
    </button>
  );
}
