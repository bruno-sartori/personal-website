import { marked } from 'marked';
import { SITE } from './site';
import {
  absolutizeGithubUrls,
  excerpt,
  readingMinutes,
  withHeadingIds,
  type Heading,
} from './html';

const REVALIDATE = 60 * 60; // 1h

/* ------------------------------------------------------------------ */
/* Blog: Medium RSS via rss2json                                       */
/* ------------------------------------------------------------------ */

export interface Post {
  slug: string;
  title: string;
  link: string;
  date: string; // ISO
  categories: string[];
  excerpt: string;
  minutes: number;
  html: string;
  headings: Heading[];
}

interface RssItem {
  title: string;
  pubDate: string;
  link: string;
  description: string;
  content: string;
  categories: string[];
}

function toIso(rssDate: string): string {
  // rss2json returns "YYYY-MM-DD HH:mm:ss" in UTC
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(rssDate)
    ? `${rssDate.replace(' ', 'T')}Z`
    : rssDate;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function postSlug(link: string): string {
  return link.split('?')[0].replace(/\/+$/, '').split('/').pop() ?? link;
}

function cleanMediumHtml(html: string): string {
  return html
    .replace(/<img[^>]+medium\.com\/_\/stat[^>]*>/gi, '') // tracking pixel
    .replace(/<p>\s*<\/p>/g, '');
}

export async function getPosts(): Promise<Post[]> {
  const feed = `https://medium.com/feed/@${SITE.mediumUser}`;
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed)}`,
      { next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) throw new Error(`rss2json responded ${res.status}`);

    const payload = (await res.json()) as { status: string; items?: RssItem[] };
    if (payload.status !== 'ok' || !payload.items) return [];

    return payload.items
      .map((item) => {
        const { html, headings } = withHeadingIds(cleanMediumHtml(item.content || item.description));
        return {
          slug: postSlug(item.link),
          title: item.title,
          link: item.link.split('?')[0],
          date: toIso(item.pubDate),
          categories: item.categories ?? [],
          excerpt: excerpt(html),
          minutes: readingMinutes(html),
          html,
          headings,
        } satisfies Post;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('[content] failed to load posts', error);
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | undefined> {
  return (await getPosts()).find((post) => post.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Projects: GitHub public repositories                               */
/* ------------------------------------------------------------------ */

export interface Project {
  slug: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
  defaultBranch: string;
}

export interface ProjectDetail extends Project {
  html: string;
  headings: Heading[];
  minutes: number;
}

interface GithubRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  pushed_at: string;
  updated_at: string;
  default_branch: string;
  fork: boolean;
  private: boolean;
  archived: boolean;
}

function githubHeaders(accept = 'application/vnd.github+json'): HeadersInit {
  const headers: Record<string, string> = {
    Accept: accept,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const token = process.env.GITHUB_ACCESS_TOKEN?.trim();
  if (token) {
    headers.Authorization = /^(bearer|token)\s/i.test(token) ? token : `Bearer ${token}`;
  }
  return headers;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${SITE.githubUser}/repos?type=owner&sort=pushed&per_page=100`,
      { headers: githubHeaders(), next: { revalidate: REVALIDATE } },
    );
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);

    const repos = (await res.json()) as GithubRepo[];

    return repos
      .filter((repo) => !repo.fork && !repo.private && repo.name !== SITE.githubUser)
      .map((repo) => ({
        slug: repo.name,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description ?? '',
        url: repo.html_url,
        homepage: repo.homepage || null,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        topics: repo.topics ?? [],
        updatedAt: repo.pushed_at || repo.updated_at,
        defaultBranch: repo.default_branch,
      }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch (error) {
    console.error('[content] failed to load projects', error);
    return [];
  }
}

export async function getProject(slug: string): Promise<ProjectDetail | undefined> {
  const project = (await getProjects()).find((p) => p.slug === slug);
  if (!project) return undefined;

  let markdown = '';
  try {
    const res = await fetch(`https://api.github.com/repos/${project.fullName}/readme`, {
      headers: githubHeaders('application/vnd.github.raw+json'),
      next: { revalidate: REVALIDATE },
    });
    if (res.ok) markdown = await res.text();
  } catch (error) {
    console.error(`[content] failed to load README for ${slug}`, error);
  }

  const rendered = markdown ? await marked.parse(markdown, { gfm: true }) : '';
  const { html, headings } = withHeadingIds(
    absolutizeGithubUrls(rendered, project.fullName, project.defaultBranch),
  );

  return { ...project, html, headings, minutes: readingMinutes(html || project.description) };
}

/** Repos with a description first: they make better cards. */
export function featuredProjects(projects: Project[], count: number): Project[] {
  const described = projects.filter((p) => p.description);
  return [...described, ...projects.filter((p) => !p.description)].slice(0, count);
}
