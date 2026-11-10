import type { MetadataRoute } from 'next';
import { getPosts, getProjects } from '@/lib/content';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);

  return [
    { url: SITE.url, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/projects`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/blog`, changeFrequency: 'weekly', priority: 0.8 },
    ...projects.map((p) => ({ url: `${SITE.url}/projects/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${SITE.url}/blog/${p.slug}`, lastModified: p.date, priority: 0.6 })),
  ];
}
