# lucasmilhoranca.dev

Personal landing page / résumé for Lucas Milhorança, full stack developer.
Deliberately minimal: static HTML + Tailwind, a little TypeScript for progressive enhancement. No UI framework, no CMS, no backend.

## Stack

- Vite + TypeScript (vanilla, no React/Vue)
- Tailwind CSS v4 (config lives in `src/style.css` via `@theme`, not `tailwind.config.js`)
- `lucide-static` (devDependency) — icons are copied as inline SVG from `node_modules/lucide-static/icons/*.svg` into the HTML, no icon library at runtime
- `pnpm`

```
index.html          # Portuguese page (/) — default language
en/index.html        # English page (/en/)
src/main.ts           # theme toggle, mobile menu, footer year — no CSS import
src/style.css          # Tailwind theme, @font-face, shared component classes
public/fonts/           # self-hosted JetBrains Mono (.woff2, latin subset)
public/favicon.svg       # transparent, no background rect
public/og.png, og-en.png  # link preview images (1200×630)
public/robots.txt, sitemap.xml, llms.txt
```

`pnpm dev` to run, `pnpm build` to build, `pnpm preview` to serve the build locally.

## Conventions worth knowing before editing

- **Two static pages, not an i18n framework.** `index.html` and `en/index.html` share CSS/JS but have independent content. Edit both when changing copy.
- **`style.css` is loaded via `<link rel="stylesheet">` in each `<head>`, not `import './style.css'` in JS.** A JS import makes Vite inject CSS at runtime, causing a flash of unstyled content on every navigation. Keep it as a real `<link>`.
- **Dark mode is the default.** An inline script in `<head>` applies `.dark` to `<html>` unless `localStorage.theme === 'light'`. Toggle logic is in `main.ts`.
- **Mobile-first everywhere.** Base Tailwind classes target mobile; `sm:`/`md:` add desktop styles.
- Single accent color (`--color-accent`, `#f0562a`) used sparingly. No gradients, no second color.
- Muted text uses `/60` opacity (`text-ink/60 dark:text-fog/60`) — the minimum that still passes WCAG AA contrast (4.5:1) on both themes. Don't go lower without recalculating.
- Contact emails differ per page: `contato@lucasmilhoranca.dev` (PT), `contact@lucasmilhoranca.dev` (EN) — Cloudflare Email Routing redirects, not the same inbox. Update both the mailto links and the JSON-LD `email` field if these change.
- Hero copy: plain, factual, first person. No slogans, no dramatic claims, no listing the tech stack (it's already in the Skills section), no unverified assumptions about the user's life or work status.

## SEO

Per-page `<title>`/meta description, Open Graph + Twitter Card (`summary_large_image`) with a generated preview image, canonical + hreflang, JSON-LD `Person` schema, `robots.txt`, `sitemap.xml`, and `llms.txt` (an emerging non-standard convention — a plain-markdown summary of the site for AI/LLM tools, see llmstxt.org).

Check the score with Lighthouse (`pnpm build && pnpm preview`, then DevTools → Lighthouse, or `npx lighthouse http://localhost:4173/ --view`) — **always against the production build**, not `pnpm dev`, which scores Performance artificially low.

## Skills used

Project-scoped Claude Code skills live in `.claude/skills/`, pulled in because none were enabled by default in this environment:

- `frontend-design` — official Anthropic plugin skill, guides the visual direction.
- `doc-coauthoring` — closest official skill to copywriting help; used loosely, not its full multi-stage workflow.
- `seo-schema` — from `seranking/seo-skills`; only its no-API "generate schema" mode is used (the rest needs a paid SE Ranking/Firecrawl account).

## Deploy

Builds to a Docker image (`Dockerfile`: Vite build → static files served by nginx) and runs on a personal k3s cluster.

- `.github/workflows/deploy.yml` triggers on push to `release/production` only — never add `pull_request` to it (see the comment in the file for why: this uses a self-hosted runner).
- `build` job (GitHub-hosted): builds and pushes the image to `ghcr.io/lucasmilhoranca/lucasmilhoranca.dev`.
- `deploy` job (self-hosted runner on the VPS): `kubectl apply -f k8s/` then rolls the new image out.
- `k8s/`: `Namespace` + `Deployment` + `NodePort` Service (port 30080). No Ingress — Nginx Proxy Manager (already running in Docker on the VPS) owns ports 80/443 and forwards to the NodePort; k3s's built-in Traefik would otherwise fight NPM for those same ports.
- No GitHub Secrets are needed for this workflow — the deploy runs on the owner's own machine.

## Git

- Never add a `Co-Authored-By: Claude` line (or any AI-attribution line) to commit messages or pull request descriptions.
- Commit messages: always in English, short and direct (imperative mood, e.g. "add mobile menu", not "added" or a paragraph).
- Repo: `github.com/lucasmilhoranca/lucasmilhoranca.dev`. Deployed to the owner's personal VPS; the domain's DNS is on Cloudflare with the proxy enabled (orange cloud).
