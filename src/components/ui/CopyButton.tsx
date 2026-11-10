'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from './Icon';

export default function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1800);
        } catch {
          /* clipboard unavailable: ignore */
        }
      }}
      className={cn('btn-ghost', className)}
      aria-live="polite"
    >
      <Icon name={copied ? 'check' : 'copy'} className={cn('size-4', copied && 'text-signal')} />
      {copied ? 'Copied' : label}
    </button>
  );
}
