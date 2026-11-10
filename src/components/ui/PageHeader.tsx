import type { ReactNode } from 'react';

export default function PageHeader({
  kicker,
  title,
  description,
  meta,
}: {
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="max-w-3xl">
      <p className="rise kicker flex items-center gap-3">
        <span className="h-px w-8 bg-linear-to-r from-neon/70 to-transparent" aria-hidden="true" />
        {kicker}
      </p>
      <h1
        className="rise mt-5 text-5xl font-semibold tracking-[-0.045em] text-white sm:text-6xl"
        style={{ '--d': '80ms' } as React.CSSProperties}
      >
        {title}
      </h1>
      {description && (
        <p className="rise mt-5 text-lg leading-relaxed text-fg/60" style={{ '--d': '160ms' } as React.CSSProperties}>
          {description}
        </p>
      )}
      {meta && (
        <p
          className="rise mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
          style={{ '--d': '240ms' } as React.CSSProperties}
        >
          {meta}
        </p>
      )}
    </header>
  );
}
