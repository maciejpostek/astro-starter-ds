# Agentic Component Rules

Status: active.

This file defines how agents should create, move, extend and document reusable
Astro components in the Astro design system.

Use this file when a task creates a component, changes a component API, adds a
variant, state, size, tone or status, moves repeated markup into a reusable
component, reorganizes component folders, or updates `/design-system/components`.

Source references:

- `AGENTIC-RULES.json`
- `COMPONENTS.md`
- `src/data/design-system/componentArchitecture.json`
- `src/data/design-system-roadmap.json`
- `src/pages/design-system/components.astro`
- `src/styles/tokens/component-sizes.css`
- `src/styles/tokens/color-components.css`
- `.agentic-rules/components/_component-rule-template.md`

## Core Decision

Component architecture uses two separate axes:

```txt
source architecture
  = atomic layer first
  = where the file lives

documentation architecture
  = family first
  = how a developer works with related components
```

Do not force the documentation order to mirror the filesystem order. Files
should optimize maintainability. Documentation should optimize practical use.

## Source Architecture

The primary source folder axis is Atomic Design:

```txt
src/components/
  atoms/
  molecules/
  organisms/
  templates/
```

The secondary source folder axis is component family or domain:

```txt
src/components/
  atoms/
    actions/
    navigation/
    forms/
    text/
    data-display/
    media/
    visual/
  molecules/
    actions/
    navigation/
    forms/
    cards/
    content/
    disclosure/
    media/
    visual/
  organisms/
    navigation/
    cards/
    sections/
    sidepanels/
    timeline/
    forms/
    visual/
  templates/
```

Rules:

- Atomic layer is always the first decision.
- Family or domain is always the second decision.
- The same family may exist under `atoms`, `molecules` and `organisms`.
- Do not create empty subfolders ahead of real components.
- Do not create top-level domain folders such as `navigation`, `cards` or
  `forms` beside `atoms`, `molecules` and `organisms`.
- Keep documentation-only components in `src/components/design-system/`.
- Keep development helpers in `src/components/dev/`.
- Keep global scripts in `src/components/global-scripts/`.

## Component-Adjacent Behaviors

Some reusable behavior belongs beside components, not inside a component.

Examples:

- `ClipboardCopy` in `src/components/global-scripts/ClipboardCopy.astro`

Rules:

- Use a global behavior when the same interaction can be attached to many
  different components.
- Do not create a new UI component when the existing component only needs an
  attachable behavior.
- Behavior scripts should expose a documented `data-*` attribute contract.
- Behavior-specific agentic rules should live in `.agentic-rules/behaviors/`.
- Components remain responsible for visual hierarchy, sizing, tokens and
  accessibility names. Behaviors remain responsible for cross-component
  interaction logic.

## Atomic Layers

### Atom

An atom is the smallest reusable UI component.

An atom may have props, variants, states, sizes and token-backed styling, but it
should not own a larger layout region or coordinate multiple component roles.

Examples:

- `Button`
- `IconButton`
- `Input`
- `Label`
- `Tag`
- `Eyebrow`
- `DivideBlock`
- `MediaRatio`
- `ImageEffectOverlay`

Place atoms in:

```txt
src/components/atoms/<family>/<ComponentName>.astro
```

### Molecule

A molecule is a small composition of atoms or simple content primitives.

A molecule should remain reusable outside one specific page section. It may own
local layout for a compact pattern, but it should not represent a full page
region or application area.

Examples:

- `ButtonGroup`
- `FormField`
- `Accordion`
- `SectionHeader`
- `NavItemLink`
- `ProjectCard`
- `FieldCard`

Place molecules in:

```txt
src/components/molecules/<family>/<ComponentName>.astro
```

### Organism

An organism is a larger interface block that coordinates multiple atoms,
molecules or internal states.

An organism usually represents a meaningful product, page or application area.
It can include sections, navigation systems, drawers, timelines, card groups or
complex interactive structures.

Examples:

- `TopNavbar`
- `NavSidebar`
- `ProjectDrawer`
- `StageDrawer`
- `Timeline`
- `DsCallout`
- `CardsGrid`

Place organisms in:

```txt
src/components/organisms/<family>/<ComponentName>.astro
```

### Template

A template is a reusable starter composition, not a normal component primitive.

Use templates only when the structure is meant to be copied, adapted or used as
a page or interaction starter. Do not put regular molecules or organisms here.

Examples:

- `SwiperStarter`
- future page section starter patterns
- future layout starter patterns

Place templates in:

```txt
src/components/templates/<family>/<TemplateName>.astro
```

## Families

A family groups components by developer workflow or domain.

Families are allowed to appear in multiple atomic layers. For example,
`navigation` can contain:

```txt
atoms/navigation/
molecules/navigation/
organisms/navigation/
```

Use family names from `src/data/design-system/componentArchitecture.json`
before creating a new family.

Default families:

- `actions`
- `navigation`
- `forms`
- `cards`
- `content`
- `text`
- `data-display`
- `media`
- `visual`
- `disclosure`
- `sidepanels`
- `timeline`
- `sections`
- `documentation`

Rules:

- Use a family when components are worked on together.
- Use the same family name across layers when the domain is the same.
- Prefer operational names over poetic names.
- Do not use `global` as a catch-all family.
- Create a new family only when the component group has a clear workflow,
  documentation or reuse reason.

## Standalone Components

Some components are single-component families.

Examples:

- `Tag`
- `Label`
- `Eyebrow`
- `DivideBlock`
- `MediaRatio`

Do not put these into a generic `global` family. They should be documented as
standalone components and may use their own family id, such as `tag`, `label`
or `eyebrow`, if they do not belong to a stronger workflow family.

