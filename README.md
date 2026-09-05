# Astro Design System Starter

A reusable Astro starter built around a documented, token-driven design system.
The home route is a replaceable starter showcase, while the design-system
documentation and reusable component library remain available during local
development without becoming part of the default production build.

## Included

- color, sizing, typography, layout and motion tokens;
- light and dark color modes;
- responsive min/max token contracts;
- `small`, `medium` and `large` component-size profiles;
- reusable Astro components organized by atomic layer and family;
- component registry with current implementation, visual, and validation readiness;
- interactive documentation under `/design-system`;
- an empty `project-context` scaffold for brand and business inputs;
- an Art Direction knowledge base and project Brand Expression Contract;
- `.agentic-rules`, `AGENTIC-RULES.json` and implementation documentation;
- `Figma2Astro Agentic Rules` as an optional translation layer for Figma MCP.

Figma is not required to use this starter. Astro code remains the source of
truth for tokens, component APIs, `data-*` contracts and implementation rules.

## Development routes

- `/` — replaceable starter showcase;
- `/design-system` — documentation overview;
- `/design-system/foundations/color` — color architecture;
- `/design-system/foundations/sizing` — sizing and component-size contracts;
- `/design-system/foundations/typography` — typography foundations and semantic styles;
- `/design-system/foundations/layout` — layout foundations and responsive contracts;
- `/design-system/architecture/component-model` — component architecture and readiness;
- `/design-system/base-components/buttons` — reusable component documentation.

## Start locally

Use Node 22.22.0 (`.nvmrc`); supported range: 22.19–22.x. Install from the
lockfile with `npm ci`. A downloaded folder does not require Git, a remote,
commits or branches. Keep the dotfiles, `.agents`, `.agentic-rules`, architecture
and project-context folders in the package. The starter repository itself can
continue using Git normally; benchmark/history commands are maintainer tools.


```bash
npm ci
npm run dev
```

Local development enables documentation, Grid Guides and Component Info Layer.
Use the explicit build boundaries instead of moving or deleting documentation:

```bash
npm run build       # production site only; alias of build:site
npm run build:site  # client routes without documentation artifacts
npm run build:docs  # complete internal documentation build
```

`src/documentation` is a development source of truth and visual projection.
Its routes are injected only in development and `build:docs`; production site
builds do not emit `/design-system`, `/architecture` or documentation assets.

Run the production validation before treating a copy as a stable project
milestone:

```bash
npm run validate
```

## Starting a new project

1. Copy this directory.
2. Replace the placeholder `site` value in `astro.config.mjs`.
3. Fill the relevant folders in `project-context` before asking AI to create
   brand, content, information architecture or page compositions.
4. Complete and approve the Brand Expression Contract before asking AI to
   produce brand-sensitive visual design.
5. Calibrate representative components before propagating a new visual
   direction across the complete library.
6. Choose the production font and update typography foundations if necessary.
7. Add project routes and content without changing design-system contracts
   unless the new project requires a deliberate system decision.
8. Reuse components from `src/components` before creating new patterns.
9. Keep component code, documentation, registry readiness and agentic rules in
   sync.

## Sources of truth

- `src/styles/tokens` — variables and token architecture;
- `src/components` — reusable implementation contracts;
- `src/documentation` — opt-in documentation and architecture routes;
- `src/data/design-system/componentArchitecture.json` — component registry;
- `project-context` — project-specific strategy, audiences, offer and content;
- `art-direction/` — universal design knowledge and reusable visual-direction
  templates;
- `project-context/brand-foundations/brand-expression` — approved
  project-specific visual intent and evidence;
- `VARIABLE-ARCHITECTURE.md` — variable hierarchy and assumptions;
- `DESIGN-SYSTEM-FRAMEWORK.md` — framework architecture;
- `AGENTS.md` and `.agentic-rules` — AI implementation rules.

Inter is installed through `@fontsource/inter`; replace it and update the
typography foundations when a project adopts a different licensed typeface.

## Configure a separate project

Copy the neutral starter into a separate folder before adding a client brand.
Fill the existing strategy, tone-of-voice and product-brief templates and update
`project-context/context-index.json`. Configure existing tokens and components
there. Brand Expression starts unconfigured; only accepted visual decisions
belong in its JSON contract. Generate its Markdown with `npm run brand:generate`.
Component Agentic Rules combine UX, communication and technical guidance. After
changing them, run `npm run agent:rules:generate`; `npm run validate` detects
stale projections. Source code remains the executable API and token authority.

## Maintainer verification before copying

Run `npm run validate`, then all Node tests with
`node --test --test-concurrency=1 tests/*.test.mjs`; sequential execution avoids
shared Astro fixture-cache collisions. Run `npm run audit:runtime:v1.1` for the
deterministic benchmark and `npm run build:docs` for the documentation boundary.
Browser commands build documentation automatically; a site-only build does not
contain the routes they test. When supplying an existing server, it must serve a
current documentation build.

The accessibility suite checks documentation UI and native-size components.
Responsive overview thumbnails intentionally scale a desktop specimen; the same
canonical renderer is tested in its full `/preview` route at 100% scale, with all
axe rules and thresholds retained. Miniature click geometry is not evidence of a
production component's target size. Use the full preview for keyboard and touch
interaction checks. macOS WebKit uses Option+Tab to include all controls.

Copy source files, hidden `.agents` and `.agentic-rules` directories, context
scaffolding, `.nvmrc`, package metadata and lockfile. Exclude `.git`,
`node_modules`, `.astro`, `dist`, test reports and private environment files.
Install with `npm ci` in the copy; keep the original starter repository and its
Git history intact. Client branding and workshop materials belong to that copy.
