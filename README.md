# Xpansly landing page

Marketing site for xpansly.ai (MVP beta and early-access recruitment).
Next.js App Router + TypeScript, CSS Modules on a token layer, React Three Fiber for the 3D mark,
GSAP ScrollTrigger + Lenis for scroll. Static export.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
npm run lint
```

## Where things live
- `src/styles/tokens.css`: colours, type scale, glass recipe and the responsive scale system
  (`--u` = one Figma pixel at the breakpoint's reference width: 390 / 834 / 1440).
- `src/styles/base.css`: text style classes (`.t-display`, `.t-h1` ...), `.container`, `.grid`, `.glass`.
- `src/components/ui`: Button, Chip, TextField / SelectField, Section.
- `src/components/sections/*`: one folder per page section.
- `src/components/sections/Problem/three`: the 3D cube mark (`config.ts` switches chrome / glass).
- `src/config/site.ts`: metadata, section anchors, `ctaFormMode` ("full" or "email").
- `src/lib/forms.ts`: validation and the placeholder `submitEarlyAccess` (TODO: real endpoint).
- `docs/spec`: Figma specs per section; `docs/xpansly-dither-cube-scroll-brief.md`: 3D brief.

## Deploying
Serve `./out` from any static host with brotli or gzip compression enabled.

## Prototype on GitHub Pages
Every push to `main` runs `.github/workflows/deploy-pages.yml`, which builds the site with
`NEXT_PUBLIC_BASE_PATH=/xpansly` and commits the output (`index.html`, `_next/`, `assets/` ...)
to the root of `main`, where GitHub Pages serves it: https://adhis-hertanto.github.io/xpansly/
Those root files are generated: edit `src/` and `public/`, not them. Pull before pushing,
since the workflow adds a commit after each push.
