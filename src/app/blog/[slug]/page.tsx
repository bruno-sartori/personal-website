import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import TableOfContents from '@/components/ui/TableOfContents';
import { Icon } from '@/components/ui/Icon';

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Post not found' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: post.link },
    openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const post = posts[index];
  const newer = posts[index - 1];
  const older = posts[index + 1];

  const summarize = encodeURIComponent(
    `Summarize this article in 5 bullet points, then list the key takeaways for a senior engineer: ${post.link}`,
  );

  return (
    <div className="container-site pt-36 sm:pt-44">
      <Link href="/blog" className="link-arrow rise">
        <Icon name="arrowLeft" className="size-3.5" /> all posts
      </Link>

      <header className="mt-10 max-w-3xl">
        <div className="rise flex flex-wrap items-center gap-2" style={{ '--d': '60ms' } as React.CSSProperties}>
          {post.categories.slice(0, 4).map((c) => (
            <span key={c} className="chip">
              #{c}
            </span>
          ))}
        </div>
        <h1
          className="rise mt-5 text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl"
          style={{ '--d': '120ms' } as React.CSSProperties}
        >
          {post.title}
        </h1>
        <p
          className="rise mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted"
          style={{ '--d': '180ms' } as React.CSSProperties}
        >
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="text-neon/50">/</span>
          <span>{post.minutes} min read</span>
        </p>

        <div className="rise mt-8 flex flex-wrap gap-2" style={{ '--d': '240ms' } as React.CSSProperties}>
          <a
            href={`https://claude.ai/new?q=${summarize}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-4 py-2 text-xs"
          >
            <Icon name="sparkles" className="size-3.5 text-plasma" />
            Summarize with Claude
          </a>
          <a
            href={`https://chatgpt.com/?q=${summarize}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost px-4 py-2 text-xs"
          >
            <Icon name="sparkles" className="size-3.5 text-neon" />
            Summarize with ChatGPT
          </a>
          <a href={post.link} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-xs">
            <Icon name="medium" className="size-3.5" />
            Read on Medium
          </a>
        </div>
      </header>

      <div className="mt-14 grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <article className="article prose prose-lg min-w-0">
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <TableOfContents headings={post.headings} />
          </div>
        </aside>
      </div>

      <nav aria-label="More posts" className="mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {older ? (
          <Link href={`/blog/${older.slug}`} className="panel spotlight group p-6">
            <span className="link-arrow">
              <Icon name="arrowLeft" className="size-3.5" /> older
            </span>
            <p className="mt-3 font-medium text-white group-hover:text-neon">{older.title}</p>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={`/blog/${newer.slug}`} className="panel spotlight group p-6 text-right">
            <span className="link-arrow justify-end">
              newer <Icon name="arrowRight" className="size-3.5" />
            </span>
            <p className="mt-3 font-medium text-white group-hover:text-neon">{newer.title}</p>
          </Link>
        )}
      </nav>
    </div>
  );
}
