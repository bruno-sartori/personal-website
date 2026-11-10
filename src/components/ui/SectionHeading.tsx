import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export default function SectionHeading({
  index,
  kicker,
  title,
  description,
  action,
  className,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl" data-reveal>
        <p className="kicker flex items-center gap-3">
          <span className="text-muted">{index}</span>
          <span className="h-px w-8 bg-gradient-to-r from-neon/70 to-transparent" aria-hidden="true" />
          {kicker}
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-4 text-base leading-relaxed text-fg/60">{description}</p>}
      </div>
      {action && <div data-reveal>{action}</div>}
    </div>
  );
}
