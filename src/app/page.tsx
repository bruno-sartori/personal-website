import Link from 'next/link';
import { SITE, SOCIALS } from '@/lib/site';
import { INTRO, LOOP, STACK, STATS, TOOLKIT, type Owner } from '@/lib/profile';
import { featuredProjects, getPosts, getProjects } from '@/lib/content';
import { cn } from '@/lib/utils';
import AgentTerminal from '@/components/home/AgentTerminal';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import PostRow from '@/components/ui/PostRow';
import CopyButton from '@/components/ui/CopyButton';
import { Icon } from '@/components/ui/Icon';

export const revalidate = 3600;

const OWNER: Record<Owner, { label: string; className: string }> = {
  agent: { label: '◇ agent', className: 'border-neon/30 bg-neon/[0.07] text-neon' },
  human: { label: '◆ human', className: 'border-plasma/30 bg-plasma/[0.08] text-plasma' },
  shared: { label: '◇◆ shared', className: 'border-line/15 bg-line/[0.04] text-fg/70' },
};

export default async function HomePage() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const latestPosts = posts.slice(0, 4);
  const topProjects = featuredProjects(projects, 6);

  return (
    <>
      {/* ------------------------------------------------------------ */}
      {/* Hero                                                          */}
      {/* ------------------------------------------------------------ */}
      <section className="relative pb-24 pt-32 sm:pt-40">
        <div className="container-site">
          <p
            className="rise inline-flex items-center gap-2.5 rounded-full border border-line/10 bg-line/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-fg/70 backdrop-blur-sm"
            style={{ '--d': '0ms' } as React.CSSProperties}
          >
            <span className="status-dot" /> {SITE.location} · remote
          </p>

          <h1
            className="rise mt-7 max-w-5xl text-[clamp(2.4rem,7vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white"
            style={{ '--d': '90ms' } as React.CSSProperties}
          >
            Hi, I&apos;m Bruno Sartori.
            <br />
            <span className="text-gradient">Senior software engineer.</span>
          </h1>
        </div>

        <div className="container-site mt-12 grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <p
              className="rise max-w-xl text-lg leading-relaxed text-fg/65"
              style={{ '--d': '180ms' } as React.CSSProperties}
            >
              {INTRO}
            </p>

            <div className="rise mt-9 flex flex-wrap gap-3" style={{ '--d': '270ms' } as React.CSSProperties}>
              <Link href="/#ai" className="btn-primary">
                <Icon name="sparkles" className="size-4" />
                How I work with AI
              </Link>
              <Link href="/projects" className="btn-ghost">
                Browse projects
                <Icon name="arrowRight" className="size-4" />
              </Link>
            </div>

            <dl
              className="rise mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-line/[0.08] bg-line/[0.06] sm:grid-cols-4"
              style={{ '--d': '360ms', gap: '1px' } as React.CSSProperties}
            >
              {STATS.map((stat) => (
                <div key={stat.value} className="bg-ink/85 px-4 py-4 backdrop-blur-sm">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-mono text-xl font-medium text-white">{stat.value}</span>
                    <span className="mt-1 block text-[12px] leading-snug text-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise min-w-0" style={{ '--d': '220ms' } as React.CSSProperties}>
            <AgentTerminal />
            <p className="mt-4 text-center font-mono text-[11px] text-muted">
              ↑ simulated sessions, modeled on how I actually work
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* AI workflow                                                   */}
      {/* ------------------------------------------------------------ */}
      <section id="ai" className="relative py-24">
        <div className="container-site">
          <SectionHeading
            index="01"
            kicker="Human × Machine"
            title={
              <>
                AI is my pair, <span className="text-gradient">not my autopilot.</span>
              </>
            }
            description="I treat agents like fast, tireless collaborators with clear boundaries. Every task runs through the same loop, and the steps where judgment matters stay with a human."
          />

          {/* the loop */}
          <div className="mt-14" aria-hidden="true">
            <div className="bus relative hidden h-px lg:block">
              <span className="bus-pulse" />
              {[12.5, 37.5, 62.5, 87.5].map((left) => (
                <span
                  key={left}
                  className="absolute -top-[3px] size-[7px] -translate-x-1/2 rounded-full border border-neon/60 bg-ink"
                  style={{ left: `${left}%` }}
                />
              ))}
            </div>
          </div>
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
            {LOOP.map((step, i) => (
              <li key={step.title} className="panel hud spotlight p-6" data-reveal>
                <span className="hud-corners" aria-hidden="true" />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
                      OWNER[step.owner].className,
                    )}
                  >
                    {OWNER[step.owner].label}
                  </span>
                </div>
                <span className="mt-6 grid size-11 place-items-center rounded-xl border border-neon/25 bg-neon/[0.08] text-neon shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]">
                  <Icon name={step.icon} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg/60">{step.text}</p>
              </li>
            ))}
          </ol>

          {/* toolkit */}
          <div className="mt-20 flex items-center gap-4" data-reveal>
            <p className="kicker">Toolkit</p>
            <span className="h-px flex-1 bg-linear-to-r from-line/15 to-transparent" aria-hidden="true" />
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TOOLKIT.map((item) => (
              <li key={item.title} className="panel spotlight group p-6" data-reveal>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg border border-line/10 bg-line/[0.04] text-plasma transition-colors group-hover:text-neon">
                    <Icon name={item.icon} className="size-[18px]" />
                  </span>
                  <h3 className="font-medium text-white">{item.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fg/60">{item.text}</p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Stack                                                         */}
      {/* ------------------------------------------------------------ */}
      <section id="stack" className="relative py-24">
        <div className="container-site">
          <SectionHeading
            index="02"
            kicker="Stack"
            title="A backend core, a front-end past, an AI&#8209;native present."
            description="I started on multi-tenant web platforms and OTT apps for Samsung Tizen, LG webOS and Chromecast, with video controls, analytics and SEO along the way. Today my center of gravity is backend engineering in C#, with AI agents built into how I deliver."
          />

          <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_0.8fr]">
            <div className="panel p-7" data-reveal>
              <p className="kicker text-muted">Engineering core</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {STACK.core.map((tech) => (
                  <li key={tech} className="chip px-2.5 py-1.5 text-xs">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel hud p-7" data-reveal>
              <span className="hud-corners" aria-hidden="true" />
              <p className="kicker">AI toolkit</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {STACK.ai.map((tech) => (
                  <li key={tech} className="chip border-neon/20 bg-neon/[0.05] px-2.5 py-1.5 text-xs text-neon/90">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel flex flex-col p-7" data-reveal>
              <p className="kicker text-muted">Education</p>
              <ul className="mt-5 space-y-4">
                {STACK.education.map((item) => (
                  <li key={item.detail}>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-sm text-fg/55">{item.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-6 font-mono text-[11px] leading-relaxed text-muted">
                <span className="text-plasma">off-duty:</span> {STACK.offDuty.join(' · ')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Projects                                                      */}
      {/* ------------------------------------------------------------ */}
      <section id="projects" className="relative py-24">
        <div className="container-site">
          <SectionHeading
            index="03"
            kicker="Repositories"
            title="Things I've built (and broken)."
            description="Open-source experiments, tools and study projects, pulled live from GitHub."
            action={
              <Link href="/projects" className="link-arrow">
                all repositories <Icon name="arrowRight" className="size-3.5" />
              </Link>
            }
          />
          {topProjects.length > 0 ? (
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topProjects.map((project) => (
                <li key={project.slug} data-reveal>
                  <ProjectCard project={project} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="GitHub is not answering right now. Try again in a minute." />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Writing                                                       */}
      {/* ------------------------------------------------------------ */}
      <section id="writing" className="relative py-24">
        <div className="container-site">
          <SectionHeading
            index="04"
            kicker="Transmissions"
            title="Notes from the field."
            description="Practical write-ups on tooling, versioning and the craft of shipping software."
            action={
              <Link href="/blog" className="link-arrow">
                all posts <Icon name="arrowRight" className="size-3.5" />
              </Link>
            }
          />
          {latestPosts.length > 0 ? (
            <ul className="panel mt-12 divide-y divide-line/[0.06] p-2">
              {latestPosts.map((post) => (
                <li key={post.slug} data-reveal>
                  <PostRow post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState text="The Medium feed is not answering right now. Try again in a minute." />
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ */}
      {/* Contact                                                       */}
      {/* ------------------------------------------------------------ */}
      <section id="contact" className="relative py-24">
        <div className="container-site">
          <div className="panel hud relative overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20" data-reveal>
            <span className="hud-corners" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon/20 blur-[100px]"
            />
            <p className="kicker">05 · Contact</p>
            <h2 className="mx-auto mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
              Open a <span className="text-gradient">channel.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-fg/60">
              Have a role, a project or a hard problem in mind? Want to talk agents, OTT or anime? My inbox is open.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a href={`mailto:${SITE.email}`} className="btn-primary">
                <Icon name="mail" className="size-4" />
                {SITE.email}
              </a>
              <CopyButton value={SITE.email} label="Copy email" />
            </div>
            <ul className="mt-10 flex flex-wrap justify-center gap-2">
              {SOCIALS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chip px-3 py-2 text-xs transition-colors hover:border-neon/40 hover:text-white"
                  >
                    <Icon name={social.icon} className="size-3.5" />
                    {social.handle}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="panel mt-12 px-6 py-10 text-center font-mono text-xs text-muted">
      <span className="text-amber-300">!</span> {text}
    </p>
  );
}
