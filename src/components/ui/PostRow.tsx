import Link from 'next/link';
import type { Post } from '@/lib/content';
import { stampDate } from '@/lib/utils';
import { Icon } from './Icon';

export default function PostRow({ post, showExcerpt = true }: { post: Post; showExcerpt?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="spotlight group relative grid grid-cols-1 gap-3 rounded-2xl border border-transparent px-5 py-5 transition-colors hover:border-line/[0.08] hover:bg-line/[0.02] sm:grid-cols-[7.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-6"
    >
      <time dateTime={post.date} className="pt-0.5 font-mono text-xs text-muted">
        {stampDate(post.date)}
      </time>
      <div className="min-w-0">
        <h3 className="text-base font-medium text-white transition-colors group-hover:text-neon sm:text-lg">
          {post.title}
        </h3>
        {showExcerpt && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-fg/55">{post.excerpt}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="chip">
            <Icon name="clock" className="size-3" /> {post.minutes} min
          </span>
          {post.categories.slice(0, 3).map((c) => (
            <span key={c} className="chip">
              #{c}
            </span>
          ))}
        </div>
      </div>
      <Icon
        name="arrowRight"
        className="hidden size-4 text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-neon sm:block sm:mt-1"
      />
    </Link>
  );
}
