import { getPosts, getProjects } from '@/lib/content';
import { INTRO, LOOP, STACK, TOOLKIT } from '@/lib/profile';
import { SITE, SOCIALS } from '@/lib/site';

export const revalidate = 3600;

/** A plain-text map of the site for LLMs and agents (https://llmstxt.org). */
export async function GET() {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const url = (path: string) => `${SITE.url}${path}`;

  const body = `# ${SITE.name}

> ${SITE.description}

${INTRO}

- Role: ${SITE.role}
- Location: ${SITE.location} (${SITE.timezone}), remote
- Email: ${SITE.email}
${SOCIALS.map((s) => `- ${s.name}: ${s.href}`).join('\n')}

## How I work with AI

${LOOP.map((s, i) => `${i + 1}. **${s.title}** (${s.owner}): ${s.text}`).join('\n')}

${TOOLKIT.map((t) => `- **${t.title}**: ${t.text}`).join('\n')}

## Stack

- Engineering: ${STACK.core.join(', ')}
- AI: ${STACK.ai.join(', ')}
- Education: ${STACK.education.map((e) => `${e.title} in ${e.detail}`).join('; ')}

## Pages

- [Home](${url('/')}): overview, AI workflow, stack, contact
- [Projects](${url('/projects')}): public GitHub repositories with READMEs
- [Blog](${url('/blog')}): articles, mirrored from Medium

## Projects

${projects.map((p) => `- [${p.name}](${url(`/projects/${p.slug}`)})${p.language ? ` [${p.language}]` : ''}${p.description ? `: ${p.description}` : ''}`).join('\n') || '- (unavailable right now)'}

## Posts

${posts.map((p) => `- [${p.title}](${url(`/blog/${p.slug}`)}) (${p.date.slice(0, 10)}): ${p.excerpt}`).join('\n') || '- (unavailable right now)'}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
