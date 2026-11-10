import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

export const runtime = 'edge';
export const alt = `${SITE.name}, senior software engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#05070d',
          backgroundImage:
            'radial-gradient(circle at 15% 0%, rgba(34,211,238,0.28), transparent 45%), radial-gradient(circle at 90% 10%, rgba(167,139,250,0.3), transparent 45%)',
          color: '#e4e9f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: '#808aa0' }}>
          <div style={{ width: 14, height: 14, borderRadius: 999, background: '#4ade80', display: 'flex' }} />
          bruno.sartori · {SITE.location}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, color: '#fff', lineHeight: 1.05 }}>
            Hi, I&apos;m Bruno Sartori.
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1.05,
              backgroundImage: 'linear-gradient(90deg, #22d3ee, #a78bfa 60%, #e879f9)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Senior software engineer.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#808aa0' }}>
          <span style={{ color: '#e4e9f5' }}>{SITE.name}</span>
          <span>C# · .NET · TypeScript · React · AI</span>
        </div>
      </div>
    ),
    size,
  );
}
