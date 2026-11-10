'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Icon, Logo } from '@/components/ui/Icon';

export function openPalette() {
  window.dispatchEvent(new Event('palette:open'));
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [modKey, setModKey] = useState('⌘');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) setModKey('Ctrl');
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[padding] duration-300',
        scrolled ? 'py-3' : 'py-5',
      )}
    >
      <div className="container-site">
        <div
          className={cn(
            'flex items-center justify-between gap-4 rounded-2xl border px-3 py-2 transition-all duration-300',
            scrolled
              ? 'border-line/10 bg-ink/70 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl'
              : 'border-transparent',
          )}
        >
          <Link href="/" className="group flex items-center gap-3" aria-label="Bruno Sartori, home">
            <Logo id="header-logo" className="transition-transform duration-500 group-hover:rotate-[30deg]" />
            <span className="font-mono text-sm tracking-tight text-white">
              bruno<span className="text-neon">.</span>sartori
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = !item.href.includes('#') && pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-lg px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] transition-colors',
                    active ? 'bg-line/[0.07] text-white' : 'text-muted hover:text-white',
                  )}
                >
                  <span className="text-neon/60">/</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={openPalette}
            className="group flex items-center gap-2.5 rounded-xl border border-line/10 bg-line/[0.03] py-1.5 pl-3 pr-1.5 text-xs text-muted transition-colors hover:border-neon/40 hover:text-white"
            aria-label="Open command palette"
          >
            <Icon name="search" className="size-4 text-neon/80 max-md:hidden" />
            <Icon name="menu" className="size-4 text-neon/80 md:hidden" />
            <span className="font-mono max-md:hidden">search · ask</span>
            <span className="font-mono md:hidden">menu</span>
            <kbd className="rounded-md border border-line/10 bg-ink/80 px-1.5 py-0.5 font-mono text-[10px] text-fg/70 max-sm:hidden">
              {modKey} K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
