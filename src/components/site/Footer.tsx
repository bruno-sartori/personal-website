import Link from 'next/link';
import { SITE, SOCIALS } from '@/lib/site';
import { Icon, Logo } from '@/components/ui/Icon';
import BackToTop from './BackToTop';

const LINKS = [
  { label: 'home', href: '/' },
  { label: 'ai workflow', href: '/#ai' },
  { label: 'projects', href: '/projects' },
  { label: 'blog', href: '/blog' },
  { label: 'llms.txt', href: '/llms.txt' },
];

export default function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line/[0.06] bg-ink/40 backdrop-blur-sm">
      <div className="container-site grid gap-12 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo id="footer-logo" />
            <span className="font-mono text-sm text-white">
              bruno<span className="text-neon">.</span>sartori
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">
            Senior software engineer from Brazil. Backend in C#, front-end roots, and AI in my daily workflow.
          </p>
          <p className="mt-6 inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg/60">
            <span className="status-dot" /> all systems nominal
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="kicker text-muted">Navigate</p>
          <ul className="mt-5 space-y-2.5">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-mono text-sm text-fg/70 transition-colors hover:text-neon">
                  <span className="text-neon/50">/</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="kicker text-muted">Elsewhere</p>
          <ul className="mt-5 space-y-2.5">
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2.5 text-sm text-fg/70 transition-colors hover:text-white"
                >
                  <Icon name={social.icon} className="size-4 text-muted group-hover:text-neon" />
                  {social.name}
                  <Icon
                    name="arrowUpRight"
                    className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="group inline-flex items-center gap-2.5 text-sm text-fg/70 transition-colors hover:text-white"
              >
                <Icon name="mail" className="size-4 text-muted group-hover:text-neon" />
                Email
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line/[0.06]">
        <div className="container-site flex flex-col items-start justify-between gap-4 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}</p>
          <p className="normal-case tracking-normal">Designed &amp; built with an AI pair programmer · Next.js</p>
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