Rules:

- A family does not need atoms, molecules and organisms to be valid.
- A standalone component may have exactly one component record.
- Documentation should show the component directly instead of inventing empty
  layer groups.

## Documentation Architecture

The main `/design-system/components` page should be family-first.

Primary view:

```txt
Components
  Navigation
    Atoms
    Molecules
    Organisms

  Actions
    Atoms
    Molecules
    Organisms

  Forms
    Atoms
    Molecules
    Organisms

  Cards
    Molecules
    Organisms

  Standalone Components
    Tag
    Label
    Eyebrow
```

Secondary reference view:

```txt
By Atomic Layer
  Atoms
  Molecules
  Organisms
  Templates
```

Rules:

- Documentation should help a developer work on one family in one place.
- A developer working on navigation should see navigation atoms, molecules and
  organisms together.
- A developer working on actions should see action atoms and action molecules
  together.
- Do not force the docs to make the user jump between atomic sections for one
  family.
- Each documented family should link to real anchors only.
- Add sidebar anchors when real sections exist.

## Component Record Contract

Every documented component should have a record with this shape:

```ts
type ComponentRecord = {
  name: string;
  layer: "atom" | "molecule" | "organism" | "template";
  family: string;
  status: "planned" | "draft" | "ready" | "deprecated";
  sourcePath: string;
  docsAnchor: string;
  description?: string;
  uses?: string[];
  tokens?: string[];
};
```

Rules:

- `name` must match the exported component filename.
- `layer` must match the source folder layer.
- `family` must match an approved family or a deliberate standalone family.
- `sourcePath` must point to the real Astro component.
- `docsAnchor` must point to a real section in `/design-system/components`.
- `uses` should list meaningful component dependencies, not every nested HTML
  element.
- `tokens` should list component-specific token contracts when they exist.

## Component Authoring

Before creating or changing a component:

1. Check `COMPONENTS.md`.
2. Check existing `src/components/**` files.
3. Check the matching family in `componentArchitecture.json`.
4. Decide atomic layer.
5. Decide family.
6. Use existing atoms inside molecules and organisms.
7. Use semantic and component-based tokens before raw values.
8. Update `/design-system/components` when the public component contract
   changes.

Rules:

- Reusable component roots should expose `data-component-name`.
- Variants, states, sizes, tones and modes should use finite props rendered as
  `data-*` attributes where practical.
- Classes should identify component parts, not encode values.
- Component styles should stay close to the component unless they are global
  layout primitives, legacy page composition or documentation infrastructure.
- If a pattern appears in two or more places, extract or reuse a component.
- Do not create local button, tag, label, input, card or section-header
  lookalikes.

## Token Contract

Components consume existing category systems:

- sizing from `01-sizing.md` and `src/styles/tokens/component-sizes.css`
- colors from `02-colors.md` and `src/styles/tokens/color-components.css`
- typography from `03-typography.md`
- layout from `04-layout.md`

Rules:

- Use component-based tokens for repeated component contracts.
- Use global semantic tokens for generic surfaces, text, borders and layout.
- Use primitive tokens directly only when defining semantic/component tokens or
  handling a clearly exceptional geometry edge.
- If a component needs a new repeated styling decision, add or update the token
  contract first, then update component CSS and docs.

## Move And Migration Rules

When moving an existing component into the atomic architecture:

1. Move one component family or one small group at a time.
2. Update imports in all consuming files.
3. Preserve component APIs unless the task explicitly includes API cleanup.
4. Update `COMPONENTS.md`.
5. Update `componentArchitecture.json` if a family, layer or record changes.
6. Update `/design-system/components` anchors if docs paths change.
7. Run `npm run build` after structural moves.

Do not mix broad folder migration with unrelated visual redesign.

## Naming Rules

Use:

- PascalCase for component filenames.
- kebab-case for family ids.
- singular component names unless the component intentionally represents a
  collection.
- operational names that describe role and usage.

Avoid:

- vague family ids such as `global`, `misc`, `shared` or `common`.
- family names that describe visual mood instead of workflow.
- component names that duplicate their folder meaning without adding clarity.

## Documentation Checklist

When documenting a component or family:

- Show the family first.
- Show available layers inside that family.
- Show source path.
- Show status.
- Show component dependencies.
- Show key props and states.
- Show token contracts.
- Show usage rules.
- Show examples only when they are real and supported by code.

Do not document imaginary anchors, variants or components.

## Per-Component Agentic Rules

Per-component agentic rules describe how an agent should choose and use a real
component in a UX context.

They are not token tables. They are decision manuals for automated interface
composition: what the component is for, when to choose it, which variant fits the
user intent, how to keep it accessible, and what implementation contract must
stay intact.

File location:

```txt
.agentic-rules/components/<component-name>.md
```

Template:

```txt
.agentic-rules/components/_component-rule-template.md
```

Required sections:

- `Identity`
- `UX Role`
- `Decision Priority`
- `Variant Decision Rules`
- `Context Of Use`
- `Accessibility Pattern`
- `Content Pattern`
- `Size And Density Rules`
- `Composition Rules`
- `Implementation Contract`
- `Do / Do Not`
- `Examples`

Rules:

- Create one rule file per component or tightly coupled component family.
- Put variants inside the component rule file unless they are independent Astro
  components with separate source files.
- Use Astro component names and `data-component-name` values as identifiers.
- Explain the UX decision an experienced designer would make before choosing the
  component.
- Include accessibility requirements for every interactive component.
- Include concrete examples using the real Astro API.
- Update the component rule whenever props, variants, states, accessibility
  behavior or intended usage changes.
- Do not use per-component rules to document imaginary variants or future
  components.
