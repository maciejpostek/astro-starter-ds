# Astro Design System Starter Roadmap

The starter separates reusable system work from project-specific product work.
The detailed status of design-system foundations and components lives in
`src/data/design-system-roadmap.json` and is rendered at
`/design-system/roadmap`.

## Stable foundation

- token architecture for color, sizing, typography, layout and motion;
- light and dark color modes;
- semantic and component-based variables;
- responsive min/max contracts;
- component-size profiles and `data-component-size` mapping;
- reusable Astro component library;
- design-system documentation;
- component registry and agentic implementation rules;
- empty project-context structure for per-project strategic inputs;
- optional Figma-to-Astro translation documentation.

## Per-project work

Each project created from this starter should define its own:

- information architecture and routes;
- content and assets;
- brand name and metadata;
- navigation model;
- page sections and compositions;
- integrations, forms and data sources;
- deployment domain and environment configuration.

Project-specific decisions should build on the existing system. If a project
needs a new reusable token or component, update the implementation,
documentation, registry, roadmap and relevant agentic rule together.

## Future starter improvements

- automate starter cloning and project-name replacement;
- add automated checks for raw primitive usage in component CSS;
- add optional visual-regression coverage for documentation previews;
- prepare a standalone GitHub repository when the starter reaches a stable
  distribution milestone.
