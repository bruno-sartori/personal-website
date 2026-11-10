import type { Metadata, Viewport } from 'next';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';
import './globals.css';

import { SITE } from '@/lib/site';
import { getPosts, getProjects } from '@/lib/content';
import Background from '@/components/site/Background';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import CommandPalette from '@/components/site/CommandPalette';
import Effects from '@/components/site/Effects';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    creator: SITE.twitter,
    title: SITE.title,
    description: SITE.description,
  },
  alternates: {
    types: { 'text/plain': '/llms.txt' },
  },
};

export const viewport: Viewport = {
  themeColor: '#05070d',
  colorScheme: 'dark',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Background />
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CommandPalette
          posts={posts.map(({ slug, title }) => ({ slug, title }))}
          projects={projects.map(({ slug, name, description }) => ({ slug, name, description }))}
        />
        <Effects />
      </body>
    </html>
  );
}
