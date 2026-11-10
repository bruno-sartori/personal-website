function resolveSiteUrl(): string {
  const raw =
    process.env.PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL || // injected by Vercel
    process.env.VERCEL_URL ||
    'http://localhost:3000';
  try {
    return new URL(raw.startsWith('http') ? raw : `https://${raw}`).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

export const SITE = {
  name: 'Bruno Sartori',
  handle: 'bruno.sartori',
  role: 'Senior Software Engineer',
  title: 'Bruno Sartori · Senior Software Engineer',
  description:
    'Senior software engineer from Brazil: C#/.NET on the backend, TypeScript and React on the front-end, OTT and smart TV experience, and AI agents in the daily workflow.',
  email: 'brunosartori.dev@gmail.com',
  location: 'São Paulo, Brazil',
  timezone: 'UTC−3',
  githubUser: 'bruno-sartori',
  mediumUser: 'brunosartori.dev',
  twitter: '@brunosartoridev',
  url: resolveSiteUrl(),
} as const;

export const SOCIALS = [
  { name: 'GitHub', handle: 'bruno-sartori', href: 'https://github.com/bruno-sartori', icon: 'github' },
  { name: 'LinkedIn', handle: 'bruno-sartori-dev', href: 'https://www.linkedin.com/in/bruno-sartori-dev', icon: 'linkedin' },
  { name: 'Medium', handle: '@brunosartori.dev', href: 'https://medium.com/@brunosartori.dev', icon: 'medium' },
  { name: 'X', handle: '@brunosartoridev', href: 'https://x.com/brunosartoridev', icon: 'x' },
] as const;

export const NAV = [
  { label: 'ai', href: '/#ai' },
  { label: 'projects', href: '/projects' },
  { label: 'blog', href: '/blog' },
  { label: 'contact', href: '/#contact' },
] as const;
