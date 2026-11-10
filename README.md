[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

# Personal Website

My personal website: an AI-first portfolio, with posts pulled from Medium and projects pulled from GitHub.

## Highlights

- **AI workflow front and center**: a human-in-the-loop pipeline, an agent toolkit, and an animated agent-session terminal.
- **Futuristic UI**: neural-network canvas background, HUD panels, pointer spotlight, and scroll-driven reveals (with `prefers-reduced-motion` respected).
- **Command palette** (`⌘K` / `Ctrl K` / `/`): jump to pages, posts, and repos, or hand a question to Claude, which reads `/llms.txt`.
- **AI-readable**: `/llms.txt` describes the site for LLMs and agents. Posts offer "Summarize with Claude / ChatGPT" links.
- **Live content**: Medium RSS (via rss2json) and GitHub repositories/READMEs, revalidated hourly (ISR).
- SEO basics: Open Graph image, `sitemap.xml` and `robots.txt`.

## Usage

Requires **Node.js 26 LTS** (pinned in `.node-version` and `package.json` `engines`). With [fnm](https://github.com/Schniz/fnm), entering the folder switches to it automatically.

```bash
fnm install   # reads .node-version
yarn install
yarn dev
yarn lint     # ESLint (flat config)
yarn build
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

| Name                  | Required | Description                                                       |
|-----------------------|----------|-------------------------------------------------------------------|
| `PRODUCTION_URL`      | no       | Public URL of the site (used for metadata, sitemap and llms.txt). |
| `GITHUB_ACCESS_TOKEN` | no       | GitHub token, which raises the API rate limit when fetching repos. |

## Structure

```
src/
  app/            routes (home, blog, projects, llms.txt, sitemap, robots, OG image)
  components/
    site/         header, footer, command palette, background, global effects
    home/         agent terminal
    ui/           cards, headings, icons, table of contents
  lib/
    content.ts    Medium + GitHub data fetching
    profile.ts    all copy about me (shared by the home page and llms.txt)
    site.ts       site config, socials, navigation
```

## Technologies used in this project

| Name                                         | Description                                          |
|----------------------------------------------|------------------------------------------------------|
| [Next.js 16](https://nextjs.org/)            | React framework (App Router, ISR, route handlers)    |
| [React 19](https://react.dev/)               | UI library                                           |
| [Tailwind CSS 4](https://tailwindcss.com/)   | Utility-first CSS framework (CSS-first config)       |
| [TypeScript](https://www.typescriptlang.org) | Typed JavaScript                                     |
| [Geist](https://vercel.com/font)             | Sans and mono typefaces                              |
