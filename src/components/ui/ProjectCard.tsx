import Link from 'next/link';
import type { Project } from '@/lib/content';
import { stampDate } from '@/lib/utils';
import { Icon } from './Icon';

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Python: '#3572A5',
  Go: '#00ADD8',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Shell: '#89e051',
};

export function LanguageTag({ language }: { language: string | null }) {
  if (!language) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2 rounded-full"
        style={{ background: LANGUAGE_COLORS[language] ?? 'rgb(var(--muted))' }}
        aria-hidden="true"
      />
      {language}
    </span>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="panel hud spotlight group flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="hud-corners" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-10 place-items-center rounded-xl border border-line/10 bg-line/[0.04] text-neon">
          <Icon name="folder" className="size-[18px]" />
        </span>
        <Icon
          name="arrowUpRight"
          className="size-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neon"
        />
      </div>

      <h3 className="mt-5 break-words font-mono text-[15px] font-medium text-white">{project.name}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-fg/60">
        {project.description || 'No description yet. The README tells the story.'}
      </p>

      {project.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="chip">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-4 border-t border-line/[0.06] pt-4 font-mono text-[11px] text-muted">
        <LanguageTag language={project.language} />
        {project.stars > 0 && (
          <span className="inline-flex items-center gap-1">
            <Icon name="star" className="size-3" /> {project.stars}
          </span>
        )}
        <span className="ml-auto">{stampDate(project.updatedAt)}</span>
      </div>
    </Link>
  );
}
