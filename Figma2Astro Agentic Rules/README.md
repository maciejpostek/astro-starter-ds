# Figma2Astro Agentic Rules

This directory contains operational rules for AI agents that reconcile Figma
with the Astro design system through Figma MCP.

These rules activate only after an explicit user request for a Figma
operation. Normal Astro edits, component reuse, page composition, validation,
and release do not read Figma or require parity.

The rules document intentional differences between design-tool
representations and production code. Their purpose is an unambiguous mapping
without guessing, duplication, or value drift.

## Primary rule

Astro code is the source of truth.

- CSS Variables define design-system values and contracts.
- Astro components define the public implementation API.
- `data-*` attributes define variants, sizes, states, and modes.
- Figma Variables are a design-optimized representation of those contracts.
- Figma does not need to reproduce every technical CSS alias when native modes
  communicate the contract more clearly.
- Every Figma simplification must have an explicit Figma → Astro adapter in
  this directory.

For project-specific visual direction, the approved Brand Expression Contract
is the source of visual intent. It guides token and component selection but
does not replace the canonical Astro API or CSS Variable contracts. Draft or
`not-configured` contracts are input gaps, not permission to invent a brand.

Figma page names, indentation, spaces, icons, and order are navigation
metadata. Machine mapping must use stable node/component IDs, registry
identity, and the adapters in this directory.

## Explicit Figma operation workflow

```text
explicit Figma request
→ selected component registry context
→ existing-state audit
→ approved visual intent, when brand-sensitive
→ Astro implementation
→ Astro documentation and browser validation
→ human visual calibration
→ Figma representation
→ scoped reconciliation result
```

When reconciling an existing Figma node:

1. Fetch design context for the exact node or variant.
2. Fetch a screenshot as a visual reference.
3. Read applied Variables, collections, and explicit node modes.
4. Use Variable Web code syntax to locate the existing CSS custom property.
5. Inspect the existing component and its public props in `src/components`.
6. Map Figma modes and variants to existing props that render stable `data-*`
   attributes; do not create local classes or raw styles.
7. Keep values in tokens. Do not copy Figma numbers into component CSS when a
   token or attribute contract exists.
8. Compare the result with the screenshot and validate every represented mode.

For brand-sensitive work, read `art-direction/README.md`,
`.agentic-rules/08-brand-expression.md`, and the approved project contract
before step 4. Compare the browser result with approved references and record
the calibration decision before synchronizing it to Figma.

If Figma and code disagree, identify the token, component, and mode on both
sides before changing anything. Code remains canonical unless the user
explicitly changes the source-of-truth decision.

## Required Figma border bindings

Every visible border created or updated through Figma MCP has independent
design-system decisions:

```text
border
├── color  → Color Semantic / Global/border/* or Component/*/border/*
├── width  → Sizing Semantic / border-width/{default|strong|emphasis}
└── style  → native Figma property such as solid or dashed
```

- Stroke color binds to a `Color Semantic` Variable scoped for
  `STROKE_COLOR`.
- Width binds to `border-width/default`, `border-width/strong`, or
  `border-width/emphasis` scoped for `STROKE_FLOAT`.
- `default` is for regular boundaries and dividers.
- `strong` is for focus or another deliberate stronger state.
- `emphasis` is for a structural accent edge such as Alert or Notification.
- Never hardcode 1, 2, or 4 when the corresponding token exists.
- When a node uses individual edge weights, bind every active edge. A
  `strokeWeight` binding alone is not sufficient.
- For a one-sided border, bind only the active edge. Zero on the other sides
  means no border.
- Line style remains native because the architecture has no line-style
  Variable.

Validation checks color and every active edge independently. Width Web code
syntax must point to `var(--border-width-default)`,
`var(--border-width-strong)`, or `var(--border-width-emphasis)`.

## Canonical Figma collections

Collection names have no project prefix. Variable paths organize the Figma
panel, and Web code syntax provides the canonical CSS mapping.

| Figma collection | Groups / modes | Astro source |
| --- | --- | --- |
| `Color Primitives` | palettes; one base mode | `color-primitives.css` |
| `Color Semantic` | `Global`, `Component`; `Light`, `Dark` | `color-semantic.css`, `color-components.css` |
| `Sizing Primitives` | reference scale; one base mode | `size-primitives.css` |
| `Sizing Semantic` | roles; `Min`, `Max` for fluid values | `size-semantic.css` |
| `Component Size` | `Small`, `Medium`, `Large` | `component-sizes.css` |
| `Typography Foundations` | design-facing properties; `Min`, `Max` | `typography-foundations.css` |
| `Typography Semantic` | heading/body size, line height, tracking; `Min`, `Max` | `typography-semantic.css` |
| `Layout Foundations` | viewport range and mobile breakpoint; `Max`, `Min` | `layout-foundations.css` |
| `Layout Semantic` | public layout contracts; `Desktop`, `Mobile` | `layout-semantic.css` |
| `Motion Foundations` | foundation, semantic, and component timing; `Default`, `Reduced Motion` | `motion-foundations.css` |

