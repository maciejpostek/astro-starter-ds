# Astro Design System Starter

A reusable Astro starter built around a documented, token-driven design system.
The project is intentionally content-neutral: the home route is empty, while
the design-system documentation and reusable component library remain ready for
new products, websites and experiments.

## Included

- color, sizing, typography, layout and motion tokens;
- light and dark color modes;
- responsive min/max token contracts;
- `small`, `medium` and `large` component-size profiles;
- reusable Astro components organized by atomic layer and family;
- component registry and design-system roadmap;
- interactive documentation under `/design-system`;
- an empty `project-context` scaffold for brand and business inputs;
- an Art Direction knowledge base and project Brand Expression Contract;
- `.agentic-rules`, `AGENTIC-RULES.json` and implementation documentation;
- `Figma2Astro Agentic Rules` as an optional translation layer for Figma MCP.

Figma is not required to use this starter. Astro code remains the source of
truth for tokens, component APIs, `data-*` contracts and implementation rules.

## Routes

- `/` — empty project canvas;
- `/design-system` — documentation overview;
- `/design-system/color` — color architecture;
- `/design-system/sizing` — sizing and component-size contracts;
- `/design-system/typography` — typography foundations and semantic styles;
- `/design-system/layout` — layout foundations and responsive contracts;
- `/design-system/components` — reusable component library;
- `/design-system/roadmap` — current design-system status.

## Start locally

```bash
npm install
npm run dev
```

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
9. Keep component code, documentation, registry, roadmap and agentic rules in
   sync.

## Sources of truth

- `src/styles/tokens` — variables and token architecture;
- `src/components` — reusable implementation contracts;
- `src/pages/design-system` — rendered documentation;
- `src/data/design-system/componentArchitecture.json` — component registry;
- `src/data/design-system-roadmap.json` — system status;
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
