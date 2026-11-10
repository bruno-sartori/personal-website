import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import { formatDate } from '@/lib/utils';
import TableOfContents from '@/components/ui/TableOfContents';
import { LanguageTag } from '@/components/ui/ProjectCard';
import { Icon } from '@/components/ui/Icon';

export const revalidate = 3600;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return (await getProjects()).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = (await getProjects()).find((p) => p.slug === params.slug);
  if (!project) return { title: 'Project not found' };
  return { title: project.name, description: project.description || `${project.name} on GitHub.` };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const meta = [
    { label: 'language', value: project.language ? <LanguageTag language={project.language} /> : '—' },
    { label: 'stars', value: project.stars },
    { label: 'forks', value: project.forks },
    { label: 'updated', value: formatDate(project.updatedAt, 'short') },
  ];

  return (
    <div className="container-site pt-36 sm:pt-44">
      <Link href="/projects" className="link-arrow rise">
        <Icon name="arrowLeft" className="size-3.5" /> all projects
      </Link>

      <header className="mt-10 max-w-3xl">
        <p className="rise kicker" style={{ '--d': '60ms' } as React.CSSProperties}>
          {project.fullName}
        </p>
        <h1
          className="rise mt-4 break-words font-mono text-4xl font-medium tracking-[-0.04em] text-white sm:text-5xl"
          style={{ '--d': '120ms' } as React.CSSProperties}
        >
          {project.name}
        </h1>
        {project.description && (
          <p className="rise mt-5 text-lg leading-relaxed text-fg/60" style={{ '--d': '180ms' } as React.CSSProperties}>
            {project.description}
          </p>
        )}

        <div className="rise mt-8 flex flex-wrap gap-2" style={{ '--d': '240ms' } as React.CSSProperties}>
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="btn-primary px-4 py-2 text-xs">
            <Icon name="github" className="size-4" />
            View repository
          </a>
          {project.homepage && (
            <a href={project.homepage} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-xs">
              <Icon name="arrowUpRight" className="size-4" />
              Live demo
            </a>
          )}
        </div>
      </header>

      <dl className="rise mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.06] sm:grid-cols-4" style={{ '--d': '300ms' } as React.CSSProperties}>
        {meta.map((m) => (
          <div key={m.label} className="bg-ink/85 px-4 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{m.label}</dt>
            <dd className="mt-1 font-mono text-sm text-white">{m.value}</dd>
          </div>
        ))}
      </dl>

      {project.topics.length > 0 && (
        <div className="mt-6 flex max-w-3xl flex-wrap gap-1.5">
          {project.topics.map((topic) => (
            <span key={topic} className="chip">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-14 grid grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="panel min-w-0 p-6 sm:p-10" data-reveal>
          <p className="mb-8 flex items-center gap-2 border-b border-line/[0.08] pb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            <Icon name="book" className="size-3.5 text-neon" /> README.md
          </p>
          {project.html ? (
            <article className="article prose min-w-0">
              <div dangerouslySetInnerHTML={{ __html: project.html }} />
            </article>
          ) : (
            <p className="font-mono text-sm text-muted">This repository has no README yet.</p>
          )}
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-28">
            <TableOfContents headings={project.headings} />
          </div>
        </aside>
      </div>
    </div>
  );
}