Every Variable that maps to one CSS token receives
`var(--token-name)` Web code syntax. `Layout Foundations / fluid/viewport` is
the documented exception because its modes map to two Astro control tokens.

## Operational rule router

- [`01-component-size.md`](./01-component-size.md) — `Component Size`,
  `data-component-size`, and local aliases.
- [`02-color-modes.md`](./02-color-modes.md) — global/component semantics and
  inherited Light/Dark modes.
- [`03-responsive-clamp-modes.md`](./03-responsive-clamp-modes.md) — Min/Max
  as `clamp()` endpoints.
- [`04-layout.md`](./04-layout.md) — foundations, semantics, layout objects,
  grid, and viewport modes.
- [`05-typography.md`](./05-typography.md) — Text Style bindings and the
  percentage-to-pixel adapter.
- [`06-actions-components.md`](./06-actions-components.md) — Button,
  IconButton, ButtonGroup, SwitchButton, and icons.
- [`07-component-library-roadmap.md`](./07-component-library-roadmap.md) —
  baseline/current inventory, family order, properties, private parts, and
  checkpoints.
- [`08-forms-components.md`](./08-forms-components.md) — form controls,
  wrappers, native semantics, and Figma adapters.
- [`09-data-display-components.md`](./09-data-display-components.md) — Tag,
  status labels, Alert, Notification, and ComparisonTable.
- [`10-text-components.md`](./10-text-components.md) — Eyebrow, dividers,
  SectionHeader, and PageHeader.
- [`11-content-components.md`](./11-content-components.md) — BulletPoint and
  ContentBlock.
- [`12-disclosure-components.md`](./12-disclosure-components.md) — Tab,
  Accordion, Tooltip, Slots, and ARIA.
- [`13-media-components.md`](./13-media-components.md) — media ratio, overlay,
  Avatar, VideoPlayer, SwiperStarter, and BeforeAfterSlider.
- [`14-visual-components.md`](./14-visual-components.md) —
  PanelPatternVisualSystem presets and code-owned geometry.
- [`15-navigation-components.md`](./15-navigation-components.md) — navigation
  atoms, wayfinding, and app-shell navigation.
- [`16-cards-components.md`](./16-cards-components.md) — card families,
  viewport adapters, data Slots, and nested masters.
- [`17-sidepanels-components.md`](./17-sidepanels-components.md) — Popup,
  modal, drawer Slots, and code-owned dialog runtime.
- [`18-timeline-components.md`](./18-timeline-components.md) — data geometry,
  Slots, and modal runtime.
- [`20-motion-foundations.md`](./20-motion-foundations.md) — easing, duration,
  delay, transition, and reduced-motion modes.
- [`21-elevation-foundations.md`](./21-elevation-foundations.md) — primitive
  and semantic shadows mapped to Effect Styles.
- [`22-website-sections.md`](./22-website-sections.md) — family-first website
  sections, reusable nested masters, responsive examples, and Astro mapping.

## Reference reports

- [`19-align-ui-benchmark.md`](./19-align-ui-benchmark.md) is a read-only,
  historical benchmark of Align UI against MPCOM. It is decision material, not
  an active mapping rule, and does not change public contracts.

Reference reports are excluded from the operational-rule language gate. New
operational rules, identifiers, Figma names, and public documentation must be
English.

## Rule-file contract

Every new operational adapter should document:

1. Figma representation;
2. Astro representation;
3. exact mapping;
4. AI implementation algorithm;
5. forbidden shortcuts;
6. validation checklist.

## Related sources

- `AGENTIC-RULES.json`
- `AGENTIC-RULES.md`
- `DESIGN-SYSTEM-FRAMEWORK.md`
- `.agentic-rules/00-framework.md`
- `.agentic-rules/01-sizing.md`
- `.agentic-rules/02-colors.md`
- `.agentic-rules/03-typography.md`
- `.agentic-rules/04-layout.md`
- `.agentic-rules/06-motion.md`
- `.agentic-rules/07-elevation.md`
- `.agentic-rules/08-brand-expression.md`
- `art-direction/README.md`
- `project-context/brand-foundations/brand-expression/contract.json`
- `src/data/design-system/componentArchitecture.json`
- `src/styles/tokens/component-sizes.css`
- `src/styles/tokens/motion-foundations.css`
- `src/styles/tokens/elevation-foundations.css`
- `src/styles/tokens/tokens.css`
- `src/components`
