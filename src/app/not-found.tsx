import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[70vh] flex-col items-center justify-center pt-32 text-center">
      <p className="rise kicker">Error 404</p>
      <h1
        className="rise mt-5 font-mono text-[clamp(4rem,14vw,9rem)] font-medium leading-none tracking-[-0.06em] text-gradient"
        style={{ '--d': '80ms' } as React.CSSProperties}
      >
        404
      </h1>
      <p className="rise mt-6 text-xl font-medium text-white" style={{ '--d': '160ms' } as React.CSSProperties}>
        Signal lost.
      </p>
      <div
        className="rise panel mt-8 w-full max-w-md px-5 py-4 text-left font-mono text-xs leading-6"
        style={{ '--d': '240ms' } as React.CSSProperties}
      >
        <p>
          <span className="text-neon">❯</span> <span className="text-white">resolve route</span>
        </p>
        <p className="text-amber-300">! no matching page in this sector</p>
        <p className="text-muted">◇ suggestion: return to base</p>
      </div>
      <Link href="/" className="rise btn-primary mt-10" style={{ '--d': '320ms' } as React.CSSProperties}>
        <Icon name="home" className="size-4" /> Back home
      </Link>
    </div>
  );
}
