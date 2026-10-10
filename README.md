# allisonbrown.dev

Personal portfolio built with **React 19 + TypeScript + Tailwind CSS v4** on **Vite**. Static output, so it can be hosted anywhere (GitHub Pages workflow included).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/
npm run preview   # serve the production build
npm run check     # screenshots + axe accessibility audit (needs `npm run preview` running)
```

## Editing content

All copy lives in `src/content/`. Components never contain copy.

| File | What's in it |
|---|---|
| `site.ts` | Name, hero line, email, links, stats, About bio, Education, nav sections |
| `experience.ts` | Timeline entries (reverse-chronological) |
| `projects.ts` | Cover-flow projects: summary, highlights, role, tech, link, award, cover colors |
| `community.ts` | Campus & Community accordion |

## Adding photos

Put images in `public/images/` and point to them:

- **Portrait:** `site.portrait = '/images/portrait.jpg'` (tall, ~4:5)
- **About:** `about.photos[0].image` (3:4) and `about.photos[1].image` (4:5)
- **Community:** `image` on each item in `community.ts` (wide)
- **Project screenshots:** `image` on each project (square crop)

Anything without an image shows the styled placeholder from the design. Compress photos first (e.g. squoosh.app, WebP, ≤ 1600px).

## Résumé

Save your one-page résumé as `public/AllisonBrown_Resume.pdf`. Every Résumé button links there.

## Deploying to GitHub Pages with allisonbrown.dev

1. Push this folder to a GitHub repo, on the `main` branch.
2. Repo **Settings → Pages → Source: GitHub Actions**. The included workflow builds and deploys on every push.
3. Under **Settings → Pages → Custom domain**, enter `allisonbrown.dev` (`public/CNAME` already contains it) and tick **Enforce HTTPS** once it's available.
4. At your domain registrar, add DNS records:
   - `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `<your-github-username>.github.io`

**Vercel instead?** Import the repo, keep the defaults (Vite is auto-detected), add the domain under Project → Domains, and delete `.github/workflows/deploy.yml`.

## Structure

```
src/
  content/       typed copy (edit here)
  components/
    ui/          Button, IconButton, Photo, SectionShell + reveal
    layout/      Background (glows, grain, scroll-driven accent), Nav (top pill / bottom pill + menu)
    sections/    Hero, Stats, Experience, Projects, Community, Education, About, Contact
    projects/    CoverFlow, CoverArt, ProjectSheet
  hooks/         shared scroll/tick loop, media queries, parallax, focus trap, scroll lock, nav state
  lib/           frame scheduler, accent interpolation, types
```

### Motion and accessibility notes
- A single rAF-throttled scroll loop drives the accent color, parallax, timeline, badge and nav. Ambient drift pauses when the hero is off-screen.
- `prefers-reduced-motion` turns off the drift, spin, parallax, 3D tilt, count-ups and letter animation, and jumps instead of smooth-scrolling.
- Content is visible without JavaScript; the reveal only hides sections once JS confirms motion is allowed.
- The cover-flow responds to arrow keys, Home/End and Enter, and announces the current project. The dialogs trap focus and return it on close, and closed panels are `inert`.
