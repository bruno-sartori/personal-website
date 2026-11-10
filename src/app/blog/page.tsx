import type { Metadata } from 'next';
import { getPosts, type Post } from '@/lib/content';
import PostRow from '@/components/ui/PostRow';
import PageHeader from '@/components/ui/PageHeader';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Write-ups on tooling, versioning, AI-assisted engineering and the craft of shipping software.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  const byYear = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = post.date.slice(0, 4);
    (acc[year] ??= []).push(post);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="container-site pt-36 sm:pt-44">
      <PageHeader
        kicker="Transmissions"
        title="Blog"
        description="Write-ups on tooling, versioning and the craft of shipping software. Published on Medium and mirrored here."
        meta={`${posts.length} posts · feed: medium.com/@brunosartori.dev`}
      />

      {years.length === 0 && (
        <p className="panel mt-16 px-6 py-10 text-center font-mono text-xs text-muted">
          <span className="text-amber-300">!</span> The Medium feed is not answering right now. Try again in a minute.
        </p>
      )}

      <div className="mt-16 space-y-16">
        {years.map((year) => (
          <section key={year} aria-labelledby={`year-${year}`} className="grid grid-cols-1 gap-6 lg:grid-cols-[10rem_minmax(0,1fr)]">
            <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
              <h2
                id={`year-${year}`}
                className="font-mono text-5xl font-medium tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(var(--neon)/0.6)]"
              >
                {year}
              </h2>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {byYear[year].length} {byYear[year].length === 1 ? 'post' : 'posts'}
              </p>
            </div>
            <ul className="panel divide-y divide-line/[0.06] p-2">
              {byYear[year].map((post) => (
                <li key={post.slug} data-reveal>
                  <PostRow post={post} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
