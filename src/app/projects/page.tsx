import type { Metadata } from 'next';
import { getProjects } from '@/lib/content';
import { SITE } from '@/lib/site';
import ProjectCard from '@/components/ui/ProjectCard';
import PageHeader from '@/components/ui/PageHeader';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Open-source experiments, tools and study projects, pulled live from GitHub.',
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const languages = new Set(projects.map((p) => p.language).filter(Boolean));

  return (
    <div className="container-site pt-36 sm:pt-44">
      <PageHeader
        kicker="Repositories"
        title="Projects"
        description="Open-source experiments, tools and study projects. Some are polished, and some exist only to learn something hard."
        meta={`${projects.length} repositories · ${languages.size} languages · github.com/${SITE.githubUser}`}
      />

      {projects.length === 0 ? (
        <p className="panel mt-16 px-6 py-10 text-center font-mono text-xs text-muted">
          <span className="text-amber-300">!</span> GitHub is not answering right now. Try again in a minute.
        </p>
      ) : (
        <ul className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug} data-reveal>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
