import type { IconName } from '@/components/ui/Icon';

/**
 * Everything the site says about Bruno lives here, so the homepage and
 * /llms.txt never drift apart.
 */

export const INTRO =
  "I'm a backend developer from Brazil, working mostly with C# and .NET these days. Before that I spent years on the front-end: React, TypeScript, multi-tenant platforms and OTT apps for Samsung Tizen, LG webOS and Chromecast. Lately I've been going deep on AI. Agents help me research, plan, write and test code every day, and the calls on what ships are still mine.";

export const STATS = [
  { value: '10+', label: 'years shipping software' },
  { value: '.NET', label: 'backend core, C# first' },
  { value: 'OTT', label: 'Tizen · webOS · Chromecast' },
  { value: 'HITL', label: 'human-in-the-loop by default' },
] as const;

export type Owner = 'agent' | 'human' | 'shared';

export const LOOP: { title: string; owner: Owner; icon: IconName; text: string }[] = [
  {
    title: 'Context',
    owner: 'shared',
    icon: 'database',
    text: 'Curated knowledge bases, docs and ADRs, so agents start from facts instead of guesses.',
  },
  {
    title: 'Plan',
    owner: 'human',
    icon: 'route',
    text: 'The agent drafts a plan. I push back on it, cut scope and pick the trade-offs.',
  },
  {
    title: 'Execute',
    owner: 'agent',
    icon: 'cpu',
    text: 'Agents write code, run tests and reach real systems through MCP tools and custom skills.',
  },
  {
    title: 'Verify',
    owner: 'human',
    icon: 'shield',
    text: 'Tests, diffs and review. Nothing is committed, deployed or published until a human approves it.',
  },
];

export const TOOLKIT: { title: string; icon: IconName; text: string; tags: string[] }[] = [
  {
    title: 'Agentic coding',
    icon: 'terminal',
    text: 'Claude Code is my daily pair programmer. I use plan mode for bigger changes, subagents for research in parallel, and hooks to enforce project rules.',
    tags: ['Claude Code', 'Subagents', 'Hooks'],
  },
  {
    title: 'Custom skills',
    icon: 'layers',
    text: "Packaged, reusable instructions that teach agents a team's workflows, such as syncing a docs site into a project wiki from start to finish.",
    tags: ['Skills', 'Workflows'],
  },
  {
    title: 'Living knowledge bases',
    icon: 'database',
    text: 'Raw docs go in and a structured wiki comes out. An agent tracks release history, breaking changes and contradictions, all checked against the source.',
    tags: ['Context engineering', 'Wikis'],
  },
  {
    title: 'MCP integrations',
    icon: 'plug',
    text: 'Connecting models to real systems through the Model Context Protocol: repos, trackers, APIs, even my anime list.',
    tags: ['MCP', 'Tool use'],
  },
  {
    title: 'Personal agents',
    icon: 'bot',
    text: 'Small autonomous helpers that search and rank things against explicit criteria. The final call stays with me.',
    tags: ['Automation', 'Ranking'],
  },
  {
    title: 'Guardrails first',
    icon: 'shield',
    text: 'Permissions, approvals and review gates are built into the loop. Agents move fast, and anything irreversible waits for a human.',
    tags: ['HITL', 'Safety'],
  },
];

export const STACK = {
  core: [
    'C#',
    '.NET',
    'TypeScript',
    'Node.js',
    'React',
    'Next.js',
    'React Native',
    'AWS',
    'Samsung Tizen',
    'LG webOS',
    'Chromecast',
    'OTT & video',
    'Analytics & tagging',
    'SEO',
  ],
  ai: [
    'Claude Code',
    'Claude API',
    'Model Context Protocol',
    'Agent skills',
    'Subagents',
    'Hooks',
    'Context engineering',
    'Knowledge bases',
    'Prompt design',
  ],
  education: [
    { title: 'Postgraduate degree', detail: 'Internet of Things' },
    { title: 'Degree', detail: 'Systems Analysis & Development · IFSP' },
  ],
  offDuty: ['anime', 'Bujinkan ninjutsu', 'sci-fi', 'philosophy', 'quantum computing'],
};
